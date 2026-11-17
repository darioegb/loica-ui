'use client'

import { createContext, useContext } from 'react'

export interface CommandPaletteContextValue {
  activeId: string | undefined
  isStyled: boolean
  matches: (value: string, keywords: readonly string[]) => boolean
  select: (run: (() => void) | undefined) => void
  setActiveId: (id: string | undefined) => void
}

export const CommandPaletteContext = createContext<CommandPaletteContextValue | undefined>(
  undefined,
)

export function useCommandPaletteContext(part: string): CommandPaletteContextValue {
  const context = useContext(CommandPaletteContext)
  if (!context) throw new Error(`${part} must be used within a <CommandPalette>`)
  return context
}
