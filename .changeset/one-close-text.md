---
'plume-ui-react': minor
---

One text names every close button. The `close` key of the `LocaleProvider` replaces `overlayClose`, `alert.dismiss` and `toast.dismiss`, so it names the close button of a `Modal`, a `Drawer`, a `Popover`, an `Alert` and a `Toast`, and its default is `Close` instead of `Dismiss` and `Dismiss notification`. `Alert` no longer takes `labels`, and the type `AlertLabels` is removed. `ToastProvider` keeps `labels` for `region` only. An `AlertDismiss` or a `ToastDismiss` with text as `children` is now named by that text, as the close button of a modal already was. `AlertDismiss` and `ToastDismiss` still take `label`.
