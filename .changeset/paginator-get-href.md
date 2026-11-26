---
'@loica-ui/react': minor
---

Add `getHref` to `Paginator`. It gets a page number and returns its URL, and every `PaginatorPage`, `PaginatorPrevious`, `PaginatorNext`, `PaginatorFirst` and `PaginatorLast` renders a link (an `<a>`, or the link of the `LinkProvider`) to that page instead of a button, so Ctrl+click opens a page in another tab and a crawler finds the pages. A plain click still calls `onPageChange` and does not prevent the default, a click that opens the page somewhere else does not change the current one, and a part that goes nowhere has no `href`. The page size select is not a link.
