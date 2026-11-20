'use client'

import type { ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import type { ButtonProps } from '../../interaction/button'
import { TourButton } from './tour-button'
import { useTourContext } from './tour-context'

export type TourNextProps = ButtonProps

/**
 * Goes on to the next step, with the `next` text of the `LocaleProvider` unless it has children. On the last step it
 * says `done` and closes the tour.
 * @since 1.4
 */
export const TourNext = forwardRef<HTMLButtonElement, TourNextProps>(
  (props: TourNextProps, ref: ForwardedRef<HTMLButtonElement>): ReactNode => {
    const { colorScheme, isLast, labels, onNext } = useTourContext('TourNext')

    return (
      <TourButton
        colorScheme={colorScheme}
        data-loica-tour-next=""
        {...props}
        action={onNext}
        defaultVariant="solid"
        label={isLast ? labels.done : labels.next}
        ref={ref}
      />
    )
  },
)

TourNext.displayName = 'TourNext'
