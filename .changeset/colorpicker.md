---
'@loica-ui/react': minor
---

New `ColorPicker`: a field to type a color, with a button that opens a panel to pick it, or only the panel with `panel`. The panel has an area for the saturation and the brightness that the pointer and the arrow keys move, a slider for the hue, fields for the hex color or for the channels of `rgb` and `hsl` (`format`), a slider and a field for the opacity with `alpha`, `swatches` to pick with one click and an eyedropper where the browser has one. The value is a string in the `format`, controlled or not, and the field reads any format and takes what is typed when it loses the focus. It is built from parts (`ColorPickerInput`, `ColorPickerPanel`, `ColorPickerArea`, `ColorPickerHue`, `ColorPickerAlpha`, `ColorPickerChannels`, `ColorPickerSwatches` and `ColorPickerEyeDropper`) with `solid`, `outline` and `unstyled` looks, and its texts come from the `colorPicker` key of the `LocaleProvider`.
