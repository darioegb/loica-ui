'use client'

import type { ReactNode } from 'react'
import { createContext, useContext } from 'react'
import type { AlertStatus } from './alert'

export interface AlertContextValue {
  dismiss: () => void
  icon: ReactNode
  isStyled: boolean
  status: AlertStatus
}

export const AlertContext = createContext<AlertContextValue | undefined>(undefined)

export function useAlertContext(part: string): AlertContextValue {
  const context = useContext(AlertContext)
  if (!context) throw new Error(`${part} must be used within an <Alert>`)
  return context
}
