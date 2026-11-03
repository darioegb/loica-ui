import type { ColorScheme, SchemeToken } from './shared.types'

/**
 * The CSS variable of a color the theme derives from a color scheme, e.g.
 * `schemeVar('primary', 'solid')` is `var(--plume-color-primary-solid)`.
 */
export function schemeVar(colorScheme: ColorScheme, token: SchemeToken): string {
  return `var(--plume-color-${colorScheme}-${token})`
}
