import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { hasPart } from '../../../overlay/has-part'
import type { ComponentProps } from '../../../theme'
import { ListItemTextPrimary } from './list-item-text-primary'
import { ListItemTextSecondary } from './list-item-text-secondary'

export interface ListItemTextOwnProps {
  /**
   * Main text of the row, rendered in a `ListItemTextPrimary`. It falls back to `children`.
   */
  primary?: ReactNode
  /** Smaller text under the main one, rendered in a `ListItemTextSecondary`. */
  secondary?: ReactNode
}

type ListItemTextRootAttributes = Pick<HTMLAttributes<HTMLDivElement>, 'children' | 'hidden' | 'id'>

export type ListItemTextProps = Omit<ComponentProps, 'index'> &
  ListItemTextRootAttributes &
  ListItemTextOwnProps

/**
 * The text of the row. With `primary` and `secondary` it renders a `ListItemTextPrimary` and a
 * `ListItemTextSecondary`; with those two as `children` it renders them instead.
 */
export const ListItemText = forwardRef<HTMLDivElement, ListItemTextProps>(
  (
    { children, className, primary, secondary, style, ...rest }: ListItemTextProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    const main = primary ?? children

    return (
      <div
        className={className}
        data-loica-list-item-text=""
        ref={ref}
        style={style}
        {...rest}
      >
        {hasPart(children, [ListItemTextPrimary, ListItemTextSecondary]) ? (
          children
        ) : (
          <>
            {main ? <ListItemTextPrimary>{main}</ListItemTextPrimary> : null}
            {secondary ? <ListItemTextSecondary>{secondary}</ListItemTextSecondary> : null}
          </>
        )}
      </div>
    )
  },
)

ListItemText.displayName = 'ListItemText'
