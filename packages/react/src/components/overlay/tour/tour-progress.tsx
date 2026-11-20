'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { useTourContext } from './tour-context'
import styles from './tour.module.css'

export type TourProgressProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'>

/**
 * The progress, such as `Step 2 of 5`, from the `progress` text of the `LocaleProvider`.
 * @since 1.4
 */
export const TourProgress = forwardRef<HTMLSpanElement, TourProgressProps>(
  ({ className, ...rest }: TourProgressProps, ref: ForwardedRef<HTMLSpanElement>): ReactNode => {
    const { index, isStyled, labels, steps } = useTourContext('TourProgress')

    return (
      <span
        {...rest}
        className={joinClasses(isStyled && styles.progress, className)}
        data-loica-tour-progress=""
        ref={ref}
      >
        {labels.progress(index + 1, steps.length)}
      </span>
    )
  },
)

TourProgress.displayName = 'TourProgress'
