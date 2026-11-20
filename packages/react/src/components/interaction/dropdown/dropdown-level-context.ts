'use client'

import { createContext } from 'react'

export interface DropdownLevel {
  close: () => void
  contains: (target: Node | null) => boolean
  parent: DropdownLevel | undefined
}

export const DropdownLevelContext = createContext<DropdownLevel | undefined>(undefined)
