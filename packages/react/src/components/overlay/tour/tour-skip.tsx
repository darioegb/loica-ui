'use client'

import type { ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import type { ButtonProps } from '../../interaction/button'
import { TourButton } from './tour-button'
import { useTourContext } from './tour-context'

export type TourSkipProps = ButtonProps

/**
 * Closes the tour with the reason `skip`, with the `skip` text of the `LocaleProvider` unless it has children. It
 * renders nothing on the last step, which has `done`.
 * @since 1.4
 */
export const TourSkip = forwardRef<HTMLButtonElement, TourSkipProps>(
  (props: TourSkipProps, ref: ForwardedRef<HTMLButtonElement>): ReactNode => {
    const { isLast, labels, onClose } = useTourContext('TourSkip')
    if (isLast) return null

    return (
      <TourButton
        data-loica-tour-skip=""
        {...props}
        action={() => onClose('skip')}
        defaultVariant="ghost"
        label={labels.skip}
        ref={ref}
      />
    )
  },
)

TourSkip.displayName = 'TourSkip'
