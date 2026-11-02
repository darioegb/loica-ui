'use client'

import type { ComponentPropsWithoutRef, ForwardedRef, ReactNode } from 'react'
import { forwardRef, useState } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { OverlayClose } from '../../../overlay/overlay-close'
import { StatusIcon } from '../../../overlay/status-icon'
import type { Size } from '../../../theme'
import { tagColorVars } from '../shared/tag-vars'
import tag from '../shared/tag.module.css'
import styles from './alert.module.css'

export type AlertStatus = 'error' | 'info' | 'success' | 'warning'

export type AlertVariant = 'outline' | 'solid' | 'subtle' | 'unstyled'

export interface AlertOwnProps {
  /** What the user can do about the message: a `Button` or a link, at the end. */
  action?: ReactNode
  /**
   * Shows a button that closes the Alert.
   *
   * @default false
   */
  dismissible?: boolean
  /**
   * The icon at the start. By default, the one of the status. Pass your own, or `false` for none.
   * It is decorative.
   */
  icon?: ReactNode | false
  /** Called when the dismiss button is pressed. */
  onDismiss?: () => void
  /**
   * Size of the Alert: its padding and its text.
   *
   * @default 'md'
   */
  size?: Size
  /**
   * The kind of message: it sets the color, the icon and the role of the Alert.
   *
   * @default 'info'
   */
  status?: AlertStatus
  /**
   * Visual variant. `subtle` tints the background, `solid` fills it and `outline` draws its
   * border. `unstyled` drops the Plume styles so you can bring your own.
   *
   * @default 'subtle'
   */
  variant?: AlertVariant
}

export type AlertProps = ComponentPropsWithoutRef<'div'> & AlertOwnProps

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      action,
      children,
      className,
      dismissible = false,
      icon,
      onDismiss,
      role,
      size = 'md',
      status = 'info',
      style,
      variant = 'subtle',
      ...rest
    }: AlertProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    const [dismissed, setDismissed] = useState(false)
    const isStyled = variant !== 'unstyled'
    const content = icon === undefined ? <StatusIcon status={status} /> : icon

    if (dismissed) return null

    return (
      <div
        className={joinClasses(
          isStyled && styles.alert,
          isStyled && styles[size],
          isStyled && tag[variant],
          className,
        )}
        data-plume-alert=""
        data-status={status}
        ref={ref}
        role={role ?? (status === 'error' ? 'alert' : 'status')}
        style={tagColorVars('alert', status, style)}
        {...rest}
      >
        {content ? (
          <span
            aria-hidden="true"
            className={isStyled ? styles.icon : undefined}
            data-plume-alert-icon=""
          >
            {content}
          </span>
        ) : null}
        <div data-plume-alert-content="">{children}</div>
        {action ? (
          <div className={isStyled ? styles.action : undefined} data-plume-alert-action="">
            {action}
          </div>
        ) : null}
        {dismissible ? (
          <OverlayClose
            closeClassName={isStyled ? styles.dismiss : undefined}
            data-plume-alert-dismiss=""
            onClose={() => {
              setDismissed(true)
              onDismiss?.()
            }}
          />
        ) : null}
      </div>
    )
  },
)

Alert.displayName = 'Alert'
