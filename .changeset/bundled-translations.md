---
'@loica-ui/react': minor
---

Add the texts of five languages, one entry point each: `@loica-ui/react/locales/de`, `es`, `fr`, `it` and `pt` (Brazilian Portuguese). Each exports a complete `LocaleMessages` that you give to the provider, `<LocaleProvider locale='es' messages={es}>`, so an app no longer translates every group by hand; a language you do not import is not in your bundle, and the messages of your app still win over it. The numbers inside a text and its plurals follow the language, with `Intl.NumberFormat` and `Intl.PluralRules`. `LocaleMessages`, the type of a complete set of texts, is exported too, to write a language of your own.
