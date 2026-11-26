import type { ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import { PaginatorEdge, type PaginatorEdgeProps } from './paginator-edge'

export type PaginatorNextProps = PaginatorEdgeProps

/** The button that goes to the next page, or a link to it when the `Paginator` has `getHref`. */
export const PaginatorNext = forwardRef<HTMLButtonElement, PaginatorNextProps>(
  (props: PaginatorNextProps, ref: ForwardedRef<HTMLButtonElement>): ReactNode => (
    <PaginatorEdge
      {...props}
      data-loica-paginator-next=""
      edge="next"
      part="PaginatorNext"
      ref={ref}
    />
  ),
)

PaginatorNext.displayName = 'PaginatorNext'
