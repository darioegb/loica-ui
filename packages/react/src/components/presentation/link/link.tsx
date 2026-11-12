'use client'

import type { ComponentPropsWithoutRef, CSSProperties, ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import { useAnchorElement } from '../../../link/use-anchor-element'
import { useLabels } from '../../../locale/locale-provider'
import { joinClasses } from '../../../overlay/class-names'
import { ignoreClick } from '../../../overlay/ignore-click'
import { visuallyHidden } from '../../../overlay/visually-hidden'
import type { ColorScheme, Size } from '../../../theme'
import { schemeVar } from '../../../theme'
import styles from './link.module.css'

export type LinkVariant = 'hover' | 'underline' | 'unstyled'

/** The text the Link adds by itself: `external` names what an external link does. */
export interface LinkLabels {
  external: string
}

export interface LinkOwnProps {
  /**
   * Color scheme from the theme palette, including custom schemes added to it.
   *
   * @since 1.1
   * @default 'primary'
   */
  colorScheme?: ColorScheme
  /**
   * Makes the Link impossible to follow: it has no `href`, is announced as disabled, ignores its
   * clicks and leaves the tab order.
   *
   * @since 1.1
   * @default false
   */
  disabled?: boolean
  /**
   * Opens the link in a new tab, with `target="_blank"` and `rel="noopener noreferrer"`, and adds a
   * text for screen readers that says so (the `link.external` text of the `LocaleProvider`). A
   * `target` or a `rel` of your own is kept.
   *
   * @since 1.1
   * @default false
   */
  external?: boolean
  /**
   * The content of the Link, as a prop, so it can be written without children:
   * `<Link href="/docs" label="Docs" />`. `children` take its place when both are set.
   *
   * @since 1.1
   */
  label?: ReactNode
  /**
   * Size of the Link, from the theme. Without it, it takes the size of the text around it.
   *
   * @since 1.1
   */
  size?: Size
  /**
   * Visual variant. `underline` always underlines the link, as a link inside a text has to be told
   * apart by more than its color. `hover` underlines it only on hover and focus, for a list of
   * links whose place says what they are, such as a menu. `unstyled` drops the Loica styles so you
   * can bring your own.
   *
   * @since 1.1
   * @default 'underline'
   */
  variant?: LinkVariant
}

export type LinkProps = ComponentPropsWithoutRef<'a'> & LinkOwnProps

const DEFAULT_LABELS: LinkLabels = { external: 'opens in a new tab' }

const linkColorVars = (colorScheme: ColorScheme, style?: CSSProperties): CSSProperties =>
  ({
    '--link-color': schemeVar(colorScheme, 'text'),
    '--link-hover-color': schemeVar(colorScheme, 'text-hover'),
    '--link-active-color': schemeVar(colorScheme, 'text-active'),
    ...style,
  }) as CSSProperties

/**
 * A link that inherits the size and the weight of the text around it. It renders the link of the
 * `LinkProvider`, so it navigates with your router, except when it is disabled or leaves the app.
 *
 * @since 1.1
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      children,
      className,
      colorScheme = 'primary',
      disabled = false,
      external = false,
      href,
      label,
      onClick,
      rel,
      size,
      style,
      target,
      variant = 'underline',
      ...rest
    }: LinkProps,
    ref: ForwardedRef<HTMLAnchorElement>,
  ) => {
    const text = useLabels('link', DEFAULT_LABELS)
    const opensIn = target ?? (external ? '_blank' : undefined)
    const Anchor = useAnchorElement({ disabled, href, target: opensIn })
    const isStyled = variant !== 'unstyled'

    return (
      <Anchor
        {...rest}
        aria-disabled={disabled || undefined}
        className={joinClasses(
          isStyled && styles.link,
          isStyled && size && styles[size],
          isStyled && styles[variant],
          className,
        )}
        data-disabled={disabled ? '' : undefined}
        data-external={external ? '' : undefined}
        data-loica-link=""
        href={disabled ? undefined : href}
        onClick={disabled ? ignoreClick : onClick}
        ref={ref}
        rel={external ? joinClasses('noopener noreferrer', rel) : rel}
        role={disabled ? 'link' : undefined}
        style={linkColorVars(colorScheme, style)}
        tabIndex={disabled ? -1 : undefined}
        target={opensIn}
      >
        {children ?? label}
        {external ? <span style={visuallyHidden}> ({text.external})</span> : null}
      </Anchor>
    )
  },
)

Link.displayName = 'Link'
