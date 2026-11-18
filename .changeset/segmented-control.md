---
'@loica-ui/react': minor
---

New `SegmentedControl` and `SegmentedControlItem`: a short list of options side by side, of which one is selected ("Day / Week / Month", the alignment of a text). It is a `radiogroup` of native radios, so it is one tab stop, the arrow keys move the selection and follow the direction of the page, and a form submits its `name` and value. Pass the `options`, or write a `SegmentedControlItem` for each one to put anything in a segment; it has the `solid` and `outline` variants, `unstyled`, `size`, `colorScheme` and `orientation`.
