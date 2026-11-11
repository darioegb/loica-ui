---
'@loica-ui/react': minor
---

New `LinkProvider`, which takes the link component of your router once (the `Link` of Next.js, or one that wraps the link of React Router) and makes `SidebarItem`, `NavbarItem`, `NavbarBrand` and `BreadcrumbLink` render it instead of the `<a>`, so the page is prefetched and navigates without a reload. A disabled item stays a plain `<a>` without `href`, and a link that leaves the app (an absolute URL, `mailto:`, `tel:`, a `//host` URL, or a `target` other than `_self`) stays a plain `<a>` too, so the router never gets it.

`Button` takes `href`, `target` and `rel`: with `href` it renders an `<a>`, or the link of the provider, with the look of the button. While it is `disabled` or `loading` it has no `href`, is announced as disabled and ignores its clicks. Its `ref` and event handlers belong to that anchor, although their types say `HTMLButtonElement`; the types would have to change to say so, which is a break left for 2.0.
