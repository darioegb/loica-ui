import { joinClasses } from '../../../overlay/class-names'
import type { Shape, Size } from '../../../theme'
import type { InputVariant } from './input-types'
import styles from './input.module.css'

interface InputFieldClassesOptions {
  className: string | undefined
  disabled: boolean
  invalid: boolean
  shape: Shape
  size: Size
  variant: InputVariant
}

export const inputFieldClasses = ({
  className,
  disabled,
  invalid,
  shape,
  size,
  variant,
}: InputFieldClassesOptions): string | undefined => {
  const isStyled = variant !== 'unstyled'
  return joinClasses(
    isStyled && styles[size],
    isStyled && styles[shape],
    isStyled && styles[variant],
    isStyled && disabled && styles.disabled,
    isStyled && invalid && styles.invalid,
    className,
  )
}

export const stateAttributes = (
  disabled: boolean,
  invalid: boolean,
): { 'data-disabled'?: string; 'data-invalid'?: string } => ({
  'data-disabled': disabled ? '' : undefined,
  'data-invalid': invalid ? '' : undefined,
})
