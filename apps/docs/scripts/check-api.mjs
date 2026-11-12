import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const api = JSON.parse(readFileSync(path.resolve(here, '../src/api.generated.json'), 'utf8'))
const filter = process.argv[2]
const MAIN_EXCEPTIONS = { toast: 'ToastProvider' }

const baseline = JSON.parse(readFileSync(path.resolve(here, 'api-1.0.json'), 'utf8'))

const missing = []
const SINCE = /^[1-9]\d*\.\d+$/
const badSince = (label, since) => {
  if (since !== undefined && !SINCE.test(since)) {
    missing.push(`${label} has @since "${since}", write it as major.minor, like 1.2`)
  }
}
const checkSince = (folder, component, published) => {
  const label = `${folder}: ${component.name}`
  if (!published) {
    if (!component.since) missing.push(`${label} is new since 1.0: tag it with @since, like 1.1`)
    return
  }
  if (component.since) missing.push(`${label} is in 1.0, so it takes no @since`)
  for (const prop of component.props) {
    const isNew = !published.includes(prop.name)
    if (isNew && !prop.since) missing.push(`${label}.${prop.name} is new since 1.0: tag it with @since, like 1.1`)
    if (!isNew && prop.since) missing.push(`${label}.${prop.name} is in 1.0, so it takes no @since`)
  }
}

for (const [folder, components] of Object.entries(api)) {
  if (filter && folder !== filter) continue
  const main = MAIN_EXCEPTIONS[folder] ?? components.find((c) => c.name.toLowerCase() === folder)?.name
  for (const component of components) {
    badSince(`${folder}: ${component.name}`, component.since)
    checkSince(folder, component, baseline[folder]?.[component.name])
    if (component.name !== main && !component.description) {
      missing.push(`${folder}: ${component.name} has no description`)
    }
    for (const prop of component.props) {
      badSince(`${folder}: ${component.name}.${prop.name}`, prop.since)
      if (!prop.description) missing.push(`${folder}: ${component.name}.${prop.name} has no description`)
    }
  }
}

if (missing.length > 0) {
  console.log(missing.join('\n'))
  console.log(`\n${missing.length} problems in the API reference`)
  process.exit(1)
}
console.log('API reference: every part and prop is described')
