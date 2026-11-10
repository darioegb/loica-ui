---
'@loica-ui/react': patch
---

`NumberInput` shows its number with Latin digits in every locale. With a locale that writes other digits, such as `ar-EG`, `fa` or `bn`, it showed `١٫٥`, which the field could not read back, so the number could not be edited once shown. The decimal separator still follows the locale.
