import type { ElementType, ForwardedRef, HTMLAttributes } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import type { FontWeightName } from '../shared/font-weight'
import styles from './heading.module.css'

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

export type HeadingVariant = 'default' | 'unstyled'

export interface HeadingOwnProps {
  /**
   * The level of the heading in the outline of the page: it picks the element, from `h1` to `h6`.
   * Use one level below the previous one, and don't pick it for its looks (see `size`).
   *
   * @default 2
   */
  level?: HeadingLevel
  /**
   * The look of the heading, from 1 (the biggest) to 6, when it is not the one of its level: an
   * `h2` that looks like a smaller heading keeps its place in the outline. It follows `level` by
   * default. `inherit` takes the font size from the element around it, so a heading inside a
   * component with its own size scales with it; the weight, the line height and the letter spacing
   * are the ones of the `level`.
   */
  size?: HeadingLevel | 'inherit'
  /**
   * Keeps the heading on one line and ends it with an ellipsis when it does not fit.
   *
   * @default false
   */
  truncate?: boolean
  /**
   * `unstyled` drops the Loica styles so you can bring your own. The heading has no other
   * variant: its look is the `size`.
   *
   * @default 'default'
   */
  variant?: HeadingVariant
  /**
   * The weight of the font, from the theme, when it is not the one of its `size`.
   *
   * @since 1.2
   */
  weight?: FontWeightName
}

type HeadingRootAttributes = Pick<
  HTMLAttributes<HTMLHeadingElement>,
  'aria-label' | 'aria-labelledby' | 'children' | 'hidden' | 'id' | 'lang' | 'title'
>

export type HeadingProps = Omit<ComponentProps, 'index'> & HeadingRootAttributes & HeadingOwnProps

const sizeClass = {
  1: styles.size1,
  2: styles.size2,
  3: styles.size3,
  4: styles.size4,
  5: styles.size5,
  6: styles.size6,
}

const weightClass = {
  bold: styles.weightBold,
  medium: styles.weightMedium,
  normal: styles.weightNormal,
  semibold: styles.weightSemibold,
}

/**
 * A heading with the text styles `heading-1` to `heading-6` of the theme. The `level` is the
 * element of the outline of the page and the `size` is how it looks.
 */
export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  (
    {
      className,
      level = 2,
      size,
      truncate = false,
      variant = 'default',
      weight,
      ...rest
    }: HeadingProps,
    ref: ForwardedRef<HTMLHeadingElement>,
  ) => {
    const Element = `h${level}` as ElementType
    const resolvedSize = size ?? level
    const inherits = resolvedSize === 'inherit'
    const isStyled = variant !== 'unstyled'
    return (
      <Element
        className={joinClasses(
          isStyled && styles.heading,
          isStyled && sizeClass[inherits ? level : resolvedSize],
          isStyled && inherits && styles.sizeInherit,
          isStyled && weight && weightClass[weight],
          truncate && styles.truncate,
          className,
        )}
        data-loica-heading=""
        data-size={resolvedSize}
        data-truncate={truncate ? '' : undefined}
        data-weight={weight}
        ref={ref}
        {...rest}
      />
    )
  },
)

Heading.displayName = 'Heading'
