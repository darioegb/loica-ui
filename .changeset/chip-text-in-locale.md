---
'plume-ui-react': minor
---

`Chip` no longer takes `labels`. The start of the name of its remove button comes from the `chip` text of the `LocaleProvider`, and a single button takes a `label` on `ChipRemove`. With this no component takes a `labels` prop. `ChipLabels` is still exported to type the messages.
