---
'plume-ui-react': minor
---

`Select`, `FileUpload`, `DatePicker`, `TimePicker`, `Avatar`, `AvatarGroup` and `ToastProvider` no longer take `labels`. Their texts come from the `LocaleProvider` (`select`, `fileUpload`, `datePicker`, `timePicker`, `avatar`, `avatarGroup` and `toast`), and a change for one section is a nested `LocaleProvider`. A single text can still be set on the part that shows it, such as `label` on `SelectClear` and `FileUploadRemove`. `AvatarGroup` no longer passes the texts of the status down to its avatars: set them under the `avatar` key. The types `SelectLabels`, `FileUploadLabels`, `DatePickerLabels`, `TimePickerLabels`, `AvatarLabels`, `AvatarGroupLabels` and `ToastLabels` are still exported to type the messages.
