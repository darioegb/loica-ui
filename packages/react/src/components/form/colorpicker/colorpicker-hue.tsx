'use client'

import type { CSSProperties, ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { Slider, type SliderValue } from '../slider'
import { useColorPickerContext } from './colorpicker-context'
import styles from './colorpicker.module.css'

export type ColorPickerHueProps = Omit<ComponentProps, 'index'>

const first = (value: SliderValue): number => (Array.isArray(value) ? value[0] : value)

/**
 * The slider of the hue, from 0 to 360 degrees. It is a `Slider`, so it has its keyboard and its `aria-valuetext`,
 * and its `ref` goes to the `<input>`.
 * @since 1.4
 */
export const ColorPickerHue = forwardRef<HTMLInputElement, ColorPickerHueProps>(
  (
    { className, style }: ColorPickerHueProps,
    ref: ForwardedRef<HTMLInputElement>,
  ): ReactNode => {
    const { blocked, isStyled, labels, size, state } = useColorPickerContext('ColorPickerHue')
    const { color, setColor } = state

    return (
      <Slider
        aria-label={labels.hue}
        className={joinClasses(isStyled && styles.hue, className)}
        data-loica-colorpicker-hue=""
        disabled={blocked}
        formatValue={(value) => `${value}°`}
        max={360}
        min={0}
        onValueChange={(value) => setColor({ h: first(value) })}
        ref={ref}
        size={size}
        step={1}
        style={{ '--slider-solid': `hsl(${color.h} 100% 50%)`, ...style } as CSSProperties}
        value={Math.round(color.h)}
        variant={isStyled ? 'solid' : 'unstyled'}
      />
    )
  },
)

ColorPickerHue.displayName = 'ColorPickerHue'
