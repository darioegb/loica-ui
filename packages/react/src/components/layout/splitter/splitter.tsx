'use client'

import type { ComponentPropsWithoutRef, CSSProperties, ForwardedRef, ReactElement, ReactNode } from 'react'
import { Children, forwardRef, isValidElement, useCallback, useId, useMemo, useRef, useState } from 'react'
import { useLabels, useResolvedLocale } from '../../../locale/locale-provider'
import { joinClasses } from '../../../overlay/class-names'
import { isRtl } from '../../../overlay/direction'
import { createCountFormatter } from '../../../overlay/format-count'
import { mergeRefs } from '../../../overlay/trigger'
import { useControllableState } from '../../../overlay/use-controllable-state'
import type { ColorScheme } from '../../../theme'
import { schemeVar } from '../../../theme'
import {
  SplitterContext,
  SplitterIndexContext,
  type SplitterLabels,
  type SplitterOrientation,
  type SplitterVariant,
} from './splitter-context'
import {
  isCollapsed,
  normalizeSizes,
  pairBounds,
  resizePair,
  sameSizes,
  setPanelSize,
  type SplitterLimits,
} from './splitter-math'
import { SplitterHandle } from './splitter-handle'
import type { SplitterPanelProps } from './splitter-panel'
import styles from './splitter.module.css'

export interface SplitterOwnProps {
  /**
   * The `SplitterPanel` parts, with a `SplitterHandle` between each pair. A pair of panels with no handle between them
   * gets one, so the handles only need to be written to change them.
   */
  children?: ReactNode
  /**
   * Color scheme from the theme palette, including custom schemes added to it. It colors the handle while it is hovered,
   * focused or dragged.
   *
   * @default 'primary'
   * @since 1.4
   */
  colorScheme?: ColorScheme
  /**
   * The sizes of the panels in percent, for an uncontrolled Splitter, in the order of the panels. They are scaled to add
   * up to 100, and without them the panels share the space equally.
   *
   * @since 1.4
   */
  defaultSizes?: number[]
  /**
   * Called with the sizes in percent every time a drag or a key changes them.
   *
   * @since 1.4
   */
  onSizesChange?: (sizes: number[]) => void
  /**
   * Called with the sizes in percent when a drag ends or a key moves a handle, so the app can save them without writing
   * on every pointer move.
   *
   * @since 1.4
   */
  onResizeEnd?: (sizes: number[]) => void
  /**
   * Whether the panels go side by side, with handles you drag left and right, or one under the other, with handles you
   * drag up and down. The Splitter needs a height of its own to resize its panels in a `vertical` layout.
   *
   * @default 'horizontal'
   * @since 1.4
   */
  orientation?: SplitterOrientation
  /**
   * The sizes of the panels in percent, for a controlled Splitter. Pair it with `onSizesChange`.
   *
   * @since 1.4
   */
  sizes?: number[]
  /**
   * How many percent a handle moves with an arrow key.
   *
   * @default 5
   * @since 1.4
   */
  step?: number
  /**
   * Visual variant of the handles. `line` is a thin divider and `bar` a wider one with a grip. `unstyled` drops the Loica
   * styles so you can bring your own; the layout and the resizing keep working.
   *
   * @default 'line'
   * @since 1.4
   */
  variant?: SplitterVariant
}

export type SplitterProps = Omit<ComponentPropsWithoutRef<'div'>, keyof SplitterOwnProps> &
  SplitterOwnProps

const createDefaultLabels = (locale: string): SplitterLabels => {
  const format = createCountFormatter(locale)
  return {
    resize: (handle, count) =>
      count === 1 ? 'Resize panels' : `Resize panels ${format(handle)} of ${format(count)}`,
  }
}

interface Part {
  element: ReactElement<SplitterPanelProps>
  kind: 'handle' | 'panel'
}

const toParts = (children: ReactNode): Part[] => {
  const parts: Part[] = []
  Children.toArray(children).forEach((child) => {
    if (!isValidElement(child)) return
    const kind = child.type === SplitterHandle ? 'handle' : 'panel'
    if (kind === 'panel' && parts[parts.length - 1]?.kind === 'panel') {
      parts.push({ element: <SplitterHandle key={`${String(child.key)}-handle`} />, kind: 'handle' })
    }
    parts.push({ element: child as Part['element'], kind })
  })
  return parts
}

const limitsOf = (props: SplitterPanelProps): SplitterLimits => ({
  collapsedSize: props.collapsedSize ?? 0,
  collapsible: props.collapsible ?? false,
  max: props.maxSize ?? 100,
  min: props.minSize ?? 0,
})

interface Drag {
  index: number
  origin: number
  rtl: boolean
  start: number[]
  total: number
}

/**
 * Panels the user resizes by dragging the handles between them. It holds the sizes, in percent, and lays the panels out
 * side by side or one under the other.
 * @since 1.4
 */
export const Splitter = forwardRef<HTMLDivElement, SplitterProps>(
  (
    {
      children,
      className,
      colorScheme = 'primary',
      defaultSizes,
      onResizeEnd,
      onSizesChange,
      orientation = 'horizontal',
      sizes: sizesProp,
      step = 5,
      style,
      variant = 'line',
      ...rest
    }: SplitterProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    const baseId = useId()
    const isStyled = variant !== 'unstyled'
    const locale = useResolvedLocale()
    const defaults = useMemo(() => createDefaultLabels(locale), [locale])
    const labels = useLabels('splitter', defaults)
    const container = useRef<HTMLDivElement | null>(null)
    const drag = useRef<Drag | null>(null)
    const restore = useRef<Record<number, number>>({})
    const [dragging, setDragging] = useState<number | null>(null)

    const parts = useMemo(() => toParts(children), [children])
    const panels = useMemo(() => parts.filter((part) => part.kind === 'panel'), [parts])
    const count = panels.length
    const limits = useMemo(
      () => panels.map((part) => limitsOf(part.element.props)),
      [panels],
    )
    const panelIds = useMemo(
      () => panels.map((part, index) => part.element.props.id ?? `${baseId}-panel-${index}`),
      [baseId, panels],
    )

    const [rawSizes, setRawSizes] = useControllableState<number[]>({
      defaultValue: defaultSizes ?? [],
      onChange: onSizesChange,
      value: sizesProp,
    })
    const sizes = useMemo(() => normalizeSizes(rawSizes, count), [count, rawSizes])
    const latest = useRef({ onResizeEnd, sizes })
    latest.current = { onResizeEnd, sizes }

    const commit = useCallback(
      (next: number[]): void => {
        if (!sameSizes(next, latest.current.sizes)) {
          latest.current = { ...latest.current, sizes: next }
          setRawSizes(next)
        }
      },
      [setRawSizes],
    )

    const finish = useCallback((): void => {
      latest.current.onResizeEnd?.(latest.current.sizes)
    }, [])

    const remember = useCallback(
      (next: number[]): void => {
        next.forEach((size, index) => {
          if (!isCollapsed(size, limits[index])) restore.current[index] = size
        })
      },
      [limits],
    )

    const moveBy = useCallback(
      (index: number, delta: number): void => {
        const current = latest.current.sizes
        remember(current)
        commit(resizePair(current, index, delta, limits))
        finish()
      },
      [commit, finish, limits, remember],
    )

    const jump = useCallback(
      (index: number, edge: 'end' | 'start'): void => {
        const current = latest.current.sizes
        const { highest, lowest } = pairBounds(current, index, limits)
        remember(current)
        commit(setPanelSize(current, index, index, edge === 'start' ? lowest : highest))
        finish()
      },
      [commit, finish, limits, remember],
    )

    const toggle = useCallback(
      (index: number): void => {
        const current = latest.current.sizes
        const panel = limits[index].collapsible ? index : index + 1
        if (!limits[panel].collapsible) return
        const total = current[index] + current[index + 1]
        const { highest, lowest } = pairBounds(current, index, limits)
        if (isCollapsed(current[panel], limits[panel])) {
          const wanted = restore.current[panel] ?? Math.max(limits[panel].min, 100 / count)
          const first = panel === index ? wanted : total - wanted
          const clamped = Math.min(highest, Math.max(lowest, first))
          commit(setPanelSize(current, index, index, clamped))
        } else {
          remember(current)
          commit(setPanelSize(current, index, panel, limits[panel].collapsedSize))
        }
        finish()
      },
      [commit, count, finish, limits, remember],
    )

    const horizontal = orientation === 'horizontal'

    const pointerStart = useCallback(
      (index: number, position: number): void => {
        const element = container.current
        if (!element) return
        const total = Array.from(element.children)
          .filter((child) => child.hasAttribute('data-loica-splitter-panel'))
          .reduce((sum, child) => {
            const box = child.getBoundingClientRect()
            return sum + (horizontal ? box.width : box.height)
          }, 0)
        if (total <= 0) return
        remember(latest.current.sizes)
        drag.current = {
          index,
          origin: position,
          rtl: horizontal && isRtl(element),
          start: latest.current.sizes,
          total,
        }
        setDragging(index)
      },
      [horizontal, remember],
    )

    const pointerMove = useCallback(
      (position: number): void => {
        const state = drag.current
        if (!state) return
        const percent = ((position - state.origin) / state.total) * 100
        commit(resizePair(state.start, state.index, state.rtl ? -percent : percent, limits))
      },
      [commit, limits],
    )

    const pointerEnd = useCallback((): void => {
      if (!drag.current) return
      drag.current = null
      setDragging(null)
      finish()
    }, [finish])

    const bounds = useCallback(
      (index: number) => pairBounds(sizes, index, limits),
      [limits, sizes],
    )

    const context = useMemo(
      () => ({
        bounds,
        count,
        dragging,
        isStyled,
        jump,
        labels,
        limits,
        moveBy,
        orientation,
        panelIds,
        pointerEnd,
        pointerMove,
        pointerStart,
        sizes,
        step,
        toggle,
        variant,
      }),
      [bounds, count, dragging, isStyled, jump, labels, limits, moveBy, orientation, panelIds, pointerEnd, pointerMove, pointerStart, sizes, step, toggle, variant],
    )

    let panelIndex = -1
    const items = parts.flatMap((part) => {
      if (part.kind === 'panel') panelIndex += 1
      else if (panelIndex < 0 || panelIndex >= count - 1) return []
      return [
        <SplitterIndexContext.Provider key={part.element.key} value={panelIndex}>
          {part.element}
        </SplitterIndexContext.Provider>,
      ]
    })

    return (
      <SplitterContext.Provider value={context}>
        <div
          className={joinClasses(isStyled && styles.splitter, className)}
          data-dragging={dragging === null ? undefined : ''}
          data-loica-splitter=""
          data-orientation={orientation}
          ref={mergeRefs<HTMLDivElement>(container, ref)}
          style={
            {
              '--splitter-active': schemeVar(colorScheme, 'solid'),
              ...style,
            } as CSSProperties
          }
          {...rest}
        >
          {items}
        </div>
      </SplitterContext.Provider>
    )
  },
)

Splitter.displayName = 'Splitter'
