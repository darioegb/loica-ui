---
'@loica-ui/react': minor
---

The search of `Select`, the text filter of `Table`, and the typeahead of `Select`, `DropdownMenu` and `Tree` ignore accents as well as case, so `cafe` finds `Café` and `a` jumps to `Árbol`. They fold the case with the `locale` of the `LocaleProvider`, so in Turkish `I` matches `ı` and `İ` matches `i`. They only find more than before.
