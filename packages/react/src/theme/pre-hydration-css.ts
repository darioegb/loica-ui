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

const page = (mode: ColorMode, theme: Theme): string =>
  `:root{color-scheme:${mode}}body{background-color:${theme.semantic.background};color:${theme.semantic.foreground}}`

const important = (vars: Record<string, string>): string =>
  Object.entries(vars)
    .map(([name, value]) => `${name}:${value}!important`)
    .join(';')

/**
 * The CSS that makes the page and the root right in the first paint, before React hydrates and its effects run.
 * With an explicit mode it is the page (color scheme, background and text); with `system` it is the same inside
 * `prefers-color-scheme: dark`, plus the variables of the dark theme for the root, which `!important` puts over the
 * light ones that its `style` attribute has, since the server can't know the preference.
 */
export function preHydrationCss({
  applyToBody,
  dark,
  id,
  light,
  mode,
  setting,
}: PreHydrationInput): string {
  const css =
    setting === 'system'
      ? `${applyToBody ? page('light', light) : ''}@media(prefers-color-scheme:dark){[data-loica-system="${id}"]{color-scheme:dark!important;${important(
          getCssVarOverrides(themeToCssVars(dark), themeToCssVars(light)),
        )}}${applyToBody ? page('dark', dark) : ''}}`
      : applyToBody
        ? page(mode, mode === 'dark' ? dark : light)
        : ''
  return css.replace(/</g, '\\3c ')
}
