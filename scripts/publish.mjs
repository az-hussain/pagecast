#!/usr/bin/env node
/**
 * Publish a deck to Cloudflare Pages as a self-contained static SPA.
 *
 * Usage:
 *   npm run publish -- <deck-name> [--yes] [--prefix <p>]
 *
 * Flow:
 *   1. Validate the deck exists.
 *   2. Confirm with the user (unless --yes).
 *   3. Ensure wrangler is authenticated.
 *   4. Build the single-deck SPA via vite.publish.config.ts.
 *   5. Deploy via `wrangler pages deploy`.
 *   6. Record URL in .pagecast/published.json.
 *
 * Notes:
 *   - The project name is `<prefix>-<deck>` (default prefix from .pagecast/config.json).
 *   - Pages.dev subdomains are public-by-default. Don't publish confidential decks.
 *   - First-time setup: run `npx wrangler login` once.
 */
import { spawn, spawnSync } from 'node:child_process'
import { mkdir, readFile, writeFile, access } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createInterface } from 'node:readline/promises'
import { randomBytes } from 'node:crypto'
import { assertSafeName } from './_util.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const PUBLISHED_PATH = resolve(ROOT, '.pagecast/published.json')
const CONFIG_PATH = resolve(ROOT, '.pagecast/config.json')

const args = process.argv.slice(2)
if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
  console.log('Usage: npm run publish -- <deck-name> [--yes] [--prefix <p>]')
  process.exit(args.length === 0 ? 1 : 0)
}

const yes = args.includes('--yes') || args.includes('-y')
const prefixIdx = args.indexOf('--prefix')
// Index of --prefix's VALUE (or -1, which never matches a real index) so the
// deck-name scan skips it. Guarding on prefixIdx avoids excluding index 0 when
// there's no --prefix at all.
const prefixValIdx = prefixIdx >= 0 ? prefixIdx + 1 : -1
const prefixArg = prefixIdx >= 0 ? args[prefixValIdx] : undefined
const deckName = args.find((a, i) => !a.startsWith('--') && i !== prefixValIdx)
if (!deckName) {
  console.error('error: missing deck name')
  process.exit(1)
}
// Deck name flows into file paths and the CF project name — keep it a safe token.
assertSafeName(deckName, 'deck name')

// --- 1. Validate deck -------------------------------------------------------
const manifestPath = resolve(ROOT, 'decks', deckName, 'deck.json')
if (!existsSync(manifestPath)) {
  console.error(`error: decks/${deckName}/deck.json not found`)
  process.exit(1)
}
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
if (!Array.isArray(manifest.slides) || manifest.slides.length === 0) {
  console.error(`error: deck "${deckName}" has no slides`)
  process.exit(1)
}

// --- 2. Resolve config + project name --------------------------------------
let config = { host: 'cloudflare-pages', projectPrefix: 'pagecast' }
try {
  config = { ...config, ...JSON.parse(await readFile(CONFIG_PATH, 'utf8')) }
} catch {}
const prefix = prefixArg ?? config.projectPrefix
const projectName = sanitize(`${prefix}-${deckName}`)

console.log(`\n  Deck:        ${manifest.title} (${deckName})`)
console.log(`  Slides:      ${manifest.slides.length}`)
console.log(`  Host:        Cloudflare Pages`)
console.log(`  Project:     ${projectName}`)
console.log(`  URL:         https://${projectName}.pages.dev`)
console.log(`\n  ⚠ pages.dev URLs are public. Don't publish confidential decks.\n`)

if (!yes) {
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  const ans = (await rl.question('Continue? [y/N] ')).trim().toLowerCase()
  rl.close()
  if (ans !== 'y' && ans !== 'yes') {
    console.log('Aborted.')
    process.exit(0)
  }
}

// --- 3. Check wrangler auth -------------------------------------------------
// This is the one step a human must do: Cloudflare login is a browser OAuth flow
// that can't be automated. whoami can exit 0 yet still lack account access (a
// stale/under-scoped token), so require a positive "logged in" signal — matching
// `npm run doctor` — rather than trusting the exit code alone.
console.log('▸ checking Cloudflare connection…')
const whoami = spawnSync('npx', ['-y', 'wrangler@4', 'whoami'], { cwd: ROOT, encoding: 'utf8' })
const connected =
  whoami.status === 0 &&
  /[Yy]ou are logged in|associated with the email/.test(`${whoami.stdout}${whoami.stderr}`)
if (!connected) {
  console.error('\n  ✗ Cloudflare isn\'t connected yet — this is the one step you have to do yourself.\n')
  console.error('  Publishing needs a free Cloudflare account. One time:')
  console.error('    1. Run:  npx wrangler login      (opens your browser to sign in)')
  console.error(`    2. Re-run:  npm run publish -- ${deckName}\n`)
  process.exit(1)
}

// --- 4. Build ---------------------------------------------------------------
const outDir = resolve(ROOT, 'dist/publish', deckName)
console.log(`▸ building single-deck bundle → ${outDir.replace(ROOT + '/', '')}`)
await runCmd('npx', ['vite', 'build', '--config', 'vite.publish.config.ts'], {
  cwd: ROOT,
  env: { ...process.env, VITE_PUBLISH_DECK: deckName, PUBLISH_OUT_DIR: outDir },
})

// The build emits publish.html but CF Pages expects index.html. Copy it.
const publishHtml = resolve(outDir, 'publish.html')
const indexHtml = resolve(outDir, 'index.html')
if (existsSync(publishHtml)) {
  await writeFile(indexHtml, await readFile(publishHtml))
}

// --- 5a. Ensure project exists ----------------------------------------------
// If a previous publish recorded a project name for this deck, reuse it.
// Otherwise compute one. If that name is taken on CF, append a random suffix.
let existingPublished = {}
try { existingPublished = JSON.parse(await readFile(PUBLISHED_PATH, 'utf8')) } catch {}

let effectiveProjectName = existingPublished[deckName]?.projectName ?? projectName

console.log(`▸ ensuring CF Pages project "${effectiveProjectName}" exists`)
const projectList = await withRetry(() =>
  runCmdSyncCapture('npx', ['-y', 'wrangler@4', 'pages', 'project', 'list'], { cwd: ROOT }),
  { tries: 2, label: 'list projects' },
)
const projectExists = projectList.includes(effectiveProjectName)

if (!projectExists) {
  effectiveProjectName = await createProjectWithCollisionFallback(effectiveProjectName)
}

// --- 5b. Deploy -------------------------------------------------------------
console.log(`▸ deploying to Cloudflare Pages (${effectiveProjectName})`)
const deploy = await withRetry(
  () =>
    runCmdCapture(
      'npx',
      ['-y', 'wrangler@4', 'pages', 'deploy', outDir, '--project-name', effectiveProjectName, '--branch', 'main'],
      { cwd: ROOT },
    ),
  { tries: 2, label: 'deploy' },
)

async function createProjectWithCollisionFallback(name) {
  for (let attempt = 0; attempt < 3; attempt++) {
    const tryName = attempt === 0 ? name : `${name}-${randomBytes(2).toString('hex')}`
    console.log(`  creating project ${tryName} ${attempt > 0 ? '(name collision fallback)' : '(one-time)'}`)
    try {
      await withRetry(
        () =>
          runCmdCapture(
            'npx',
            ['-y', 'wrangler@4', 'pages', 'project', 'create', tryName, '--production-branch', 'main'],
            { cwd: ROOT },
          ),
        { tries: 2, label: 'create project' },
      )
      return tryName
    } catch (err) {
      const msg = String(err.message ?? err)
      const looksLikeNameTaken =
        msg.includes('already exists') ||
        msg.includes('name is not available') ||
        msg.includes('subdomain is not available')
      if (!looksLikeNameTaken) throw err
      console.log(`  ⚠ "${tryName}" is taken on Cloudflare Pages — trying a new name`)
    }
  }
  throw new Error('Could not find an available CF Pages project name after 3 attempts')
}

// Parse URL from wrangler output. Wrangler prints a line like:
//   ✨ Deployment complete! Take a peek over at https://abc.pagecast-foo.pages.dev
const urlMatch = deploy.match(/https?:\/\/[\w.-]+\.pages\.dev/g)
if (!urlMatch || urlMatch.length === 0) {
  console.error('error: could not parse deployment URL from wrangler output')
  console.error(deploy)
  process.exit(1)
}
// The canonical project URL (deploy output also includes per-deployment preview URLs).
const liveUrl = `https://${effectiveProjectName}.pages.dev`

// --- 6. Record (reuse the published.json already parsed in step 5a) ----------
const published = existingPublished
const publishedBy = getGitUser()
published[deckName] = {
  url: liveUrl,
  publishedAt: new Date().toISOString(),
  ...(publishedBy ? { publishedBy } : {}),
  host: 'cloudflare-pages',
  projectName: effectiveProjectName,
}

await mkdir(dirname(PUBLISHED_PATH), { recursive: true })
await writeFile(PUBLISHED_PATH, JSON.stringify(published, null, 2) + '\n')

console.log(`\n✓ Live: ${liveUrl}`)
console.log(`  Recorded in .pagecast/published.json — commit when ready.`)

// --- helpers ----------------------------------------------------------------

function runCmd(cmd, args, opts) {
  return new Promise((res, rej) => {
    const p = spawn(cmd, args, { stdio: 'inherit', ...opts })
    p.on('exit', (code) => (code === 0 ? res() : rej(new Error(`${cmd} exited ${code}`))))
    p.on('error', rej)
  })
}

function runCmdCapture(cmd, args, opts) {
  return new Promise((res, rej) => {
    const p = spawn(cmd, args, { ...opts, stdio: ['ignore', 'pipe', 'pipe'] })
    let out = ''
    p.stdout.on('data', (d) => { const s = d.toString(); process.stdout.write(s); out += s })
    p.stderr.on('data', (d) => { const s = d.toString(); process.stderr.write(s); out += s })
    p.on('exit', (code) => (code === 0 ? res(out) : rej(new Error(`${cmd} exited ${code}: ${out}`))))
    p.on('error', rej)
  })
}

function runCmdSyncCapture(cmd, args, opts) {
  const r = spawnSync(cmd, args, { ...opts, encoding: 'utf8' })
  if (r.status !== 0) throw new Error(`${cmd} exited ${r.status}: ${r.stderr || r.stdout}`)
  return r.stdout
}

async function withRetry(fn, { tries = 2, delayMs = 2500, label = 'op' } = {}) {
  let lastErr
  for (let i = 0; i < tries; i++) {
    try {
      return await fn()
    } catch (err) {
      lastErr = err
      const msg = String(err.message ?? err)
      // Only retry transient CF API errors. Don't retry semantic errors like name collisions.
      const isTransient =
        msg.includes('500') ||
        msg.includes('502') ||
        msg.includes('503') ||
        msg.includes('504') ||
        msg.includes('Internal Server Error') ||
        msg.includes('ECONNRESET') ||
        msg.includes('ETIMEDOUT')
      if (!isTransient || i === tries - 1) throw err
      console.log(`  ⚠ ${label} hit a transient error, retrying in ${Math.round(delayMs / 1000)}s…`)
      await new Promise((r) => setTimeout(r, delayMs))
    }
  }
  throw lastErr
}

function sanitize(name) {
  return name.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
}

function getGitUser() {
  try {
    const r = spawnSync('git', ['config', 'user.email'], { encoding: 'utf8', cwd: ROOT })
    if (r.status === 0) return r.stdout.trim() || undefined
  } catch {}
  return undefined
}
