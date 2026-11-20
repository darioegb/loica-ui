'use client'

import type { CSSProperties, FocusEvent, ForwardedRef, ReactNode } from 'react'
import { forwardRef, useCallback, useId, useMemo, useState } from 'react'
import { useLabels, useResolvedLocale } from '../../../locale/locale-provider'
import { useFloatingPanel } from '../../../overlay/use-floating-panel'
import { useFocusTrap } from '../../../overlay/use-focus-trap'
import type { ColorScheme, ComponentProps, Shape, Size } from '../../../theme'
import { schemeVar } from '../../../theme'
import { customProperties } from '../shared/picker-panel'
import type { ColorFormat } from './color-math'
import { ColorPickerContext, type ColorPickerContextProps } from './colorpicker-context'
import { ColorPickerInput, type ColorPickerFieldAttributes } from './colorpicker-input'
import { createDefaultLabels } from './colorpicker-labels'
import { ColorPickerPanel } from './colorpicker-panel'
import type { ColorPickerLabels, ColorPickerVariant } from './colorpicker-types'
import { useColorState } from './use-color-state'

export type { ColorFormat } from './color-math'
export type { ColorPickerLabels, ColorPickerVariant } from './colorpicker-types'

export interface ColorPickerOwnProps {
  /**
   * Adds a slider for the opacity and the opacity to the value: `#rrggbbaa`, `rgba()` or `hsla()` when it is below 1,
   * and the plain color when it is 1. Without it the value is always opaque.
   * @default false
   * @since 1.4
   */
  alpha?: boolean
  /**
   * The parts of the picker (`ColorPickerInput` and `ColorPickerPanel`), in the order they should appear. Without
   * children it renders the input and the panel.
   * @since 1.4
   */
  children?: ReactNode
  /**
   * Color scheme from the theme palette, custom schemes included. It colors the focus of the field and of the fields of
   * the panel, and the border of the `filled` and `underline` panels.
   * @default 'secondary'
   * @since 1.4
   */
  colorScheme?: ColorScheme
  /**
   * Initial color of the uncontrolled picker, in any format the picker reads (`#rgb`, `#rrggbb`, `#rrggbbaa`,
   * `rgb()`, `hsl()`), or `""` for none.
   * @default ''
   * @since 1.4
   */
  defaultValue?: string
  /**
   * Disables the field, the button and the panel.
   * @default false
   * @since 1.4
   */
  disabled?: boolean
  /**
   * Shows a button that takes a color from the screen, in the browsers that have an `EyeDropper` (Chrome and Edge).
   * @default true
   * @since 1.4
   */
  eyeDropper?: boolean
  /**
   * The format of the value, of the text of the field and of the numbers of the panel: `hex` shows one field,
   * `rgb` and `hsl` show one for each channel.
   * @default 'hex'
   * @since 1.4
   */
  format?: ColorFormat
  /**
   * Called with the new color, written in the `format`, when the user moves the area or a slider, picks a swatch or the
   * eyedropper, or types a valid color and leaves the field or presses <kbd>Enter</kbd>. It is called with `""` when the
   * field is cleared.
   * @since 1.4
   */
  onValueChange?: (value: string) => void
  /**
   * Renders only the panel, always visible, without the field.
   * @default false
   * @since 1.4
   */
  panel?: boolean
  /**
   * The color is shown and the panel is readable, but it can't be changed.
   * @default false
   * @since 1.4
   */
  readOnly?: boolean
  /**
   * Shape of the corners. `pill` rounds the `outline` field and the corners of the popup.
   * @default 'rounded'
   * @since 1.4
   */
  shape?: Shape
  /**
   * Size of the field and of the text of the panel.
   * @default 'md'
   * @since 1.4
   */
  size?: Size
  /**
   * Colors to pick with one click, as CSS colors (`#ef4444`, `rgb(34 197 94)`, `hsl(217 91% 60%)`). The ones the
   * picker can't read are left out.
   * @since 1.4
   */
  swatches?: readonly string[]
  /**
   * The color, written in the `format`, or `""` when there is none. Makes the picker controlled; use `defaultValue`
   * otherwise.
   * @since 1.4
   */
  value?: string
  /**
   * Visual variant of the field and of the popup. `outline` has a bordered popup, `filled` a tinted one with an accent
   * line, `underline` a square one with an accent line, and `unstyled` none of them.
   * @default 'outline'
   * @since 1.4
   */
  variant?: ColorPickerVariant
}

export type ColorPickerProps = Omit<ComponentProps, 'index'> &
  ColorPickerFieldAttributes &
  ColorPickerOwnProps

/**
 * A field to type a color, or pick it in a panel with an area, sliders, fields for its channels, swatches and an
 * eyedropper. Its `ref` goes to the `<input>`, which a `<form>` submits by its `name`, and its `className` and
 * `style` to the element around the parts.
 * @since 1.4
 */
export const ColorPicker = forwardRef<HTMLInputElement, ColorPickerProps>(
  (
    {
      alpha = false,
      children,
      className,
      colorScheme = 'secondary',
      defaultValue = '',
      disabled = false,
      eyeDropper = true,
      format = 'hex',
      onValueChange,
      panel: isPanel = false,
      readOnly = false,
      shape = 'rounded',
      size = 'md',
      style,
      swatches = [],
      value,
      variant = 'outline',
      ...inputProps
    }: ColorPickerProps,
    ref: ForwardedRef<HTMLInputElement>,
  ): ReactNode => {
    const locale = useResolvedLocale()
    const defaults = useMemo(() => createDefaultLabels(locale), [locale])
    const labels: ColorPickerLabels = useLabels('colorPicker', defaults)
    const state = useColorState({ alpha, defaultValue, format, onValueChange, value })
    const [root, setRoot] = useState<HTMLDivElement | null>(null)
    const [input, setInput] = useState<HTMLInputElement | null>(null)
    const [open, setOpen] = useState(false)
    const panelId = useId()
    const blocked = disabled || readOnly
    const popupOpen = !isPanel && open && !blocked

    const { isTopmost, panel, position, setPanel } = useFloatingPanel({
      anchor: root,
      enabled: popupOpen,
      offset: 8,
      onDismiss: (reason) => {
        setOpen(false)
        if (reason === 'escape') input?.focus()
      },
      placement: 'bottom-start',
    })

    useFocusTrap(panel, {
      active: popupOpen,
      initialFocus: panel?.querySelector<HTMLElement>('[data-loica-colorpicker-area]') ?? null,
      isTopmost,
      restoreFocus: false,
    })

    const handleBlur = useCallback(
      (event: FocusEvent<HTMLDivElement>): void => {
        const next = event.relatedTarget as Node | null
        if (next && !event.currentTarget.contains(next) && !panel?.contains(next)) setOpen(false)
      },
      [panel],
    )

    const toggle = useCallback((): void => setOpen((isOpen) => !isOpen), [])

    const panelStyle = useMemo<CSSProperties>(() => {
      const vars = { '--picker-scheme': schemeVar(colorScheme, 'text'), ...customProperties(style) }
      return isPanel
        ? (vars)
        : ({
            ...vars,
            ...position.style,
            opacity: position.isPositioned ? undefined : 0,
          })
    }, [colorScheme, isPanel, position.isPositioned, position.style, style])

    const context = useMemo<ColorPickerContextProps>(
      () => ({
        alpha,
        blocked,
        colorScheme,
        disabled,
        eyeDropper,
        format,
        inputRef: ref,
        isPanel,
        isStyled: variant !== 'unstyled',
        labels,
        open: popupOpen,
        panelId,
        panelStyle,
        readOnly,
        setInput,
        setPanel,
        shape,
        size,
        state,
        swatches,
        toggle,
        variant,
      }),
      [
        alpha,
        blocked,
        colorScheme,
        disabled,
        eyeDropper,
        format,
        isPanel,
        labels,
        panelId,
        panelStyle,
        popupOpen,
        readOnly,
        ref,
        setPanel,
        shape,
        size,
        state,
        swatches,
        toggle,
        variant,
      ],
    )

    return (
      <ColorPickerContext.Provider value={context}>
        <div
          className={className}
          data-loica-colorpicker=""
          data-open={popupOpen ? '' : undefined}
          onBlur={handleBlur}
          ref={setRoot}
          style={style}
        >
          {children ?? (
            <>
              <ColorPickerInput {...inputProps} />
              <ColorPickerPanel />
            </>
          )}
        </div>
      </ColorPickerContext.Provider>
    )
  },
)

ColorPicker.displayName = 'ColorPicker'
