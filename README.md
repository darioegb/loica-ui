<p align="center">
  <a href="https://darioegb.github.io/loica-ui/">
    <img src="https://darioegb.github.io/loica-ui/logo.svg" alt="" width="72" />
  </a>
</p>

<h1 align="center">Loica UI React</h1>

<p align="center">A lightweight design system for React</p>

<p align="center">
  <img alt="Bundle size" src="https://img.shields.io/bundlejs/size/@loica-ui/react" />
  <img alt="npm downloads" src="https://img.shields.io/npm/dm/@loica-ui/react" />
  <img alt="Last commit" src="https://img.shields.io/github/last-commit/darioegb/loica-ui" />
  <img alt="License" src="https://img.shields.io/npm/l/@loica-ui/react" />
  <a href="https://sonarcloud.io/summary/new_code?id=darioegb_loica-ui"><img alt="Quality Gate Status" src="https://sonarcloud.io/api/project_badges/measure?project=darioegb_loica-ui&metric=alert_status" /></a>
</p>

Components ship their own scoped styles and are themed entirely through CSS variables, so they adapt to your brand and switch between light and dark without runtime color math.

- **Themeable**: every design token is a CSS variable. The stylesheet declares the defaults and `<ThemeProvider>` changes the ones your theme overrides.
- **Light & dark**: built in, set with `defaultColorMode` and switched with `setColorMode`.
- **Framework-agnostic**: use the components as they are, or set `variant="unstyled"` and style them with Tailwind or Bootstrap.
- **Typed**: written in TypeScript, with React 18 and 19 support.

## Contents

- [Documentation](#documentation)
- [Installation](#installation)
- [Components](#components)
- [Examples](#examples)
- [Development](#development)
- [Releasing](#releasing)
- [Contributing](#contributing)
- [License](#license)

## Documentation

The [documentation site](https://darioegb.github.io/loica-ui/) has the examples of every component with their code (each one opens in StackBlitz) and its API reference, plus the color palette, design tokens, framework integration guides and the [examples](https://darioegb.github.io/loica-ui/?path=/docs/guides-examples--docs). The [roadmap](https://darioegb.github.io/loica-ui/?path=/docs/guides-roadmap--docs) says where the library is heading, and the [milestones](https://github.com/darioegb/loica-ui/milestones) what each release holds.

## Installation

```sh
npm install @loica-ui/react
# or
pnpm add @loica-ui/react
# or
yarn add @loica-ui/react
```

`@loica-ui/react` is the only package you need: it includes every component, the theme (`ThemeProvider`, `useTheme`, tokens and types), the hooks and the utilities. `react` and `react-dom` (>= 18) are peer dependencies.

Import the stylesheet once and wrap your app in `<ThemeProvider>`:

```tsx
import '@loica-ui/react/styles.css'
import { Button, ThemeProvider } from '@loica-ui/react'

export function App() {
  return (
    <ThemeProvider defaultColorMode="light">
      <Button colorScheme="primary" label="Click me" />
    </ThemeProvider>
  )
}
```

To load only the CSS of some components, import `tokens.css` once and then the stylesheet of each component (each one brings the CSS of the components it renders):

```tsx
import '@loica-ui/react/tokens.css'
import '@loica-ui/react/css/button.css'
import '@loica-ui/react/css/input.css'
```

## Components

| Component | Docs |
| --- | --- |
| Accordion | [Accordion](https://darioegb.github.io/loica-ui/?path=/docs/components-accordion--docs) |
| Alert | [Alert](https://darioegb.github.io/loica-ui/?path=/docs/components-alert--docs) |
| Avatar | [Avatar](https://darioegb.github.io/loica-ui/?path=/docs/components-avatar--docs) |
| Badge | [Badge](https://darioegb.github.io/loica-ui/?path=/docs/components-badge--docs) |
| Breadcrumb | [Breadcrumb](https://darioegb.github.io/loica-ui/?path=/docs/components-breadcrumb--docs) |
| Button | [Button](https://darioegb.github.io/loica-ui/?path=/docs/components-button--docs) |
| Card | [Card](https://darioegb.github.io/loica-ui/?path=/docs/components-card--docs) |
| Carousel | [Carousel](https://darioegb.github.io/loica-ui/?path=/docs/components-carousel--docs) |
| Checkbox | [Checkbox](https://darioegb.github.io/loica-ui/?path=/docs/components-checkbox--docs) |
| Chip | [Chip](https://darioegb.github.io/loica-ui/?path=/docs/components-chip--docs) |
| Code | [Code](https://darioegb.github.io/loica-ui/?path=/docs/components-code--docs) |
| Collapse | [Collapse](https://darioegb.github.io/loica-ui/?path=/docs/components-collapse--docs) |
| Confirm | [Confirm](https://darioegb.github.io/loica-ui/?path=/docs/components-confirm--docs) |
| Container | [Container](https://darioegb.github.io/loica-ui/?path=/docs/components-container--docs) |
| DatePicker | [DatePicker](https://darioegb.github.io/loica-ui/?path=/docs/components-datepicker--docs) |
| DescriptionList | [DescriptionList](https://darioegb.github.io/loica-ui/?path=/docs/components-descriptionlist--docs) |
| Divider | [Divider](https://darioegb.github.io/loica-ui/?path=/docs/components-divider--docs) |
| Drawer | [Drawer](https://darioegb.github.io/loica-ui/?path=/docs/components-drawer--docs) |
| Dropdown | [Dropdown](https://darioegb.github.io/loica-ui/?path=/docs/components-dropdown--docs) |
| EmptyState | [EmptyState](https://darioegb.github.io/loica-ui/?path=/docs/components-emptystate--docs) |
| Field | [Field](https://darioegb.github.io/loica-ui/?path=/docs/components-field--docs) |
| FileUpload | [FileUpload](https://darioegb.github.io/loica-ui/?path=/docs/components-fileupload--docs) |
| Heading | [Heading](https://darioegb.github.io/loica-ui/?path=/docs/components-heading--docs) |
| Icon | [Icon](https://darioegb.github.io/loica-ui/?path=/docs/components-icon--docs) |
| Input | [Input](https://darioegb.github.io/loica-ui/?path=/docs/components-input--docs) |
| Kbd | [Kbd](https://darioegb.github.io/loica-ui/?path=/docs/components-kbd--docs) |
| Link | [Link](https://darioegb.github.io/loica-ui/?path=/docs/components-link--docs) |
| List | [List](https://darioegb.github.io/loica-ui/?path=/docs/components-list--docs) |
| Loader | [Loader](https://darioegb.github.io/loica-ui/?path=/docs/components-loader--docs) |
| Modal | [Modal](https://darioegb.github.io/loica-ui/?path=/docs/components-modal--docs) |
| Navbar | [Navbar](https://darioegb.github.io/loica-ui/?path=/docs/components-navbar--docs) |
| NumberInput | [NumberInput](https://darioegb.github.io/loica-ui/?path=/docs/components-numberinput--docs) |
| PageHeader | [PageHeader](https://darioegb.github.io/loica-ui/?path=/docs/components-pageheader--docs) |
| Paginator | [Paginator](https://darioegb.github.io/loica-ui/?path=/docs/components-paginator--docs) |
| PinInput | [PinInput](https://darioegb.github.io/loica-ui/?path=/docs/components-pininput--docs) |
| Popover | [Popover](https://darioegb.github.io/loica-ui/?path=/docs/components-popover--docs) |
| ProgressBar | [ProgressBar](https://darioegb.github.io/loica-ui/?path=/docs/components-progressbar--docs) |
| Radio | [Radio](https://darioegb.github.io/loica-ui/?path=/docs/components-radio--docs) |
| Rating | [Rating](https://darioegb.github.io/loica-ui/?path=/docs/components-rating--docs) |
| Select | [Select](https://darioegb.github.io/loica-ui/?path=/docs/components-select--docs) |
| Sidebar | [Sidebar](https://darioegb.github.io/loica-ui/?path=/docs/components-sidebar--docs) |
| Skeleton | [Skeleton](https://darioegb.github.io/loica-ui/?path=/docs/components-skeleton--docs) |
| Slider | [Slider](https://darioegb.github.io/loica-ui/?path=/docs/components-slider--docs) |
| Stack | [Stack](https://darioegb.github.io/loica-ui/?path=/docs/components-stack--docs) |
| Stat | [Stat](https://darioegb.github.io/loica-ui/?path=/docs/components-stat--docs) |
| Stepper | [Stepper](https://darioegb.github.io/loica-ui/?path=/docs/components-stepper--docs) |
| Table | [Table](https://darioegb.github.io/loica-ui/?path=/docs/components-table--docs) |
| Tabs | [Tabs](https://darioegb.github.io/loica-ui/?path=/docs/components-tabs--docs) |
| Text | [Text](https://darioegb.github.io/loica-ui/?path=/docs/components-text--docs) |
| Textarea | [Textarea](https://darioegb.github.io/loica-ui/?path=/docs/components-textarea--docs) |
| TimePicker | [TimePicker](https://darioegb.github.io/loica-ui/?path=/docs/components-timepicker--docs) |
| Toast | [Toast](https://darioegb.github.io/loica-ui/?path=/docs/components-toast--docs) |
| Toggle | [Toggle](https://darioegb.github.io/loica-ui/?path=/docs/components-toggle--docs) |
| Tooltip | [Tooltip](https://darioegb.github.io/loica-ui/?path=/docs/components-tooltip--docs) |
| Tree | [Tree](https://darioegb.github.io/loica-ui/?path=/docs/components-tree--docs) |

Coming from a 0.x version? See the [upgrading guide](https://darioegb.github.io/loica-ui/?path=/docs/guides-upgrading-to-1-0--docs).

## Examples

Standalone apps that consume the **published npm package** (not the workspace sources). Both use a custom theme: a `primary` override plus a new `salmon` color scheme, typed with module augmentation.

- **[Vite](apps/example-vite)**: a client-only SPA with a slice of the same product, to try the components and edit the code.

  [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://darioegb.github.io/loica-ui/?path=/docs/guides-examples--docs)

- **[Next.js App Router](apps/example-next-app)**: a project dashboard with a sign in, a sidebar and dark mode, rendered on the server with no theme flash. [Live demo](https://loica-ui.vercel.app), deployed on Vercel.

Both are also linked from the [Examples page of the docs](https://darioegb.github.io/loica-ui/?path=/docs/guides-examples--docs).

## Development

This is a [pnpm](https://pnpm.io) + [Turborepo](https://turborepo.com) monorepo. Packages are bundled with [tsup](https://tsup.egoist.dev), documented with [Storybook](https://storybook.js.org) and tested with [Vitest](https://vitest.dev) and Testing Library.

Requirements: Node.js 24 (see `.nvmrc`) and pnpm (`corepack enable` picks the version pinned in `package.json`).

```sh
pnpm install
pnpm dev            # Storybook with hot reload at http://localhost:6006
```

| Command | Description |
| --- | --- |
| `pnpm dev` | Run the docs (Storybook) in development mode |
| `pnpm dev:vite` / `pnpm dev:next` | Run an example app, rebuilding the package as you change it |
| `pnpm build` | Build the `@loica-ui/react` package |
| `pnpm build:docs` | Build the packages and the static Storybook site (`apps/docs/storybook-static`) |
| `pnpm test` | Run the tests |
| `pnpm test:coverage` | Run the tests with coverage |
| `pnpm lint` / `pnpm lint:fix` | Lint every package |
| `pnpm check:examples` | Build both examples against the packed package, as npm would install it |
| `pnpm --filter @loica-ui/docs check:a11y` | Run axe on every story in light and dark mode (see [AUTHORING.md](AUTHORING.md)) |
| `pnpm new:component <Name> <category>` | Scaffold a component (see [AUTHORING.md](AUTHORING.md)) |
| `pnpm changeset` | Describe a change that should be released |
| `pnpm clean` | Remove build output and `node_modules` |

### Repository structure

```text
apps/
  docs/                      Storybook documentation site
  example-*/                 Example apps (Vite, Next.js App Router), built with the package
packages/
  @loica-ui/react/            The published package
    src/components/<category>/<name>/   One folder per component, with its stories and tests
    src/theme/               ThemeProvider, design tokens and shared types
    src/hooks/               Shared hooks (use-mask, use-debounce)
    src/utils/               Shared utilities (color, date, lazy, merge)
  eslint-config-custom/      Shared ESLint config
  tsconfig/                  Shared TypeScript configs
```

Component stories live next to each component (`packages/react/src/components/<category>/<name>/stories`) and are picked up by the docs app.

## Releasing

Versioning and publishing use [Changesets](https://github.com/changesets/changesets):

1. If a pull request changes `@loica-ui/react`, add a changeset with `pnpm changeset` and commit the generated file. Changes to the docs, examples or stories don't need one.
2. When it is merged into `main`, the Release workflow opens (or updates) a **Version packages** pull request that bumps versions and updates the changelogs.
3. Merging that pull request publishes the new versions to npm.

The documentation site is deployed to GitHub Pages when a release is published, so it always documents the version on
npm. A change that only touches the docs (the docs app or the stories) is deployed when it is merged into `main`, as long
as `main` has no unpublished changesets; with some pending, it goes out with the release. **Run workflow** on the Docs
workflow deploys by hand, and refuses while `main` has unpublished changesets.

## Contributing

Bug reports, ideas and pull requests are welcome. Please [open an issue](https://github.com/darioegb/loica-ui/issues) first for larger changes, and read the [contributing guidelines](CONTRIBUTING.md) and [code of conduct](CODE_OF_CONDUCT.md). Commit messages follow [Conventional Commits](https://www.conventionalcommits.org) (checked by commitlint).

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/darioegb"><img src="https://avatars2.githubusercontent.com/u/1558318?v=4?s=64" width="64px;" alt="Darío Gonzalez"/><br /><sub><b>Darío Gonzalez</b></sub></a><br /><a href="https://github.com/darioegb/loica-ui/commits?author=darioegb" title="Code">💻</a> <a href="#maintenance-darioegb" title="Maintenance">🚧</a> <a href="https://github.com/darioegb/loica-ui/commits?author=darioegb" title="Documentation">📖</a> <a href="#example-darioegb" title="Examples">💡</a></td>
    </tr>
  </tbody>
</table>

## License

[MIT](./LICENSE) © [Dario Gonzalez](https://github.com/darioegb)
