import type { ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import { PaginatorEdge, type PaginatorEdgeProps } from './paginator-edge'

export type PaginatorPreviousProps = PaginatorEdgeProps

/** The button that goes to the previous page, or a link to it when the `Paginator` has `getHref`. */
export const PaginatorPrevious = forwardRef<HTMLButtonElement, PaginatorPreviousProps>(
  (props: PaginatorPreviousProps, ref: ForwardedRef<HTMLButtonElement>): ReactNode => (
    <PaginatorEdge
      {...props}
      data-loica-paginator-previous=""
      edge="previous"
      part="PaginatorPrevious"
      ref={ref}
    />
  ),
)

PaginatorPrevious.displayName = 'PaginatorPrevious'
