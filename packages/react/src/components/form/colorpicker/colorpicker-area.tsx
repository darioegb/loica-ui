'use client'

import type { CSSProperties, ForwardedRef, KeyboardEvent, PointerEvent, ReactNode } from 'react'
import { forwardRef, useRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { clamp, cssColor } from './color-math'
import { useColorPickerContext } from './colorpicker-context'
import styles from './colorpicker.module.css'

export type ColorPickerAreaProps = Omit<ComponentProps, 'index'>

const ARROWS: Record<string, [number, number]> = {
  ArrowDown: [0, -1],
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
  ArrowUp: [0, 1],
}

/**
 * The square where the user picks the saturation (across) and the brightness (up). It is a slider that the arrow
 * keys move one percent, and ten with <kbd>Shift</kbd>, and it keeps its direction in right-to-left text, as a
 * gradient does. The thumb has `data-loica-colorpicker-thumb`.
 * @since 1.4
 */
export const ColorPickerArea = forwardRef<HTMLDivElement, ColorPickerAreaProps>(
  ({ className, style }: ColorPickerAreaProps, ref: ForwardedRef<HTMLDivElement>): ReactNode => {
    const { blocked, isStyled, labels, state } = useColorPickerContext('ColorPickerArea')
    const { color, setColor } = state
    const dragging = useRef(false)
    const saturation = Math.round(color.s * 100)
    const brightness = Math.round(color.v * 100)

    const moveTo = (event: PointerEvent<HTMLDivElement>): void => {
      const box = event.currentTarget.getBoundingClientRect()
      if (box.width === 0 || box.height === 0) return
      setColor({
        s: clamp((event.clientX - box.left) / box.width, 0, 1),
        v: 1 - clamp((event.clientY - box.top) / box.height, 0, 1),
      })
    }

    const handlePointerDown = (event: PointerEvent<HTMLDivElement>): void => {
      if (blocked) return
      dragging.current = true
      event.currentTarget.focus()
      event.currentTarget.setPointerCapture?.(event.pointerId)
      moveTo(event)
    }

    const handlePointerMove = (event: PointerEvent<HTMLDivElement>): void => {
      if (dragging.current) moveTo(event)
    }

    const handlePointerEnd = (): void => {
      dragging.current = false
    }

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
      const step = ARROWS[event.key]
      if (!step || blocked) return
      event.preventDefault()
      const amount = event.shiftKey ? 0.1 : 0.01
      setColor({
        s: clamp(color.s + step[0] * amount, 0, 1),
        v: clamp(color.v + step[1] * amount, 0, 1),
      })
    }

    return (
      <div
        aria-disabled={blocked || undefined}
        aria-label={labels.area}
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={saturation}
        aria-valuetext={labels.areaValue(saturation, brightness)}
        className={joinClasses(isStyled && styles.area, className)}
        data-loica-colorpicker-area=""
        onKeyDown={handleKeyDown}
        onLostPointerCapture={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        ref={ref}
        role="slider"
        style={
          {
            '--colorpicker-current': cssColor({ ...color, a: 1 }),
            '--colorpicker-hue': `hsl(${color.h} 100% 50%)`,
            ...style,
          } as CSSProperties
        }
        tabIndex={blocked ? -1 : 0}
      >
        <span
          className={joinClasses(isStyled && styles.areaThumb)}
          data-loica-colorpicker-thumb=""
          style={{ left: `${color.s * 100}%`, top: `${(1 - color.v) * 100}%` }}
        />
      </div>
    )
  },
)

ColorPickerArea.displayName = 'ColorPickerArea'
