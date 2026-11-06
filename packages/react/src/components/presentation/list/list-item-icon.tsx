import type { ForwardedRef, HTMLAttributes } from 'react'
import { forwardRef } from 'react'
import type { ComponentProps } from '../../../theme'

type ListItemIconRootAttributes = Pick<
  HTMLAttributes<HTMLSpanElement>,
  'children' | 'hidden' | 'id'
>

export type ListItemIconProps = Omit<ComponentProps, 'index'> & ListItemIconRootAttributes

/** An icon at the start of the row. It is hidden from screen readers. */
export const ListItemIcon = forwardRef<HTMLSpanElement, ListItemIconProps>(
  (
    { children, className, style, ...rest }: ListItemIconProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ) => {
    return (
      <span
        aria-hidden="true"
        className={className}
        data-loica-list-item-icon=""
        ref={ref}
        style={style}
        {...rest}
      >
        {children}
      </span>
    )
  },
)

ListItemIcon.displayName = 'ListItemIcon'
