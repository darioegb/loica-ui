import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { gzipSync } from 'node:zlib'
import { build } from 'esbuild'

const packageDir = resolve(import.meta.dirname, '..')
const budgetFile = join(import.meta.dirname, 'bundle-budget.json')
const pageFile = resolve(packageDir, '../../apps/docs/stories/why-loica.mdx')
const dist = join(packageDir, 'dist')
const write = process.argv.includes('--write')

if (!existsSync(join(dist, 'index.mjs'))) {
  throw new Error('Build the package first: pnpm --filter @loica-ui/react build')
}

const config = JSON.parse(readFileSync(budgetFile, 'utf8'))
const gzipped = (content) => gzipSync(content, { level: 9 }).length
const kilobytes = (bytes) => `${(bytes / 1024).toFixed(1)} KB`
const withHeadroom = (bytes) => Math.ceil((bytes * 1.05) / 50) * 50

async function measureJs(imports) {
  const names = imports === '*' ? '*' : `{ ${imports.join(', ')} }`
  const result = await build({
    stdin: { contents: `export ${names} from './dist/index.mjs'`, loader: 'js', resolveDir: packageDir },
    bundle: true,
    external: ['react', 'react-dom', 'react/jsx-runtime'],
    format: 'esm',
    logLevel: 'silent',
    minify: true,
    write: false,
  })
  return gzipped(result.outputFiles[0].contents)
}

function sheetsOf(name, seen = new Set()) {
  if (seen.has(name)) return seen
  seen.add(name)
  const css = readFileSync(join(dist, 'css', `${name}.css`), 'utf8')
  for (const [, imported] of css.matchAll(/@import\s+['"]\.\/([^'"]+)\.css['"]/g)) sheetsOf(imported, seen)
  return seen
}

function measureCss(css) {
  if (typeof css === 'string') return gzipped(readFileSync(join(dist, css)))
  const names = new Set(css.flatMap((name) => [...sheetsOf(name)]))
  const text = [...names].map((name) => readFileSync(join(dist, 'css', `${name}.css`), 'utf8')).join('')
  return gzipped(text)
}

const measured = {}
for (const item of config.cases) {
  measured[item.name] = { css: measureCss(item.css), js: await measureJs(item.imports) }
}

const failures = []
const rows = config.cases.map((item) => {
  const { css, js } = measured[item.name]
  const budget = config.budgets[item.name]
  const cells = [['js', js], ['css', css]].map(([kind, bytes]) => {
    const limit = budget?.[kind]
    if (limit === undefined) failures.push(`${item.name} has no ${kind} budget: run check:size --write`)
    else if (bytes > limit) failures.push(`${item.name} ${kind}: ${kilobytes(bytes)} is over its budget of ${kilobytes(limit)}`)
    return `${kilobytes(bytes)} / ${limit === undefined ? '-' : kilobytes(limit)}`
  })
  return `${item.name.padEnd(12)} js ${cells[0].padEnd(20)} css ${cells[1]}`
})
console.log(`Gzipped size / budget, without React\n${rows.join('\n')}`)

if (write) {
  config.budgets = Object.fromEntries(
    config.cases.map((item) => [
      item.name,
      { css: withHeadroom(measured[item.name].css), js: withHeadroom(measured[item.name].js) },
    ]),
  )
  writeFileSync(budgetFile, `${JSON.stringify(config, null, 2)}\n`)

  const { version } = JSON.parse(readFileSync(join(packageDir, 'package.json'), 'utf8'))
  const [major, minor] = version.split('.')
  const body = config.cases
    .map((item) => {
      const { css, js } = measured[item.name]
      const cssCell = typeof item.css === 'string' ? `${kilobytes(css)} (<code>${item.css}</code>)` : kilobytes(css)
      return `    <tr><td>${item.label}</td><td>${kilobytes(js)}</td><td>${cssCell}</td></tr>`
    })
    .join('\n')
  const page = readFileSync(pageFile, 'utf8')
  const table = /(\{\/\* size-table:start \*\/\}[\s\S]*?<tbody>\n)[\s\S]*?(\n  <\/tbody>[\s\S]*?\{\/\* size-table:end \*\/\})/
  if (!table.test(page)) throw new Error('why-loica.mdx has no size-table markers')
  writeFileSync(
    pageFile,
    page
      .replace(table, `$1${body}$2`)
      .replace(/Measured on version \d+\.\d+/, `Measured on version ${major}.${minor}`),
  )
  console.log('\nWrote the budgets and the table of why-loica.mdx')
} else if (failures.length > 0) {
  console.error(`\n${failures.join('\n')}`)
  console.error('\nIf the growth is on purpose, run `pnpm --filter @loica-ui/react check:size --write` and commit the new budgets.')
  process.exit(1)
}
