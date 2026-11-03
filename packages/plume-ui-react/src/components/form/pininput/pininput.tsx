'use client'

import type { ComponentPropsWithoutRef, CSSProperties, ForwardedRef, ReactNode } from 'react'
import { forwardRef, useEffect, useMemo } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { useLabels } from '../../../locale/locale-provider'
import type { ColorScheme, Shape, Size } from '../../../theme'
import { schemeVar } from '../../../theme'
import { useFieldContext } from '../field/field-context'
import { PinInputCell } from './pininput-cell'
import type { PinInputType } from './pin-utils'
import styles from './pininput.module.css'
import { usePinInput } from './use-pin-input'

export interface PinInputLabels {
  input: (index: number, length: number) => string
}

export type PinInputVariant = 'outline' | 'filled' | 'underline' | 'unstyled'

export interface PinInputOwnProps {
  /**
   * Native `autocomplete` of the boxes. `one-time-code` lets a phone suggest the code from an SMS; use `off` for a PIN.
   *
   * @default 'one-time-code'
   */
  autoComplete?: string
  /**
   * Gives the focus to the first box when the component mounts. It is `autoFocus` with another name: moving the focus on its own is only right on a screen that exists to enter the code.
   *
   * @default false
   */
  focusOnMount?: boolean
  /**
   * Color scheme for the focus ring, from the theme palette (custom schemes included).
   *
   * @default 'secondary'
   */
  colorScheme?: ColorScheme
  /** The code the boxes start with, when it is not controlled. */
  defaultValue?: string
  /**
   * How many boxes, that is, how many characters the code has.
   *
   * @default 6
   */
  length?: number
  /**
   * Hides what is typed, as a password does. Use it for a PIN, not for a code that is sent to the user.
   *
   * @default false
   */
  mask?: boolean
  /** Name of the code in a form. It is submitted in a hidden input; the boxes have no name. */
  name?: string
  /** Called with the code when the last box is filled. */
  onComplete?: (value: string) => void
  /** Called with the code every time it changes, complete or not. */
  onValueChange?: (value: string) => void
  /** A character shown in the empty boxes, like `○`. */
  placeholder?: string
  /**
   * Corners of the boxes.
   *
   * @default 'rounded'
   */
  shape?: Shape
  /**
   * Makes the boxes read only: they keep the code and can be focused, but not edited.
   *
   * @default false
   */
  readOnly?: boolean
  /**
   * Marks the boxes as required for assistive technology.
   *
   * @default false
   */
  required?: boolean
  /**
   * Size of the boxes.
   *
   * @default 'md'
   */
  size?: Size
  /**
   * What the boxes accept: `numeric` digits (and asks the phone for the numeric keyboard), `alphanumeric` letters and digits, or `text` anything but spaces.
   *
   * @default 'numeric'
   */
  type?: PinInputType
  /**
   * The code. Makes the PinInput controlled: pass `onValueChange` to update it. The characters are always one after another, with no empty box in between.
   */
  value?: string
  /**
   * Visual variant of the boxes, the same as the `Input`. `unstyled` drops the Plume styles so you can bring your own; the row stays.
   *
   * @default 'outline'
   */
  variant?: PinInputVariant
}

export type PinInputProps = Omit<
  ComponentPropsWithoutRef<'fieldset'>,
  'children' | 'defaultValue' | 'name' | 'onChange' | 'placeholder'
> &
  PinInputOwnProps

const defaultLabels = (type: PinInputType): PinInputLabels => ({
  input: (index, length) => `${type === 'numeric' ? 'Digit' : 'Character'} ${index} of ${length}`,
})

export const PinInput = forwardRef<HTMLFieldSetElement, PinInputProps>(
  (
    {
      'aria-describedby': describedBy,
      'aria-invalid': ariaInvalid,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby,
      autoComplete = 'one-time-code',
      focusOnMount = false,
      className,
      colorScheme = 'secondary',
      defaultValue,
      disabled = false,
      id,
      length = 6,
      mask = false,
      name,
      onComplete,
      onValueChange,
      placeholder,
      readOnly = false,
      required = false,
      shape = 'rounded',
      size = 'md',
      style,
      type = 'numeric',
      value,
      variant = 'outline',
      ...rest
    }: PinInputProps,
    ref: ForwardedRef<HTMLFieldSetElement>,
  ): ReactNode => {
    const field = useFieldContext()
    const pin = usePinInput({
      focusOnMount,
      defaultValue,
      length,
      onComplete,
      onValueChange,
      readOnly,
      type,
      value,
    })
    const isStyled = variant !== 'unstyled'
    const invalid = ariaInvalid === true || ariaInvalid === 'true'
    const fieldLabel = field?.controlId === id ? field?.labelId : undefined
    const labelledBy = ariaLabelledby ?? (ariaLabel ? undefined : fieldLabel)
    const { cells, tabbable } = pin
    const defaults = useMemo(() => defaultLabels(type), [type])
    const text = useLabels('pinInput', defaults)
    const colorVars = {
      '--pininput-color': schemeVar(invalid ? 'error' : colorScheme, 'text'),
      ...style,
    } as CSSProperties
    const classes = joinClasses(
      isStyled && styles.pin,
      isStyled && styles[variant],
      isStyled && styles[size],
      isStyled && styles[shape],
      isStyled && invalid && styles.invalid,
      className,
    )
    useEffect(() => {
      const label = fieldLabel ? document.getElementById(fieldLabel) : null
      if (!label) return undefined
      const focus = (): void => cells.current[tabbable]?.focus()
      label.addEventListener('click', focus)
      return () => label.removeEventListener('click', focus)
    }, [cells, fieldLabel, tabbable])

    return (
      <fieldset
        aria-describedby={describedBy}
        aria-invalid={invalid || undefined}
        aria-label={ariaLabel}
        aria-labelledby={labelledBy}
        className={classes}
        data-disabled={disabled ? '' : undefined}
        data-invalid={invalid ? '' : undefined}
        data-plume-pininput=""
        data-readonly={readOnly ? '' : undefined}
        disabled={disabled}
        id={id}
        ref={ref}
        style={colorVars}
        {...rest}
      >
        {[...new Array(length).keys()].map((index) => (
          <PinInputCell
            autoComplete={autoComplete}
            disabled={disabled}
            index={index}
            invalid={invalid}
            isStyled={isStyled}
            key={index}
            label={text.input(index + 1, length)}
            mask={mask}
            pin={pin}
            placeholder={placeholder}
            readOnly={readOnly}
            required={required}
            type={type}
          />
        ))}
        {name ? (
          <input data-plume-pininput-hidden="" name={name} type="hidden" value={pin.value} />
        ) : null}
      </fieldset>
    )
  },
)

PinInput.displayName = 'PinInput'
