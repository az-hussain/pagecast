# Contributing to Pagecast

Thanks for your interest — issues and PRs are welcome.

## Getting set up

```bash
git clone https://github.com/az-hussain/pagecast
cd pagecast
npm install
npm run dev          # http://localhost:5173
npm run doctor       # see what's ready
```

You need [Node.js 20.19+](https://nodejs.org). Before opening a PR, make sure the build is green:

```bash
npm run build        # type-check + production build (this is what CI runs)
```

## Where things live

- **`src/`** — the web app (gallery, viewer, print/PDF route).
- **`scripts/`** — the CLI (`new:deck`, `add:slide`, `export`, `publish`, …). New commands go here.
- **`slides/`** — reusable slides; **`decks/`** — decks and their local slides.
- **`vite.publish.config.ts`** — the single-deck publish build.

## A few conventions

- **Name slides for what they are** (`cover.tsx`, `pricing.tsx`), never for their position. Order lives in the deck manifest; reordering is `npm run move:slide`, not a file rename.
- **Mutate manifests through the CLI**, not by hand-editing JSON — the scripts validate paths and keep formatting consistent.
- **Keep publishing isolated.** If you change how slides or decks are discovered (`src/lib/slides.ts`, `src/lib/decks.ts`), update the publish-build override in `vite.publish.config.ts` to match — it's what keeps one deck from leaking another into a public bundle. See [SECURITY.md](./SECURITY.md).
- Match the style of the surrounding code. There's no required formatter, but keep diffs tight.

## Reporting security issues

Please don't open a public issue for anything exploitable — see [SECURITY.md](./SECURITY.md).
