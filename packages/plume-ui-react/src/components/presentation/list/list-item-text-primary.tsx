import type { ForwardedRef, HTMLAttributes } from 'react'
import { forwardRef } from 'react'
import type { ComponentProps } from '../../../theme'

type ListItemTextPrimaryRootAttributes = Pick<
  HTMLAttributes<HTMLSpanElement>,
  'children' | 'hidden' | 'id'
>

export type ListItemTextPrimaryProps = Omit<ComponentProps, 'index'> &
  ListItemTextPrimaryRootAttributes

/** The main text of a `ListItemText`. */
export const ListItemTextPrimary = forwardRef<HTMLSpanElement, ListItemTextPrimaryProps>(
  (
    { children, className, style, ...rest }: ListItemTextPrimaryProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ) => {
    return (
      <span
        className={className}
        data-plume-list-item-text-primary=""
        ref={ref}
        style={style}
        {...rest}
      >
        {children}
      </span>
    )
  },
)

ListItemTextPrimary.displayName = 'ListItemTextPrimary'
