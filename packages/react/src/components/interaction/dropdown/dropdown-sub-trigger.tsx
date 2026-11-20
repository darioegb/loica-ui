'use client'

import type {
  AriaAttributes,
  ForwardedRef,
  KeyboardEvent,
  MouseEvent,
  PointerEvent,
  ReactNode,
} from 'react'
import { forwardRef, useEffect, useRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { hasPart } from '../../../overlay/has-part'
import { logicalKey } from '../../../overlay/direction'
import { ChevronRightIcon } from '../../../overlay/icons'
import { mergeRefs } from '../../../overlay/trigger'
import type { ComponentProps } from '../../../theme'
import { useDropdownContext } from './dropdown-context'
import { DropdownItemIcon } from './dropdown-item-icon'
import { DropdownItemLabel } from './dropdown-item-label'
import { useDropdownSubContext } from './dropdown-sub-context'
import styles from './dropdown.module.css'

const ITEM_PARTS = [DropdownItemIcon, DropdownItemLabel]

export interface DropdownSubTriggerOwnProps {
  /** The text of the item, or the `DropdownItemIcon` and `DropdownItemLabel` parts. */
  children?: ReactNode
  /**
   * Disables the item: it can't open the submenu and the keyboard skips it.
   *
   * @default false
   * @since 1.4
   */
  disabled?: boolean
  /**
   * Icon shown before the text. It has no effect when the item is composed with parts.
   * @since 1.4
   */
  icon?: ReactNode
}

export type DropdownSubTriggerProps = Omit<ComponentProps, 'index'> &
  Pick<AriaAttributes, 'aria-label'> &
  DropdownSubTriggerOwnProps

/**
 * The item of a menu that opens a submenu, with an arrow that points to it. The submenu opens when the pointer stays on
 * it for a moment, when it is pressed and with <kbd>Enter</kbd>, <kbd>Space</kbd> or the arrow key that points to the
 * submenu (<kbd>→</kbd>, and <kbd>←</kbd> when the text runs right to left).
 * @since 1.4
 */
export const DropdownSubTrigger = forwardRef<HTMLButtonElement, DropdownSubTriggerProps>(
  (
    {
      children,
      className,
      disabled = false,
      icon,
      style,
      ...rest
    }: DropdownSubTriggerProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ): ReactNode => {
    const { hoverGrace, isStyled } = useDropdownContext('DropdownSubTrigger')
    const { delay, menuId, open, openSub, setTrigger, startGrace, triggerId } =
      useDropdownSubContext('DropdownSubTrigger')
    const timer = useRef<number | undefined>(undefined)

    useEffect(() => () => window.clearTimeout(timer.current), [])

    const handleClick = (event: MouseEvent<HTMLButtonElement>): void => {
      if (disabled) return
      window.clearTimeout(timer.current)
      openSub(event.detail === 0 ? 'keyboard' : 'pointer')
    }

    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>): void => {
      if (disabled || logicalKey(event.key, event.currentTarget) !== 'ArrowRight') return
      event.preventDefault()
      openSub('keyboard')
    }

    const handlePointerEnter = (event: PointerEvent<HTMLButtonElement>): void => {
      if (disabled || event.pointerType === 'touch' || open) return
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => openSub('pointer'), delay)
    }

    const handlePointerLeave = (event: PointerEvent<HTMLButtonElement>): void => {
      window.clearTimeout(timer.current)
      if (open && event.pointerType !== 'touch') startGrace({ x: event.clientX, y: event.clientY })
    }

    const handlePointerMove = (event: PointerEvent<HTMLButtonElement>): void => {
      if (!disabled && !hoverGrace.current && document.activeElement !== event.currentTarget) {
        event.currentTarget.focus({ preventScroll: true })
      }
    }

    const content = hasPart(children, ITEM_PARTS) ? (
      children
    ) : (
      <>
        {icon ? <DropdownItemIcon>{icon}</DropdownItemIcon> : null}
        <DropdownItemLabel>{children}</DropdownItemLabel>
      </>
    )

    return (
      <button
        {...rest}
        aria-controls={open ? menuId : undefined}
        aria-expanded={open}
        aria-haspopup="menu"
        className={joinClasses(isStyled && styles.item, className)}
        data-disabled={disabled ? '' : undefined}
        data-loica-dropdown-item=""
        data-loica-dropdown-sub-trigger=""
        data-open={open ? '' : undefined}
        disabled={disabled}
        id={triggerId}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onPointerMove={handlePointerMove}
        ref={mergeRefs<HTMLButtonElement>(setTrigger, ref)}
        role="menuitem"
        style={style}
        tabIndex={-1}
        type="button"
      >
        {content}
        <span aria-hidden="true" className={isStyled ? styles.chevron : undefined} data-loica-dropdown-chevron="">
          <ChevronRightIcon />
        </span>
      </button>
    )
  },
)

DropdownSubTrigger.displayName = 'DropdownSubTrigger'
