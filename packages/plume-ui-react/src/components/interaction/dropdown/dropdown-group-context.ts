'use client'

import { createContext } from 'react'

export interface DropdownGroupContextValue {
  labelId: string
}

export const DropdownGroupContext = createContext<DropdownGroupContextValue | undefined>(undefined)
