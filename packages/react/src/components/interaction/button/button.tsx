'use client'

import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  ForwardedRef,
  MouseEvent,
  ReactNode,
} from 'react'
import { forwardRef } from 'react'
import { useAnchorElement } from '../../../link/use-anchor-element'
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
  /**
   * Makes the Button a link: it renders an `<a>`, or the component of the `LinkProvider`, with the
   * look of the Button. While `disabled` or `loading` it has no `href`, is announced as disabled
   * and ignores its clicks. The `ref` and the event handlers then belong to that anchor, although
   * their types say `HTMLButtonElement`; `type`, `form` and the rest of the button attributes are
   * not used.
   *
   * @since 1.1
   */
  href?: string
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
   * What a link with `href` is to the linked page, such as `noopener`.
   *
   * @since 1.1
   */
  rel?: string
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
   * Where a link with `href` opens, such as `_blank`.
   *
   * @since 1.1
   */
  target?: string
  /**
   * Visual style variant of the Button.
   *
   * @default 'solid'
   */
  variant?: ButtonVariant
}

export type ButtonVariant = 'solid' | 'outline' | 'link' | 'icon' | 'ghost' | 'unstyled'

export type ButtonProps = ComponentPropsWithoutRef<'button'> & ButtonOwnProps

const ignoreClick = (event: MouseEvent<HTMLElement>): void => {
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

interface ButtonBodyProps {
  content: ReactNode
  iconLeft?: ReactNode
  iconRight?: ReactNode
  loading: boolean
  loadingText?: string
}

function ButtonBody({
  content,
  iconLeft,
  iconRight,
  loading,
  loadingText,
}: Readonly<ButtonBodyProps>): ReactNode {
  if (loading) {
    return (
      <>
        {loadingText ?? <span style={visuallyHidden}>{content}</span>}
        <Loader size="sm" />
      </>
    )
  }
  return (
    <>
      {iconLeft}
      {content}
      {iconRight}
    </>
  )
}

interface ButtonClassNameOptions {
  className?: string
  inactive: boolean
  shape: Shape
  size: Size
  variant: ButtonVariant
}

function buttonClassName({
  className,
  inactive,
  shape,
  size,
  variant,
}: ButtonClassNameOptions): string | undefined {
  if (variant === 'unstyled') return joinClasses(className)
  return joinClasses(
    styles[variant],
    styles[size],
    styles[shape],
    inactive && styles.disabled,
    className,
  )
}

const stateAttributes = (loading: boolean, inactive: boolean) => ({
  'aria-busy': loading || undefined,
  'data-disabled': inactive ? '' : undefined,
  'data-loading': loading ? '' : undefined,
})

const linkAttributes = (
  href: string,
  disabled: boolean,
  inactive: boolean,
  onClick: ButtonProps['onClick'],
) => ({
  'aria-disabled': inactive || undefined,
  href: inactive ? undefined : href,
  onClick: inactive ? ignoreClick : onClick,
  role: inactive ? 'link' : undefined,
  tabIndex: disabled ? -1 : undefined,
})

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      href,
      iconLeft,
      iconRight,
      label,
      loadingText,
      onClick,
      rel,
      style,
      target,
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
    const content = children ?? label
    const inactive = disabled || loading
    const Anchor = useAnchorElement({ disabled: inactive, href, target })

    const common = {
      ...stateAttributes(loading, inactive),
      className: buttonClassName({ className, inactive, shape, size, variant }),
      'data-loica-button': '',
      style: { ...buttonColorVars(colorScheme), ...style },
    }

    const body = (
      <ButtonBody
        content={content}
        iconLeft={iconLeft}
        iconRight={iconRight}
        loading={loading}
        loadingText={loadingText}
      />
    )

    if (href !== undefined) {
      return (
        <Anchor
          {...common}
          {...rest}
          {...linkAttributes(href, disabled, inactive, onClick)}
          ref={ref}
          rel={rel}
          target={target}
        >
          {body}
        </Anchor>
      )
    }

    return (
      <button
        {...common}
        aria-disabled={loading && !disabled ? true : undefined}
        disabled={disabled}
        ref={ref}
        type={type}
        {...rest}
        onClick={loading ? ignoreClick : onClick}
      >
        {body}
      </button>
    )
  },
)

Button.displayName = 'Button'
