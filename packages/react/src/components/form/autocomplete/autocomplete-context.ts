'use client'

import type { KeyboardEvent } from 'react'
import { createContext, useContext } from 'react'
import type { Placement } from '../../../overlay'
import type { ColorScheme, Shape, Size } from '../../../theme'
import type { SelectVariant } from '../select/select-context'

export type AutocompleteVariant = SelectVariant

export interface AutocompleteContextValue {
  activeId: string | undefined
  anchor: HTMLElement | null
  ariaDescribedBy: string | undefined
  ariaInvalid: boolean | 'true' | 'false' | undefined
  ariaLabel: string | undefined
  ariaLabelledBy: string | undefined
  close: (returnFocus: boolean) => void
  colorScheme: ColorScheme
  controlId: string
  disabled: boolean
  flip: boolean
  isStyled: boolean
  listboxId: string
  offset: number
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void
  onValueInput: (value: string) => void
  open: boolean
  placement: Placement
  readOnly: boolean
  required: boolean
  setEmptyShown: (shown: boolean) => void
  setInput: (element: HTMLInputElement | null) => void
  shape: Shape
  shift: boolean
  size: Size
  value: string
  variant: AutocompleteVariant
}

export const AutocompleteContext = createContext<AutocompleteContextValue | undefined>(undefined)

export function useAutocompleteContext(part: string): AutocompleteContextValue {
  const context = useContext(AutocompleteContext)
  if (!context) throw new Error(`${part} must be used within an <Autocomplete>`)
  return context
}
