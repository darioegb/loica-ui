import type { ReactNode } from 'react'
import { isValidElement } from 'react'
import { foldText } from '../../../overlay/fold-text'

export function nodeText(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(nodeText).join('')
  if (isValidElement<{ children?: ReactNode }>(node)) return nodeText(node.props.children)
  return ''
}

/** Every word of the query has to be in the value or in a keyword, whatever the case or the accents. */
export function defaultFilter(
  value: string,
  query: string,
  keywords: readonly string[],
  locale: string,
): boolean {
  const words = foldText(query, locale).split(/\s+/).filter(Boolean)
  if (words.length === 0) return true
  const haystack = foldText([value, ...keywords].join(' '), locale)
  return words.every((word) => haystack.includes(word))
}
