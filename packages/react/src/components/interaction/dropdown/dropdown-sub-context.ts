'use client'

import { createContext, useContext } from 'react'
import type { DropdownLevel } from './dropdown-level-context'

export type DropdownSubMode = 'keyboard' | 'pointer'

export interface DropdownSubContextValue {
  closeSub: () => void
  delay: number
  level: DropdownLevel
  menuId: string
  mode: DropdownSubMode
  open: boolean
  openSub: (mode: DropdownSubMode) => void
  parentLevel: DropdownLevel | undefined
  setPanel: (element: HTMLElement | null) => void
  setTrigger: (element: HTMLElement | null) => void
  startGrace: (origin: { x: number; y: number }) => void
  trigger: HTMLElement | null
  triggerId: string
}

export const DropdownSubContext = createContext<DropdownSubContextValue | undefined>(undefined)

export function useDropdownSubContext(part: string): DropdownSubContextValue {
  const context = useContext(DropdownSubContext)
  if (!context) throw new Error(`${part} must be used within a <DropdownSub>`)
  return context
}
