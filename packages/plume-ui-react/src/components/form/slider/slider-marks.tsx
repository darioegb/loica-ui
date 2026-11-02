import type { CSSProperties, ReactNode } from 'react'
import { fractionOf } from './slider-math'
import type { SliderState } from './slider-types'
import styles from './slider.module.css'

interface SliderMarksProps {
  state: SliderState
}

export function SliderMarks({ state }: Readonly<SliderMarksProps>): ReactNode {
  const { isStyled, marks, max, min, values } = state
  if (marks.length === 0) return null

  const lower = values.length > 1 ? Math.min(...values) : min
  const upper = Math.max(...values)

  return (
    <span
      aria-hidden="true"
      className={isStyled ? styles.marks : undefined}
      data-plume-slider-marks=""
    >
      {marks.map((mark) => (
        <span
          className={isStyled ? styles.mark : undefined}
          data-active={mark.value > lower && mark.value < upper ? '' : undefined}
          data-edge={mark.value <= min || mark.value >= max ? '' : undefined}
          data-plume-slider-mark-item=""
          key={mark.value}
          style={{ '--slider-mark': fractionOf(mark.value, min, max) } as CSSProperties}
        >
          {mark.label === undefined ? null : (
            <span
              className={isStyled ? styles.markLabel : undefined}
              data-plume-slider-mark-label=""
            >
              {mark.label}
            </span>
          )}
        </span>
      ))}
    </span>
  )
}
