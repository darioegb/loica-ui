'use client'

import type { ComponentPropsWithoutRef, CSSProperties, ForwardedRef, ReactNode } from 'react'
import { forwardRef, useMemo } from 'react'
import { useLabels, useResolvedLocale } from '../../../locale/locale-provider'
import { joinClasses } from '../../../overlay/class-names'
import { visuallyHidden } from '../../../overlay/visually-hidden'
import type { ColorScheme, Size } from '../../../theme'
import { schemeVar } from '../../../theme'
import styles from './stat.module.css'

export type StatTrend = 'down' | 'neutral' | 'up'

export type StatVariant = 'default' | 'unstyled'

export interface StatLabels {
  /** Said before the change when the trend is `down`. */
  down: string
  /** Said before the change when the trend is `neutral`. */
  neutral: string
  /** Said before the change when the trend is `up`. */
  up: string
}

export interface StatOwnProps {
  /**
   * The change, as the text to show: `+12 %`, `3 more than last week`. Write it with its sign, since the
   * component doesn't compute it.
   *
   * @since 1.2
   */
  change?: ReactNode
  /**
   * Color scheme from the theme palette for the change. By default it follows the `trend`: `success` for `up`,
   * `error` for `down` and muted for `neutral`. Set it when up is not good news, as in a count of errors.
   *
   * @since 1.2
   */
  colorScheme?: ColorScheme
  /**
   * Options of `Intl.NumberFormat` to write a number `value`: `{ style: 'currency', currency: 'EUR' }`,
   * `{ notation: 'compact' }`.
   *
   * @since 1.2
   */
  formatOptions?: Intl.NumberFormatOptions
  /**
   * A line under the change, for what the number counts or the period it covers.
   *
   * @since 1.2
   */
  helpText?: ReactNode
  /**
   * What the number is. It is the name of the statistic, so write it as a short noun.
   *
   * @since 1.2
   */
  label: ReactNode
  /**
   * BCP 47 tag to write a number `value`. It follows the `locale` of the `LocaleProvider`, then `en`.
   *
   * @since 1.2
   */
  locale?: string
  /**
   * Size of the value: `sm`, `md` or `lg`.
   *
   * @since 1.2
   * @default 'md'
   */
  size?: Size
  /**
   * Where the number went: `up`, `down` or `neutral`. It sets the arrow and the color of the `change`, and
   * the text that announces it to a screen reader (`stat.up`, `stat.down` and `stat.neutral` of the
   * `LocaleProvider`). Without it the change is plain text.
   *
   * @since 1.2
   */
  trend?: StatTrend
  /**
   * The number or text to show. A number is written with the `locale`, and `formatOptions` change how.
   *
   * @since 1.2
   */
  value: ReactNode
  /**
   * `unstyled` drops the Loica styles, so you can bring your own. The `data-*` attributes stay.
   *
   * @since 1.2
   * @default 'default'
   */
  variant?: StatVariant
}

export type StatProps = Omit<ComponentPropsWithoutRef<'dl'>, 'children'> & StatOwnProps

const DEFAULT_LABELS: StatLabels = {
  down: 'Decrease',
  neutral: 'No change',
  up: 'Increase',
}

const paths: Record<StatTrend, string> = {
  down: 'M4 6l4 4 4-4',
  neutral: 'M4 8h8',
  up: 'M4 10l4-4 4 4',
}

const statColorVars = (colorScheme: ColorScheme | undefined, style?: CSSProperties): CSSProperties | undefined =>
  colorScheme === undefined ? style : ({ '--stat-change': schemeVar(colorScheme, 'text'), ...style } as CSSProperties)

/**
 * A number with its name, how it changed and a line of help: a metric of a dashboard. Put it in a `Card`, it is
 * not one itself.
 *
 * @since 1.2
 */
export const Stat = forwardRef<HTMLDListElement, StatProps>(
  (
    {
      change,
      className,
      colorScheme,
      formatOptions,
      helpText,
      label,
      locale,
      size = 'md',
      style,
      trend,
      value,
      variant = 'default',
      ...rest
    }: StatProps,
    ref: ForwardedRef<HTMLDListElement>,
  ) => {
    const resolvedLocale = useResolvedLocale(locale)
    const labels = useLabels('stat', DEFAULT_LABELS)
    const isStyled = variant !== 'unstyled'
    const text = useMemo(
      () => (typeof value === 'number' ? new Intl.NumberFormat(resolvedLocale, formatOptions).format(value) : value),
      [formatOptions, resolvedLocale, value],
    )

    return (
      <dl
        className={joinClasses(isStyled && styles.stat, className)}
        data-loica-stat=""
        data-size={size}
        data-trend={trend}
        ref={ref}
        style={statColorVars(colorScheme, style)}
        {...rest}
      >
        <dt data-loica-stat-label="">{label}</dt>
        <dd data-loica-stat-value="">{text}</dd>
        {change === undefined || change === null || change === false ? null : (
          <dd data-loica-stat-change="">
            {trend ? (
              <svg aria-hidden="true" data-loica-stat-icon="" fill="none" height="1em" viewBox="0 0 16 16" width="1em">
                <path d={paths[trend]} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            ) : null}
            {trend ? <span style={visuallyHidden}>{labels[trend]}: </span> : null}
            {change}
          </dd>
        )}
        {helpText ? <dd data-loica-stat-help="">{helpText}</dd> : null}
      </dl>
    )
  },
)

Stat.displayName = 'Stat'
