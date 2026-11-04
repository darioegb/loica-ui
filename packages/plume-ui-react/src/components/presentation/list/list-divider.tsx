import type { ForwardedRef, LiHTMLAttributes } from 'react'
import { forwardRef } from 'react'
import type { ComponentProps } from '../../../theme'

type ListDividerRootAttributes = Pick<LiHTMLAttributes<HTMLLIElement>, 'hidden' | 'id'>

export type ListDividerProps = Omit<ComponentProps, 'index'> & ListDividerRootAttributes

/**
 * A line between two items. It is presentational: it doesn't count as an item of the list. With the
 * `unstyled` variant it is an empty `<li>` for your classes to draw.
 */
export const ListDivider = forwardRef<HTMLLIElement, ListDividerProps>(
  ({ className, style, ...rest }: ListDividerProps, ref: ForwardedRef<HTMLLIElement>) => {
    return (
      <li
        aria-hidden="true"
        className={className}
        data-plume-list-divider=""
        ref={ref}
        style={style}
        {...rest}
      />
    )
  },
)

ListDivider.displayName = 'ListDivider'
