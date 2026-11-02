---
'plume-ui-react': minor
---

`DatePicker` and `TimePicker` take an `icon` prop for the button that opens the calendar or the panel. It replaces the icon that the exported `DatePickerTrigger` and `TimePickerTrigger` parts used to take as `children`, which are no longer exported because the field of the pickers is an `Input`. The button keeps its name, which comes from the `datePicker.openCalendar` and `timePicker.openTimePicker` texts of the `LocaleProvider`.
