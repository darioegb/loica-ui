'use client'

import type { RefObject } from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSelectionState } from '../../../overlay/use-selection-state'
import {
  checkStateOf,
  expandChecked,
  readStructure,
  toggleChecked,
  type TreeCheckState,
  type TreeStructure,
} from './tree-checks'
import type { TreeSelection } from './tree-context'
import { visibleItems } from './tree-navigation'

interface TreeStateOptions {
  cascade: boolean
  children: unknown
  defaultExpanded?: string[]
  defaultValue?: string | string[]
  expanded?: string[]
  onExpandedChange?: (expanded: string[]) => void
  onValueChange?: (value: never) => void
  root: RefObject<HTMLElement | null>
  selection: TreeSelection
  value?: string | string[]
}

interface TreeState {
  activate: (item: string, hasChildren: boolean) => void
  checkState: (item: string) => TreeCheckState | undefined
  expanded: readonly string[]
  select: (item: string) => void
  selectAll: () => void
  selected: readonly string[]
  selectRange: (to: string, from?: string) => void
  toggleExpanded: (item: string, expand: boolean) => void
}

export function useTreeState({
  cascade,
  children,
  defaultExpanded,
  defaultValue,
  expanded: expandedProp,
  onExpandedChange,
  onValueChange,
  root,
  selection,
  value,
}: TreeStateOptions): TreeState {
  const isCheckbox = selection === 'checkbox'
  const [structure, setStructure] = useState<TreeStructure>({})
  const { commit: commitExpanded, selected: expanded } = useSelectionState({
    defaultValue: defaultExpanded,
    multiple: true,
    onValueChange: onExpandedChange,
    value: expandedProp,
  })
  const { commit: commitSelected, selected } = useSelectionState({
    defaultValue,
    multiple: selection === 'multiple' || isCheckbox,
    onValueChange,
    value,
  })
  const anchor = useRef<string | undefined>(undefined)
  const checked = useMemo(
    () => expandChecked(selected, structure, isCheckbox && cascade),
    [cascade, isCheckbox, selected, structure],
  )

  useEffect(() => {
    if (!isCheckbox || !cascade) return
    const next = readStructure(root.current)
    setStructure((current) => (JSON.stringify(current) === JSON.stringify(next) ? current : next))
  }, [cascade, children, isCheckbox, root])

  const toggleExpanded = useCallback(
    (item: string, expand: boolean): void => {
      if (expand === expanded.includes(item)) return
      commitExpanded(expand ? [...expanded, item] : expanded.filter((current) => current !== item))
    },
    [commitExpanded, expanded],
  )

  const select = useCallback(
    (item: string): void => {
      const isSelected = selected.includes(item)
      anchor.current = item
      if (isCheckbox) commitSelected(toggleChecked(item, checked, structure, cascade))
      else if (selection === 'single' && !isSelected) commitSelected([item])
      else if (selection === 'multiple') {
        commitSelected(
          isSelected ? selected.filter((current) => current !== item) : [...selected, item],
        )
      }
    },
    [cascade, checked, commitSelected, isCheckbox, selected, selection, structure],
  )

  const addToSelection = useCallback(
    (items: readonly string[]): void => {
      const added = items.filter((item) => !selected.includes(item))
      if (added.length > 0) commitSelected([...selected, ...added])
    },
    [commitSelected, selected],
  )

  const selectRange = useCallback(
    (to: string, from: string = anchor.current ?? to): void => {
      if (selection !== 'multiple') return
      const values = visibleItems(root.current).map((row) => row.dataset.plumeTreeValue ?? '')
      const end = values.indexOf(to)
      const start = values.includes(from) ? values.indexOf(from) : end
      if (end === -1) return
      addToSelection(values.slice(Math.min(start, end), Math.max(start, end) + 1))
    },
    [addToSelection, root, selection],
  )

  const selectAll = useCallback((): void => {
    if (selection !== 'multiple') return
    addToSelection(visibleItems(root.current).map((row) => row.dataset.plumeTreeValue ?? ''))
  }, [addToSelection, root, selection])

  const activate = useCallback(
    (item: string, hasChildren: boolean): void => {
      select(item)
      if (hasChildren && !isCheckbox) toggleExpanded(item, !expanded.includes(item))
    },
    [expanded, isCheckbox, select, toggleExpanded],
  )

  const checkState = useCallback(
    (item: string): TreeCheckState | undefined =>
      isCheckbox ? checkStateOf(item, checked, structure, cascade) : undefined,
    [cascade, checked, isCheckbox, structure],
  )

  return {
    activate,
    checkState,
    expanded,
    select,
    selectAll,
    selected,
    selectRange,
    toggleExpanded,
  }
}
