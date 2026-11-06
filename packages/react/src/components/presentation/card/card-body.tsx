import type { ForwardedRef, HTMLAttributes } from 'react'
import { forwardRef } from 'react'
import type { ComponentProps } from '../../../theme'

type CardBodyRootAttributes = Pick<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'hidden' | 'id' | 'title'
>

export type CardBodyProps = Omit<ComponentProps, 'index'> & CardBodyRootAttributes

/** The content, which takes the free space of the Card. */
export const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
  ({ children, className, style, ...rest }: CardBodyProps, ref: ForwardedRef<HTMLDivElement>) => {
    return (
      <div
        className={className}
        data-loica-card-body=""
        ref={ref}
        style={style}
        {...rest}
      >
        {children}
      </div>
    )
  },
)

CardBody.displayName = 'CardBody'
