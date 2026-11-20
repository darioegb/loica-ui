'use client'

import type { ButtonHTMLAttributes, ForwardedRef, ReactNode } from 'react'
import { forwardRef, useEffect, useState } from 'react'
import { EyeDropperIcon } from '../../../overlay/icons'
import type { ComponentProps } from '../../../theme'
import { Button } from '../../interaction/button'
import { useColorPickerContext } from './colorpicker-context'

interface EyeDropperWindow {
  EyeDropper?: new () => { open: () => Promise<{ sRGBHex: string }> }
}

export interface ColorPickerEyeDropperOwnProps {
  /** Another icon for the button. */
  children?: ReactNode
}

type ColorPickerEyeDropperRootAttributes = Pick<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'aria-label' | 'title'
>

export type ColorPickerEyeDropperProps = Omit<ComponentProps, 'index'> &
  ColorPickerEyeDropperRootAttributes &
  ColorPickerEyeDropperOwnProps

/**
 * The button that takes a color from the screen with the `EyeDropper` of the browser. It renders nothing in a browser
 * that has none (Chrome and Edge do), or when the `ColorPicker` has `eyeDropper` off. It is named by the
 * `colorPicker.eyeDropper` text of the `LocaleProvider`.
 * @since 1.4
 */
export const ColorPickerEyeDropper = forwardRef<HTMLButtonElement, ColorPickerEyeDropperProps>(
  (
    { 'aria-label': ariaLabel, children, className, style, title }: ColorPickerEyeDropperProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ): ReactNode => {
    const { blocked, eyeDropper, isStyled, labels, state } =
      useColorPickerContext('ColorPickerEyeDropper')
    const [supported, setSupported] = useState(false)
    useEffect(() => setSupported('EyeDropper' in window), [])
    if (!eyeDropper || !supported) return null

    const pick = async (): Promise<void> => {
      const Dropper = (window as unknown as EyeDropperWindow).EyeDropper
      if (!Dropper) return
      try {
        state.setFromText((await new Dropper().open()).sRGBHex)
      } catch {
        return
      }
    }

    return (
      <Button
        aria-label={ariaLabel ?? labels.eyeDropper}
        className={className}
        data-loica-colorpicker-eyedropper=""
        disabled={blocked}
        onClick={() => void pick()}
        ref={ref}
        shape="pill"
        size="sm"
        style={style}
        title={title}
        variant={isStyled ? 'icon' : 'unstyled'}
      >
        {children ?? <EyeDropperIcon />}
      </Button>
    )
  },
)

ColorPickerEyeDropper.displayName = 'ColorPickerEyeDropper'
