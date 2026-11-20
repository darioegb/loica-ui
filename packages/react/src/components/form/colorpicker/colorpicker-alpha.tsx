'use client'

import type { CSSProperties, ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { Slider, type SliderValue } from '../slider'
import { cssColor } from './color-math'
import { useColorPickerContext } from './colorpicker-context'
import styles from './colorpicker.module.css'

export type ColorPickerAlphaProps = Omit<ComponentProps, 'index'>

const first = (value: SliderValue): number => (Array.isArray(value) ? value[0] : value)

/**
 * The slider of the opacity, from 0 to 100 percent. It renders nothing unless the `ColorPicker` has `alpha`. It is a
 * `Slider`, and its `ref` goes to the `<input>`.
 * @since 1.4
 */
export const ColorPickerAlpha = forwardRef<HTMLInputElement, ColorPickerAlphaProps>(
  (
    { className, style }: ColorPickerAlphaProps,
    ref: ForwardedRef<HTMLInputElement>,
  ): ReactNode => {
    const { alpha, blocked, isStyled, labels, size, state } =
      useColorPickerContext('ColorPickerAlpha')
    const { color, setColor } = state
    if (!alpha) return null
    const opaque = cssColor({ ...color, a: 1 })

    return (
      <Slider
        aria-label={labels.alpha}
        className={joinClasses(isStyled && styles.alpha, className)}
        data-loica-colorpicker-alpha=""
        disabled={blocked}
        formatValue={(value) => `${value} %`}
        max={100}
        min={0}
        onValueChange={(value) => setColor({ a: first(value) / 100 })}
        ref={ref}
        size={size}
        step={1}
        style={{ '--colorpicker-current': opaque, '--slider-solid': opaque, ...style } as CSSProperties}
        value={Math.round(color.a * 100)}
        variant={isStyled ? 'solid' : 'unstyled'}
      />
    )
  },
)

ColorPickerAlpha.displayName = 'ColorPickerAlpha'
