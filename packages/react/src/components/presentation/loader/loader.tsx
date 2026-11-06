'use client'

import type { ComponentPropsWithoutRef, CSSProperties, ForwardedRef } from 'react'
import { forwardRef } from 'react'
import { useLabels } from '../../../locale/locale-provider'
import { joinClasses } from '../../../overlay/class-names'
import type { ColorScheme, Size } from '../../../theme'
import { schemeVar } from '../../../theme'
import styles from './loader.module.css'

export interface LoaderOwnProps {
  /**
   * Color scheme of the Loader, which takes its `text` color. Without it the Loader takes the color
   * of the text around it.
   */
  colorScheme?: ColorScheme
  /**
   * Accessible name of the Loader, announced while it is shown. It defaults to the `loader` text of
   * the `LocaleProvider`, or `Loading`.
   */
  label?: string
  /**
   * Size of the Loader.
   *
   * @default 'md'
   */
  size?: Size
  /**
   * How the Loader moves: a ring that turns, three dots or three bars.
   *
   * @default 'spinner'
   */
  variant?: LoaderVariant
}

export type LoaderVariant = 'spinner' | 'dots' | 'bars' | 'unstyled'

export type LoaderProps = Omit<ComponentPropsWithoutRef<'output'>, 'children'> & LoaderOwnProps

const DEFAULT_LABELS = { label: 'Loading' }

export const Loader = forwardRef<HTMLOutputElement, LoaderProps>(
  (
    {
      className,
      colorScheme,
      label,
      style,
      size = 'md',
      variant = 'spinner',
      ...rest
    }: LoaderProps,
    ref: ForwardedRef<HTMLOutputElement>,
  ) => {
    const text = useLabels('loader', DEFAULT_LABELS, label === undefined ? undefined : { label })
    const isStyled = variant !== 'unstyled'
    const hasItems = variant === 'dots' || variant === 'bars'

    return (
      <output
        aria-label={text.label}
        className={joinClasses(isStyled && styles[variant], isStyled && styles[size], className)}
        data-loica-loader=""
        ref={ref}
        style={
          colorScheme
            ? ({ '--loader-color': schemeVar(colorScheme, 'text'), ...style } as CSSProperties)
            : style
        }
        {...rest}
      >
        {hasItems ? (
          <>
            <span />
            <span />
            <span />
          </>
        ) : null}
      </output>
    )
  },
)

Loader.displayName = 'Loader'
