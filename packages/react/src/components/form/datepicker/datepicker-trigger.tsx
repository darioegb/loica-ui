'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { CalendarIcon } from '../../../overlay/icons'
import type { ComponentProps } from '../../../theme'
import { InputSlot } from '../input/input-layout'
import { PickerTrigger } from '../shared/picker-trigger'
import { useDatePickerInputContext } from './datepicker-input-context'
import { useDatePickerContext } from './datepicker-context'

export interface DatePickerTriggerOwnProps {
  /**
   * Which side of the field the button goes on.
   *
   * @default 'after'
   */
  position?: 'after' | 'before'
}

export type DatePickerTriggerProps = Omit<ComponentProps, 'index'> &
  Pick<HTMLAttributes<HTMLButtonElement>, 'children'> &
  DatePickerTriggerOwnProps

/** The button that opens the calendar, inside a `DatePickerInput`. `children` replace the icon. */
export const DatePickerTrigger = forwardRef<HTMLButtonElement, DatePickerTriggerProps>(
  (
    { children, className, position = 'after', style }: DatePickerTriggerProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ): ReactNode => {
    const {
      calendarId,
      icon,
      labels,
      state: { modalOpen },
      variant,
    } = useDatePickerContext('DatePickerTrigger')
    const { disabled, onTriggerClick } = useDatePickerInputContext('DatePickerTrigger')

    return (
      <InputSlot isStyled={variant !== 'unstyled'} kind="element" position={position}>
        <PickerTrigger
          className={className}
          controls={calendarId}
          data-loica-datepicker-trigger=""
          disabled={disabled}
          icon={children ?? icon ?? <CalendarIcon />}
          label={labels.openCalendar}
          onClick={onTriggerClick}
          open={modalOpen}
          ref={ref}
          style={style}
          unstyled={variant === 'unstyled'}
        />
      </InputSlot>
    )
  },
)

DatePickerTrigger.displayName = 'DatePickerTrigger'
