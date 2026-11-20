'use client'

import { useState } from 'react'
import { useIsomorphicLayoutEffect } from '../../../overlay/use-isomorphic-layout-effect'

export interface TargetRect {
  height: number
  left: number
  top: number
  width: number
}

const same = (a: TargetRect | null, b: TargetRect): boolean =>
  a !== null &&
  a.top === b.top &&
  a.left === b.left &&
  a.width === b.width &&
  a.height === b.height

export function useTargetRect(
  target: HTMLElement | null,
  padding: number,
): TargetRect | null {
  const [rect, setRect] = useState<TargetRect | null>(null)

  useIsomorphicLayoutEffect(() => {
    if (!target) {
      setRect(null)
      return undefined
    }
    const update = (): void => {
      const box = target.getBoundingClientRect()
      const next = {
        height: box.height + padding * 2,
        left: box.left - padding,
        top: box.top - padding,
        width: box.width + padding * 2,
      }
      setRect((current) => (same(current, next) ? current : next))
    }
    update()
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)
    const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(update)
    observer?.observe(target)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update, true)
      observer?.disconnect()
    }
  }, [padding, target])

  return rect
}
