---
'@loica-ui/react': patch
---

The default texts that write a number use the `locale` of the `LocaleProvider`: the names of the stars and the read only value of `Rating`, the counter and the characters left of `Textarea`, the `+2` of `Select` and the `2 more` of `AvatarGroup`, the slides and dots of `Carousel`, and the cells of `PinInput`. With a locale that has its own digits, such as `ar-EG`, `fa` or `bn`, they show them (`٣`), and a decimal rating has the separator of the locale (`3,5` in `de`). In `en`, and in any locale with Latin digits and whole numbers, the text is the same as before: there is no thousands separator. A text of your own in `messages` still wins.
