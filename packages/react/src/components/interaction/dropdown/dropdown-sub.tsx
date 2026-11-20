'use client'

import type { ReactNode } from 'react'
import { useCallback, useContext, useId, useMemo, useState } from 'react'
import { useDropdownContext } from './dropdown-context'
import { DropdownLevelContext, type DropdownLevel } from './dropdown-level-context'
import { DropdownSubContext, type DropdownSubMode } from './dropdown-sub-context'
import { useSafeArea } from './use-safe-area'

export interface DropdownSubOwnProps {
  /** The `DropdownSubTrigger` and the `DropdownSubMenu`. */
  children: ReactNode
  /**
   * Time in milliseconds the pointer has to stay on the trigger before the submenu opens. Pressing the trigger, or
   * the arrow key that points to the submenu, opens it at once.
   *
   * @default 150
   * @since 1.4
   */
  delay?: number
}

export type DropdownSubProps = DropdownSubOwnProps

/**
 * A submenu inside a `DropdownMenu`, or inside another submenu. It holds the state of the submenu and renders no
 * element. The items inside it are the ones of the `Dropdown`, and selecting one closes the whole menu.
 * @since 1.4
 */
export function DropdownSub({ children, delay = 150 }: Readonly<DropdownSubProps>): ReactNode {
  const { hoverGrace } = useDropdownContext('DropdownSub')
  const parentLevel = useContext(DropdownLevelContext)
  const baseId = useId()
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<DropdownSubMode>('pointer')
  const [trigger, setTrigger] = useState<HTMLElement | null>(null)
  const [panel, setPanel] = useState<HTMLElement | null>(null)

  const closeSub = useCallback((): void => {
    setOpen(false)
    setMode('pointer')
  }, [])

  const openSub = useCallback((next: DropdownSubMode): void => {
    setOpen(true)
    setMode((current) => (current === 'keyboard' ? current : next))
  }, [])

  const startGrace = useSafeArea({ close: closeSub, enabled: open, grace: hoverGrace, panel, trigger })

  const level = useMemo<DropdownLevel>(
    () => ({
      close: closeSub,
      contains: (target) => Boolean(target && panel?.contains(target)),
      parent: parentLevel,
    }),
    [closeSub, panel, parentLevel],
  )

  const context = useMemo(
    () => ({
      closeSub,
      delay,
      level,
      menuId: `${baseId}-menu`,
      mode,
      open,
      openSub,
      parentLevel,
      setPanel,
      setTrigger,
      startGrace,
      trigger,
      triggerId: `${baseId}-trigger`,
    }),
    [baseId, closeSub, delay, level, mode, open, openSub, parentLevel, startGrace, trigger],
  )

  return <DropdownSubContext.Provider value={context}>{children}</DropdownSubContext.Provider>
}

DropdownSub.displayName = 'DropdownSub'
