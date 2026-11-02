'use client'

import type { ComponentPropsWithoutRef, ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import type { ColorScheme, Shape, Size } from '../../../theme'
import { useMask } from '../../../hooks/use-mask'
import { useLabels } from '../../../locale/locale-provider'
import { InputLayout } from './input-layout'
import { InputRevealButton, usePasswordReveal } from './input-reveal'
import { inputFieldClasses, stateAttributes } from './input-styles'
import { inputColorVars } from './input-types'
import type { InputLabels, InputVariant } from './input-types'

export type { InputLabels, InputVariant } from './input-types'

const DEFAULT_LABELS: InputLabels = { reveal: 'Show password' }

export interface InputOwnProps {
  /** Content attached before the Input, outside its border (e.g. a URL prefix). */
  addonBefore?: ReactNode
  /** Content attached after the Input, outside its border (e.g. a domain suffix). */
  addonAfter?: ReactNode
  /** Element rendered inside the Input, before the text (e.g. an icon). */
  elementBefore?: ReactNode
  /** Element rendered inside the Input, after the text (e.g. an icon). */
  elementAfter?: ReactNode
  /**
   * Color scheme for the focus border and ring, from the theme palette (custom schemes included).
   *
   * @default 'secondary'
   */
  colorScheme?: ColorScheme
  /**
   * Optional input mask. `#` accepts a digit, `A` a letter and `*` a letter or digit; characters that do not fit are rejected. Any other character is a literal auto-inserted as the user types, and `\` escapes the next character (e.g. `##/##/####`, `(###) ###-####`, `AA-####`).
   */
  mask?: string
  /**
   * With `type="password"`, adds a button that shows or hides the password. It is a toggle button (`aria-pressed`) inside the Input, in the place of `elementAfter`; an `elementAfter` goes to its left. It has no effect with another type.
   *
   * @default false
   */
  revealable?: boolean
  /**
   * Shape style of the Input. `pill` only applies to the `outline` variant.
   *
   * @default 'rounded'
   */
  shape?: Shape
  /**
   * Size of the Input.
   *
   * @default 'md'
   */
  size?: Size
  /**
   * Visual style variant of the Input.
   *
   * @default 'outline'
   */
  variant?: InputVariant
}

export type InputProps = Omit<ComponentPropsWithoutRef<'input'>, 'children' | 'size'> & InputOwnProps

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      addonBefore,
      addonAfter,
      elementBefore,
      elementAfter,
      style,
      className,
      colorScheme = 'secondary',
      disabled = false,
      readOnly = false,
      revealable = false,
      shape = 'rounded',
      size = 'md',
      type = 'text',
      variant = 'outline',
      mask,
      value,
      defaultValue,
      onChange,
      ...rest
    }: InputProps,
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    const text = useLabels('input', DEFAULT_LABELS)
    const { canReveal, revealed, toggle } = usePasswordReveal(type, revealable)
    const invalid = rest['aria-invalid'] === true || rest['aria-invalid'] === 'true'
    const { value: maskedValue, onChange: maskedOnChange } = useMask({
      mask,
      value: typeof value === 'string' ? value : undefined,
      defaultValue: typeof defaultValue === 'string' ? defaultValue : undefined,
      onChange,
    })
    const isStyled = variant !== 'unstyled'
    const colorVars = {
      ...inputColorVars(invalid ? 'error' : colorScheme),
      ...style,
    }
    const hasGroup = Boolean(
      addonBefore || addonAfter || elementBefore || elementAfter || canReveal,
    )
    const field = (
      <input
        {...rest}
        {...stateAttributes(disabled, invalid)}
        className={inputFieldClasses({
          className: hasGroup ? undefined : className,
          disabled,
          invalid,
          shape,
          size,
          variant,
        })}
        data-plume-input-field=""
        defaultValue={mask ? undefined : defaultValue}
        disabled={disabled}
        onChange={maskedOnChange}
        readOnly={readOnly}
        ref={ref}
        style={hasGroup ? undefined : colorVars}
        type={revealed && type === 'password' ? 'text' : type}
        value={mask ? maskedValue : value}
      />
    )

    if (!hasGroup) return field

    return (
      <InputLayout
        addonAfter={addonAfter}
        addonBefore={addonBefore}
        className={className}
        disabled={disabled}
        elementAfter={elementAfter}
        elementBefore={elementBefore}
        field={field}
        invalid={invalid}
        isStyled={isStyled}
        reveal={
          canReveal ? (
            <InputRevealButton
              disabled={disabled}
              isStyled={isStyled}
              label={text.reveal}
              onToggle={toggle}
              revealed={revealed}
            />
          ) : null
        }
        style={colorVars}
      />
    )
  },
)

Input.displayName = 'Input'
