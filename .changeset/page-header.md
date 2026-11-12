---
'@loica-ui/react': minor
---

New `PageHeader` component: the title of a page (an `h1` by default, with `titleAs` to pick another level), an optional `description` under it and `actions` at its end, which go below the title on a narrow screen. It reuses `Heading` and `Text`, takes `variant="unstyled"` and renders a `header`, so put it inside a `main`.
