import type { ComponentPropsWithoutRef, ForwardedRef } from 'react'
import { forwardRef } from 'react'

export type DescriptionTermProps = ComponentPropsWithoutRef<'dt'>

/**
 * What a detail is about: the name of a field. It is a `dt`, in the muted color of the theme.
 *
 * @since 1.2
 */
export const DescriptionTerm = forwardRef<HTMLElement, DescriptionTermProps>(
  (props: DescriptionTermProps, ref: ForwardedRef<HTMLElement>) => (
    <dt data-loica-description-term="" ref={ref} {...props} />
  ),
)

DescriptionTerm.displayName = 'DescriptionTerm'
