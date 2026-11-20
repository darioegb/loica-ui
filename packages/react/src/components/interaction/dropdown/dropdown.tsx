'use client'

import type { ReactNode } from 'react'
import { useCallback, useId, useMemo, useRef, useState } from 'react'
import { Portal } from '../../../overlay'
import type { Placement } from '../../../overlay'
import { useOpenState } from '../../../overlay/use-open-state'
import type { Size } from '../../../theme'
import {
  DropdownContext,
  type DropdownContextValue,
  type DropdownInitialItem,
  type DropdownTriggerMode,
  type DropdownVariant,
} from './dropdown-context'

export type { DropdownTriggerMode, DropdownVariant } from './dropdown-context'

export interface DropdownOwnProps {
  /** The `DropdownTrigger` and the `DropdownMenu`. */
  children: ReactNode
  /**
   * Whether selecting an item closes the menu. An item can override it.
   *
   * @default true
   */
  closeOnSelect?: boolean
  /**
   * Whether the menu is open at first, for an uncontrolled menu.
   *
   * @default false
   */
  defaultOpen?: boolean
  /**
   * Opens on the opposite side when there is no room on the one asked for.
   *
   * @default true
   */
  flip?: boolean
  /**
   * Distance in pixels between the trigger and the menu. A menu that opens at a point has none.
   *
   * @default 4
   */
  offset?: number
  /** Called with the new state when the menu opens or closes. */
  onOpenChange?: (open: boolean) => void
  /** Whether the menu is open, for a controlled menu. Pair it with `onOpenChange`. */
  open?: boolean
  /**
   * Where the menu opens, relative to the trigger: a side, with an optional alignment
   * (`bottom-start`, `top-end`).
   *
   * @default 'bottom-start'
   */
  placement?: Placement
  /**
   * Slides the menu along its side to keep it inside the screen.
   *
   * @default true
   */
  shift?: boolean
  /**
   * Size of the text and of the padding of the items.
   *
   * @default 'md'
   */
  size?: Size
  /**
   * Visual variant. `elevated` floats the menu with a shadow and `outline` draws its border.
   * `unstyled` drops the Loica styles so you can bring your own.
   *
   * @default 'elevated'
   */
  variant?: DropdownVariant
  /**
   * What opens the menu. `click` makes the `DropdownTrigger` a button that toggles it. `contextmenu` makes it an area
   * that opens the menu where the secondary button is pressed, below the element that has the focus with the context
   * menu key or <kbd>Shift</kbd> + <kbd>F10</kbd>, or with a long press on a touch screen. There the menu needs a
   * point, so `open` and `defaultOpen` can close it but not open it. Give the `DropdownMenu` an `aria-label`, because
   * there is no button to name it.
   *
   * @default 'click'
   * @since 1.4
   */
  trigger?: DropdownTriggerMode
}

export type DropdownProps = DropdownOwnProps

export function Dropdown({
  children,
  closeOnSelect = true,
  defaultOpen = false,
  flip = true,
  offset = 4,
  onOpenChange,
  open: openProp,
  placement = 'bottom-start',
  shift = true,
  size = 'md',
  trigger: mode = 'click',
  variant = 'elevated',
}: Readonly<DropdownProps>): ReactNode {
  const baseId = useId()
  const [trigger, setTrigger] = useState<HTMLElement | null>(null)
  const [openState, setOpen] = useOpenState({
    defaultOpen,
    onOpenChange,
    open: openProp,
  })
  const [point, setPoint] = useState<{ x: number; y: number } | null>(null)
  const [virtual, setVirtual] = useState<HTMLElement | null>(null)
  const atPoint = mode === 'contextmenu'
  const open = openState && (!atPoint || point !== null)
  const initialItem = useRef<DropdownInitialItem>('none')
  const hoverGrace = useRef(false)

  const openMenu = useCallback(
    (initial: DropdownInitialItem): void => {
      initialItem.current = initial
      setOpen(true)
    },
    [setOpen],
  )

  const openAt = useCallback(
    (x: number, y: number, initial: DropdownInitialItem): void => {
      initialItem.current = initial
      setPoint({ x, y })
      setOpen(true)
    },
    [setOpen],
  )

  const context = useMemo<DropdownContextValue>(
    () => ({
      anchor: atPoint ? virtual : trigger,
      closeOnSelect,
      flip,
      hoverGrace,
      initialItem,
      isStyled: variant !== 'unstyled',
      menuId: `${baseId}-menu`,
      mode,
      offset: atPoint ? 0 : offset,
      open,
      openAt,
      openMenu,
      placement,
      setOpen,
      setTrigger,
      shift,
      size,
      trigger: atPoint ? null : trigger,
      triggerId: `${baseId}-trigger`,
      variant,
    }),
    [
      atPoint,
      baseId,
      closeOnSelect,
      flip,
      mode,
      offset,
      open,
      openAt,
      openMenu,
      placement,
      setOpen,
      shift,
      size,
      trigger,
      variant,
      virtual,
    ],
  )

  return (
    <DropdownContext.Provider value={context}>
      {children}
      {atPoint && open && point ? (
        <Portal>
          <span
            aria-hidden="true"
            data-loica-dropdown-anchor=""
            key={`${point.x}:${point.y}`}
            ref={setVirtual}
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
  )
}

Dropdown.displayName = 'Dropdown'
