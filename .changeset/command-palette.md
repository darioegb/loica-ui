---
'@loica-ui/react': minor
---

New `CommandPalette`, `CommandPaletteGroup` and `CommandPaletteItem`: a dialog to search and run commands, the one that opens with `Ctrl` + `K`. It is a `Modal` with a search box and a list: the items that match are left as the user types (ignoring case and accents, with `keywords` for other words), the arrow keys move between them, `Enter` picks one and runs its `onSelect`, and an item can show its `shortcut`. Open it with `open` and `onOpenChange`, and give it `backdropClassName` for the layer behind it when it is unstyled; the library doesn't listen to the shortcut, so the app binds the keys it wants. `filter`, `query` and `onQueryChange` take the search over for results that you filter yourself. Its texts come from the new `commandPalette` key of the `LocaleProvider`.
