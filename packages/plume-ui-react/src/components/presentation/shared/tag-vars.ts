import type { CSSProperties } from 'react'
import type { ColorScheme } from '../../../theme'
import { schemeVar } from '../../../theme'

export const tagColorVars = (
  name: 'alert' | 'avatar' | 'badge' | 'chip',
  colorScheme: ColorScheme,
  style?: CSSProperties,
): CSSProperties =>
  ({
    [`--${name}-solid`]: schemeVar(colorScheme, 'solid'),
    [`--${name}-contrast`]: schemeVar(colorScheme, 'solid-contrast'),
    [`--${name}-text`]: schemeVar(colorScheme, 'text'),
    [`--${name}-tint`]: schemeVar(colorScheme, 'tint'),
    [`--${name}-tint-text`]: schemeVar(colorScheme, 'tint-text'),
    '--tag-solid': `var(--${name}-solid)`,
    '--tag-contrast': `var(--${name}-contrast)`,
    '--tag-text': `var(--${name}-text)`,
    '--tag-tint': `var(--${name}-tint)`,
    '--tag-tint-text': `var(--${name}-tint-text)`,
    ...style,
  }) as CSSProperties
