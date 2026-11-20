---
'@loica-ui/react': minor
---

`Select` can search on a server. `onSearchChange` gets the text of the search each time it changes (and an empty string when the list closes), `filter={false}` shows the options you pass instead of hiding the ones that don't match, and `loading` shows a `Loader` in the list, marks it busy and holds back the empty message while the options arrive. With the filter off, the select remembers the text of the chosen options, so they stay in the field when the next results don't have them, and the active option moves to the first of the new results. The `Loader` is a new part, `SelectLoading`, and takes its name from the `loader` text of the `LocaleProvider`.
