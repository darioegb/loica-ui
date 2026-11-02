---
'plume-ui-react': minor
---

`Input`, `Textarea` and `NumberInput` are single components. `InputGroup`, `InputControl`, `InputAddon`, `InputElement`, `InputField`, `InputReveal`, `TextareaField`, `TextareaCount`, `TextareaStatus`, `NumberInputField`, `NumberInputDecrement`, `NumberInputIncrement` and `NumberInputHidden` are removed, and the three take no `children`. The addons, the elements, the reveal button, the counter and the steppers come from `addonBefore`, `addonAfter`, `elementBefore`, `elementAfter`, `revealable`, `showCount` and `steppers`. Each inner element carries a `data-plume-<component>-<element>` attribute, so it can be styled from the parent. They take all the native attributes of their element, and the names of the reveal and stepper buttons come from the `input` and `numberInput` texts of the `LocaleProvider` only.
