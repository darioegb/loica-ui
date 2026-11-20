'use client'

import type { ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import type { ButtonProps } from '../../interaction/button'
import { TourButton } from './tour-button'
import { useTourContext } from './tour-context'

export type TourPreviousProps = ButtonProps

/**
 * Goes back to the step before, with the `previous` text of the `LocaleProvider` unless it has children. It renders
 * nothing on the first step.
 * @since 1.4
 */
export const TourPrevious = forwardRef<HTMLButtonElement, TourPreviousProps>(
  (props: TourPreviousProps, ref: ForwardedRef<HTMLButtonElement>): ReactNode => {
    const { index, labels, onPrevious } = useTourContext('TourPrevious')
    if (index === 0) return null

    return (
      <TourButton
        data-loica-tour-previous=""
        {...props}
        action={onPrevious}
        defaultVariant="outline"
        label={labels.previous}
        ref={ref}
      />
    )
  },
)

TourPrevious.displayName = 'TourPrevious'
