'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef, useCallback, useMemo, useState } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { StatusIcon } from '../../../overlay/status-icon'
import type { ComponentProps, Size } from '../../../theme'
import { tagColorVars } from '../shared/tag-vars'
import tag from '../shared/tag.module.css'
import styles from './alert.module.css'
import { AlertAction } from './alert-action'
import { AlertContent } from './alert-content'
import { AlertContext } from './alert-context'
import { AlertDescription } from './alert-description'
import { AlertDismiss } from './alert-dismiss'
import { AlertIcon } from './alert-icon'
import { AlertTitle } from './alert-title'
import { hasPart } from '../../../overlay/has-part'

export type AlertStatus = 'error' | 'info' | 'success' | 'warning'

export type AlertVariant = 'outline' | 'solid' | 'subtle' | 'unstyled'

export interface AlertOwnProps {
  /** What the user can do about the message: a `Button` or a link, at the end. */
  action?: ReactNode
  /**
   * The text under the title, so the Alert can be written without children:
   * `<Alert description="It will be ready in a minute." />`. `children` go after it.
   */
  description?: ReactNode
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
   * The title, in bold, rendered as an `AlertTitle`: `<Alert status="success" title="Saved" />`.
   * Use the `AlertTitle` part instead to render it as a heading.
   */
  title?: ReactNode
  /**
   * Visual variant. `subtle` tints the background, `solid` fills it and `outline` draws its
   * border. `unstyled` drops the Loica styles so you can bring your own.
   *
   * @default 'subtle'
   */
  variant?: AlertVariant
}

type AlertRootAttributes = Pick<
  HTMLAttributes<HTMLDivElement>,
  'aria-label' | 'aria-labelledby' | 'children' | 'hidden' | 'id' | 'role'
>

export type AlertProps = Omit<ComponentProps, 'index'> & AlertRootAttributes & AlertOwnProps

const ALERT_PARTS = [AlertAction, AlertContent, AlertDismiss, AlertIcon]

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      action,
      children,
      className,
      description,
      dismissible = false,
      icon,
      onDismiss,
      role,
      size = 'md',
      status = 'info',
      style,
      title,
      variant = 'subtle',
      ...rest
    }: AlertProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    const [dismissed, setDismissed] = useState(false)
    const isStyled = variant !== 'unstyled'
    const dismiss = useCallback((): void => {
      setDismissed(true)
      onDismiss?.()
    }, [onDismiss])
    const context = useMemo(
      () => ({
        dismiss,
        icon: icon === undefined ? <StatusIcon status={status} /> : icon,
        isStyled,
        status,
      }),
      [dismiss, icon, isStyled, status],
    )

    if (dismissed) return null

    return (
      <AlertContext.Provider value={context}>
        <div
          className={joinClasses(
            isStyled && styles.alert,
            isStyled && styles[size],
            isStyled && tag[variant],
            className,
          )}
          data-loica-alert=""
          data-status={status}
          ref={ref}
          role={role ?? (status === 'error' ? 'alert' : 'status')}
          style={tagColorVars('alert', status, style)}
          {...rest}
        >
          {hasPart(children, ALERT_PARTS) ? (
            children
          ) : (
            <>
              <AlertIcon />
              <AlertContent>
                {title == null ? null : <AlertTitle>{title}</AlertTitle>}
                {description == null ? null : <AlertDescription>{description}</AlertDescription>}
                {children}
              </AlertContent>
              {action ? <AlertAction>{action}</AlertAction> : null}
              {dismissible ? <AlertDismiss /> : null}
            </>
          )}
        </div>
      </AlertContext.Provider>
    )
  },
)

Alert.displayName = 'Alert'
