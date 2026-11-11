---
'@loica-ui/react': patch
---

`Field` no longer repeats its own class in the `class` attribute (`_field _vertical _field`). The class of its orientation already carries the base one, so nothing changes in how it looks.
