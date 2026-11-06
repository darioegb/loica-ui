'use client'

import type { ForwardedRef, ReactNode } from 'react'
import { forwardRef, useMemo } from 'react'
import { mergeRefs } from '../../../overlay/trigger'
import { InputField, type InputFieldProps } from '../input/input-field'
import { useTimePickerInputContext } from './timepicker-input-context'

export type TimePickerFieldProps = InputFieldProps

/** The `<input>` inside a `TimePickerInput`. It takes the native props of an input. */
export const TimePickerField = forwardRef<HTMLInputElement, TimePickerFieldProps>(
  (props: TimePickerFieldProps, ref: ForwardedRef<HTMLInputElement>): ReactNode => {
    const { fieldProps, setRef } = useTimePickerInputContext('TimePickerField')
    const mergedRef = useMemo(() => mergeRefs(setRef, ref), [ref, setRef])

    return <InputField data-loica-timepicker-field="" {...fieldProps} {...props} ref={mergedRef} />
  },
)

TimePickerField.displayName = 'TimePickerField'
