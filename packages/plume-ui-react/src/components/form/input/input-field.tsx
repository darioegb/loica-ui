'use client'

import type { ComponentPropsWithoutRef, ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import { useMask } from '../../../hooks/use-mask'
import type { Shape, Size } from '../../../theme'
import { inputFieldClasses, stateAttributes } from './input-styles'
import type { InputVariant } from './input-types'

export interface InputFieldOwnProps {
  /**
   * Optional input mask. `#` accepts a digit, `A` a letter and `*` a letter or digit; characters that do not fit are rejected. Any other character is a literal auto-inserted as the user types, and `\` escapes the next character.
   */
  mask?: string
  /**
   * Corners of the field.
   *
   * @default 'rounded'
   */
  shape?: Shape
  /**
   * Size of the field.
   *
   * @default 'md'
   */
  size?: Size
  /**
   * Visual variant of the field. `unstyled` drops the Plume styles so you can bring your own.
   *
   * @default 'outline'
   */
  variant?: InputVariant
}

export type InputFieldProps = Omit<ComponentPropsWithoutRef<'input'>, 'size'> & InputFieldOwnProps

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      className,
      defaultValue,
      disabled = false,
      mask,
      onChange,
      readOnly = false,
      shape = 'rounded',
      size = 'md',
      value,
      variant = 'outline',
      ...rest
    }: InputFieldProps,
    ref: ForwardedRef<HTMLInputElement>,
  ): ReactNode => {
    const invalid = rest['aria-invalid'] === true || rest['aria-invalid'] === 'true'
    const { value: maskedValue, onChange: maskedOnChange } = useMask({
      mask,
      value: typeof value === 'string' ? value : undefined,
      defaultValue: typeof defaultValue === 'string' ? defaultValue : undefined,
      onChange,
    })

    return (
      <input
        {...rest}
        {...stateAttributes(disabled, invalid)}
        className={inputFieldClasses({ className, disabled, invalid, shape, size, variant })}
        data-plume-input-field=""
        defaultValue={mask ? undefined : defaultValue}
        disabled={disabled}
        onChange={maskedOnChange}
        readOnly={readOnly}
        ref={ref}
        value={mask ? maskedValue : value}
      />
    )
  },
)

InputField.displayName = 'InputField'
