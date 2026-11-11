---
'@loica-ui/react': minor
---

`DatePicker` takes `weekStartsOn`, the first day of the week of its calendar: a day from `0` (Sunday) to `6` (Saturday), or `'locale'` to take it from the `locale` (Sunday in `en-US`, Monday in `es`, Saturday in `ar-EG`). Without it the week still starts on Monday, whatever the `locale`, so no calendar changes. `Home` and `End` go to the first and the last day of that week. `getDaysOfWeekByLanguage` takes the same day as a second argument, and the types `WeekDay` and `WeekStartsOn` are exported. In a browser that can't tell the first day of a locale (no `Intl.Locale` week info) `'locale'` falls back to a table by region.
