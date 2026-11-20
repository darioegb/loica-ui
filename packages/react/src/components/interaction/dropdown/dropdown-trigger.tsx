'use client'

import type {
  CSSProperties,
  ForwardedRef,
  KeyboardEvent,
  MouseEvent,
  ReactElement,
  ReactNode,
} from 'react'
import { forwardRef, isValidElement } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { cloneWithProps, mergeRefs } from '../../../overlay/trigger'
import type { ComponentProps } from '../../../theme'
import { DropdownArea } from './dropdown-area'
import { useDropdownContext } from './dropdown-context'

export interface DropdownTriggerOwnProps {
  /**
   * The element that opens the menu, such as a `Button`. Text renders a plain `<button>`. With `trigger='contextmenu'`
   * on the `Dropdown` it is the area that opens it, such as a `div` or a `tr`, and text or several elements render a
   * `<div>`. For the keyboard the area has to be able to take the focus.
   */
  children: ReactNode
  /**
   * With `trigger='contextmenu'` on the `Dropdown`, leaves the menu of the browser instead of opening this one.
   *
   * @default false
   * @since 1.4
   */
  disabled?: boolean
}

export type DropdownTriggerProps = Omit<ComponentProps, 'index'> & DropdownTriggerOwnProps

interface DropdownButtonProps {
  children: ReactNode
  className?: string
  forwardedRef: ForwardedRef<HTMLElement>
  style?: CSSProperties
}

function DropdownButton({
  children,
  className,
  forwardedRef: ref,
  style,
}: Readonly<DropdownButtonProps>): ReactElement {
  const { menuId, open, openMenu, setOpen, setTrigger, triggerId } =
    useDropdownContext('DropdownTrigger')
  const childProps = isValidElement(children)
    ? (children.props as {
        className?: string
        id?: string
        style?: CSSProperties
      })
    : undefined

  const injected = {
    'aria-controls': open ? menuId : undefined,
    'aria-expanded': open,
    'aria-haspopup': 'menu' as const,
    'data-open': open ? '' : undefined,
    'data-loica-dropdown-trigger': '',
    id: childProps?.id ?? triggerId,
    onClick: (event: MouseEvent): void => {
      if (open) setOpen(false)
      else openMenu(event.detail === 0 ? 'first' : 'none')
    },
    onKeyDown: (event: KeyboardEvent): void => {
      if (event.key === 'ArrowDown') {
        event.preventDefault()
        openMenu('first')
      } else if (event.key === 'ArrowUp') {
        event.preventDefault()
        openMenu('last')
      }
    },
    ...(className ? { className: joinClasses(childProps?.className, className) } : {}),
    ...(style ? { style: { ...childProps?.style, ...style } } : {}),
  }

  if (isValidElement(children)) return cloneWithProps(children, injected, setTrigger, ref)

  return (
    <button
      {...injected}
      ref={mergeRefs<HTMLButtonElement>(setTrigger, ref as ForwardedRef<HTMLButtonElement>)}
      type="button"
    >
      {children}
    </button>
  )
}

/**
 * One element, such as a `Button`, which gets the click and keyboard handlers and the `aria-*`
 * attributes and is what the menu is anchored to. With text, it renders a plain `<button>`. Its
 * `className` and `style` are added to those of the element. With `trigger='contextmenu'` on the `Dropdown` it is the
 * area where the menu opens, and the element gets the handlers of the secondary button, the context menu key and the
 * long press instead.
 */
export const DropdownTrigger = forwardRef<HTMLElement, DropdownTriggerProps>(
  (
    { children, className, disabled = false, style }: DropdownTriggerProps,
    ref: ForwardedRef<HTMLElement>,
  ): ReactElement => {
    const { mode } = useDropdownContext('DropdownTrigger')

    if (mode === 'contextmenu') {
      return (
        <DropdownArea className={className} disabled={disabled} forwardedRef={ref} style={style}>
          {children}
        </DropdownArea>
      )
    }

    return (
      <DropdownButton className={className} forwardedRef={ref} style={style}>
        {children}
      </DropdownButton>
    )
  },
)

DropdownTrigger.displayName = 'DropdownTrigger'
