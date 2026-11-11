---
'@loica-ui/react': patch
---

`Input`, `Textarea`, `DatePicker` and `TimePicker` no longer collapse inside a `Table`. In a table that had to share its width among many columns, a field could shrink to 34px, because its minimum width was a percentage of a cell that the table sizes from its content. Now a field in a cell keeps at least `8rem`; set `--table-field-min-width` on the `Table` to change that floor. Outside a table nothing changes.
