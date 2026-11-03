'use client'

import type { ChangeEvent } from 'react'
import { useMemo } from 'react'
import type { Shape, Size } from '../../../theme'
import type { InputFieldProps } from '../input/input-field'
import { useShallowStable } from '../shared/use-shallow-stable'
import type { DatePickerRootAttributes, DatePickerVariant } from './datepicker-types'

interface DatePickerFieldPropsOptions {
  describedBy: string
  disabled: boolean
  mask: string
  onBlur: () => void
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  placeholder: string
  readOnly: boolean | undefined
  rest: DatePickerRootAttributes
  shape: Shape | undefined
  size: Size | undefined
  value: string
  variant: DatePickerVariant
}

export function useDatePickerFieldProps({
  describedBy,
  disabled,
  mask,
  onBlur,
  onChange,
  placeholder,
  readOnly,
  rest,
  shape,
  size,
  value,
  variant,
}: Readonly<DatePickerFieldPropsOptions>): InputFieldProps {
  const stableRest = useShallowStable(rest)

  return useMemo(
    () => ({
      autoComplete: 'off',
      'data-plume-datepicker-input': '',
      disabled,
      inputMode: 'numeric',
      mask,
      onBlur,
      onChange,
      placeholder,
      readOnly,
      shape,
      size,
      type: 'text',
      value,
      variant,
      ...stableRest,
      'aria-describedby': describedBy,
    }),
    [
      describedBy,
      disabled,
      mask,
      onBlur,
      onChange,
      placeholder,
      readOnly,
      shape,
      size,
      stableRest,
      value,
      variant,
    ],
  )
}
