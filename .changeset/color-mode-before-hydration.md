---
'@loica-ui/react': patch
---

The first paint has the right color mode, before the page hydrates. With `defaultColorMode="system"` and a dark system, the root, the color scheme (native controls and scrollbars) and, with `applyToBody`, the page background are dark from the start, instead of light until the effects run; with `'dark'` the color scheme and the page background no longer wait for hydration either. The `ThemeProvider` writes a `<style>` next to its root for it, with no script.
