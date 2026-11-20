export type ColorPickerVariant = 'outline' | 'filled' | 'underline' | 'unstyled'

/**
 * Every text the picker shows or announces: the names of the panel (`colorPicker`), of the button that opens it
 * (`openColorPicker`), of the area (`area`, and `areaValue(saturation, brightness)` for what a screen reader reads as
 * it moves, with the numbers as percentages), of the sliders (`hue`, `alpha`), of the fields (`hex`, `red`, `green`,
 * `blue`, `saturation`, `lightness`), of the list of swatches (`swatches`) and of the eyedropper button (`eyeDropper`).
 * @since 1.4
 */
export interface ColorPickerLabels {
  alpha: string
  area: string
  areaValue: (saturation: number, brightness: number) => string
  blue: string
  colorPicker: string
  eyeDropper: string
  green: string
  hex: string
  hue: string
  lightness: string
  openColorPicker: string
  red: string
  saturation: string
  swatches: string
}
