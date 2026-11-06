'use client'

import type { ChangeEvent, ReactNode } from 'react'
import { useMemo } from 'react'
import { mergeRefs } from '../../../overlay/trigger'
import type { SliderState } from './slider-types'
import styles from './slider.module.css'

interface SliderThumbProps {
  index: number
  state: SliderState
}

export function SliderThumb({ index, state }: Readonly<SliderThumbProps>): ReactNode {
  const { inputs, rootRef } = state
  const setRef = useMemo(
    () =>
      mergeRefs<HTMLInputElement>(index === 0 ? rootRef : undefined, (node) => {
        inputs.current[index] = node
      }),
    [index, inputs, rootRef],
  )
  const current = state.values[index]
  if (current === undefined) return null

  const { ariaLabel, isRange, labelledBy, readOnly } = state

  return (
    <input
      aria-describedby={state.describedBy}
      aria-invalid={state.isInvalid || undefined}
      aria-label={isRange ? state.text.thumb(index) : ariaLabel}
      aria-labelledby={isRange ? undefined : labelledBy}
      aria-orientation={state.orientation === 'vertical' ? 'vertical' : undefined}
      aria-readonly={readOnly || undefined}
      aria-valuetext={state.formatValue?.(current)}
      className={state.isStyled ? styles.thumb : undefined}
      data-front={index === 0 && (state.fractions[0] ?? 0) > 0.5 ? '' : undefined}
      data-loica-slider-thumb=""
      disabled={state.disabled}
      id={index === 0 ? state.firstId : `${state.firstId}-${index}`}
      max={state.max}
      min={state.min}
      name={state.name}
      onChange={(event: ChangeEvent<HTMLInputElement>) => {
        if (!readOnly) state.update(index, Number(event.target.value))
      }}
      onKeyUp={state.commit}
      onPointerUp={state.commit}
      ref={setRef}
      step={state.step}
      type="range"
      value={current}
    />
  )
}
