'use client'

import type { CSSProperties, ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { formatColor, parseColor } from './color-math'
import { useColorPickerContext } from './colorpicker-context'
import styles from './colorpicker.module.css'

export type ColorPickerSwatchesProps = Omit<ComponentProps, 'index'>

/**
 * The `swatches` of the `ColorPicker`, as buttons that pick a color with one click. The one that is picked has
 * `aria-pressed`, and each one is named by its color and has `data-loica-colorpicker-swatch`. It renders nothing when
 * there is no swatch the picker can read.
 * @since 1.4
 */
export const ColorPickerSwatches = forwardRef<HTMLDivElement, ColorPickerSwatchesProps>(
  (
    { className, style }: ColorPickerSwatchesProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): ReactNode => {
    const { alpha, blocked, format, isStyled, labels, state, swatches } =
      useColorPickerContext('ColorPickerSwatches')
    const known = swatches.flatMap((swatch) => {
      const parsed = parseColor(swatch)
      return parsed ? [{ color: parsed, swatch }] : []
    })
    if (known.length === 0) return null

    return (
      <div
        aria-label={labels.swatches}
        className={joinClasses(isStyled && styles.swatches, className)}
        data-loica-colorpicker-swatches=""
        ref={ref}
        role="group"
        style={style}
      >
        {known.map(({ color, swatch }) => (
          <button
            aria-label={swatch}
            aria-pressed={formatColor(color, format, alpha) === state.text}
            className={isStyled ? styles.swatch : undefined}
            data-loica-colorpicker-swatch=""
            disabled={blocked}
            key={swatch}
            onClick={() => state.setColor(color)}
            style={{ '--colorpicker-swatch': swatch } as CSSProperties}
            type="button"
          />
        ))}
      </div>
    )
  },
)

ColorPickerSwatches.displayName = 'ColorPickerSwatches'
