---
'@loica-ui/react': minor
---

New `Splitter`, `SplitterPanel` and `SplitterHandle`: panels the user resizes by dragging the handle between them, side by side or one under the other. Sizes are in percent, with `minSize` and `maxSize` on each panel, and the app can control them with `sizes` and `onSizesChange` or save them with `onResizeEnd`. The handle is a window splitter of WAI-ARIA: it takes the focus, reports the size of the panel before it, and moves with the arrow keys, `Home` and `End`. A `collapsible` panel closes with `Enter` on the handle, a double click or a drag under half of its `minSize`. It works with the pointer and with touch, and follows the direction of the text. The `LocaleProvider` takes the name of the handle with `splitter.resize`.
