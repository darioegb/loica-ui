// Compares how the stories look in two static Storybook builds: the base (the branch a pull request goes into) and
// the head (this one). It screenshots the `Default` and `Variants` story of every component, in light and dark
// mode, in both builds on the same machine, and fails when a picture is different, so the look of the default theme
// changes only on purpose (see the Public API guide). Nothing is stored: the base is rendered every time, so there
// is no baseline to update and no difference between machines.
//
//   node scripts/check-visual.mjs --base ../../base/apps/docs/storybook-static
//   node scripts/check-visual.mjs --base <dir> button input     only the stories whose id contains a word
//   node scripts/check-visual.mjs --base <dir> --allow-changes  report the differences, but don't fail
//
// `--head` is the build to check (`storybook-static`) and `--out` is where the report goes (`visual-report`): the
// `before` and `after` picture of every story that changed, and the `after` of the new ones.
import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { availableParallelism } from 'node:os'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'
import { serveStatic } from './serve-static.mjs'

const MODES = ['light', 'dark']
const STORIES = /--(default|variants)$/
const RENDER_TIMEOUT = 15_000
// Stories that show a date (today in the calendar) must not change with the day they are rendered.
const NOW = new Date('2026-06-15T12:00:00Z')

const args = process.argv.slice(2)
const flags = {}
const filters = []
for (let index = 0; index < args.length; index++) {
  if (['--base', '--head', '--out'].includes(args[index])) flags[args[index].slice(2)] = args[++index]
  else if (args[index] === '--allow-changes') flags.allowChanges = true
  else filters.push(args[index])
}
if (!flags.base) {
  console.error('--base takes the folder of the static Storybook to compare with.')
  process.exit(1)
}
const headDir = resolve(flags.head ?? fileURLToPath(new URL('../storybook-static', import.meta.url)))
const baseDir = resolve(flags.base)
const outDir = resolve(flags.out ?? fileURLToPath(new URL('../visual-report', import.meta.url)))

const servers = { base: await serveStatic(baseDir), head: await serveStatic(headDir) }
const urls = Object.fromEntries(
  Object.entries(servers).map(([side, server]) => [side, `http://127.0.0.1:${server.address().port}`]),
)

async function storyIds(url) {
  const index = await (await fetch(`${url}/index.json`)).json()
  return Object.values(index.entries)
    .filter((entry) => entry.type === 'story' && STORIES.test(entry.id))
    .map((entry) => entry.id)
}

const [baseIds, headIds] = await Promise.all([storyIds(urls.base), storyIds(urls.head)])
const ids = [...new Set([...baseIds, ...headIds])]
  .filter((id) => filters.length === 0 || filters.some((word) => id.includes(word.toLowerCase())))
  .sort()
if (ids.length === 0) {
  console.error('No story to compare.')
  process.exit(1)
}

const jobs = ids.flatMap((id) => MODES.map((mode) => ({ id, mode })))
const inBase = new Set(baseIds)
const inHead = new Set(headIds)

async function shoot(page, side, { id, mode }) {
  await page.goto(`${urls[side]}/iframe.html?id=${id}&viewMode=story&globals=colorMode:${mode}`)
  await page.waitForFunction(
    () => document.body.classList.contains('sb-show-main') || document.body.classList.contains('sb-show-errordisplay'),
    undefined,
    { timeout: RENDER_TIMEOUT },
  )
  if (await page.evaluate(() => document.body.classList.contains('sb-show-errordisplay'))) {
    throw new Error(`The story ${id} throws while rendering in the ${side} build`)
  }
  await page.evaluate(() => document.fonts.ready)
  await page.evaluate(() => new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done))))
  return page.screenshot({ animations: 'disabled', caret: 'hide', fullPage: true })
}

const browser = await chromium.launch()
const changed = []
const added = []
const removed = []
const errors = []

async function worker() {
  const context = await browser.newContext({ reducedMotion: 'reduce', viewport: { height: 900, width: 1280 } })
  await context.clock.install({ time: NOW })
  await context.clock.setFixedTime(NOW)
  const page = await context.newPage()
  for (let job = jobs.shift(); job; job = jobs.shift()) {
    const name = `${job.id}--${job.mode}`
    try {
      if (!inBase.has(job.id)) {
        added.push({ ...job, after: await shoot(page, 'head', job) })
      } else if (!inHead.has(job.id)) {
        removed.push(name)
      } else {
        const before = await shoot(page, 'base', job)
        const after = await shoot(page, 'head', job)
        if (!before.equals(after)) changed.push({ ...job, after, before })
      }
    } catch (error) {
      errors.push(`${name}: ${error.message.split('\n')[0]}`)
    }
  }
  await context.close()
}

const total = jobs.length
await Promise.all(Array.from({ length: Math.min(8, availableParallelism()) }, worker))
await browser.close()
for (const server of Object.values(servers)) server.close()

rmSync(outDir, { force: true, recursive: true })
if (changed.length + added.length > 0) mkdirSync(outDir, { recursive: true })
for (const { id, mode, after, before } of changed) {
  writeFileSync(join(outDir, `${id}--${mode}.before.png`), before)
  writeFileSync(join(outDir, `${id}--${mode}.after.png`), after)
}
for (const { id, mode, after } of added) writeFileSync(join(outDir, `${id}--${mode}.after.png`), after)

const label = ({ id, mode }) => `${id} (${mode})`
const byLabel = (first, second) => label(first).localeCompare(label(second))
if (added.length > 0) console.log(`\nNew stories, with nothing to compare:\n${added.sort(byLabel).map((job) => `  ${label(job)}`).join('\n')}`)
if (removed.length > 0) console.log(`\nStories that are not in the head build:\n${removed.sort().map((name) => `  ${name}`).join('\n')}`)
if (errors.length > 0) console.error(`\nCould not render:\n${errors.sort().map((message) => `  ${message}`).join('\n')}`)
if (changed.length > 0) {
  console.error(`\nLook different from the base:\n${changed.sort(byLabel).map((job) => `  ${label(job)}`).join('\n')}`)
  console.error(`\nThe before and after pictures are in ${outDir}.`)
}

const different = changed.length + errors.length
if (different > 0 && !flags.allowChanges) {
  console.error(
    `\nVisual: ${changed.length} of ${total} story renders changed. If that is on purpose, the pull request needs the \`visual-change\` label.`,
  )
  process.exit(1)
}
console.log(
  different > 0
    ? `Visual: ${changed.length} of ${total} story renders changed, allowed.`
    : `Visual: ${total} story renders look the same as in the base.`,
)
