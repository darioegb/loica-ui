---
'plume-ui-react': patch
---

`Card` and `List` and their parts are server modules: they have no context and no `'use client'`, so a Server Component renders them with no JavaScript in the browser. The root styles its parts through their `data-plume-*` attributes, so the parts no longer carry a Plume class, and they no longer throw outside their root. `ListDivider` draws its line with CSS, without a `Divider` inside. The look doesn't change.
