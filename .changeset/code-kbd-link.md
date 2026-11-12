---
'@loica-ui/react': minor
---

New `Code`, `Kbd` and `Link` components. `Code` and `Kbd` are an inline `<code>` and `<kbd>` that scale with the text around them, with the variants `subtle` and `outline` and a `colorScheme`. `Link` is an `<a>` that inherits the size and the weight of its text, underlined by default, with the variants `underline` and `hover`, a `colorScheme`, `disabled` (no `href`, `aria-disabled`, and the click ignored) and `external` (a new tab with `rel="noopener noreferrer"` and a text for screen readers, from the new `link.external` key of the `LocaleProvider`). `Link` renders the link of the `LinkProvider`, so it navigates with your router, and stays a plain `<a>` when it is disabled or leaves the app.
