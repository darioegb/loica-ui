import { createCountFormatter } from '../../../overlay/format-count'
import type { ColorPickerLabels } from './colorpicker-types'

export const createDefaultLabels = (locale: string): ColorPickerLabels => {
  const format = createCountFormatter(locale)
  return {
    alpha: 'Opacity',
    area: 'Saturation and brightness',
    areaValue: (saturation, brightness) =>
      `Saturation ${format(saturation)} %, brightness ${format(brightness)} %`,
    blue: 'Blue',
    colorPicker: 'Color picker',
    eyeDropper: 'Pick a color from the screen',
    green: 'Green',
    hex: 'Hex',
    hue: 'Hue',
    lightness: 'Lightness',
    openColorPicker: 'Open color picker',
    red: 'Red',
    saturation: 'Saturation',
    swatches: 'Swatches',
  }
}
