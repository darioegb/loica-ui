import type { ForwardedRef, HTMLAttributes } from 'react'
import { forwardRef } from 'react'
import type { ComponentProps } from '../../../theme'

type CardFooterRootAttributes = Pick<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'hidden' | 'id' | 'title'
>

export type CardFooterProps = Omit<ComponentProps, 'index'> & CardFooterRootAttributes

/** A row for actions. */
export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ children, className, style, ...rest }: CardFooterProps, ref: ForwardedRef<HTMLDivElement>) => {
    return (
      <div
        className={className}
        data-loica-card-footer=""
        ref={ref}
        style={style}
        {...rest}
      >
        {children}
      </div>
    )
  },
)

CardFooter.displayName = 'CardFooter'
