---
'plume-ui-react': minor
---

The simple case of a component can close on itself:

- `Button`, `Badge` and `Chip` take their content as `label` too: `<Button label="Save" />`. `children` win when both are set.
- `Alert` and `Card` take `title` and `description`, and build their `AlertTitle` and `AlertDescription`, or `CardHeader` and `CardBody`. `title` is no longer the native tooltip of their element.
- `Select` takes its options as data with `options`, plus `placeholder`, `aria-label` and `aria-labelledby` for the trigger it draws. It keeps a `SelectTrigger` or a `SelectContent` you give it. The type of an option is `SelectOptionData`.
