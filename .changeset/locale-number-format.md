---
'@loica-ui/react': minor
---

`Paginator` and `FileUpload` write their numbers with the `locale` of the `LocaleProvider`, or with their own new `locale` prop, as the `DatePicker` does, and fall back to `en`. The summary of the `Paginator` has the thousands separator (`1,234–1,250 of 12,345` instead of `1234–1250 of 12345`), and the size of a file has the decimal separator of the locale (`1,5 KB` in `es`). A `summary` or a `fileSize` text of your own still wins.
