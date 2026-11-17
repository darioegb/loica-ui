import type { ComponentPropsWithoutRef, ForwardedRef } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ColorScheme } from '../../../theme'
import styles from './timeline.module.css'
import { timelineColorVars } from './timeline-item'

export type TimelineVariant = 'default' | 'unstyled'

export interface TimelineOwnProps {
  /**
   * Color scheme from the theme palette, custom schemes included, for the markers of the items. An item can set
   * its own.
   *
   * @since 1.3
   * @default 'secondary'
   */
  colorScheme?: ColorScheme
  /**
   * `unstyled` drops the Loica styles, so you can lay the items out yourself. The `data-*` attributes stay.
   *
   * @since 1.3
   * @default 'default'
   */
  variant?: TimelineVariant
}

export type TimelineProps = ComponentPropsWithoutRef<'ol'> & TimelineOwnProps

/**
 * A vertical list of events in order, each with a marker joined to the next one by a line: the activity of a
 * project, the steps of an order. Write a `TimelineItem` for each event, as direct children.
 *
 * @since 1.3
 */
export const Timeline = forwardRef<HTMLOListElement, TimelineProps>(
  (
    {
      className,
      colorScheme = 'secondary',
      role = 'list',
      style,
      variant = 'default',
      ...rest
    }: TimelineProps,
    ref: ForwardedRef<HTMLOListElement>,
  ) => {
    const isStyled = variant !== 'unstyled'
    return (
      <ol
        className={joinClasses(isStyled && styles.timeline, className)}
        data-loica-timeline=""
        ref={ref}
        role={role}
        style={timelineColorVars(colorScheme, style)}
        {...rest}
      />
    )
  },
)

Timeline.displayName = 'Timeline'
