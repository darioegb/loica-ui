'use client'

import type { KeyboardEvent } from 'react'
import { useResolvedLocale } from '../../../locale/locale-provider'
import { isTypeaheadKey, matchTypeahead, useTypeahead } from '../../../overlay/use-typeahead'

export const getItems = (menu: HTMLElement): HTMLElement[] =>
  Array.from(menu.querySelectorAll<HTMLElement>('[role="menuitem"]')).filter(
    (item) =>
      item.getAttribute('aria-disabled') !== 'true' && !(item as HTMLButtonElement).disabled,
  )

export const focusItem = (item: HTMLElement | undefined): void =>
  item?.focus({ preventScroll: true })

export const isOwnEvent = (event: KeyboardEvent<HTMLElement>): boolean =>
  (event.target as HTMLElement).closest('[role="menu"]') === event.currentTarget

export function useMenuKeyDown(
  onTab: () => void,
): (event: KeyboardEvent<HTMLDivElement>) => void {
  const type = useTypeahead()
  const locale = useResolvedLocale()

  return (event) => {
    if (!isOwnEvent(event)) return
    const items = getItems(event.currentTarget)
    const current = items.indexOf(document.activeElement as HTMLElement)
    let next: number | undefined
    if (event.key === 'ArrowDown') next = (current + 1) % items.length
    else if (event.key === 'ArrowUp') next = current <= 0 ? items.length - 1 : current - 1
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = items.length - 1
    else if (event.key === 'Tab') {
      event.preventDefault()
      onTab()
      return
    } else if (isTypeaheadKey(event)) {
      const labels = items.map((item) => item.textContent ?? '')
      const match = matchTypeahead(labels, type(event.key), current, locale)
      if (match >= 0) focusItem(items[match])
      return
    }
    if (next === undefined) return
    event.preventDefault()
    focusItem(items[next])
  }
}
