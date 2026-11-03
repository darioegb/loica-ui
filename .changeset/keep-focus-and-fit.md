---
'plume-ui-react': patch
---

Keyboard focus no longer drops to the page when a `Select` chip is removed or the value is cleared, or when the arrow
keys scroll a `Carousel` with focus on a slide. An unstyled `Paginator` in a container sized to its content keeps all
its pages instead of dropping them one by one. The `filled` `Select` and `NumberInput` darken on hover like the other
filled fields.
