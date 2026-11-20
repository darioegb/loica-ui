'use client'

import { createContext, useContext } from 'react'
import type { SplitterBounds, SplitterLimits } from './splitter-math'

export type SplitterOrientation = 'horizontal' | 'vertical'

export type SplitterVariant = 'bar' | 'line' | 'unstyled'

export interface SplitterLabels {
  resize: (handle: number, count: number) => string
}

export interface SplitterContextValue {
  bounds: (index: number) => SplitterBounds
  count: number
  dragging: number | null
  isStyled: boolean
  jump: (index: number, edge: 'end' | 'start') => void
  labels: SplitterLabels
  limits: readonly SplitterLimits[]
  moveBy: (index: number, delta: number) => void
  orientation: SplitterOrientation
  panelIds: readonly string[]
  pointerEnd: () => void
  pointerMove: (position: number) => void
  pointerStart: (index: number, position: number) => void
  sizes: readonly number[]
  step: number
  toggle: (index: number) => void
  variant: SplitterVariant
}

export const SplitterContext = createContext<SplitterContextValue | undefined>(undefined)

export const SplitterIndexContext = createContext<number | undefined>(undefined)

export function useSplitterContext(part: string): SplitterContextValue {
  const context = useContext(SplitterContext)
  if (!context) throw new Error(`${part} must be used within a <Splitter>`)
  return context
}

export function useSplitterIndex(part: string): number {
  const index = useContext(SplitterIndexContext)
  if (index === undefined) throw new Error(`${part} must be used within a <Splitter>`)
  return index
}
