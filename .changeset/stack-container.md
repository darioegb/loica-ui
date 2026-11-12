---
'@loica-ui/react': minor
---

New layout components. `Stack` lines its children up in a column or a row with the same `gap` (a key of the `spaces` of the theme), `align`, `justify` and `wrap`, and `stackBelow` turns a row into a column below a breakpoint, with static CSS and no style at runtime. `Container` keeps its content to a `size` of the `containers` of the theme, or `full`, centered and with a `gutter` on each side. Both take an `as` for the element and `variant="unstyled"`. They go in a new `layout` category.
