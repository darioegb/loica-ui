'use client'

import type { ComponentPropsWithoutRef, CSSProperties, ForwardedRef } from 'react'
import { forwardRef } from 'react'
import { useLabels } from '../../../locale/locale-provider'
import { joinClasses } from '../../../overlay/class-names'
import type { ColorShade, Size } from '../../../theme'
import { colorVar } from '../../../theme'
import styles from './loader.module.css'

export interface LoaderOwnProps {
  /**
   * Color from the theme palette: a scheme (`primary`) or a specific shade (`primary.700`). Without
   * it the Loader takes the color of the text around it.
   */
  colorScheme?: ColorShade
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
        data-plume-loader=""
        ref={ref}
        style={
          colorScheme
            ? ({ '--loader-color': colorVar(colorScheme), ...style } as CSSProperties)
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
