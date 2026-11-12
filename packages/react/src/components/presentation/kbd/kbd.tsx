import type { ComponentPropsWithoutRef, ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ColorScheme, Size } from '../../../theme'
import { tagColorVars } from '../shared/tag-vars'
import tag from '../shared/tag.module.css'
import styles from './kbd.module.css'

export type KbdVariant = 'outline' | 'subtle' | 'unstyled'

export interface KbdOwnProps {
  /**
   * Color scheme from the theme palette, including custom schemes added to it.
   *
   * @since 1.1
   * @default 'secondary'
   */
  colorScheme?: ColorScheme
  /**
   * The content of the Kbd, as a prop, so it can be written without children:
   * `<Kbd label="Esc" />`. `children` take its place when both are set.
   *
   * @since 1.1
   */
  label?: ReactNode
  /**
   * Size of the Kbd, from the theme. Without it, it takes the size of the text around it.
   *
   * @since 1.1
   */
  size?: Size
  /**
   * Visual variant. `outline` draws a border, like the edge of a key, and `subtle` tints the
   * background. `unstyled` drops the Loica styles so you can bring your own.
   *
   * @since 1.1
   * @default 'outline'
   */
  variant?: KbdVariant
}

export type KbdProps = ComponentPropsWithoutRef<'kbd'> & KbdOwnProps

/**
 * A key, or a combination of keys, that the user presses. It scales with the text around it, and
 * a shortcut is one `Kbd` per key: `<Kbd>Ctrl</Kbd> + <Kbd>K</Kbd>`.
 *
 * @since 1.1
 */
export const Kbd = forwardRef<HTMLElement, KbdProps>(
  (
    {
      children,
      className,
      colorScheme = 'secondary',
      label,
      size,
      style,
      variant = 'outline',
      ...rest
    }: KbdProps,
    ref: ForwardedRef<HTMLElement>,
  ) => {
    const isStyled = variant !== 'unstyled'
    return (
      <kbd
        className={joinClasses(
          isStyled && styles.kbd,
          isStyled && size && styles[size],
          isStyled && tag[variant],
          className,
        )}
        data-loica-kbd=""
        ref={ref}
        style={tagColorVars('kbd', colorScheme, style)}
        {...rest}
      >
        {children ?? label}
      </kbd>
    )
  },
)

Kbd.displayName = 'Kbd'
