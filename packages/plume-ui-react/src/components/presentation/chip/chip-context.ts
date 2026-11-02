'use client'

import { createContext } from 'react'

/** `remove` is the start of the accessible name of the remove button, which goes before the text of the Chip (`Remove Design`). */
export interface ChipLabels {
  remove: string
}

export const ChipRemoveLabelContext = createContext<string | undefined>(undefined)

