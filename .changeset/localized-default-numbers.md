---
'@loica-ui/react': minor
---

The default texts that write a number use the `locale` of the `LocaleProvider`: the names of the stars and the read only value of `Rating`, the counter and the characters left of `Textarea`, the `+2` of `Select` and the `2 more` of `AvatarGroup`, the slides and dots of `Carousel`, and the cells of `PinInput`. They write the digits and the thousands separator of the locale, so with `ar-EG`, `fa` or `bn` they show their own digits, a rating of `3.5` is `3,5` in `de`, and a counter of 1200 characters is `1,200` in `en`: whole numbers under a thousand in a locale with Latin digits are the same as before. A text of your own in `messages` still wins.

The size of a file in `FileUpload` is written with `Intl`, with the unit and the spacing of the locale: `1.5 kB` instead of `1.5 KB` in `en`, `512 byte` instead of `512 B`, `1,5 ko` in `fr`. The number is still the size over 1024.
