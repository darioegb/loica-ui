'use client'

import type { ReactNode } from 'react'
import { mergeRefs } from '../../../overlay/trigger'
import type { PinInputType } from './pin-utils'
import styles from './pininput.module.css'
import type { PinInputState } from './use-pin-input'

interface PinInputCellProps {
  autoComplete: string
  disabled: boolean
  index: number
  invalid: boolean
  isStyled: boolean
  label: string
  mask: boolean
  pin: PinInputState
  placeholder: string | undefined
  readOnly: boolean
  required: boolean
  type: PinInputType
}

export function PinInputCell({
  autoComplete,
  disabled,
  index,
  invalid,
  isStyled,
  label,
  mask,
  pin,
  placeholder,
  readOnly,
  required,
  type,
}: Readonly<PinInputCellProps>): ReactNode {
  return (
    <input
      aria-invalid={invalid || undefined}
      aria-label={label}
      aria-required={required || undefined}
      autoComplete={autoComplete}
      className={isStyled ? styles.cell : undefined}
      data-disabled={disabled ? '' : undefined}
      data-filled={pin.value[index] ? '' : undefined}
      data-invalid={invalid ? '' : undefined}
      data-loica-pininput-cell=""
      disabled={disabled}
      inputMode={type === 'numeric' ? 'numeric' : 'text'}
      onChange={(event) => pin.onChange(index, event.target.value)}
      onFocus={(event) => event.target.select()}
      onKeyDown={(event) => pin.onKeyDown(index, event)}
      onPaste={(event) => pin.onPaste(index, event)}
      placeholder={placeholder}
      readOnly={readOnly}
      ref={mergeRefs<HTMLInputElement>((element) => {
        pin.cells.current[index] = element
      })}
      tabIndex={index === pin.tabbable ? 0 : -1}
      type={mask ? 'password' : 'text'}
      value={pin.value[index] ?? ''}
    />
  )
}
