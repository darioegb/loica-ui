'use client'

import { createContext, useContext } from 'react'
import type { InputFieldProps } from '../input/input-field'

export interface TimePickerInputContextProps {
  blocked: boolean
  fieldProps: InputFieldProps
  hint: string
  hintId: string
  setRef: (node: HTMLInputElement | null) => void
}

export const TimePickerInputContext = createContext<TimePickerInputContextProps | undefined>(
  undefined,
)

export const useTimePickerInputContext = (part: string): TimePickerInputContextProps => {
  const context = useContext(TimePickerInputContext)
  if (!context) {
    throw new Error(`${part} must be used within a <TimePickerInput>`)
  }
  return context
}
