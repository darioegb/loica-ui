'use client'

import type { MouseEvent } from 'react'
import { createContext, useContext } from 'react'

/** `remove` is the start of the accessible name of the remove button, which goes before the text of the Chip (`Remove Design`). */
export interface ChipLabels {
  remove: string
}

export interface ChipContextValue {
  disabled: boolean
  isStyled: boolean
  labelId: string
  labels: ChipLabels
  onRemove?: (event: MouseEvent<HTMLButtonElement>) => void
  removeId: string
}

export const ChipRemoveLabelContext = createContext<string | undefined>(undefined)

export const ChipContext = createContext<ChipContextValue | undefined>(undefined)

export function useChipContext(part: string): ChipContextValue {
  const context = useContext(ChipContext)
  if (!context) throw new Error(`<${part}> must be rendered inside a <Chip>`)
  return context
}
