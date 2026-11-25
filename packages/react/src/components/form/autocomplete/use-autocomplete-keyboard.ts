'use client'

import type { KeyboardEvent } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { SelectOptionRecord } from '../select/select-context'
import { getEnabledOptions, scrollOptionIntoView, stepOption } from '../select/select-dom'

const steps: Record<string, number> = {
  ArrowDown: 1,
  ArrowUp: -1,
  PageDown: 10,
  PageUp: -10,
}

interface UseAutocompleteKeyboardOptions {
  canEdit: boolean
  close: (returnFocus: boolean) => void
  listbox: HTMLElement | null
  open: boolean
  openList: () => void
  options: readonly SelectOptionRecord[]
  select: (value: string) => void
  value: string
}

interface AutocompleteKeyboard {
  activeId: string | undefined
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void
  setActiveId: (id: string | undefined) => void
}

export function useAutocompleteKeyboard(
  settings: UseAutocompleteKeyboardOptions,
): AutocompleteKeyboard {
  const { listbox, open, options, value } = settings
  const [activeId, setActiveId] = useState<string | undefined>(undefined)
  const pending = useRef<'first' | 'last' | undefined>(undefined)
  const latest = useRef(settings)
  latest.current = settings

  useEffect(() => {
    if (!open) {
      pending.current = undefined
      setActiveId(undefined)
      return
    }
    const enabled = getEnabledOptions(listbox)
    const wanted = pending.current
    if (wanted && enabled.length > 0) {
      pending.current = undefined
      const target = wanted === 'last' ? enabled[enabled.length - 1] : enabled[0]
      setActiveId(target.id)
      scrollOptionIntoView(target)
      return
    }
    setActiveId((current) => (enabled.some((option) => option.id === current) ? current : undefined))
  }, [open, listbox, options, value])

  const focusOption = (option: HTMLElement | undefined): void => {
    if (!option) return
    setActiveId(option.id)
    scrollOptionIntoView(option)
  }

  const handleClosedKey = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
    event.preventDefault()
    if (!event.altKey) pending.current = event.key === 'ArrowDown' ? 'first' : 'last'
    latest.current.openList()
  }

  const handleOpenKey = (event: KeyboardEvent<HTMLInputElement>): void => {
    const enabled = getEnabledOptions(latest.current.listbox)
    if (event.key in steps) {
      event.preventDefault()
      focusOption(stepOption(enabled, activeId, steps[event.key]))
    } else if (event.key === 'Enter') {
      const chosen = enabled.find((option) => option.id === activeId)?.dataset.value
      if (chosen === undefined) {
        latest.current.close(false)
      } else {
        event.preventDefault()
        latest.current.select(chosen)
      }
    } else if (event.key === 'Tab') {
      latest.current.close(false)
    }
  }

  const handleKey = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (!latest.current.canEdit || event.nativeEvent.isComposing) return
    if (latest.current.open) handleOpenKey(event)
    else handleClosedKey(event)
  }
  const handler = useRef(handleKey)
  handler.current = handleKey
  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>): void => handler.current(event),
    [],
  )

  return { activeId, onKeyDown, setActiveId }
}
