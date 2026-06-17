# Security

## Reporting a vulnerability

Found a security issue? Please open a private report via GitHub's **Security → Report a vulnerability** tab, or email the maintainer. Don't file a public issue for anything exploitable.

## About `npm audit` warnings

Pagecast is a **local authoring tool**. There is no server we run and nothing of yours is sent anywhere except when *you* explicitly publish a deck (static files pushed to your own Cloudflare account). That shapes how to read `npm audit`:

- **Nothing in a published deck or exported PDF ships third-party runtime code beyond React.** Published decks are static HTML/CSS/JS built from your slides.
- **Build/dev tooling is not shipped.** Vite, esbuild, and Playwright run only on your machine, during `npm run dev`, `build`, or `export`.

### Current status

As of the latest dependency update, `npm audit` reports **zero known vulnerabilities**. The toolchain tracks current major versions (Vite 8 and its current esbuild). Run `npm audit` yourself any time to confirm.

### Publishing tooling (`wrangler`) is not installed by default

`wrangler` (Cloudflare's CLI) is **not** a dependency — it runs on demand via `npx` only when you publish. So a normal `npm install` doesn't pull it in, and its dependency tree doesn't appear in your audit unless you publish.

## Publishing bundles only the chosen deck

`npm run publish -- <deck>` produces a static bundle scoped to **exactly that deck** — its manifest and its slides only. Other decks in the repo (and their slides) are never included in the published output, even though they live in the same repo. This is enforced at build time in `vite.publish.config.ts`, which (a) replaces the repo-wide slide/deck discovery with a registry generated from just the published deck, and (b) refuses to bundle any file belonging to another deck, so even a cross-deck `import` fails the build instead of leaking.

**Speaker `notes` are stripped** from the published bundle — they never reach the public site. To keep that airtight, the publish build *fails* if a slide's `notes` isn't a single string literal it can fully remove (a complex value could otherwise be partially left behind). Slide *content* — anything the slide renders — is of course published; publishing a deck publishes what it shows.

## Published decks are public

`*.pages.dev` URLs are public and unauthenticated — anyone with the link can view a published deck. Don't publish confidential material. For private decks, share the exported PDF instead.

Note: `.pagecast/published.json` is committed and records the git email of whoever published each deck. That's fine in a private repo (the recommended setup). If you ever make your **deck repo** public, scrub that file first — or keep the repo private.
