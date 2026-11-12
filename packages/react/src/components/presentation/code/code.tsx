import type { ComponentPropsWithoutRef, ForwardedRef } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ColorScheme } from '../../../theme'
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
    { className, colorScheme = 'secondary', style, variant = 'subtle', ...rest }: CodeProps,
    ref: ForwardedRef<HTMLElement>,
  ) => {
    const isStyled = variant !== 'unstyled'
    return (
      <code
        className={joinClasses(isStyled && styles.code, isStyled && tag[variant], className)}
        data-loica-code=""
        ref={ref}
        style={tagColorVars('code', colorScheme, style)}
        {...rest}
      />
    )
  },
)

Code.displayName = 'Code'
