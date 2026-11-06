import type { ColorScheme } from '../../../theme'
import { schemeVar } from '../../../theme'

export type InputVariant = 'outline' | 'filled' | 'underline' | 'unstyled'

export interface InputLabels {
  reveal: string
}

export const inputColorVars = (colorScheme: ColorScheme): Record<string, string> => ({
  '--input-color': schemeVar(colorScheme, 'text'),
})
