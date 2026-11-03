---
'plume-ui-react': minor
---

The palette of the default theme has the six colors the components use, `primary`, `secondary`, `info`, `success`, `warning` and `error`: `brown`, `pink`, `purple`, `teal` and `yellow` are removed, and the guide **Upgrading to 1.0** has their shades to add them back to a theme. The shades of a color are no longer CSS variables (`--plume-color-primary-500`): the components read the colors the theme works out from them (`--plume-color-<scheme>-solid`, `-text`, `-tint`...), so `colorVar`, `ColorShade` and `Shade` are removed, and the `colorScheme` of the `Loader` takes a scheme, like every other component, and gives it its `text` color. The new `schemeVar('primary', 'solid')` gives the variable of one of those colors, and the `SchemeToken` type lists them.

The scales of the theme keep only the values the components read, so `styles.css` and `tokens.css` declare 184 variables instead of 402. Removed: the spaces `0`, `0.5`, `2.5`, `7`, `9`, `11`, `13` and `24` to `96`, the radii `0`, `1` and `5`, the shadows `none`, `sm` and `2xl`, the containers `xl`, `2xl` and `4xl` to `7xl`, the font size `5xl`, the weights `thin`, `extralight`, `light`, `extrabold` and `black`, the line heights `relaxed` and `loose`, and `typography.fontFamilyMono`. The guide **Upgrading to 1.0** has their values.
