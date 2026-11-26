import type { MouseEvent } from 'react'

export const opensElsewhere = (event: MouseEvent<HTMLElement>): boolean =>
  event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
