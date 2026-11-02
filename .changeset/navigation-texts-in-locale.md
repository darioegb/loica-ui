---
'plume-ui-react': minor
---

`Breadcrumb`, `Carousel`, `Paginator` and `Stepper` no longer take `labels`. Their texts come from the `LocaleProvider` (`breadcrumb`, `carousel`, `paginator` and `stepper`), and a change for one section is a nested `LocaleProvider`. A single text can still be set on the part that shows it: `label` on `CarouselPrev`, `CarouselNext`, and `aria-label` on `CarouselDots`, `CarouselSlide`, `PaginatorPage` and the edge buttons. The types `BreadcrumbLabels`, `CarouselLabels`, `PaginatorLabels` and `StepperLabels` are still exported to type the messages.
