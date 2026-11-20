'use client'

import { createContext, useContext } from 'react'
import type { DropdownInitialItem } from '../dropdown/dropdown-context'

export interface ContextMenuContextValue {
  open: boolean
  openAt: (x: number, y: number, initialItem: DropdownInitialItem) => void
}

export const ContextMenuContext = createContext<ContextMenuContextValue | undefined>(undefined)

export function useContextMenuContext(part: string): ContextMenuContextValue {
  const context = useContext(ContextMenuContext)
  if (!context) throw new Error(`${part} must be used within a <ContextMenu>`)
  return context
}
