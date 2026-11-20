'use client'

import type { ForwardedRef, HTMLAttributes, KeyboardEvent, ReactNode } from 'react'
import { forwardRef, useEffect } from 'react'
import { Portal } from '../../../overlay'
import { joinClasses } from '../../../overlay/class-names'
import { isRtl, logicalKey } from '../../../overlay/direction'
import { mergeRefs } from '../../../overlay/trigger'
import { useFloatingPanel } from '../../../overlay/use-floating-panel'
import type { DismissReason } from '../../../overlay/use-dismiss'
import type { ComponentProps } from '../../../theme'
import { useDropdownContext } from './dropdown-context'
import { focusItem, getItems, isOwnEvent, useMenuKeyDown } from './dropdown-keyboard'
import { DropdownLevelContext } from './dropdown-level-context'
import { useDropdownSubContext } from './dropdown-sub-context'
import styles from './dropdown.module.css'

type DropdownSubMenuRootAttributes = Pick<
  HTMLAttributes<HTMLDivElement>,
  'aria-label' | 'aria-labelledby' | 'children'
>

export type DropdownSubMenuProps = Omit<ComponentProps, 'index'> & DropdownSubMenuRootAttributes

/**
 * The menu of a submenu. It opens beside its `DropdownSubTrigger` and is named after it unless you give it a name. The
 * arrow key that points back to the trigger and <kbd>Esc</kbd> close it and give the focus back to the trigger, one level
 * at a time, and <kbd>Tab</kbd> closes the whole menu.
 * @since 1.4
 */
export const DropdownSubMenu = forwardRef<HTMLDivElement, DropdownSubMenuProps>(
  (
    { children, className, style, ...rest }: DropdownSubMenuProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): ReactNode => {
    const root = useDropdownContext('DropdownSubMenu')
    const sub = useDropdownSubContext('DropdownSubMenu')
    const { closeSub, level, menuId, mode, open, parentLevel, setPanel, trigger, triggerId } = sub

    const handleDismiss = (reason: DismissReason, event?: Event): void => {
      if (reason === 'escape') {
        closeSub()
        trigger?.focus({ preventScroll: true })
        return
      }
      const target = (event?.target as Node | null) ?? null
      let child = level
      let ancestor = parentLevel
      while (ancestor && !ancestor.contains(target)) {
        child = ancestor
        ancestor = ancestor.parent
      }
      child.close()
    }

    const { panel, position, setPanel: setFloating } = useFloatingPanel({
      anchor: trigger,
      enabled: open,
      flip: root.flip,
      offset: 2,
      onDismiss: handleDismiss,
      ownsFocus: mode === 'keyboard',
      placement: isRtl(trigger) ? 'left-start' : 'right-start',
      shift: root.shift,
    })
    const handleMenuKey = useMenuKeyDown(() => root.setOpen(false))

    useEffect(() => {
      if (!open || mode !== 'keyboard' || !panel) return
      const items = getItems(panel)
      if (items.length > 0) focusItem(items[0])
      else panel.focus({ preventScroll: true })
    }, [mode, open, panel])

    useEffect(() => {
      if (!open || !trigger) return undefined
      const parentMenu = trigger.closest('[role="menu"]')
      const handleFocusIn = (event: FocusEvent): void => {
        const target = event.target as Node
        if (root.hoverGrace.current || target === trigger) return
        if (parentMenu?.contains(target)) closeSub()
      }
      document.addEventListener('focusin', handleFocusIn)
      return () => document.removeEventListener('focusin', handleFocusIn)
    }, [closeSub, open, root.hoverGrace, trigger])

    if (!open) return null

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
      if (!isOwnEvent(event)) return
      if (logicalKey(event.key, event.currentTarget) === 'ArrowLeft') {
        event.preventDefault()
        closeSub()
        trigger?.focus({ preventScroll: true })
        return
      }
      handleMenuKey(event)
    }

    const classes = joinClasses(
      root.isStyled && styles.menu,
      root.isStyled && styles[root.size],
      root.isStyled && styles[root.variant],
      className,
    )

    return (
      <Portal>
        <div
          aria-labelledby={rest['aria-label'] ? undefined : (rest['aria-labelledby'] ?? triggerId)}
          {...rest}
          className={classes}
          data-open=""
          data-placement={position.placement}
          data-loica-dropdown-menu=""
          data-loica-dropdown-sub-menu=""
          id={menuId}
          onKeyDown={handleKeyDown}
          ref={mergeRefs<HTMLDivElement>(setFloating, setPanel, ref)}
          role="menu"
          style={{ ...position.style, opacity: position.isPositioned ? undefined : 0, ...style }}
          tabIndex={-1}
        >
          <DropdownLevelContext.Provider value={level}>{children}</DropdownLevelContext.Provider>
        </div>
      </Portal>
    )
  },
)

DropdownSubMenu.displayName = 'DropdownSubMenu'
