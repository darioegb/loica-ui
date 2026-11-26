---
'@loica-ui/react': patch
---

Document the minimum width of the text fields. `Input` and `Textarea` never get narrower than `--field-min-width` (18 rem, or the width of their parent when that is smaller), so a `width` below it does nothing; the Input and Textarea pages now say how to size a field, and the Input page has two new examples: a search form with the button in `addonAfter`, and a field next to a button in a row.
