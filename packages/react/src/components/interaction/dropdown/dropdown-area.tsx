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
import { isValidElement, useEffect, useRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { cloneWithProps } from '../../../overlay/trigger'
import { useDropdownContext } from './dropdown-context'

const LONG_PRESS = 500
const MOVE_LIMIT = 10

export interface DropdownAreaProps {
  children: ReactNode
  className?: string
  disabled: boolean
  forwardedRef: ForwardedRef<HTMLElement>
  style?: CSSProperties
}

export function DropdownArea({
  children,
  className,
  disabled,
  forwardedRef: ref,
  style,
}: Readonly<DropdownAreaProps>): ReactElement {
  const { open, openAt } = useDropdownContext('DropdownTrigger')
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
        'data-loica-dropdown-area': '',
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
}
