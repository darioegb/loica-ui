import type { ComponentPropsWithoutRef, ForwardedRef } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { Size } from '../../../theme'
import styles from './descriptionlist.module.css'

export type DescriptionListLayout = 'inline' | 'stacked'

export type DescriptionListVariant = 'default' | 'unstyled'

export interface DescriptionListOwnProps {
  /**
   * Where the details go. `stacked` puts each one under its term, and `inline` puts the terms in
   * a column on the left, as wide as the longest one, and the details beside them.
   *
   * @since 1.2
   * @default 'stacked'
   */
  layout?: DescriptionListLayout
  /**
   * Size of the text and of the space between the terms.
   *
   * @since 1.2
   * @default 'md'
   */
  size?: Size
  /**
   * `unstyled` drops the Loica styles, so you can lay the terms out yourself. The `data-*`
   * attributes stay.
   *
   * @since 1.2
   * @default 'default'
   */
  variant?: DescriptionListVariant
}

export type DescriptionListProps = ComponentPropsWithoutRef<'dl'> & DescriptionListOwnProps

/**
 * A list of terms and their details, on the native `dl`: the fields of a record, the facts of a
 * project. Write a `DescriptionTerm` followed by its `DescriptionDetails`, as direct children.
 *
 * @since 1.2
 */
export const DescriptionList = forwardRef<HTMLDListElement, DescriptionListProps>(
  (
    { className, layout = 'stacked', size = 'md', variant = 'default', ...rest }: DescriptionListProps,
    ref: ForwardedRef<HTMLDListElement>,
  ) => {
    const isStyled = variant !== 'unstyled'
    return (
      <dl
        className={joinClasses(isStyled && styles.descriptionlist, className)}
        data-layout={layout}
        data-loica-descriptionlist=""
        data-size={size}
        ref={ref}
        {...rest}
      />
    )
  },
)

DescriptionList.displayName = 'DescriptionList'
