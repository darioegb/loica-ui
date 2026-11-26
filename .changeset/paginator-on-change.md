---
'@loica-ui/react': minor
---

`Paginator` takes an `onChange({ page, pageSize })` that is called once for each change the user makes, with the page and the page size together. Changing the page size changes the page too, so `onPageSizeChange` and `onPageChange` are called one after the other and an app that keeps both in the URL or in a request had to merge them. `onChange` is called after those two, which work as before.
