'use client'

import type { ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ColorScheme, ComponentProps } from '../../../theme'
import { Input } from '../input'
import { clamp, hslaToHsva, hsvaToHsla, hsvaToRgba, rgbaToHsva, type Hsva } from './color-math'
import { useColorPickerContext } from './colorpicker-context'
import styles from './colorpicker.module.css'
import { useDraft } from './use-draft'

interface ChannelProps {
  blocked: boolean
  caption: string
  colorScheme: ColorScheme
  commit: (text: string) => void
  isStyled: boolean
  mode: 'numeric' | 'text'
  value: string
}

function Channel({
  blocked,
  caption,
  colorScheme,
  commit,
  isStyled,
  mode,
  value,
}: Readonly<ChannelProps>): ReactNode {
  const draft = useDraft(value, commit)

  return (
    <label className={isStyled ? styles.channel : undefined} data-loica-colorpicker-channel="">
      <span className={isStyled ? styles.caption : undefined}>{caption}</span>
      <Input
        {...draft}
        autoComplete="off"
        colorScheme={colorScheme}
        disabled={blocked}
        inputMode={mode}
        size="sm"
        spellCheck={false}
        variant={isStyled ? 'outline' : 'unstyled'}
      />
    </label>
  )
}

export type ColorPickerChannelsProps = Omit<ComponentProps, 'index'>

const toNumber = (text: string): number | null => {
  const number = text.trim() === '' ? Number.NaN : Number(text)
  return Number.isFinite(number) ? number : null
}

/**
 * The fields of the color, in the `format` of the `ColorPicker`: one for the hex color, three for the channels of
 * `rgb` or `hsl`, plus one for the opacity with `alpha`. A field takes what is typed when it loses the focus or on
 * <kbd>Enter</kbd>, and each one is a `<label>` with `data-loica-colorpicker-channel`.
 * @since 1.4
 */
export const ColorPickerChannels = forwardRef<HTMLDivElement, ColorPickerChannelsProps>(
  (
    { className, style }: ColorPickerChannelsProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): ReactNode => {
    const { alpha, blocked, colorScheme, format, isStyled, labels, state } =
      useColorPickerContext('ColorPickerChannels')
    const { color, setColor, setFromText, text } = state
    const shared = { blocked, colorScheme, isStyled }

    const channel = (
      caption: string,
      value: number,
      max: number,
      apply: (value: number) => Hsva,
    ): ReactNode => (
      <Channel
        {...shared}
        caption={caption}
        commit={(draft) => {
          const number = toNumber(draft)
          if (number !== null) setColor(apply(clamp(Math.round(number), 0, max)))
        }}
        key={caption}
        mode="numeric"
        value={String(Math.round(value))}
      />
    )

    const rgba = hsvaToRgba(color)
    const hsla = hsvaToHsla(color)
    const withRgb = (change: Partial<typeof rgba>): Hsva =>
      rgbaToHsva({ ...rgba, ...change }, color.h)
    const withHsl = (change: Partial<typeof hsla>): Hsva => hslaToHsva({ ...hsla, ...change })

    return (
      <div
        className={joinClasses(isStyled && styles.channels, className)}
        data-loica-colorpicker-channels=""
        ref={ref}
        style={style}
      >
        {format === 'hex' ? (
          <Channel
            {...shared}
            caption={labels.hex}
            commit={setFromText}
            mode="text"
            value={text}
          />
        ) : null}
        {format === 'rgb'
          ? [
              channel(labels.red, rgba.r, 255, (r) => withRgb({ r })),
              channel(labels.green, rgba.g, 255, (g) => withRgb({ g })),
              channel(labels.blue, rgba.b, 255, (b) => withRgb({ b })),
            ]
          : null}
        {format === 'hsl'
          ? [
              channel(labels.hue, hsla.h, 360, (h) => withHsl({ h })),
              channel(labels.saturation, hsla.s * 100, 100, (s) => withHsl({ s: s / 100 })),
              channel(labels.lightness, hsla.l * 100, 100, (l) => withHsl({ l: l / 100 })),
            ]
          : null}
        {alpha
          ? channel(labels.alpha, color.a * 100, 100, (value) => ({ ...color, a: value / 100 }))
          : null}
      </div>
    )
  },
)

ColorPickerChannels.displayName = 'ColorPickerChannels'
