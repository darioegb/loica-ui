'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef, useEffect, useMemo } from 'react'
import { Portal, useFocusTrap } from '../../../overlay'
import { joinClasses } from '../../../overlay/class-names'
import { useFloatingPanel } from '../../../overlay/use-floating-panel'
import { mergeRefs } from '../../../overlay/trigger'
import type { ComponentProps } from '../../../theme'
import { useDropdownContext } from './dropdown-context'
import { focusItem, getItems, useMenuKeyDown } from './dropdown-keyboard'
import { DropdownLevelContext, type DropdownLevel } from './dropdown-level-context'
import styles from './dropdown.module.css'

type DropdownMenuRootAttributes = Pick<
  HTMLAttributes<HTMLDivElement>,
  'aria-label' | 'aria-labelledby' | 'children'
>

export type DropdownMenuProps = Omit<ComponentProps, 'index'> & DropdownMenuRootAttributes

/** The menu. It is named after the trigger unless you give it a name. */
export const DropdownMenu = forwardRef<HTMLDivElement, DropdownMenuProps>(
  (
    { children, className, style, ...rest }: DropdownMenuProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): ReactNode => {
    const context = useDropdownContext('DropdownMenu')
    const {
      anchor,
      flip,
      initialItem,
      isStyled,
      menuId,
      offset,
      open,
      placement,
      setOpen,
      shift,
      trigger,
    } = context
    const { isTopmost, panel, position, setPanel } = useFloatingPanel({
      anchor,
      enabled: open,
      flip,
      offset,
      onDismiss: () => setOpen(false),
      placement,
      shift,
    })

    useFocusTrap(panel, { active: open, isTopmost, returnFocus: trigger })
    const handleKeyDown = useMenuKeyDown(() => setOpen(false))
    const level = useMemo<DropdownLevel>(
      () => ({
        close: () => setOpen(false),
        contains: (target) => Boolean(target && (panel?.contains(target) || anchor?.contains(target))),
        parent: undefined,
      }),
      [anchor, panel, setOpen],
    )

    useEffect(() => {
      if (!open || !panel) return
      const items = getItems(panel)
      if (initialItem.current === 'first') focusItem(items[0])
      else if (initialItem.current === 'last') focusItem(items[items.length - 1])
    }, [initialItem, open, panel])

    if (!open) return null

    const classes = joinClasses(
      isStyled && styles.menu,
      isStyled && styles[context.size],
      isStyled && styles[context.variant],
      className,
    )

    return (
      <Portal>
        <div
          aria-labelledby={
            rest['aria-label'] ? undefined : (rest['aria-labelledby'] ?? trigger?.id)
          }
          {...rest}
          className={classes}
          data-open=""
          data-placement={position.placement}
          data-loica-dropdown-menu=""
          id={menuId}
          onKeyDown={handleKeyDown}
          ref={mergeRefs<HTMLDivElement>(setPanel, ref)}
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

DropdownMenu.displayName = 'DropdownMenu'
