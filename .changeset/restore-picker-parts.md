---
'plume-ui-react': minor
---

The `TimePicker` gets a `TimePickerField` part, the native input of the `TimePickerInput`, that takes the place of the `InputField` its compositions used. `DatePickerTrigger` and `TimePickerTrigger` take a `position` (`before` or `after` the field, `after` by default), because they draw their own slot now that the `Input` has no `InputElement`.
