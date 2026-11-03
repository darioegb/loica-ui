import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { getDefaultCssVars } from '../src/theme/default-css-vars'

const SKIPPED_FOLDERS = new Set(['tests', 'stories'])
const NAME = '[a-z0-9]+(?:-[a-z0-9]+)*'
const REFERENCE = new RegExp(`--plume-${NAME}`, 'g')
const NESTED_REFERENCE = new RegExp(`var\\((--plume-${NAME})\\)`, 'g')

/**
 * The theme is not read from `src/theme`: it defines the tokens, and `theme-provider.tsx` is the
 * only file there that consumes some.
 */
function readSources(srcDir: string): string {
  return readdirSync(srcDir, { recursive: true, encoding: 'utf8' })
    .map((file) => file.split(path.sep))
    .filter((parts) => {
      const name = parts[parts.length - 1]
      if (!/\.(css|tsx?)$/.test(name) || name.endsWith('.d.ts')) return false
      if (parts.some((part) => SKIPPED_FOLDERS.has(part))) return false
      return parts[0] !== 'theme' || name === 'theme-provider.tsx'
    })
    .map((parts) => readFileSync(path.join(srcDir, ...parts), 'utf8'))
    .join('\n')
}

/**
 * The tokens of the default theme that no component reads, directly or through another token
 * (`--plume-text-heading-2-size` is `var(--plume-font-size-3xl)`). The theme keeps only what the
 * components use, so a token a change stops reading shows up here. The
 * colors of a scheme are left out: a component reads them by the name of its `colorScheme`, through
 * `schemeVar`, and `SchemeToken` lists the ones that exist.
 */
export function getUnreadTokens(srcDir: string): string[] {
  const source = readSources(srcDir)
  const light = getDefaultCssVars('light')
  const dark = getDefaultCssVars('dark')

  const read = new Set((source.match(REFERENCE) ?? []).filter((name) => name in light))
  const pending = [...read]
  for (let name = pending.pop(); name; name = pending.pop()) {
    for (const vars of [light, dark]) {
      for (const [, nested] of (vars[name] ?? '').matchAll(NESTED_REFERENCE)) {
        if (nested in light && !read.has(nested)) {
          read.add(nested)
          pending.push(nested)
        }
      }
    }
  }
  return Object.keys(light).filter((name) => !read.has(name) && !name.startsWith('--plume-color-'))
}
