'use client'

import type { ChangeEvent, KeyboardEvent, ReactNode } from 'react'
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { visuallyHidden } from '../../../overlay/visually-hidden'
import { useResolvedLocale } from '../../../locale/locale-provider'
import {
  getEnabledOptions,
  scrollOptionIntoView,
  stepOption,
} from '../../form/select/select-dom'
import { useModalContext } from '../modal/modal-context'
import { CommandPaletteContext } from './commandpalette-context'
import { defaultFilter } from './commandpalette-filter'
import type { CommandPaletteFilter, CommandPaletteLabels } from './commandpalette-types'
import styles from './commandpalette.module.css'

const steps: Record<string, number> = {
  ArrowDown: 1,
  ArrowUp: -1,
  PageDown: 10,
  PageUp: -10,
}

function describeResults(count: number | undefined, labels: CommandPaletteLabels): string {
  if (count === undefined) return ''
  return count === 0 ? labels.empty : labels.results(count)
}

interface CommandPaletteBodyProps {
  children: ReactNode
  closeOnSelect: boolean
  filter: CommandPaletteFilter | false | undefined
  labels: CommandPaletteLabels
  onQueryChange: ((query: string) => void) | undefined
  placeholder: string | undefined
  query: string | undefined
}

export function CommandPaletteBody({
  children,
  closeOnSelect,
  filter,
  labels,
  onQueryChange,
  placeholder,
  query: queryProp,
}: Readonly<CommandPaletteBodyProps>): ReactNode {
  const { isStyled, setOpen } = useModalContext('CommandPalette')
  const locale = useResolvedLocale()
  const listboxId = useId()
  const [internalQuery, setInternalQuery] = useState('')
  const [activeId, setActiveId] = useState<string | undefined>(undefined)
  const [listbox, setListbox] = useState<HTMLDivElement | null>(null)
  const [count, setCount] = useState<number | undefined>(undefined)
  const query = queryProp ?? internalQuery
  const lastQuery = useRef(query)

  useEffect(() => {
    const enabled = getEnabledOptions(listbox)
    const restart = lastQuery.current !== query
    lastQuery.current = query
    setActiveId((current) =>
      restart || !enabled.some((option) => option.id === current) ? enabled[0]?.id : current,
    )
    setCount(listbox?.querySelectorAll('[role="option"]:not([hidden])').length ?? 0)
  }, [children, listbox, query])

  const matches = useCallback(
    (value: string, keywords: readonly string[]): boolean => {
      if (filter === false) return true
      return filter
        ? filter(value, query, keywords)
        : defaultFilter(value, query, keywords, locale)
    },
    [filter, locale, query],
  )

  const select = useCallback(
    (run: (() => void) | undefined): void => {
      run?.()
      if (closeOnSelect) setOpen(false)
    },
    [closeOnSelect, setOpen],
  )

  const context = useMemo(
    () => ({ activeId, isStyled, matches, select, setActiveId }),
    [activeId, isStyled, matches, select],
  )

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.nativeEvent.isComposing) return
    const enabled = getEnabledOptions(listbox)
    if (event.key in steps) {
      event.preventDefault()
      const next = stepOption(enabled, activeId, steps[event.key])
      if (next) setActiveId(next.id)
      scrollOptionIntoView(next)
    } else if (event.key === 'Enter') {
      event.preventDefault()
      enabled.find((option) => option.id === activeId)?.click()
    }
  }

  const announcement = describeResults(count, labels)

  return (
    <CommandPaletteContext.Provider value={context}>
      <div className={joinClasses(isStyled && styles.search)} data-loica-commandpalette-search="">
        <input
          aria-activedescendant={activeId}
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-expanded="true"
          aria-label={placeholder ?? labels.placeholder}
          autoComplete="off"
          className={joinClasses(isStyled && styles.input)}
          data-loica-commandpalette-input=""
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            if (queryProp === undefined) setInternalQuery(event.target.value)
            onQueryChange?.(event.target.value)
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder ?? labels.placeholder}
          role="combobox"
          spellCheck={false}
          type="text"
          value={query}
        />
      </div>
      <div
        aria-label={labels.label}
        className={joinClasses(isStyled && styles.list)}
        data-loica-commandpalette-list=""
        id={listboxId}
        ref={setListbox}
        role="listbox"
      >
        {children}
      </div>
      {count === 0 ? (
        <div className={joinClasses(isStyled && styles.empty)} data-loica-commandpalette-empty="">
          {labels.empty}
        </div>
      ) : null}
      <div aria-live="polite" role="status" style={visuallyHidden}>
        {announcement}
      </div>
    </CommandPaletteContext.Provider>
  )
}
