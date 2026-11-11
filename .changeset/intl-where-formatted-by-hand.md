---
'@loica-ui/react': patch
---

`Table` sorts text with the `locale` of the `LocaleProvider`, and not with the language of the browser, so the order of a table no longer changes from one visitor to another. `ProgressBar` writes its default percentage with `Intl`: the same `50%` in `en`, and `50 %` in `de` and `fr`. `Avatar` capitalizes its initials with the locale, so in Turkish `ilker` gives `İ` and not `I`.
