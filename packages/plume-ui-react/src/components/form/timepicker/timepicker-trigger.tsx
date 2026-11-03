'use client'

import type { ButtonHTMLAttributes, ForwardedRef, ReactNode } from 'react'
import { forwardRef, useContext } from 'react'
import { ClockIcon } from '../../../overlay/icons'
import type { ComponentProps } from '../../../theme'
import { InputSlot } from '../input/input-layout'
import { PickerTrigger } from '../shared/picker-trigger'
import { useTimePickerContext } from './timepicker-context'
import { TimePickerInputContext } from './timepicker-input-context'

export interface TimePickerTriggerOwnProps {
  /** Another icon for the button. */
  children?: ReactNode
  /**
   * Which side of the field the button goes on.
   *
   * @default 'after'
   */
  position?: 'after' | 'before'
}

type TimePickerTriggerRootAttributes = Pick<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'aria-label' | 'disabled' | 'id' | 'title'
>

export type TimePickerTriggerProps = Omit<ComponentProps, 'index'> &
  TimePickerTriggerRootAttributes &
  TimePickerTriggerOwnProps

/**
 * The button that opens and closes the panel. It is disabled with its `TimePickerInput`, or on its
 * own.
 */
export const TimePickerTrigger = forwardRef<HTMLButtonElement, TimePickerTriggerProps>(
  (
    {
      'aria-label': ariaLabel,
      children,
      className,
      disabled,
      id,
      position = 'after',
      style,
      title,
    }: TimePickerTriggerProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ): ReactNode => {
    const { icon, labels, open, panelId, toggle, variant } =
      useTimePickerContext('TimePickerTrigger')
    const input = useContext(TimePickerInputContext)
    const blocked = disabled ?? Boolean(input?.blocked)

    return (
      <InputSlot isStyled={variant !== 'unstyled'} kind="element" position={position}>
        <PickerTrigger
          className={className}
          controls={panelId}
          data-plume-timepicker-trigger=""
          disabled={blocked}
          icon={children ?? icon ?? <ClockIcon />}
          id={id}
          label={ariaLabel ?? labels.openTimePicker}
          onClick={toggle}
          open={open}
          ref={ref}
          style={style}
          title={title}
          unstyled={variant === 'unstyled'}
        />
      </InputSlot>
    )
  },
)

TimePickerTrigger.displayName = 'TimePickerTrigger'
