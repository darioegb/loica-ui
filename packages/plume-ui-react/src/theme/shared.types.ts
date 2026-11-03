import type { CSSProperties } from 'react'
import type { ColorPalette } from './theme.types'

export interface ComponentProps {
  className?: string
  style?: CSSProperties
  index?: number
}

export type Size = 'sm' | 'md' | 'lg'
export type Shape = 'pill' | 'rounded'
export type ColorScheme = keyof ColorPalette
/**
 * The colors the theme derives from the shades of every color scheme, each one the variable
 * `--plume-color-<scheme>-<token>`, already adjusted for contrast in light and dark mode.
 */
export type SchemeToken =
  | 'solid'
  | 'solid-contrast'
  | 'solid-hover'
  | 'solid-active'
  | 'text'
  | 'text-hover'
  | 'text-active'
  | 'tint'
  | 'tint-strong'
  | 'tint-text'
