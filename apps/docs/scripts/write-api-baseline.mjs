import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const api = JSON.parse(readFileSync(path.resolve(here, '../src/api.generated.json'), 'utf8'))
const output = path.resolve(here, process.argv[2] ?? 'api-1.0.json')

const names = Object.fromEntries(
  Object.entries(api).map(([folder, components]) => [
    folder,
    Object.fromEntries(
      components.map((component) => [component.name, component.props.map((prop) => prop.name).sort()]),
    ),
  ]),
)

writeFileSync(output, `${JSON.stringify(names, null, 1)}\n`)
console.log(`Wrote the names of ${Object.keys(names).length} folders to ${path.basename(output)}`)
