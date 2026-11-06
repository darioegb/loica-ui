'use client'

import type { KeyboardEvent, RefObject } from 'react'
import { useCallback, useEffect, useRef } from 'react'
import { findTypeaheadMatch, parentItem, visibleItems } from './tree-navigation'

const typeaheadDelay = 500

interface KeyContext {
  activate: (value: string, hasChildren: boolean) => void
  current: HTMLElement
  hasChildren: boolean
  index: number
  isOpen: boolean
  items: HTMLElement[]
  select: (value: string) => void
  toggleExpanded: (value: string, expand: boolean) => void
  value: string
}

const keyActions: Record<string, (context: KeyContext) => void> = {
  ArrowDown: ({ index, items }) => items[index + 1]?.focus(),
  ArrowLeft: ({ current, hasChildren, isOpen, toggleExpanded, value }) => {
    if (hasChildren && isOpen) toggleExpanded(value, false)
    else parentItem(current)?.focus()
  },
  ArrowRight: ({ hasChildren, index, isOpen, items, toggleExpanded, value }) => {
    if (!hasChildren) return
    if (isOpen) items[index + 1]?.focus()
    else toggleExpanded(value, true)
  },
  ArrowUp: ({ index, items }) => items[index - 1]?.focus(),
  End: ({ items }) => items[items.length - 1]?.focus(),
  Enter: ({ activate, hasChildren, value }) => activate(value, hasChildren),
  Home: ({ items }) => items[0]?.focus(),
  ' ': ({ select, value }) => select(value),
}

interface RangeContext {
  index: number
  items: HTMLElement[]
  select: (value: string) => void
  selectAll: () => void
  selectRange: (to: string, from?: string) => void
  value: string
}

const valueOf = (item: HTMLElement): string => item.dataset.loicaTreeValue ?? ''

const extendTo = (target: HTMLElement | undefined, select: (value: string) => void): void => {
  if (!target) return
  target.focus()
  select(valueOf(target))
}

const rangeTo = (
  target: HTMLElement | undefined,
  { selectRange, value }: RangeContext,
): void => {
  if (!target) return
  target.focus()
  selectRange(valueOf(target), value)
}

const rangeActions: Record<string, (context: RangeContext) => void> = {
  all: ({ selectAll }) => selectAll(),
  ArrowDown: ({ index, items, select }) => extendTo(items[index + 1], select),
  ArrowUp: ({ index, items, select }) => extendTo(items[index - 1], select),
  End: (context) => rangeTo(context.items[context.items.length - 1], context),
  Home: (context) => rangeTo(context.items[0], context),
  ' ': ({ selectRange, value }) => selectRange(value),
}

const rangeKey = (event: KeyboardEvent<HTMLElement>): string | undefined => {
  if (event.altKey) return undefined
  const command = event.ctrlKey || event.metaKey
  if (command && !event.shiftKey) return event.key.toLowerCase() === 'a' ? 'all' : undefined
  if (!event.shiftKey) return undefined
  const keys = command ? ['End', 'Home'] : ['ArrowDown', 'ArrowUp', ' ']
  return keys.includes(event.key) ? event.key : undefined
}

interface TreeKeyboardOptions {
  activate: (value: string, hasChildren: boolean) => void
  expanded: readonly string[]
  multiple: boolean
  root: RefObject<HTMLElement | null>
  select: (value: string) => void
  selectAll: () => void
  selectRange: (to: string, from?: string) => void
  toggleExpanded: (value: string, expand: boolean) => void
}

type ItemKeyDown = (event: KeyboardEvent<HTMLElement>, value: string, hasChildren: boolean) => void

const isCharacter = (event: KeyboardEvent<HTMLElement>): boolean =>
  event.key.length === 1 && !event.altKey && !event.ctrlKey && !event.metaKey

export function useTreeKeyboard({
  activate,
  expanded,
  multiple,
  root,
  select,
  selectAll,
  selectRange,
  toggleExpanded,
}: TreeKeyboardOptions): ItemKeyDown {
  const typed = useRef('')
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  return useCallback(
    (event, value, hasChildren) => {
      if (event.target !== event.currentTarget) return
      const items = visibleItems(root.current)
      const index = items.indexOf(event.currentTarget)
      const range = multiple ? rangeKey(event) : undefined
      if (range) {
        event.preventDefault()
        rangeActions[range]?.({ index, items, select, selectAll, selectRange, value })
        return
      }

      const action = keyActions[event.key]

      if (action && !event.altKey && !event.ctrlKey && !event.metaKey) {
        event.preventDefault()
        action({
          activate,
          current: event.currentTarget,
          hasChildren,
          index,
          isOpen: expanded.includes(value),
          items,
          select,
          toggleExpanded,
          value,
        })
        return
      }

      if (!isCharacter(event)) return
      event.preventDefault()
      clearTimeout(timer.current)
      typed.current += event.key
      timer.current = setTimeout(() => {
        typed.current = ''
      }, typeaheadDelay)
      findTypeaheadMatch(items, index, typed.current)?.focus()
    },
    [activate, expanded, multiple, root, select, selectAll, selectRange, toggleExpanded],
  )
}
