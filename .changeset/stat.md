---
'@loica-ui/react': minor
---

New `Stat` component: a metric of a dashboard, with its `label`, its `value`, a `change` with a `trend` (`up`, `down` or `neutral`) and a `helpText`. A number `value` is written with the locale (`formatOptions` are the options of `Intl.NumberFormat`), the trend gets an arrow and a color and is also said in words to a screen reader, with the new `stat` texts of the `LocaleProvider` (`up`, `down`, `neutral`), and `colorScheme` sets another color for when up is not good news. It is not a card: put it in a `Card`.
