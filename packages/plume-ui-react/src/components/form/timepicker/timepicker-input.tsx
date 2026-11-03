'use client'

import type { ForwardedRef, InputHTMLAttributes, ReactNode } from 'react'
import { forwardRef, useId, useMemo } from 'react'
import type { ComponentProps } from '../../../theme'
import { hasPart } from '../../../overlay/has-part'
import { mergeRefs } from '../../../overlay/trigger'
import { InputLayout } from '../input/input-layout'
import { inputColorVars } from '../input/input-types'
import { useShallowStable } from '../shared/use-shallow-stable'
import { TimePickerField } from './timepicker-field'
import { TimePickerFormatHint } from './timepicker-format-hint'
import { TimePickerInputContext } from './timepicker-input-context'
import { TimePickerTrigger } from './timepicker-trigger'
import { useTimePickerContext } from './timepicker-context'
import { useTimeText } from './use-time-text'

export type TimePickerRootAttributes = Pick<
  InputHTMLAttributes<HTMLInputElement>,
  | 'aria-describedby'
  | 'aria-invalid'
  | 'aria-label'
  | 'aria-labelledby'
  | 'disabled'
  | 'id'
  | 'name'
  | 'placeholder'
  | 'readOnly'
  | 'required'
>

export interface TimePickerInputOwnProps {
  /**
   * The parts to show instead of the default field and button: a `TimePickerField` and a `TimePickerTrigger`, in the order you want. A `TimePickerFormatHint` among them takes the place of the default one.
   */
  children?: ReactNode
  /** Called with the current value when the input loses focus, after applying the typed text. */
  onBlur?: (value: string) => void
}

export type TimePickerInputProps = Omit<ComponentProps, 'index' | 'style'> &
  TimePickerRootAttributes &
  TimePickerInputOwnProps

const TIME_MASK = '##:##'

/**
 * The field and the button that opens the panel. Given children, compose `TimePickerField` and
 * `TimePickerTrigger` in any order. Its `ref` goes to the native `<input>`. It renders nothing when the
 * picker is `panel`.
 */
export const TimePickerInput = forwardRef<HTMLInputElement, TimePickerInputProps>(
  (
    {
      children,
      className,
      disabled = false,
      onBlur,
      placeholder,
      readOnly,
      ...rest
    }: TimePickerInputProps,
    ref: ForwardedRef<HTMLInputElement>,
  ): ReactNode => {
    const {
      colorScheme,
      hour12,
      inputRef,
      isPanel,
      labels,
      setInput,
      setValue,
      shape,
      size,
      value,
      variant,
    } = useTimePickerContext('TimePickerInput')
    const { commit, handleChange, text } = useTimeText({ hour12, labels, setValue, value })
    const hintId = useId()
    const format = placeholder ?? labels.placeholder(hour12 ? labels.am : undefined)
    const setRef = useMemo(() => mergeRefs(setInput, inputRef, ref), [inputRef, ref, setInput])
    const stableRest = useShallowStable(rest)
    const describedBy = [rest['aria-describedby'], hintId].filter(Boolean).join(' ')
    const fieldProps = useMemo(
      () => ({
        ...stableRest,
        'aria-describedby': describedBy,
        autoComplete: 'off',
        'data-plume-timepicker-input': '',
        disabled,
        inputMode: 'numeric' as const,
        mask: hour12 ? undefined : TIME_MASK,
        onBlur: () => {
          const committed = commit()
          onBlur?.(committed)
        },
        onChange: handleChange,
        placeholder: format,
        readOnly,
        shape,
        size,
        type: 'text',
        value: text,
        variant,
      }),
      [
        commit,
        describedBy,
        disabled,
        format,
        handleChange,
        hour12,
        onBlur,
        readOnly,
        shape,
        size,
        stableRest,
        text,
        variant,
      ],
    )
    const inputContext = useMemo(
      () => ({
        blocked: disabled || Boolean(readOnly),
        fieldProps,
        hint: labels.format(format),
        hintId,
        setRef,
      }),
      [disabled, fieldProps, format, hintId, labels, readOnly, setRef],
    )

    if (isPanel) return null

    const invalid = rest['aria-invalid'] === true || rest['aria-invalid'] === 'true'

    return (
      <TimePickerInputContext.Provider value={inputContext}>
        <InputLayout
          addonAfter={null}
          addonBefore={null}
          className={className}
          disabled={disabled}
          elementAfter={null}
          elementBefore={null}
          field={
            children ?? (
              <>
                <TimePickerField />
                <TimePickerTrigger />
              </>
            )
          }
          invalid={invalid}
          isStyled={variant !== 'unstyled'}
          reveal={null}
          style={inputColorVars(invalid ? 'error' : colorScheme)}
        />
        {hasPart(children, [TimePickerFormatHint]) ? null : <TimePickerFormatHint />}
      </TimePickerInputContext.Provider>
    )
  },
)

TimePickerInput.displayName = 'TimePickerInput'
