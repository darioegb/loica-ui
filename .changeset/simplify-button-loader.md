---
'plume-ui-react': minor
---

`Button` is a single component. Its content is its `children`, and it takes every attribute of a `<button>` (`form`, `name`, `value`, `autoFocus`, `onPointerDown`...). `label`, `labels`, `busy` and `busyText` are replaced by `children`, `loading` and `loadingText`, `data-busy` is `data-loading`, and the parts `ButtonIcon`, `ButtonLabel` and `ButtonSpinner` and the type `ButtonLabels` are removed: the icons go in `iconLeft` and `iconRight`.

`Spinner` is replaced by `Loader`, with the variants `spinner` (the default), `dots` and `bars`, and every attribute of an `<output>`. `dashed`, `dotted`, `double`, `thickness` and `speed` are removed, and without `colorScheme` it takes the color of the text around it. Its name comes from `label` or from the new `loader` key of the `LocaleProvider`, which replaces the keys `button`, `spinner` and `table`. The `Table` no longer takes `labels`, and the type `TableLabels` is removed: `TableLoading` still takes `label`.
