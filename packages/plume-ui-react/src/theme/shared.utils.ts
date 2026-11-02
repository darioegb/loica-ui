import { defaultTheme } from './config'
import type { ColorShade } from './shared.types'

const palettes = defaultTheme.colors as unknown as Record<string, Record<string, string> | undefined>

/**
 * Maps a ColorShade (e.g. 'primary' or 'primary.900') to the matching CSS custom property
 * (e.g. `var(--plume-color-primary-900)`). A bare scheme defaults to shade 500. The stylesheet only
 * declares the variables the components read, so the default shade comes as fallback; a
 * <ThemeProvider> emits the variable when its theme changes the shade.
 */
export function colorVar(colorShade: ColorShade): string {
  const [scheme, shade = '500'] = colorShade.split('.')
  const fallback = palettes[scheme]?.[shade]
  return `var(--plume-color-${scheme}-${shade}${fallback ? `, ${fallback}` : ''})`
}
