'use client'

import type { ReactNode, RefObject } from 'react'
import { MinusIcon, PlusIcon } from '../../../overlay/icons'
import styles from './numberinput.module.css'
import { useHoldRepeat } from './use-hold-repeat'
import type { NumberInputState } from './use-number-input'

interface NumberInputStepperProps {
  direction: 1 | -1
  disabled: boolean
  inputRef: RefObject<HTMLInputElement | null>
  isStyled: boolean
  label: string
  number: NumberInputState
}

export function NumberInputStepper({
  direction,
  disabled,
  inputRef,
  isStyled,
  label,
  number,
}: Readonly<NumberInputStepperProps>): ReactNode {
  const canStep = direction === 1 ? number.canIncrement : number.canDecrement
  const isDisabled = disabled || !canStep
  const hold = useHoldRepeat(() => {
    inputRef.current?.focus()
    number.stepBy(direction)
  }, !isDisabled)

  return (
    <button
      aria-label={label}
      className={isStyled ? styles.stepper : undefined}
      data-disabled={isDisabled ? '' : undefined}
      data-loica-numberinput-stepper={direction === 1 ? 'increment' : 'decrement'}
      disabled={isDisabled}
      onMouseDown={(event) => event.preventDefault()}
      tabIndex={-1}
      type="button"
      {...hold}
    >
      {direction === 1 ? <PlusIcon /> : <MinusIcon />}
    </button>
  )
}
