---
'plume-ui-react': minor
---

`PinInput`, `Rating` and `Slider` are single components. `PinInputCell`, `PinInputHidden`, `RatingItem`, `RatingEmpty`, `RatingFilled`, `RatingRadio`, `RatingValueText`, `SliderBody`, `SliderTrack`, `SliderRange`, `SliderThumb`, `SliderMarks`, `SliderMarkItem` and `SliderMarkLabel` are removed, and the three take no `children`. The boxes come from `length` and `name`, the stars from `icon` and `emptyIcon`, and the track, the marks and the thumbs from `marks` and the value. Each inner element carries a `data-plume-<component>-<element>` attribute, so it can be styled from the parent. They take all the native attributes of their element, and the names of the boxes, the stars and the thumbs of a range come from the `pinInput`, `rating` and `slider` texts of the `LocaleProvider` only. A `Rating` can no longer render a function per star.
