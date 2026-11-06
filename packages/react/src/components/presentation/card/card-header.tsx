import type { ForwardedRef, HTMLAttributes } from 'react'
import { forwardRef } from 'react'
import type { ComponentProps } from '../../../theme'

type CardHeaderRootAttributes = Pick<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'hidden' | 'id' | 'title'
>

export type CardHeaderProps = Omit<ComponentProps, 'index'> & CardHeaderRootAttributes

/** The title area, in a larger and bolder type. */
export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ children, className, style, ...rest }: CardHeaderProps, ref: ForwardedRef<HTMLDivElement>) => {
    return (
      <div
        className={className}
        data-loica-card-header=""
        ref={ref}
        style={style}
        {...rest}
      >
        {children}
      </div>
    )
  },
)

CardHeader.displayName = 'CardHeader'
