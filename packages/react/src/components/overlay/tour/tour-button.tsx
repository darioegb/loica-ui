'use client'

import type { ForwardedRef, MouseEvent, ReactNode } from 'react'
import { forwardRef } from 'react'
import { Button, type ButtonProps } from '../../interaction/button'
import { useTourContext } from './tour-context'

interface TourButtonProps extends ButtonProps {
  action: () => void
  defaultVariant: NonNullable<ButtonProps['variant']>
  label: string
}

export const TourButton = forwardRef<HTMLButtonElement, TourButtonProps>(
  (
    { action, children, defaultVariant, label, onClick, variant, ...rest }: TourButtonProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ): ReactNode => {
    const { isStyled } = useTourContext('TourButton')
    const handleClick = (event: MouseEvent<HTMLButtonElement>): void => {
      onClick?.(event)
      if (!event.defaultPrevented) action()
    }

    return (
      <Button
        size="sm"
        {...rest}
        onClick={handleClick}
        ref={ref}
        variant={variant ?? (isStyled ? defaultVariant : 'unstyled')}
      >
        {children ?? label}
      </Button>
    )
  },
)

TourButton.displayName = 'TourButton'
