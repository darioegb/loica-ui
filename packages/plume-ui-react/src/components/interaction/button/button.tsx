'use client'

import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  ForwardedRef,
  MouseEvent,
  ReactNode,
} from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { visuallyHidden } from '../../../overlay/visually-hidden'
import type { ColorScheme, Shape, Size } from '../../../theme'
import { schemeVar } from '../../../theme'
import { Loader } from '../../presentation/loader'
import styles from './button.module.css'

export interface ButtonOwnProps {
  /**
   * Color scheme from the theme palette, including custom schemes added to it.
   *
   * @default 'secondary'
   */
  colorScheme?: ColorScheme
  /** Icon shown before the content. It is hidden while `loading`. */
  iconLeft?: ReactNode
  /** Icon shown after the content. It is hidden while `loading`. */
  iconRight?: ReactNode
  /**
   * The content of the Button, as a prop, so it can be written without children:
   * `<Button label="Save" />`. `children` take its place when both are set.
   */
  label?: ReactNode
  /**
   * Shows a `Loader` and makes the Button ignore its clicks, so it keeps the focus. It is announced
   * as busy and disabled. Without `loadingText` the content is hidden while loading, but still names
   * the Button.
   *
   * @default false
   */
  loading?: boolean
  /** Text shown instead of the content while `loading`. */
  loadingText?: string
  /**
   * Shape style of the Button.
   *
   * @default 'rounded'
   */
  shape?: Shape
  /**
   * Size of the Button.
   *
   * @default 'md'
   */
  size?: Size
  /**
   * Visual style variant of the Button.
   *
   * @default 'solid'
   */
  variant?: ButtonVariant
}

export type ButtonVariant = 'solid' | 'outline' | 'link' | 'icon' | 'ghost' | 'unstyled'

export type ButtonProps = ComponentPropsWithoutRef<'button'> & ButtonOwnProps

const ignoreClick = (event: MouseEvent<HTMLButtonElement>): void => {
  event.preventDefault()
  event.stopPropagation()
  // stopPropagation only blocks React handlers; the native one stops any DOM listener too.
  event.nativeEvent.stopImmediatePropagation()
}

const buttonColorVars = (colorScheme: ColorScheme): CSSProperties =>
  ({
    '--button-color': schemeVar(colorScheme, 'text'),
    '--button-contrast-color': schemeVar(colorScheme, 'solid-contrast'),
    '--button-solid-bg': schemeVar(colorScheme, 'solid'),
    '--button-solid-hover': schemeVar(colorScheme, 'solid-hover'),
    '--button-solid-active': schemeVar(colorScheme, 'solid-active'),
    '--button-hover-color': schemeVar(colorScheme, 'text-hover'),
    '--button-focus-color': schemeVar(colorScheme, 'text-active'),
    '--button-hover-alt-color': schemeVar(colorScheme, 'tint'),
    '--button-focus-alt-color': schemeVar(colorScheme, 'tint-strong'),
    '--button-tint-text': schemeVar(colorScheme, 'tint-text'),
  }) as CSSProperties

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      iconLeft,
      iconRight,
      label,
      loadingText,
      onClick,
      style,
      colorScheme = 'secondary',
      disabled = false,
      loading = false,
      shape = 'rounded',
      size = 'md',
      type = 'button',
      variant = 'solid',
      ...rest
    }: ButtonProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ) => {
    const isStyled = variant !== 'unstyled'
    const content = children ?? label

    return (
      <button
        aria-busy={loading || undefined}
        aria-disabled={loading && !disabled ? true : undefined}
        className={joinClasses(
          isStyled && styles[variant],
          isStyled && styles[size],
          isStyled && styles[shape],
          isStyled && (disabled || loading) && styles.disabled,
          className,
        )}
        data-disabled={disabled || loading ? '' : undefined}
        data-loading={loading ? '' : undefined}
        data-plume-button=""
        disabled={disabled}
        ref={ref}
        style={{ ...buttonColorVars(colorScheme), ...style }}
        type={type}
        {...rest}
        onClick={loading ? ignoreClick : onClick}
      >
        {loading ? (
          <>
            {loadingText ?? <span style={visuallyHidden}>{content}</span>}
            <Loader size="sm" />
          </>
        ) : (
          <>
            {iconLeft}
            {content}
            {iconRight}
          </>
        )}
      </button>
    )
  },
)

Button.displayName = 'Button'
