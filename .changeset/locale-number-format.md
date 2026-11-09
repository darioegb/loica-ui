---
'@loica-ui/react': minor
---

`Paginator`, `FileUpload` and `NumberInput` write their numbers with the `locale` of the `LocaleProvider`, or with their own new `locale` prop, as the `DatePicker` does, and fall back to `en`. The summary of the `Paginator` has the thousands separator (`1,234–1,250 of 12,345` instead of `1234–1250 of 12345`), and the size of a file has the decimal separator of the locale (`1,5 KB` in `es`). The `NumberInput` shows its number with the decimal separator of the locale (`1,5` in `es`, with no thousands separator, and the same text as before in `en`); the number that goes to `onValueChange` and to a form is the same. A `summary` or a `fileSize` text of your own, and a `format` of the `NumberInput`, still win.
