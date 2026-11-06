'use client'

import type { HTMLInputTypeAttribute, ReactNode } from 'react'
import { useCallback, useState } from 'react'
import { EyeIcon, EyeOffIcon } from '../../../overlay/icons'
import styles from './input.module.css'

interface InputRevealButtonProps {
  disabled: boolean
  isStyled: boolean
  label: string
  onToggle: () => void
  revealed: boolean
}

export function InputRevealButton({
  disabled,
  isStyled,
  label,
  onToggle,
  revealed,
}: Readonly<InputRevealButtonProps>): ReactNode {
  return (
    <button
      aria-label={label}
      aria-pressed={revealed}
      className={isStyled ? styles.reveal : undefined}
      data-disabled={disabled ? '' : undefined}
      data-loica-input-reveal=""
      data-revealed={revealed ? '' : undefined}
      disabled={disabled}
      onClick={onToggle}
      type="button"
    >
      {revealed ? <EyeOffIcon /> : <EyeIcon />}
    </button>
  )
}

interface PasswordReveal {
  canReveal: boolean
  revealed: boolean
  toggle: () => void
}

export function usePasswordReveal(
  type: HTMLInputTypeAttribute,
  revealable: boolean,
): PasswordReveal {
  const [revealed, setRevealed] = useState(false)
  return {
    canReveal: revealable && type === 'password',
    revealed,
    toggle: useCallback(() => setRevealed((current) => !current), []),
  }
}
