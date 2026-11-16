'use client'

import type { ReactNode } from 'react'
import { createContext, useContext } from 'react'
import type { ColorScheme } from '../../../theme'

/** The texts of the buttons: the `confirm` key of the `LocaleProvider`. */
export interface ConfirmLabels {
  /** The button that refuses. */
  cancel: string
  /** The button that accepts. */
  confirm: string
}

export interface ConfirmOptions {
  /**
   * The text of the button that refuses. By default the `cancel` text of the `LocaleProvider`.
   *
   * @since 1.2
   */
  cancelLabel?: ReactNode
  /**
   * Color scheme of the button that accepts: `error` for something that can't be undone.
   *
   * @since 1.2
   * @default 'primary'
   */
  colorScheme?: ColorScheme
  /**
   * The text of the button that accepts, better as the action itself (`Delete project`) than as `OK`. By
   * default the `confirm` text of the `LocaleProvider`.
   *
   * @since 1.2
   */
  confirmLabel?: ReactNode
  /**
   * What happens if the user accepts, and what it costs. A screen reader reads it after the title.
   *
   * @since 1.2
   */
  description?: ReactNode
  /**
   * The question, as a short sentence. It names the dialog.
   *
   * @since 1.2
   */
  title: ReactNode
}

/** Opens the dialog and resolves to `true` if the user accepts, and to `false` if they refuse or dismiss it. */
export type ConfirmFunction = (options: ConfirmOptions) => Promise<boolean>

export const ConfirmContext = createContext<ConfirmFunction | undefined>(undefined)

/**
 * Returns the `confirm` function: `if (await confirm({ title: 'Delete project?' })) { ... }`. It needs a
 * `ConfirmProvider` above it.
 *
 * @since 1.2
 */
export function useConfirm(): ConfirmFunction {
  const confirm = useContext(ConfirmContext)
  if (!confirm) throw new Error('useConfirm must be used within a <ConfirmProvider>')
  return confirm
}
