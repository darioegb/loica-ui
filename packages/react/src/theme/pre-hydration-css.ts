import { getCssVarOverrides } from './default-css-vars'
import type { ColorMode, ColorModeSetting } from './theme-context'
import { themeToCssVars } from './theme-to-css-vars'
import type { Theme } from './theme.types'

interface PreHydrationInput {
  applyToBody: boolean
  dark: Theme
  id: string
  light: Theme
  mode: ColorMode
  setting: ColorModeSetting
}

// A value that could end its declaration or the style element is left out: the inline style of the root, which
// the browser parses as a value and not as a stylesheet, still applies it once the page has hydrated.
const isSafe = (value: string): boolean => !/[{}<>;\\]/.test(value)

function page(mode: ColorMode, theme: Theme): string {
  const { background, foreground } = theme.semantic
  const colors =
    isSafe(background) && isSafe(foreground)
      ? `body{background-color:${background};color:${foreground}}`
      : ''
  return `:root{color-scheme:${mode}}${colors}`
}

function important(vars: Record<string, string>): string {
  return Object.entries(vars)
    .filter(([, value]) => isSafe(value))
    .map(([name, value]) => `${name}:${value}!important`)
    .join(';')
}

function systemCss({ applyToBody, dark, id, light }: PreHydrationInput): string {
  const lightPage = applyToBody ? page('light', light) : ''
  const darkPage = applyToBody ? page('dark', dark) : ''
  const variables = important(getCssVarOverrides(themeToCssVars(dark), themeToCssVars(light)))
  return `${lightPage}@media(prefers-color-scheme:dark){[data-loica-system="${id}"]{color-scheme:dark!important;${variables}}${darkPage}}`
}

/**
 * The CSS that makes the page and the root right in the first paint, before React hydrates and its effects run.
 * With an explicit mode it is the page (color scheme, background and text); with `system` it is the same inside
 * `prefers-color-scheme: dark`, plus the variables of the dark theme for the root, which `!important` puts over the
 * light ones that its `style` attribute has, since the server can't know the preference.
 */
export function preHydrationCss(input: PreHydrationInput): string {
  if (input.setting === 'system') return systemCss(input)
  if (!input.applyToBody) return ''
  return page(input.mode, input.mode === 'dark' ? input.dark : input.light)
}
