'use client'

import type { ReactNode } from 'react'
import { itemState } from './rating-types'
import type { RatingLabels } from './rating-types'
import styles from './rating.module.css'

interface RatingItemProps {
  allowHalf: boolean
  clearable: boolean
  emptyIcon: ReactNode
  filledIcon: ReactNode
  isStyled: boolean
  labels: RatingLabels
  max: number
  name: string
  position: number
  readOnly: boolean
  setHover: (value: number | undefined) => void
  setValue: (value: number) => void
  shown: number
  value: number
}

type RatingRadioProps = Pick<
  RatingItemProps,
  'clearable' | 'isStyled' | 'labels' | 'max' | 'name' | 'position' | 'setHover' | 'setValue' | 'value'
> & {
  half: 'end' | 'start' | undefined
  option: number
}

function RatingRadio({
  clearable,
  half,
  isStyled,
  labels,
  max,
  name,
  option,
  setHover,
  setValue,
  value,
}: Readonly<RatingRadioProps>): ReactNode {
  return (
    <input
      aria-label={labels.item(option, max)}
      checked={value === option}
      className={isStyled ? styles.radio : undefined}
      data-half={half}
      data-plume-rating-radio=""
      name={name}
      onChange={() => setValue(option)}
      onClick={() => {
        if (clearable && value === option) setValue(0)
      }}
      onKeyDown={(event) => {
        if (clearable && (event.key === 'Backspace' || event.key === 'Delete')) {
          event.preventDefault()
          setValue(0)
        }
      }}
      onPointerEnter={() => setHover(option)}
      type="radio"
      value={option}
    />
  )
}

export function RatingItem({
  allowHalf,
  emptyIcon,
  filledIcon,
  position,
  readOnly,
  shown,
  ...radio
}: Readonly<RatingItemProps>): ReactNode {
  const { isStyled } = radio
  const options = allowHalf ? [position - 0.5, position] : [position]

  return (
    <span
      className={isStyled ? styles.item : undefined}
      data-plume-rating-item=""
      data-state={itemState(position, shown)}
    >
      <span
        aria-hidden="true"
        className={isStyled ? styles.empty : undefined}
        data-plume-rating-empty=""
      >
        {emptyIcon}
      </span>
      <span
        aria-hidden="true"
        className={isStyled ? styles.filled : undefined}
        data-plume-rating-filled=""
      >
        {filledIcon}
      </span>
      {readOnly
        ? null
        : options.map((option) => (
            <RatingRadio
              {...radio}
              half={allowHalf ? (option === position ? 'end' : 'start') : undefined}
              key={option}
              option={option}
              position={position}
            />
          ))}
    </span>
  )
}
