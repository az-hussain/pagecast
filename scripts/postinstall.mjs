#!/usr/bin/env node
/**
 * Friendly pointer printed after `npm install`. Purely informational — never
 * fails the install. Kept quiet in CI.
 */
if (process.env.CI || process.env.PAGECAST_NO_POSTINSTALL) process.exit(0)

const useColor = process.stdout.isTTY && !process.env.NO_COLOR
const c = (n, s) => (useColor ? `\x1b[${n}m${s}\x1b[0m` : s)
const bold = (s) => c('1', s)
const dim = (s) => c('2', s)
const green = (s) => c('32', s)

console.log(`
  ${green('✓')} ${bold('Pagecast')} dependencies installed.

  ${bold('Next')}
    npm run doctor   ${dim('— check your environment + what you can do')}
    npm run dev      ${dim('— view decks at http://localhost:5173')}

  ${dim('New here? Tell your agent:')} "Set up Pagecast and show me the example deck."
`)
