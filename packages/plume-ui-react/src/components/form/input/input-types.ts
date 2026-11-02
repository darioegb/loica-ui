import type { ColorScheme } from '../../../theme'

export type InputVariant = 'outline' | 'filled' | 'underline' | 'unstyled'

export interface InputLabels {
  reveal: string
}

export const inputColorVars = (colorScheme: ColorScheme): Record<string, string> => ({
  '--input-color': `var(--plume-color-${colorScheme}-text)`,
})
