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
 * The tokens `tokens.css` declares: the ones the components read, plus what those resolve to
 * (`--plume-text-heading-2-size` is `var(--plume-font-size-3xl)`), plus the ones that change with
 * the color mode, so a framework theme built on them follows it, plus every color of every scheme,
 * because a `colorScheme` takes any of them at runtime through `schemeVar`. The rest of the default
 * theme (the long spaces scale, the largest containers...) is not declared; a `<ThemeProvider>`
 * still emits any of them as soon as its theme changes the value.
 */
export function getEmittedTokens(srcDir: string): Set<string> {
  const source = readSources(srcDir)
  const light = getDefaultCssVars('light')
  const dark = getDefaultCssVars('dark')

  const emitted = new Set((source.match(REFERENCE) ?? []).filter((name) => name in light))
  for (const name of Object.keys(light)) {
    if (light[name] !== dark[name] || name.startsWith('--plume-color-')) emitted.add(name)
  }

  const pending = [...emitted]
  for (let name = pending.pop(); name; name = pending.pop()) {
    for (const vars of [light, dark]) {
      for (const [, nested] of (vars[name] ?? '').matchAll(NESTED_REFERENCE)) {
        if (nested in light && !emitted.has(nested)) {
          emitted.add(nested)
          pending.push(nested)
        }
      }
    }
  }
  return emitted
}
