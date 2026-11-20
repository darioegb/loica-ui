'use client'

import type { ReactNode } from 'react'
import { useCallback, useId, useMemo, useRef, useState } from 'react'
import { Portal } from '../../../overlay'
import { useOpenState } from '../../../overlay/use-open-state'
import type { Size } from '../../../theme'
import {
  DropdownContext,
  type DropdownContextValue,
  type DropdownInitialItem,
  type DropdownVariant,
} from '../dropdown/dropdown-context'
import { ContextMenuContext } from './contextmenu-context'
import '../dropdown/dropdown.module.css'

export interface ContextMenuOwnProps {
  /** The `ContextMenuTrigger` and the `DropdownMenu`, with the items of the `Dropdown`. */
  children: ReactNode
  /**
   * Whether selecting an item closes the menu. An item can override it.
   *
   * @default true
   * @since 1.4
   */
  closeOnSelect?: boolean
  /**
   * Opens on the opposite side when there is no room on the one asked for.
   *
   * @default true
   * @since 1.4
   */
  flip?: boolean
  /**
   * Called with the new state when the menu opens or closes.
   * @since 1.4
   */
  onOpenChange?: (open: boolean) => void
  /**
   * Slides the menu along its side to keep it inside the screen.
   *
   * @default true
   * @since 1.4
   */
  shift?: boolean
  /**
   * Size of the text and of the padding of the items.
   *
   * @default 'md'
   * @since 1.4
   */
  size?: Size
  /**
   * Visual variant. `elevated` floats the menu with a shadow and `outline` draws its border. `unstyled` drops the
   * Loica styles so you can bring your own.
   *
   * @default 'elevated'
   * @since 1.4
   */
  variant?: DropdownVariant
}

export type ContextMenuProps = ContextMenuOwnProps

/**
 * A menu that opens where the user presses the secondary button, with the context menu key or with <kbd>Shift</kbd> +
 * <kbd>F10</kbd> on the element that has the focus, or with a long press on a touch screen. It is the `Dropdown` with
 * the items, groups, separators and submenus it already has: the `ContextMenuTrigger` marks the area, and the menu is a
 * `DropdownMenu`. The root holds the state and renders no element.
 * @since 1.4
 */
export function ContextMenu({
  children,
  closeOnSelect = true,
  flip = true,
  onOpenChange,
  shift = true,
  size = 'md',
  variant = 'elevated',
}: Readonly<ContextMenuProps>): ReactNode {
  const baseId = useId()
  const [open, setOpen] = useOpenState({ onOpenChange })
  const [point, setPoint] = useState<{ x: number; y: number } | null>(null)
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  const initialItem = useRef<DropdownInitialItem>('none')
  const hoverGrace = useRef(false)

  const openAt = useCallback(
    (x: number, y: number, initial: DropdownInitialItem): void => {
      initialItem.current = initial
      setPoint({ x, y })
      setOpen(true)
    },
    [setOpen],
  )

  const dropdown = useMemo<DropdownContextValue>(
    () => ({
      anchor,
      closeOnSelect,
      flip,
      hoverGrace,
      initialItem,
      isStyled: variant !== 'unstyled',
      menuId: `${baseId}-menu`,
      offset: 0,
      open,
      openMenu: () => undefined,
      placement: 'bottom-start',
      setOpen,
      setTrigger: () => undefined,
      shift,
      size,
      trigger: null,
      triggerId: `${baseId}-trigger`,
      variant,
    }),
    [anchor, baseId, closeOnSelect, flip, open, setOpen, shift, size, variant],
  )

  const context = useMemo(() => ({ open, openAt }), [open, openAt])

  return (
    <ContextMenuContext.Provider value={context}>
      <DropdownContext.Provider value={dropdown}>
        {children}
        {open && point ? (
          <Portal>
            <span
              aria-hidden="true"
              data-loica-contextmenu-anchor=""
              key={`${point.x}:${point.y}`}
              ref={setAnchor}
              style={{
                height: 0,
                left: point.x,
                pointerEvents: 'none',
                position: 'fixed',
                top: point.y,
                width: 0,
              }}
            />
          </Portal>
        ) : null}
      </DropdownContext.Provider>
    </ContextMenuContext.Provider>
  )
}

ContextMenu.displayName = 'ContextMenu'
