import type { ElementType, ForwardedRef, HTMLAttributes } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import type { FontWeightName } from '../shared/font-weight'
import styles from './text.module.css'

export type TextElement = 'dd' | 'div' | 'dt' | 'label' | 'li' | 'p' | 'small' | 'span' | 'strong'

export type TextVariant = 'body' | 'body-sm' | 'caption' | 'label' | 'unstyled'

export type TextSize = 'inherit'

export interface TextOwnProps {
  /**
   * The element it renders. Pick the one that says what the text is: `label` for a form control,
   * `strong` for importance, `small` for fine print, `dt` and `dd` inside a `dl`, `li` inside a
   * list.
   *
   * @default 'p'
   */
  as?: TextElement
  /** The `id` of the control it names, when it renders a `label`. */
  htmlFor?: string
  /**
   * Uses the muted color of the theme, for secondary text.
   *
   * @default false
   */
  muted?: boolean
  /**
   * `inherit` takes the font size from the element around it, not from the `variant`, so a text
   * inside a component with its own size scales with it. The weight, the line height and the
   * letter spacing still come from the `variant`.
   *
   * @since 1.2
   */
  size?: TextSize
  /**
   * Keeps the text on one line and ends it with an ellipsis when it does not fit. It needs a width
   * to fit in: a block element, or a `max-width`.
   *
   * @default false
   */
  truncate?: boolean
  /**
   * The text style: `body`, `body-sm`, `label` or `caption`, made of the size, weight, line height
   * and letter spacing of the theme. `unstyled` drops the Loica styles so you can bring your own.
   *
   * @default 'body'
   */
  variant?: TextVariant
  /**
   * The weight of the font, from the theme, when it is not the one of the `variant`.
   *
   * @since 1.2
   */
  weight?: FontWeightName
}

type TextRootAttributes = Pick<
  HTMLAttributes<HTMLElement>,
  'aria-label' | 'aria-labelledby' | 'children' | 'hidden' | 'id' | 'lang' | 'role' | 'title'
>

export type TextProps = Omit<ComponentProps, 'index'> & TextRootAttributes & TextOwnProps

const variantClass = {
  body: styles.body,
  'body-sm': styles.bodySm,
  caption: styles.caption,
  label: styles.label,
}

const weightClass = {
  bold: styles.weightBold,
  medium: styles.weightMedium,
  normal: styles.weightNormal,
  semibold: styles.weightSemibold,
}

/**
 * A piece of text with one of the text styles of the theme: it takes the size, the weight, the line
 * height and the letter spacing, so the text of a page follows the theme.
 */
export const Text = forwardRef<HTMLElement, TextProps>(
  (
    {
      as = 'p',
      className,
      muted = false,
      size,
      truncate = false,
      variant = 'body',
      weight,
      ...rest
    }: TextProps,
    ref: ForwardedRef<HTMLElement>,
  ) => {
    const Element = as as ElementType
    const isStyled = variant !== 'unstyled'
    return (
      <Element
        className={joinClasses(
          isStyled && styles.text,
          isStyled && variantClass[variant],
          isStyled && size === 'inherit' && styles.sizeInherit,
          isStyled && weight && weightClass[weight],
          isStyled && muted && styles.muted,
          truncate && styles.truncate,
          className,
        )}
        data-muted={muted ? '' : undefined}
        data-loica-text=""
        data-size={size}
        data-truncate={truncate ? '' : undefined}
        data-variant={variant}
        data-weight={weight}
        ref={ref}
        {...rest}
      />
    )
  },
)

Text.displayName = 'Text'
