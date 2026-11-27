---
'@loica-ui/react': minor
---

`NumberInput` takes `formatValue` and `parseValue`, the names `Slider` and `ProgressBar` already use, with the meaning `format` and `parse` have. `format` and `parse` still work and are marked as deprecated, and the new names win when both are set; they stay for the rest of 1.x and go away in 2.0 (#376). `numberFormat(locale, options)` gives the new names and the old ones, so spreading it on a `NumberInput` keeps working. The API reference now shows a "Deprecated" badge on a prop with `@deprecated`.
