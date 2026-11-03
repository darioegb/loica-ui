---
'plume-ui-react': minor
---

`DropdownGroup` gathers related items of a `DropdownMenu` with `role="group"`, named by its `DropdownLabel` or its `label`, so a screen reader announces the title when the focus enters it. The `DropdownTrigger` points to the open menu with `aria-controls`.

A `Tree` with `selection="multiple"` selects ranges: <kbd>Shift</kbd> with the arrows, <kbd>Space</kbd> or a click, <kbd>Ctrl</kbd> <kbd>Shift</kbd> with <kbd>Home</kbd> or <kbd>End</kbd>, and <kbd>Ctrl</kbd> or <kbd>⌘</kbd> with <kbd>A</kbd> for every visible item.

`CarouselPlayPause` can be written before the `CarouselSlides`, to be the first stop of the Tab order as the WAI-ARIA carousel pattern asks, and the Carousel still shows it under the slides. The examples do so.
