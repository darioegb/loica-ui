---
'plume-ui-react': minor
---

`LocaleProvider` can be nested. An inner provider merges its `messages` with the ones of the provider above it, per component, and inherits its `locale` unless it sets its own.
