'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { useTourContext } from './tour-context'
import styles from './tour.module.css'

export type TourTitleProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'>

/**
 * The `title` of the step, which names the panel.
 * @since 1.4
 */
export const TourTitle = forwardRef<HTMLDivElement, TourTitleProps>(
  ({ className, ...rest }: TourTitleProps, ref: ForwardedRef<HTMLDivElement>): ReactNode => {
    const { baseId, isStyled, step } = useTourContext('TourTitle')

    return (
      <div
        {...rest}
        className={joinClasses(isStyled && styles.title, className)}
        data-loica-tour-title=""
        id={`${baseId}-title`}
        ref={ref}
      >
        {step.title}
      </div>
    )
  },
)

TourTitle.displayName = 'TourTitle'
