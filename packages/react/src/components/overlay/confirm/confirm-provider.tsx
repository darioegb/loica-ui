'use client'

import type { ReactNode } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useLabels } from '../../../locale/locale-provider'
import type { Size } from '../../../theme'
import { Button } from '../../interaction/button'
import { Modal } from '../modal/modal'
import { ModalBody } from '../modal/modal-body'
import { ModalContent } from '../modal/modal-content'
import { useModalContext } from '../modal/modal-context'
import { ModalFooter } from '../modal/modal-footer'
import { ModalHeader } from '../modal/modal-header'
import { ConfirmContext, type ConfirmFunction, type ConfirmLabels, type ConfirmOptions } from './confirm-context'

export interface ConfirmProviderProps {
  /** The app. Any component below the provider can call `useConfirm()`. */
  children: ReactNode
  /**
   * Maximum width of the dialog.
   *
   * @since 1.2
   * @default 'sm'
   */
  size?: Size
}

interface Request {
  id: number
  opener: Element | null
  options: ConfirmOptions
  resolve: (confirmed: boolean) => void
  settled: boolean
}

const DEFAULT_LABELS: ConfirmLabels = {
  cancel: 'Cancel',
  confirm: 'Confirm',
}

function ConfirmDialog({
  onSettle,
  options,
}: Readonly<{ onSettle: (confirmed: boolean) => void; options: ConfirmOptions }>): ReactNode {
  const labels = useLabels('confirm', DEFAULT_LABELS)
  const { bodyId } = useModalContext('ConfirmProvider')
  const { cancelLabel, colorScheme, confirmLabel, description, title } = options

  return (
    <ModalContent aria-describedby={description ? bodyId : undefined} role="alertdialog">
      <ModalHeader>{title}</ModalHeader>
      {description ? <ModalBody>{description}</ModalBody> : null}
      <ModalFooter>
        <Button onClick={() => onSettle(false)} variant="ghost">
          {cancelLabel ?? labels.cancel}
        </Button>
        <Button colorScheme={colorScheme} onClick={() => onSettle(true)}>
          {confirmLabel ?? labels.confirm}
        </Button>
      </ModalFooter>
    </ModalContent>
  )
}

/**
 * Renders the dialog that `useConfirm()` opens, one at a time: a call made while another is open waits for its
 * turn. The dialog is an `alertdialog` and the focus starts on the cancel button, so Enter doesn't accept by
 * accident. <kbd>Esc</kbd> and a click outside refuse. When it closes, the focus goes back to where it was.
 *
 * @since 1.2
 */
export function ConfirmProvider({ children, size = 'sm' }: Readonly<ConfirmProviderProps>): ReactNode {
  const [queue, setQueue] = useState<Request[]>([])
  const pending = useRef<Request[]>([])
  const shown = useRef<Request | undefined>(undefined)
  const counter = useRef(0)
  const current = queue[0]

  pending.current = queue

  const confirm = useCallback<ConfirmFunction>(
    (options) =>
      new Promise<boolean>((resolve) => {
        const opener = typeof document === 'undefined' ? null : document.activeElement
        setQueue((requests) => [...requests, { id: (counter.current += 1), opener, options, resolve, settled: false }])
      }),
    [],
  )

  const settle = useCallback((confirmed: boolean): void => {
    const request = pending.current[0]
    if (!request || request.settled) return
    request.settled = true
    request.resolve(confirmed)
    setQueue((requests) => requests.slice(1))
  }, [])

  useEffect(() => {
    const closed = shown.current
    shown.current = current
    const opener = closed?.opener
    if (closed && !current && opener instanceof HTMLElement && opener.isConnected) opener.focus()
  }, [current])

  useEffect(
    () => () => {
      for (const request of pending.current) request.resolve(false)
    },
    [],
  )

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {current ? (
        <Modal key={current.id} onOpenChange={(open) => !open && settle(false)} open size={size}>
          <ConfirmDialog onSettle={settle} options={current.options} />
        </Modal>
      ) : null}
    </ConfirmContext.Provider>
  )
}

ConfirmProvider.displayName = 'ConfirmProvider'
