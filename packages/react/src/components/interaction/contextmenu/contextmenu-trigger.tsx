'use client'

import type {
  CSSProperties,
  ForwardedRef,
  KeyboardEvent,
  MouseEvent,
  PointerEvent,
  ReactElement,
  ReactNode,
} from 'react'
import { forwardRef, isValidElement, useEffect, useRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { cloneWithProps } from '../../../overlay/trigger'
import type { ComponentProps } from '../../../theme'
import { useContextMenuContext } from './contextmenu-context'
import './contextmenu.module.css'

const LONG_PRESS = 500
const MOVE_LIMIT = 10

export interface ContextMenuTriggerOwnProps {
  /**
   * The area that opens the menu: one element, which gets the handlers, or content that renders in a `<div>`. For the
   * keyboard the element has to be able to take the focus.
   */
  children: ReactNode
  /**
   * Leaves the menu of the browser instead of opening this one.
   *
   * @default false
   * @since 1.4
   */
  disabled?: boolean
}

export type ContextMenuTriggerProps = Omit<ComponentProps, 'index'> & ContextMenuTriggerOwnProps

/**
 * The area where the menu opens. It takes one element, such as a `div` or a `tr`, which gets the handlers, and
 * `className` and `style` are added to those of the element. With text or several elements it renders a `<div>`. A `ContextMenuTrigger` inside another one opens its own menu and leaves the outer one closed.
 * @since 1.4
 */
export const ContextMenuTrigger = forwardRef<HTMLElement, ContextMenuTriggerProps>(
  (
    { children, className, disabled = false, style }: ContextMenuTriggerProps,
    ref: ForwardedRef<HTMLElement>,
  ): ReactElement => {
    const { open, openAt } = useContextMenuContext('ContextMenuTrigger')
    const press = useRef<{ x: number; y: number; timer: number } | null>(null)

    const cancelPress = (): void => {
      if (press.current) window.clearTimeout(press.current.timer)
      press.current = null
    }

    useEffect(() => cancelPress, [])

    const childProps = isValidElement(children)
      ? (children.props as { className?: string; style?: CSSProperties })
      : undefined

    const own = {
      ...(className ? { className: joinClasses(childProps?.className, className) } : {}),
      ...(style ? { style: { ...childProps?.style, ...style } } : {}),
    }

    const injected = disabled
      ? own
      : {
          'data-open': open ? '' : undefined,
          'data-loica-contextmenu-trigger': '',
          onContextMenu: (event: MouseEvent): void => {
            if (event.defaultPrevented) return
            event.preventDefault()
            cancelPress()
            openAt(event.clientX, event.clientY, 'none')
          },
          onKeyDown: (event: KeyboardEvent): void => {
            if (event.defaultPrevented) return
            if (event.key !== 'ContextMenu' && !(event.key === 'F10' && event.shiftKey)) return
            event.preventDefault()
            const box = (event.target as HTMLElement).getBoundingClientRect()
            openAt(box.left, box.bottom, 'first')
          },
          onPointerCancel: cancelPress,
          onPointerDown: (event: PointerEvent): void => {
            if (event.pointerType !== 'touch' || event.defaultPrevented) return
            cancelPress()
            const { clientX: x, clientY: y } = event
            press.current = {
              timer: window.setTimeout(() => {
                press.current = null
                openAt(x, y, 'none')
              }, LONG_PRESS),
              x,
              y,
            }
          },
          onPointerMove: (event: PointerEvent): void => {
            const start = press.current
            if (start && Math.hypot(event.clientX - start.x, event.clientY - start.y) > MOVE_LIMIT) {
              cancelPress()
            }
          },
          onPointerUp: cancelPress,
          ...own,
        }

    if (isValidElement(children)) return cloneWithProps(children, injected, ref)

    return (
      <div {...injected} ref={ref as ForwardedRef<HTMLDivElement>}>
        {children}
      </div>
    )
  },
)

ContextMenuTrigger.displayName = 'ContextMenuTrigger'
