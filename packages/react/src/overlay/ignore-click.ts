import type { MouseEvent } from 'react'

export const ignoreClick = (event: MouseEvent<HTMLElement>): void => {
  event.preventDefault()
  event.stopPropagation()
  // stopPropagation only blocks React handlers; the native one stops any DOM listener too.
  event.nativeEvent.stopImmediatePropagation()
}
