import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const componentsDir = path.resolve(here, '../../../packages/react/src/components')
const output = path.resolve(here, '../src/components.generated.json')

const CATEGORIES = {
  layout: 'Layout',
  form: 'Forms',
  interaction: 'Actions',
  navigation: 'Navigation',
  overlay: 'Overlays',
  presentation: 'Content',
  utility: 'Data and media',
}

// Storybook ids lowercase the title and replace what is not a letter or a digit with a dash.
const docsId = (title) =>
  `${title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')}--docs`

// The JSDoc above the meta of the stories is the intro of the page; its first sentence is the summary.
const summaryOf = (source) => {
  const match = /\/\*\*((?:(?!\*\/)[\s\S])*)\*\/\s*(?:export default|const meta\b)/.exec(source)
  if (!match) return ''
  const text = match[1]
    .split('\n')
    .map((line) => line.replace(/^\s*\* ?/, ''))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
  const sentence = /^.*?[.!?](?=\s|$)/.exec(text)
  return (sentence ? sentence[0] : text).replace(/`([^`]+)`/g, '$1').replace(/\*\*([^*]+)\*\*/g, '$1')
}

const components = []
for (const category of Object.keys(CATEGORIES)) {
  for (const folder of readdirSync(path.join(componentsDir, category))) {
    const storiesDir = path.join(componentsDir, category, folder, 'stories')
    let files
    try {
      files = readdirSync(storiesDir).filter((file) => file.endsWith('.stories.tsx'))
    } catch {
      continue
    }
    for (const file of files) {
      const source = readFileSync(path.join(storiesDir, file), 'utf8')
      const title = /title:\s*['"](Components\/[^'"]+)['"]/.exec(source)?.[1]
      if (!title) continue
      components.push({
        category: CATEGORIES[category],
        id: docsId(title),
        name: title.split('/').at(-1),
        summary: summaryOf(source),
      })
    }
  }
}

components.sort((a, b) => a.name.localeCompare(b.name))
writeFileSync(
  output,
  `${JSON.stringify({ categories: Object.values(CATEGORIES), components }, null, 2)}\n`,
)
console.log(`Components overview: ${components.length} components`)
