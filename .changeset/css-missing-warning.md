---
'@loica-ui/react': minor
---

Warn in development when a component renders without its CSS. With the per-component stylesheets (`@loica-ui/react/css/<name>.css`), forgetting one rendered the component unstyled with no error; now the console says, once for each stylesheet, which one to import. Every sheet sets a `--loica-css-<name>` custom property on `:root` that the check reads, so a sheet that another one imports counts. The check is removed from the production build by the bundler (`process.env.NODE_ENV`). `styles.css` is now documented as the way to start, and the per-component sheets as an optimization.
