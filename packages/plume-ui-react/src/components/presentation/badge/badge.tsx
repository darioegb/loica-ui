import type { ComponentPropsWithoutRef, ForwardedRef, ReactNode } from 'react'
import { Children, forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ColorScheme, Shape, Size } from '../../../theme'
import { tagColorVars } from '../shared/tag-vars'
import tag from '../shared/tag.module.css'
import styles from './badge.module.css'

export interface BadgeOwnProps {
  /**
   * Color scheme from the theme palette, including custom schemes added to it.
   *
   * @default 'primary'
   */
  colorScheme?: ColorScheme
  /**
   * Shows a dot before the content, in the color of the text. With no children it is a dot on its
   * own. The dot is `aria-hidden` and carries `data-plume-badge-dot`.
   *
   * @default false
   */
  dot?: boolean
  /**
   * The content of the Badge, as a prop, so it can be written without children:
   * `<Badge label="New" />`. `children` take its place when both are set.
   */
  label?: ReactNode
  /**
   * Corners of the Badge.
   *
   * @default 'rounded'
   */
  shape?: Shape
  /**
   * Size of the Badge.
   *
   * @default 'md'
   */
  size?: Size
  /**
   * Visual variant. `solid` fills the Badge, `subtle` tints it and `outline` only draws its
   * border. `unstyled` drops the Plume styles so you can bring your own.
   *
   * @default 'solid'
   */
  variant?: BadgeVariant
}

export type BadgeVariant = 'solid' | 'outline' | 'subtle' | 'unstyled'

export type BadgeProps = ComponentPropsWithoutRef<'span'> & BadgeOwnProps

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      children,
      className = '',
      colorScheme = 'primary',
      dot = false,
      label,
      role,
      shape = 'rounded',
      size = 'md',
      style,
      variant = 'solid',
      ...rest
    }: BadgeProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ) => {
    const isStyled = variant !== 'unstyled'
    const content = children ?? label
    const isDotOnly = dot && Children.count(content) === 0
    const isNamed = Boolean(rest['aria-label'] ?? rest['aria-labelledby'])
    const resolvedRole = role ?? (isNamed ? 'img' : undefined)
    const classes = joinClasses(
      isStyled && styles.badge,
      isStyled && tag[size],
      isStyled && tag[shape],
      isStyled && tag[variant],
      isStyled && isDotOnly && styles.dotOnly,
      className,
    )

    return (
      <span
        className={classes}
        data-plume-badge=""
        ref={ref}
        role={resolvedRole}
        style={tagColorVars('badge', colorScheme, style)}
        {...rest}
      >
        {dot ? (
          <span
            aria-hidden="true"
            className={isStyled ? styles.dot : undefined}
            data-plume-badge-dot=""
          />
        ) : null}
        {content}
      </span>
    )
  },
)

Badge.displayName = 'Badge'
