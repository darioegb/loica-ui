import { deepMerge } from '../utils/merge'
import { defaultDarkTheme, defaultTheme } from './config'
import type { ColorMode } from './theme-context'
import { themeToCssVars } from './theme-to-css-vars'
import type { Theme } from './theme.types'

type CssVars = Record<string, string>

const cache: Partial<Record<ColorMode, CssVars>> = {}

/**
 * The default value of every variable for a mode. `tokens.css` declares the ones the components
 * read, so a provider only has to emit what its theme changes.
 */
export function getDefaultCssVars(mode: ColorMode): CssVars {
  cache[mode] ??= themeToCssVars(
    mode === 'dark' ? deepMerge<Theme>(defaultTheme, defaultDarkTheme as Theme) : defaultTheme,
  )
  return cache[mode]
}

/**
 * The variables that differ from the defaults. A value that points to another variable is always
 * kept: it is resolved where it is declared, so a custom `--plume-color-primary-text` in a
 * provider only reaches `--plume-focus-ring-color` if this one is declared again next to it.
 */
export function getCssVarOverrides(vars: CssVars, defaults: CssVars): CssVars {
  return Object.fromEntries(
    Object.entries(vars).filter(
      ([name, value]) => defaults[name] !== value || value.includes('var('),
    ),
  )
}
