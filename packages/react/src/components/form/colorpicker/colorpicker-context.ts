'use client'

import type { CSSProperties, ForwardedRef } from 'react'
import { createContext, useContext } from 'react'
import type { ColorScheme, Shape, Size } from '../../../theme'
import type { ColorFormat } from './color-math'
import type { ColorPickerLabels, ColorPickerVariant } from './colorpicker-types'
import type { ColorState } from './use-color-state'

export interface ColorPickerContextProps {
  alpha: boolean
  blocked: boolean
  colorScheme: ColorScheme
  disabled: boolean
  eyeDropper: boolean
  format: ColorFormat
  inputRef: ForwardedRef<HTMLInputElement>
  isPanel: boolean
  isStyled: boolean
  labels: ColorPickerLabels
  open: boolean
  panelId: string
  panelStyle: CSSProperties
  readOnly: boolean
  setInput: (element: HTMLInputElement | null) => void
  setPanel: (element: HTMLElement | null) => void
  shape: Shape
  size: Size
  state: ColorState
  swatches: readonly string[]
  toggle: () => void
  variant: ColorPickerVariant
}

export const ColorPickerContext = createContext<ColorPickerContextProps | undefined>(undefined)

export function useColorPickerContext(part: string): ColorPickerContextProps {
  const context = useContext(ColorPickerContext)
  if (!context) throw new Error(`${part} must be used within a <ColorPicker>`)
  return context
}
