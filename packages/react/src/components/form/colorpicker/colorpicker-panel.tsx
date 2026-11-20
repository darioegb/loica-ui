'use client'

import type { ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import { Portal } from '../../../overlay'
import { joinClasses } from '../../../overlay/class-names'
import { mergeRefs } from '../../../overlay/trigger'
import type { ComponentProps } from '../../../theme'
import { pickerPanelClasses } from '../shared/picker-panel'
import { ColorPickerAlpha } from './colorpicker-alpha'
import { ColorPickerArea } from './colorpicker-area'
import { ColorPickerChannels } from './colorpicker-channels'
import { useColorPickerContext } from './colorpicker-context'
import { ColorPickerEyeDropper } from './colorpicker-eyedropper'
import { ColorPickerHue } from './colorpicker-hue'
import { ColorPickerSwatches } from './colorpicker-swatches'
import styles from './colorpicker.module.css'

export interface ColorPickerPanelOwnProps {
  /** Accessible name of the panel. By default it is the `colorPicker.colorPicker` text of the `LocaleProvider`. */
  'aria-label'?: string
  /**
   * The parts of the panel (`ColorPickerArea`, `ColorPickerHue`, `ColorPickerAlpha`, `ColorPickerChannels`,
   * `ColorPickerSwatches` and `ColorPickerEyeDropper`), in the order they should appear. Without children it renders
   * all of them.
   */
  children?: ReactNode
}

export type ColorPickerPanelProps = Omit<ComponentProps, 'index'> & ColorPickerPanelOwnProps

/**
 * The popup, or the page content when the picker is `panel`. Given no children it holds the area, the sliders, the
 * fields, the swatches and the eyedropper.
 * @since 1.4
 */
export const ColorPickerPanel = forwardRef<HTMLDivElement, ColorPickerPanelProps>(
  (
    { 'aria-label': ariaLabel, children, className, style }: ColorPickerPanelProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): ReactNode => {
    const { isPanel, isStyled, labels, open, panelId, panelStyle, setPanel, shape, size, variant } =
      useColorPickerContext('ColorPickerPanel')
    if (!isPanel && !open) return null

    const panel = (
      <div
        aria-label={ariaLabel ?? labels.colorPicker}
        aria-modal={isPanel ? undefined : true}
        className={joinClasses(
          isStyled && styles.panel,
          pickerPanelClasses(variant, size, shape),
          isStyled && isPanel && styles.inline,
          className,
        )}
        data-inline={isPanel ? '' : undefined}
        data-loica-colorpicker-panel=""
        id={isPanel ? undefined : panelId}
        ref={mergeRefs<HTMLDivElement>(isPanel ? undefined : setPanel, ref)}
        role={isPanel ? 'group' : 'dialog'}
        style={{ ...panelStyle, ...style }}
      >
        {children ?? (
          <>
            <ColorPickerArea />
            <div
              className={isStyled ? styles.controls : undefined}
              data-loica-colorpicker-controls=""
            >
              <ColorPickerEyeDropper />
              <div className={isStyled ? styles.sliders : undefined}>
                <ColorPickerHue />
                <ColorPickerAlpha />
              </div>
            </div>
            <ColorPickerChannels />
            <ColorPickerSwatches />
          </>
        )}
      </div>
    )

    return isPanel ? panel : <Portal>{panel}</Portal>
  },
)

ColorPickerPanel.displayName = 'ColorPickerPanel'
