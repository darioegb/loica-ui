'use client'

import { createContext, useContext } from 'react'
import type { Placement } from '../../../overlay'
import type { ColorScheme, Size } from '../../../theme'
import type { TourCloseReason, TourLabels, TourStep, TourVariant } from './tour-types'
import type { TargetRect } from './use-target-rect'

export interface TourContextProps {
  baseId: string
  colorScheme: ColorScheme
  index: number
  interactive: boolean
  isLast: boolean
  isStyled: boolean
  labels: TourLabels
  onClose: (reason: TourCloseReason) => void
  onNext: () => void
  onPrevious: () => void
  placement: Placement
  rect: TargetRect | null
  size: Size
  spotlightPadding: number
  step: TourStep
  steps: readonly TourStep[]
  target: HTMLElement | null
  variant: TourVariant
}

export const TourContext = createContext<TourContextProps | undefined>(undefined)

export function useTourContext(part: string): TourContextProps {
  const context = useContext(TourContext)
  if (!context) throw new Error(`${part} must be used within a <Tour>`)
  return context
}
