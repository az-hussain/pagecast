#!/usr/bin/env node
/**
 * Environment check — the agent's (and human's) orientation tool.
 *
 *   npm run doctor
 *
 * Prints what's ready and what isn't, with the exact one-line fix for every
 * gap. Nothing here mutates your machine; it only looks. Setup in this repo is
 * progressive: viewing and editing need only `npm install`; the PDF browser and
 * Cloudflare login are added on-demand the first time you export or publish.
 *
 * Exit code is 0 unless a *required* capability (Node, dependencies) is missing,
 * so a CI/agent can gate on it.
 */
import { existsSync } from 'node:fs'
import { readdir } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')

// --- tiny ANSI helpers (no deps) -------------------------------------------
const useColor = process.stdout.isTTY && !process.env.NO_COLOR
const c = (code, s) => (useColor ? `\x1b[${code}m${s}\x1b[0m` : s)
const green = (s) => c('32', s)
const yellow = (s) => c('33', s)
const red = (s) => c('31', s)
const dim = (s) => c('2', s)
const bold = (s) => c('1', s)

const OK = green('✓')
const OPT = yellow('○') // optional capability not yet set up
const BAD = red('✗')

// --- checks -----------------------------------------------------------------
// Each returns: { label, state: 'ok'|'optional'|'missing', detail, fix?, gates }
// `gates` = which workflows this capability unlocks.

const checks = []

// 1. Node.js (required). Vite 8 needs ^20.19.0 || >=22.12.0.
{
  const [maj, min] = process.versions.node.split('.').map(Number)
  const ok = (maj === 20 && min >= 19) || maj >= 22
  checks.push({
    label: 'Node.js',
    state: ok ? 'ok' : 'missing',
    detail: ok
      ? `v${process.versions.node}  ${dim('(>= 20.19 required)')}`
      : `v${process.versions.node} ${dim('— need >= 20.19 (or >= 22.12)')}`,
    fix: ok ? null : 'Install the current Node LTS from https://nodejs.org, then re-run.',
    gates: 'everything',
  })
}

// 2. Dependencies (required)
{
  const ok = existsSync(resolve(ROOT, 'node_modules', 'vite'))
  checks.push({
    label: 'Dependencies',
    state: ok ? 'ok' : 'missing',
    detail: ok ? 'installed' : dim('not installed'),
    fix: ok ? null : 'npm install',
    gates: 'everything',
  })
}

// 3. PDF export browser (optional — only `npm run export`)
{
  let installed = false
  try {
    const { chromium } = await import('playwright')
    const p = chromium.executablePath()
    installed = !!p && existsSync(p)
  } catch {
    installed = false
  }
  checks.push({
    label: 'PDF export',
    state: installed ? 'ok' : 'optional',
    detail: installed
      ? 'Chromium ready'
      : dim('Chromium not downloaded — only needed for ') + '`npm run export`',
    fix: installed ? null : 'npx playwright install chromium',
    gates: 'export',
  })
}

// 4. Cloudflare (optional — only `npm run publish`)
// Wrangler isn't a dependency: it runs on demand via `npx` at publish time. We
// deliberately DON'T probe login state here — that would hit the network and
// could hang a fresh-clone `doctor`. `npm run publish` checks login itself and
// guides the user through `wrangler login` if needed.
{
  checks.push({
    label: 'Cloudflare',
    state: 'optional',
    detail:
      dim('signs in at publish time — ') + '`npx wrangler login`' + dim(' (free, one-time)'),
    gates: 'publish',
  })
}

// 5. Decks present (informational)
{
  let decks = []
  try {
    const entries = await readdir(resolve(ROOT, 'decks'), { withFileTypes: true })
    decks = entries.filter((e) => e.isDirectory()).map((e) => e.name)
  } catch {}
  checks.push({
    label: 'Decks',
    state: decks.length ? 'ok' : 'optional',
    detail: decks.length
      ? `${decks.length} found ${dim(`(${decks.join(', ')})`)}`
      : dim('none yet — create one with `npm run new:deck -- <name>`'),
    gates: 'info',
  })
}

// --- render -----------------------------------------------------------------
const glyph = { ok: OK, optional: OPT, missing: BAD }

console.log('\n  ' + bold('Pagecast') + dim(' — environment check\n'))
for (const ch of checks) {
  console.log(`  ${glyph[ch.state]}  ${ch.label.padEnd(14)} ${ch.detail}`)
  if (ch.fix) console.log(`     ${dim('fix:')} ${ch.fix}`)
}

// Capability summary -------------------------------------------------------
const required = checks.filter((c) => c.gates === 'everything')
const canView = required.every((c) => c.state === 'ok')
const canExport = canView && checks.find((c) => c.gates === 'export').state === 'ok'
const mark = (b) => (b ? green('yes') : dim('not yet'))

console.log(
  `\n  ${bold('Ready to:')}  view ${mark(canView)}   build ${mark(canView)}   export PDF ${mark(canExport)}`,
)
if (canView) {
  console.log(
    `  ${dim('To publish:')} npx wrangler login${dim(', then')} npm run publish -- <deck>`,
  )
}

// Next step ----------------------------------------------------------------
const firstMissing = required.find((c) => c.state === 'missing')
if (firstMissing) {
  console.log(`\n  ${bold('Next:')} ${firstMissing.fix}\n`)
  process.exit(1)
} else {
  console.log(
    `\n  ${bold('Next:')} npm run dev   ${dim('→ open http://localhost:5173')}\n`,
  )
}
