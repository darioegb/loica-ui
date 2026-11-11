---
'@loica-ui/react': minor
---

New `numberFormat(locale, options)`, to spread on a `NumberInput` for thousands separators, a currency, a percentage or a unit: `<NumberInput {...numberFormat('es', { currency: 'EUR', style: 'currency' })} />`. It takes the options of `Intl.NumberFormat` and gives a `format` and the `parse` that reads it back, so what the field shows can be typed again, with the separators and the symbols of the locale (`1.234,5` in `de`). The text of a `NumberInput` without it, and the number that goes to `onValueChange` and to a form, do not change. An option it can't read back, such as `notation: 'compact'`, throws a `RangeError`.
