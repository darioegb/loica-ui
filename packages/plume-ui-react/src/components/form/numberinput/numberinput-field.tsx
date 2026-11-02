'use client'

import type { ForwardedRef, InputHTMLAttributes, ReactNode, RefObject } from 'react'
import { forwardRef, useMemo } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { mergeRefs } from '../../../overlay/trigger'
import styles from './numberinput.module.css'
import type { NumberInputState } from './use-number-input'

interface NumberInputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  disabled: boolean
  inputRef: RefObject<HTMLInputElement | null>
  invalid: boolean
  isStyled: boolean
  max: number | undefined
  min: number | undefined
  number: NumberInputState
  precision: number | undefined
  readOnly: boolean
}

export const NumberInputField = forwardRef<HTMLInputElement, NumberInputFieldProps>(
  (
    {
      disabled,
      inputRef,
      invalid,
      isStyled,
      max,
      min,
      number,
      onBlur,
      onKeyDown,
      precision,
      readOnly,
      ...rest
    }: NumberInputFieldProps,
    ref: ForwardedRef<HTMLInputElement>,
  ): ReactNode => {
    const setRef = useMemo(() => mergeRefs<HTMLInputElement>(inputRef, ref), [inputRef, ref])

    return (
      <input
        aria-readonly={readOnly || undefined}
        aria-valuemax={max}
        aria-valuemin={min}
        aria-valuenow={number.value ?? undefined}
        aria-valuetext={number.valueText}
        autoComplete="off"
        className={joinClasses(isStyled && styles.input)}
        data-disabled={disabled ? '' : undefined}
        data-invalid={invalid ? '' : undefined}
        data-plume-numberinput-field=""
        disabled={disabled}
        inputMode={precision === 0 ? 'numeric' : 'decimal'}
        onChange={(event) => number.onTextChange(event.target.value)}
        readOnly={readOnly}
        ref={setRef}
        role="spinbutton"
        type="text"
        value={number.display}
        {...rest}
        onBlur={(event) => {
          number.commit()
          onBlur?.(event)
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event)
          if (!event.defaultPrevented) number.onKeyDown(event)
        }}
      />
    )
  },
)

NumberInputField.displayName = 'NumberInputField'
