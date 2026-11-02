import type { CSSProperties, ReactNode, Ref, RefObject } from 'react'
import type { ColorScheme } from '../../../theme'

export interface SliderMark {
  label?: ReactNode
  value: number
}

export interface SliderLabels {
  thumb: (index: number) => string
}

export interface SliderState {
  ariaLabel: string | undefined
  commit: () => void
  describedBy: string | undefined
  disabled: boolean
  firstId: string
  formatValue: ((value: number) => string) | undefined
  fractions: number[]
  inputs: RefObject<(HTMLInputElement | null)[]>
  isInvalid: boolean
  isRange: boolean
  isStyled: boolean
  labelledBy: string | undefined
  marks: SliderMark[]
  max: number
  min: number
  name: string | undefined
  orientation: 'horizontal' | 'vertical'
  readOnly: boolean
  rootRef: Ref<HTMLInputElement> | undefined
  step: number
  text: SliderLabels
  update: (index: number, requested: number) => void
  values: number[]
}

export const sliderColorVars = (colorScheme: ColorScheme, style?: CSSProperties): CSSProperties =>
  ({
    '--slider-solid': `var(--plume-color-${colorScheme}-solid)`,
    '--slider-text': `var(--plume-color-${colorScheme}-text)`,
    '--slider-tint': `var(--plume-color-${colorScheme}-tint)`,
    ...style,
  }) as CSSProperties
