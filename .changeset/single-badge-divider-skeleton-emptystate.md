---
'plume-ui-react': minor
---

`Badge`, `Divider`, `Skeleton` and `EmptyState` are single components, and a Server Component can render them. `BadgeDot`, `DividerLabel`, `SkeletonLine`, `EmptyStateIcon`, `EmptyStateTitle`, `EmptyStateDescription` and `EmptyStateAction` are removed. The dot of a `Badge` comes with `dot`, the label of a `Divider` is its `children`, the lines of a `Skeleton` come with `lines` (they are all the same height and the last one is shorter), and the `EmptyState` is made with `icon`, `title`, `description` and `action`. Its `children` no longer replace the parts: they go between the description and the action. Every inner element carries a `data-plume-<component>-<element>` attribute, so it can be styled from the parent, or by putting your own element in the prop that fills it. `Badge`, `Divider`, `Skeleton` and `EmptyState` take all the native attributes of their element.
