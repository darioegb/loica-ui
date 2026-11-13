---
'@loica-ui/react': minor
---

New `useConfirm` and `ConfirmProvider`: `if (await confirm({ title: 'Delete project?', colorScheme: 'error' })) { ... }` opens a confirmation dialog and resolves to `true` or `false`. The provider renders it as a `Modal` with `role="alertdialog"`, one at a time, with the focus on Cancel and back where it was when it closes. The texts of the buttons come from the new `confirm` key of the `LocaleProvider` (`cancel`, `confirm`), and each call can set its own. `ModalContent` now accepts a `role`.
