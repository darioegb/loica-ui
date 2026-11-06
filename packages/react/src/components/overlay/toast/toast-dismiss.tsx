'use client'

import type { ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import { OverlayClose, type OverlayCloseProps } from '../../../overlay/overlay-close'
import { useToastItem } from './toast-item-context'
import styles from './toast.module.css'

export type ToastDismissProps = OverlayCloseProps

/**
 * The dismiss button. Its name is the `close` text of the `LocaleProvider` unless you give it a
 * `label`, and an element given as `children`, such as a `Button`, becomes the button.
 */
export const ToastDismiss = forwardRef<HTMLElement, ToastDismissProps>(
  ({ label, ...props }: ToastDismissProps, ref: ForwardedRef<HTMLElement>): ReactNode => {
    const { dismiss, isStyled } = useToastItem('ToastDismiss')

    return (
      <OverlayClose
        {...props}
        closeClassName={isStyled ? styles.dismiss : undefined}
        data-loica-toast-dismiss=""
        label={label}
        onClose={dismiss}
        ref={ref}
      />
    )
  },
)

ToastDismiss.displayName = 'ToastDismiss'
