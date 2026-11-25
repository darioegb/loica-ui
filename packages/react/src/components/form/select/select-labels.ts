import { createCountFormatter } from '../../../overlay/format-count'
import type { SelectLabels } from './select-context'

export const createDefaultLabels = (locale: string): SelectLabels => {
  const number = createCountFormatter(locale)
  return {
    clear: 'Clear',
    empty: 'No results',
    overflow: (hidden) => `+${number(hidden)}`,
    remove: (label) => `Remove ${label}`,
    search: 'Search',
  }
}
