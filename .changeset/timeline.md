---
'@loica-ui/react': minor
---

New `Timeline` and `TimelineItem`: a vertical list of events in order, each with a marker joined to the next one by a line, for the activity of a project or the steps of an order. It is a native `ol`, and each `TimelineItem` takes a `title`, a `time` (with a `dateTime` for the `<time>` element), an `icon`, a `colorScheme` and its content as `children`. It is a server component, with the `default` and `unstyled` variants.
