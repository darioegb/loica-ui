import type { ComponentPropsWithoutRef, ForwardedRef } from 'react'
import { forwardRef } from 'react'

export type DescriptionDetailsProps = ComponentPropsWithoutRef<'dd'>

/**
 * The value of a term: text, a badge, an avatar, anything. It is a `dd`, and has no margin of its own.
 *
 * @since 1.2
 */
export const DescriptionDetails = forwardRef<HTMLElement, DescriptionDetailsProps>(
  (props: DescriptionDetailsProps, ref: ForwardedRef<HTMLElement>) => (
    <dd data-loica-description-details="" ref={ref} {...props} />
  ),
)

DescriptionDetails.displayName = 'DescriptionDetails'
