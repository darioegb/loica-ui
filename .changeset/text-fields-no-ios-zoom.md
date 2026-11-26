---
'@loica-ui/react': patch
---

Stop Safari on iOS from zooming the page when a text field takes the focus. iOS zooms in on any field with text smaller than 16px, and it does not zoom back out. The `sm` size of `Input`, `Textarea`, `NumberInput`, `PinInput` and `RichTextEditor`, the search box of an open `Select`, and the `md` size of `Input` on a page whose text is smaller than 16px (it inherits the size) were under that. `Autocomplete`, `ColorPicker`, `DatePicker` and `TimePicker` share the `Input` styles, so they are fixed too. On a touch screen (`pointer: coarse`) those sizes are now 16px; a mouse keeps the sizes it had, and `lg` is unchanged.
