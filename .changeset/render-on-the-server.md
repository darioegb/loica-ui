---
'@loica-ui/react': patch
---

Fix three things that only worked after the page loaded:

- A `Select` with `options` now has its chosen option (label and icon) in the HTML the server renders, instead of an empty value until it hydrates. An option written as a child still registers after mount.
- An overlay (`Select`, `Modal`, `Popover`, `Tooltip`, `Drawer`, `Toast`) no longer throws `document is not defined` when it is rendered on the server without a `ThemeProvider`.
- `SidebarToggle` no longer renders `aria-expanded="true"` on the server, where the width of the screen is not known; it sets it when the page loads.
