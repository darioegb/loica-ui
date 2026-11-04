---
'plume-ui-react': patch
---

Several `ThemeProvider`s with `applyToBody` no longer leave the page themed wrong. Each one used to save what it found on the page and put it back on unmount, so with two of them, or after one unmounted before the other, the page kept the `color-scheme`, the background and the text color of a provider that was gone. The providers are now kept in a list: the last one that mounted themes the page, and the page goes back to how it was when none is left.
