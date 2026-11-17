import type { ComponentPropsWithoutRef, CSSProperties, ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import type { ColorScheme } from '../../../theme'
import { schemeVar } from '../../../theme'

export interface TimelineItemOwnProps {
  /**
   * Color scheme from the theme palette, custom schemes included, for the marker of this item. By default it takes
   * the one of the `Timeline`. The color is only a hint, so say what happened in the `title`.
   *
   * @since 1.3
   */
  colorScheme?: ColorScheme
  /**
   * The moment of the event as a valid date or time string (`2026-06-15`, `2026-06-15T09:30`), which goes in the
   * `dateTime` of the `<time>` element that wraps the `time`. Without it the `time` is plain text.
   *
   * @since 1.3
   */
  dateTime?: string
  /**
   * What the marker shows, such as an SVG. Without it the marker is a dot. It is hidden from assistive technology,
   * so the `title` has to say what the icon says.
   *
   * @since 1.3
   */
  icon?: ReactNode
  /**
   * When it happened, as the text to show: `3 hours ago`, `15 Jun, 09:30`. Write it as you want it read, since the
   * component doesn't format it; pass the **dateTime** too for a machine-readable value.
   *
   * @since 1.3
   */
  time?: ReactNode
  /**
   * What happened, in a line.
   *
   * @since 1.3
   */
  title?: ReactNode
}

export type TimelineItemProps = Omit<ComponentPropsWithoutRef<'li'>, 'title'> &
  TimelineItemOwnProps

export const timelineColorVars = (colorScheme: ColorScheme, style?: CSSProperties): CSSProperties =>
  ({
    '--timeline-solid': schemeVar(colorScheme, 'solid'),
    '--timeline-tint': schemeVar(colorScheme, 'tint'),
    '--timeline-tint-text': schemeVar(colorScheme, 'tint-text'),
    ...style,
  }) as CSSProperties

/**
 * An event of a `Timeline`: its marker, its `title` and `time`, and as `children` whatever else you want to tell
 * about it.
 *
 * @since 1.3
 */
export const TimelineItem = forwardRef<HTMLLIElement, TimelineItemProps>(
  (
    { children, colorScheme, dateTime, icon, style, time, title, ...rest }: TimelineItemProps,
    ref: ForwardedRef<HTMLLIElement>,
  ) => (
    <li
      data-loica-timeline-item=""
      ref={ref}
      style={colorScheme === undefined ? style : timelineColorVars(colorScheme, style)}
      {...rest}
    >
      <span aria-hidden="true" data-loica-timeline-marker="">
        {icon}
      </span>
      <div data-loica-timeline-content="">
        {title || time ? (
          <div data-loica-timeline-header="">
            {title ? <div data-loica-timeline-title="">{title}</div> : null}
            {time ? (
              <time data-loica-timeline-time="" dateTime={dateTime}>
                {time}
              </time>
            ) : null}
          </div>
        ) : null}
        {children ? <div data-loica-timeline-body="">{children}</div> : null}
      </div>
    </li>
  ),
)

TimelineItem.displayName = 'TimelineItem'
