// Runs axe on every story, in light and dark mode, the way the Storybook accessibility panel does, and fails on
// any violation or any error the story prints to the console (a React warning, an invalid prop). A story that
// throws while rendering fails too, so this is also the smoke test of every story. It reads the static build
// (`storybook-static`), or a running Storybook with `--url`.
//
//   node scripts/check-a11y.mjs                          every story of the static build
//   node scripts/check-a11y.mjs carousel toast           only the stories whose id contains one of the words
//   node scripts/check-a11y.mjs --url http://localhost:6006 carousel
//
// "Incomplete" results (a background axe can't compute: an overlay, a scroll container, a background image) are
// not failures, as in the panel. An overlay the story doesn't open is not checked: open it and look at the panel.
import { createRequire } from 'node:module'
import { availableParallelism } from 'node:os'
import { chromium } from 'playwright'
import { openStorybook } from './storybook-server.mjs'

const require = createRequire(import.meta.url)
const axeSource = require.resolve('axe-core/axe.min.js')

// The same context and rules as @storybook/addon-a11y, plus the config of .storybook/preview.tsx.
const CONTEXT = {
  include: 'body',
  exclude: [
    '.sb-wrapper',
    '#storybook-docs',
    '#storybook-highlights-root',
    '[data-plume-table-element][aria-busy="true"]',
  ],
}
const DISABLED_RULES = ['region']
const MODES = ['light', 'dark']
const RENDER_TIMEOUT = 15_000

const { baseUrl, close, filters, stories } = await openStorybook(process.argv.slice(2))

if (stories.length === 0) {
  console.error(`No story matches ${filters.join(', ')}.`)
  process.exit(1)
}

const jobs = MODES.flatMap((mode) => stories.map((id) => ({ id, mode })))
const browser = await chromium.launch()
const context = await browser.newContext({ reducedMotion: 'reduce', viewport: { height: 900, width: 1280 } })
const failures = []

// Console errors a story causes on purpose, by story id.
const EXPECTED_ERRORS = {
  'components-avatar--fallbacks': /^Failed to load resource/,
}

// What the story prints as an error (a React warning, an invalid prop, a failed request) is a failure too.
function collectConsoleErrors(page) {
  const messages = []
  const onConsole = (message) => {
    if (message.type() === 'error') messages.push(message.text())
  }
  const onPageError = (error) => messages.push(error.message)
  page.on('console', onConsole)
  page.on('pageerror', onPageError)
  return {
    messages,
    stop() {
      page.off('console', onConsole)
      page.off('pageerror', onPageError)
    },
  }
}

async function check(page, job) {
  const errors = collectConsoleErrors(page)
  try {
    const violations = await checkStory(page, job)
    return [
      ...violations,
      ...errors.messages
        .filter((message) => !EXPECTED_ERRORS[job.id]?.test(message))
        .map((message) => ({
          help: message.split('\n')[0].slice(0, 200),
          id: 'console-error',
          nodes: [],
        })),
    ]
  } finally {
    errors.stop()
  }
}

async function checkStory(page, { id, mode }) {
  await page.goto(`${baseUrl}/iframe.html?id=${id}&viewMode=story&globals=colorMode:${mode}`)
  await page.waitForFunction(
    () => document.body.classList.contains('sb-show-main') || document.body.classList.contains('sb-show-errordisplay'),
    undefined,
    { timeout: RENDER_TIMEOUT },
  )
  if (await page.evaluate(() => document.body.classList.contains('sb-show-errordisplay'))) {
    return [{ help: 'The story throws while rendering', id: 'render-error', nodes: [] }]
  }
  await page.evaluate(() => document.fonts.ready)
  await page.addScriptTag({ path: axeSource })
  // The addon runs axe by itself when the story loads, and axe refuses a second run until it ends.
  for (let attempt = 1; ; attempt++) {
    try {
      return await runAxe(page)
    } catch (error) {
      if (attempt === 20 || !error.message.includes('Axe is already running')) throw error
      await page.waitForTimeout(250)
    }
  }
}

function runAxe(page) {
  return page.evaluate(
    async ({ context: axeContext, disabled }) => {
      window.axe.configure({ rules: disabled.map((rule) => ({ enabled: false, id: rule })) })
      const { violations } = await window.axe.run(axeContext)
      return violations.map(({ help, id, nodes }) => ({
        help,
        id,
        nodes: nodes.map(({ failureSummary, html }) => ({ failureSummary, html })),
      }))
    },
    { context: CONTEXT, disabled: DISABLED_RULES },
  )
}

async function worker() {
  const page = await context.newPage()
  for (let job = jobs.shift(); job; job = jobs.shift()) {
    try {
      const violations = await check(page, job)
      if (violations.length > 0) failures.push({ ...job, violations })
    } catch (error) {
      failures.push({ ...job, violations: [{ help: error.message.split('\n')[0], id: 'error', nodes: [] }] })
    }
  }
  await page.close()
}

const total = jobs.length
await Promise.all(Array.from({ length: Math.min(8, availableParallelism()) }, worker))
await browser.close()
close()

for (const { id, mode, violations } of failures.sort((a, b) => a.id.localeCompare(b.id))) {
  console.error(`\n${id} (${mode})`)
  for (const violation of violations) {
    console.error(`  ${violation.id}: ${violation.help}`)
    for (const node of violation.nodes.slice(0, 3)) {
      console.error(`    ${node.html.slice(0, 160)}`)
      if (node.failureSummary) console.error(`      ${node.failureSummary.split('\n').slice(1).join(' ').trim()}`)
    }
    if (violation.nodes.length > 3) console.error(`    …and ${violation.nodes.length - 3} more`)
  }
}

if (failures.length > 0) {
  console.error(`\nAccessibility: ${failures.length} of ${total} story renders have violations.`)
  process.exit(1)
}
console.log(`Accessibility: ${stories.length} stories pass axe in light and dark mode.`)
