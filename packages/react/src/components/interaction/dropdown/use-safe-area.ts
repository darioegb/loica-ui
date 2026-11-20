'use client'

import type { RefObject } from 'react'
import { useCallback, useEffect, useRef } from 'react'

interface Point {
  x: number
  y: number
}

const PADDING = 8

const side = (a: Point, b: Point, point: Point): number =>
  (a.x - point.x) * (b.y - point.y) - (b.x - point.x) * (a.y - point.y)

const inTriangle = (a: Point, b: Point, c: Point, point: Point): boolean => {
  const signs = [side(a, b, point), side(b, c, point), side(c, a, point)]
  return signs.every((sign) => sign >= 0) || signs.every((sign) => sign <= 0)
}

function insideSafeArea(origin: Point, panel: HTMLElement, point: Point): boolean {
  const rect = panel.getBoundingClientRect()
  const placement = panel.getAttribute('data-placement')?.split('-')[0]
  const vertical = placement === 'top' || placement === 'bottom'
  let near: number
  if (placement === 'left') near = rect.right
  else if (placement === 'top') near = rect.bottom
  else if (placement === 'bottom') near = rect.top
  else near = rect.left
  const corners: [Point, Point] = vertical
    ? [
        { x: rect.left - PADDING, y: near },
        { x: rect.right + PADDING, y: near },
      ]
    : [
        { x: near, y: rect.top - PADDING },
        { x: near, y: rect.bottom + PADDING },
      ]
  return inTriangle(origin, corners[0], corners[1], point)
}

interface UseSafeAreaOptions {
  close: () => void
  enabled: boolean
  grace: RefObject<boolean>
  panel: HTMLElement | null
  trigger: HTMLElement | null
}

export function useSafeArea({
  close,
  enabled,
  grace,
  panel,
  trigger,
}: UseSafeAreaOptions): (origin: Point) => void {
  const stopRef = useRef<(() => void) | undefined>(undefined)

  const stop = useCallback((): void => {
    stopRef.current?.()
    stopRef.current = undefined
    grace.current = false
  }, [grace])

  const start = useCallback(
    (origin: Point): void => {
      if (!panel || !trigger) return
      stop()
      grace.current = true
      const handleMove = (event: PointerEvent): void => {
        const target = event.target as Node | null
        if (target && (trigger.contains(target) || panel.contains(target))) {
          stop()
        } else if (!insideSafeArea(origin, panel, { x: event.clientX, y: event.clientY })) {
          stop()
          close()
        }
      }
      document.addEventListener('pointermove', handleMove)
      stopRef.current = () => document.removeEventListener('pointermove', handleMove)
    },
    [close, grace, panel, stop, trigger],
  )

  useEffect(() => {
    if (!enabled) stop()
  }, [enabled, stop])

  useEffect(() => stop, [stop])

  return start
}
