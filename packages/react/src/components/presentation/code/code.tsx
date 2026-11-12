import type { ComponentPropsWithoutRef, ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ColorScheme, Size } from '../../../theme'
import { tagColorVars } from '../shared/tag-vars'
import tag from '../shared/tag.module.css'
import styles from './code.module.css'

export type CodeVariant = 'outline' | 'subtle' | 'unstyled'

export interface CodeOwnProps {
  /**
   * Color scheme from the theme palette, including custom schemes added to it.
   *
   * @since 1.1
   * @default 'secondary'
   */
  colorScheme?: ColorScheme
  /**
   * The content of the Code, as a prop, so it can be written without children:
   * `<Code label="pnpm install" />`. `children` take its place when both are set.
   *
   * @since 1.1
   */
  label?: ReactNode
  /**
   * Size of the the Code, from the theme. Without it, it takes the size of the text around it.
   *
   * @since 1.1
   */
  size?: Size
  /**
   * Visual variant. `subtle` tints the background and `outline` only draws a border. `unstyled`
   * drops the Loica styles so you can bring your own.
   *
   * @since 1.1
   * @default 'subtle'
   */
  variant?: CodeVariant
}

export type CodeProps = ComponentPropsWithoutRef<'code'> & CodeOwnProps

/**
 * A piece of code inside a text, in a monospace font that scales with the text around it.
 *
 * @since 1.1
 */
export const Code = forwardRef<HTMLElement, CodeProps>(
  (
    {
      children,
      className,
      colorScheme = 'secondary',
      label,
      size,
      style,
      variant = 'subtle',
      ...rest
    }: CodeProps,
    ref: ForwardedRef<HTMLElement>,
  ) => {
    const isStyled = variant !== 'unstyled'
    return (
      <code
        className={joinClasses(
          isStyled && styles.code,
          isStyled && size && styles[size],
          isStyled && tag[variant],
          className,
        )}
        data-loica-code=""
        ref={ref}
        style={tagColorVars('code', colorScheme, style)}
        {...rest}
      >
        {children ?? label}
      </code>
    )
  },
)

Code.displayName = 'Code'
