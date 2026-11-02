import type { CSSProperties, ReactNode } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import styles from './input.module.css'

interface InputSlotProps {
  children: ReactNode
  isStyled: boolean
  kind: 'addon' | 'element'
  position: 'after' | 'before'
}

function InputSlot({ children, isStyled, kind, position }: Readonly<InputSlotProps>): ReactNode {
  const base = kind === 'addon' ? styles.addOn : styles.element
  const side =
    kind === 'addon'
      ? styles[position === 'before' ? 'addOnBefore' : 'addOnAfter']
      : styles[position === 'before' ? 'elementBefore' : 'elementAfter']

  return (
    <span
      className={joinClasses(isStyled && base, isStyled && side)}
      data-plume-input-addon={kind === 'addon' ? '' : undefined}
      data-plume-input-element={kind === 'element' ? '' : undefined}
      data-position={position}
    >
      {children}
    </span>
  )
}

interface InputLayoutProps {
  addonAfter: ReactNode
  addonBefore: ReactNode
  className: string | undefined
  disabled: boolean
  elementAfter: ReactNode
  elementBefore: ReactNode
  field: ReactNode
  invalid: boolean
  isStyled: boolean
  reveal: ReactNode
  style: CSSProperties
}

export function InputLayout({
  addonAfter,
  addonBefore,
  className,
  disabled,
  elementAfter,
  elementBefore,
  field,
  invalid,
  isStyled,
  reveal,
  style,
}: Readonly<InputLayoutProps>): ReactNode {
  return (
    <div
      className={joinClasses(isStyled && styles.inputGroup, className)}
      data-disabled={disabled ? '' : undefined}
      data-invalid={invalid ? '' : undefined}
      data-plume-input-group=""
      style={style}
    >
      {addonBefore ? (
        <InputSlot isStyled={isStyled} kind="addon" position="before">
          {addonBefore}
        </InputSlot>
      ) : null}
      <div className={isStyled ? styles.control : undefined} data-plume-input-control="">
        {elementBefore ? (
          <InputSlot isStyled={isStyled} kind="element" position="before">
            {elementBefore}
          </InputSlot>
        ) : null}
        {field}
        {elementAfter ? (
          <InputSlot isStyled={isStyled} kind="element" position="after">
            {elementAfter}
          </InputSlot>
        ) : null}
        {reveal}
      </div>
      {addonAfter ? (
        <InputSlot isStyled={isStyled} kind="addon" position="after">
          {addonAfter}
        </InputSlot>
      ) : null}
    </div>
  )
}
