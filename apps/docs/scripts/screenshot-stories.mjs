// Takes a screenshot of the Tailwind and Bootstrap story of every component, in light and dark mode, into
// `story-screenshots/` with an `index.html` that shows them side by side. Those two stories are the ones that style
// the `unstyled` variant with another framework, so a change that breaks one is easy to miss in review. CI uploads
// the folder as an artifact of the pull request. It reads the static build (`storybook-static`), or a running
// Storybook with `--url`.
//
//   node scripts/screenshot-stories.mjs                          every Tailwind and Bootstrap story
//   node scripts/screenshot-stories.mjs datepicker select       only the stories whose id contains one of the words
//   node scripts/screenshot-stories.mjs --url http://localhost:6006 datepicker
import { mkdir, rm, writeFile } from 'node:fs/promises'
import { availableParallelism } from 'node:os'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'
import { openStorybook } from './storybook-server.mjs'

const outDir = fileURLToPath(new URL('../story-screenshots', import.meta.url))
const MODES = ['light', 'dark']
const RENDER_TIMEOUT = 15_000

const { baseUrl, close, filters, stories: all } = await openStorybook(process.argv.slice(2))
const stories = all.filter((id) => /--(tailwind|bootstrap)$/.test(id))

if (stories.length === 0) {
  console.error(`No Tailwind or Bootstrap story matches ${filters.join(', ')}.`)
  process.exit(1)
}

await rm(outDir, { force: true, recursive: true })
await mkdir(outDir, { recursive: true })

const jobs = MODES.flatMap((mode) => stories.map((id) => ({ id, mode })))
const browser = await chromium.launch()
const context = await browser.newContext({ reducedMotion: 'reduce', viewport: { height: 600, width: 1000 } })
const failures = []

async function shoot(page, { id, mode }) {
  await page.goto(`${baseUrl}/iframe.html?id=${id}&viewMode=story&globals=colorMode:${mode}`)
  await page.waitForFunction(
    () => document.body.classList.contains('sb-show-main') || document.body.classList.contains('sb-show-errordisplay'),
    undefined,
    { timeout: RENDER_TIMEOUT },
  )
  if (await page.evaluate(() => document.body.classList.contains('sb-show-errordisplay'))) {
    throw new Error('The story throws while rendering')
  }
  await page.evaluate(() => document.fonts.ready)
  await page.screenshot({ fullPage: true, path: `${outDir}/${id}--${mode}.png` })
}

async function worker() {
  const page = await context.newPage()
  for (let job = jobs.shift(); job; job = jobs.shift()) {
    try {
      await shoot(page, job)
    } catch (error) {
      failures.push(`${job.id} (${job.mode}): ${error.message.split('\n')[0]}`)
    }
  }
  await page.close()
}

await Promise.all(Array.from({ length: Math.min(8, availableParallelism()) }, worker))
await browser.close()
close()

const title = (id) => id.replace(/^components-/, '').replace('--', ' · ')
const rows = stories
  .sort()
  .map(
    (id) =>
      `<h2>${title(id)}</h2><div class="row">${MODES.map((mode) => `<img loading="lazy" src="${id}--${mode}.png" alt="${id} in ${mode} mode">`).join('')}</div>`,
  )
await writeFile(
  `${outDir}/index.html`,
  `<!doctype html><meta charset="utf-8"><title>Tailwind and Bootstrap stories</title>
<style>body{font:14px system-ui;margin:1rem}h2{margin:1.5rem 0 .5rem}.row{display:flex;gap:1rem}img{width:49%;border:1px solid #8884}</style>
${rows.join('\n')}`,
)

if (failures.length > 0) {
  console.error(failures.sort().join('\n'))
  console.error(`\nScreenshots: ${failures.length} of ${stories.length * MODES.length} failed.`)
  process.exit(1)
}
console.log(`Screenshots: ${stories.length * MODES.length} images in ${outDir}`)
