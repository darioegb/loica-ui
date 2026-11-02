---
'plume-ui-react': minor
---

`styles.css` and `tokens.css` declare only the tokens that the components read (and the ones that change with the color mode), 236 variables instead of 402: the shades of the colors, the long `--plume-space-*` scale, the largest containers and the unused weights, sizes and radii are no longer declared, and `tokens.css` is about a quarter smaller. The names of the tokens and the `Theme` don't change, and `<ThemeProvider>` still declares any token whose value your theme changes. To read one of the others in your own CSS, declare it, or give `var()` the default value as fallback. `colorVar()` does it for the shades (`var(--plume-color-primary-700, #2727db)`).
