---
'plume-ui-react': minor
---

`Input`, `Textarea`, `NumberInput`, `PinInput`, `Rating` and `Slider` no longer take `labels`. Their texts come from the `LocaleProvider` (`input`, `textarea`, `numberInput`, `pinInput`, `rating` and `slider`), and a change for one section is a nested `LocaleProvider`. A single text can still be set on the part that shows it: `aria-label` on `InputReveal`, `PinInputCell` and `RatingRadio`, and `label` on `NumberInputDecrement` and `NumberInputIncrement`. The types `InputLabels`, `TextareaLabels`, `NumberInputLabels`, `PinInputLabels`, `RatingLabels` and `SliderLabels` are still exported to type the messages.
