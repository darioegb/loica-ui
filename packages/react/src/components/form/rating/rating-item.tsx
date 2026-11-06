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
      data-loica-rating-radio=""
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

const halfOf = (
  allowHalf: boolean,
  option: number,
  position: number,
): 'end' | 'start' | undefined => {
  if (!allowHalf) return undefined
  return option === position ? 'end' : 'start'
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
      data-loica-rating-item=""
      data-state={itemState(position, shown)}
    >
      <span
        aria-hidden="true"
        className={isStyled ? styles.empty : undefined}
        data-loica-rating-empty=""
      >
        {emptyIcon}
      </span>
      <span
        aria-hidden="true"
        className={isStyled ? styles.filled : undefined}
        data-loica-rating-filled=""
      >
        {filledIcon}
      </span>
      {readOnly
        ? null
        : options.map((option) => (
            <RatingRadio
              {...radio}
              half={halfOf(allowHalf, option, position)}
              key={option}
              option={option}
              position={position}
            />
          ))}
    </span>
  )
}
