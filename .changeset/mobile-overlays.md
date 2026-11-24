---
'@loica-ui/react': patch
---

Fix the `Tour` on small screens: when its target is so large that the panel would leave the screen or cover it, the panel now docks at the bottom of the screen instead of being squashed or pushed out of view, and a target taller than the screen scrolls to its start. Fix the popup of `ColorPicker`, which opened behind a `Drawer` or a `Modal` and could not be seen.
