'use client'

import type { ComponentPropsWithoutRef, ForwardedRef } from 'react'
import { forwardRef } from 'react'
import { useSplitterContext, useSplitterIndex } from './splitter-context'
import { isCollapsed } from './splitter-math'

export interface SplitterPanelOwnProps {
  /**
   * The size in percent the panel has when it is collapsed. At `0` its content is hidden; with more, a narrow rail stays
   * visible.
   *
   * @default 0
   * @since 1.4
   */
  collapsedSize?: number
  /**
   * Lets the panel collapse: <kbd>Enter</kbd> on its handle, a double click on it, or dragging it past half of its
   * `minSize` collapses it, and any of them again opens it.
   *
   * @default false
   * @since 1.4
   */
  collapsible?: boolean
  /**
   * The largest size in percent the panel can have.
   *
   * @default 100
   * @since 1.4
   */
  maxSize?: number
  /**
   * The smallest size in percent the panel can have, unless it is collapsed.
   *
   * @default 0
   * @since 1.4
   */
  minSize?: number
}

export type SplitterPanelProps = Omit<ComponentPropsWithoutRef<'div'>, keyof SplitterPanelOwnProps> &
  SplitterPanelOwnProps

const LIMIT_PROPS = new Set(['collapsedSize', 'collapsible', 'maxSize', 'minSize'])

const withoutLimits = (props: SplitterPanelProps): ComponentPropsWithoutRef<'div'> =>
  Object.fromEntries(
    Object.entries(props).filter(([key]) => !LIMIT_PROPS.has(key)),
  )

/**
 * A panel of the Splitter. It takes the space its size says, shrinks its content with a scrollbar when it is smaller
 * than it, and is a direct child of the `Splitter`.
 * @since 1.4
 */
export const SplitterPanel = forwardRef<HTMLDivElement, SplitterPanelProps>(
  (
    { className, style, ...props }: SplitterPanelProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    const rest = withoutLimits(props)
    const { limits, panelIds, sizes } = useSplitterContext('SplitterPanel')
    const index = useSplitterIndex('SplitterPanel')
    const collapsed = isCollapsed(sizes[index], limits[index])
    const hidden = collapsed && limits[index].collapsedSize === 0

    return (
      <div
        {...rest}
        className={className}
        data-collapsed={collapsed ? '' : undefined}
        data-loica-splitter-panel=""
        id={panelIds[index]}
        ref={ref}
        style={{ flex: `${sizes[index]} 1 0%`, ...(hidden ? { visibility: 'hidden' } : {}), ...style }}
      />
    )
  },
)

SplitterPanel.displayName = 'SplitterPanel'
