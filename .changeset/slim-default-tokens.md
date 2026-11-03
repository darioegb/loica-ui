---
'plume-ui-react': minor
---

The palette of the default theme has the six colors the components use, `primary`, `secondary`, `info`, `success`, `warning` and `error`: `brown`, `pink`, `purple`, `teal` and `yellow` are removed, and the guide **Upgrading to 1.0** has their shades to add them back to a theme. The shades of a color are no longer CSS variables (`--plume-color-primary-500`): the components read the colors the theme works out from them (`--plume-color-<scheme>-solid`, `-text`, `-tint`...), so `colorVar`, `ColorShade` and `Shade` are removed, and the `colorScheme` of the `Loader` takes a scheme, like every other component, and gives it its `text` color. The new `schemeVar('primary', 'solid')` gives the variable of one of those colors, and the `SchemeToken` type lists them.

`styles.css` and `tokens.css` declare only the tokens that the components read and the ones that change with the color mode: 186 variables instead of 402, and `tokens.css` is 40 % smaller. The long `--plume-space-*` scale, the largest containers and the unused weights, sizes and radii stay in the `Theme` but are not declared: `<ThemeProvider>` still declares any token whose value your theme changes, and in your own CSS give `var()` the default value as fallback.
