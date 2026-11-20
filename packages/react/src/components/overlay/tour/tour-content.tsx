'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { useTourContext } from './tour-context'
import styles from './tour.module.css'

export type TourContentProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'>

/**
 * The `content` of the step, which describes the panel. It renders nothing when the step has none.
 * @since 1.4
 */
export const TourContent = forwardRef<HTMLDivElement, TourContentProps>(
  ({ className, ...rest }: TourContentProps, ref: ForwardedRef<HTMLDivElement>): ReactNode => {
    const { baseId, isStyled, step } = useTourContext('TourContent')
    if (!step.content) return null

    return (
      <div
        {...rest}
        className={joinClasses(isStyled && styles.content, className)}
        data-loica-tour-content=""
        id={`${baseId}-content`}
        ref={ref}
      >
        {step.content}
      </div>
    )
  },
)

TourContent.displayName = 'TourContent'
