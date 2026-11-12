# Contributing to Loica UI React

Thanks for your interest in improving Loica UI React. Please read the [Code of Conduct](CODE_OF_CONDUCT.md) before taking part.

## Reporting issues

[Open an issue](https://github.com/darioegb/loica-ui/issues) for bugs, feature requests or questions. For bugs, include the package and version, what you expected, what happened, and a minimal reproduction (the [Vite playground on StackBlitz](https://darioegb.github.io/loica-ui/?path=/docs/guides-examples--docs) is a quick way to share one). For larger changes, open an issue to discuss them before sending a pull request.

## Setting up

Requirements: Node.js 24 (see `.nvmrc`) and pnpm (`corepack enable` picks the version pinned in `package.json`).

```sh
git clone https://github.com/<your-user>/loica-ui.git
cd @loica-ui/react
pnpm install
pnpm dev   # Storybook at http://localhost:6006
pnpm dev:vite   # or dev:next: an example app, rebuilding the package as you change it
```

The [root README](README.md#development) lists the available commands and the repository structure.

## Making changes

1. Fork the repository and create a branch from `main` (see [Branch names](#branch-names)).
2. Make your change. Component code, styles, stories and tests live together in `packages/react/src/components/<category>/<name>`. To add a component, run `pnpm new:component` and follow [AUTHORING.md](AUTHORING.md).
3. Add or update tests, and stories when the change is visible in the docs.
4. Run `pnpm lint` and `pnpm test`, and check your change in Storybook. If you changed a story, run `pnpm --filter @loica-ui/docs check:a11y --url http://localhost:6006 <name>` while `pnpm dev` is running (the first time, install its browser with `pnpm --filter @loica-ui/docs exec playwright install chromium`).
5. If you changed `@loica-ui/react`, run `pnpm changeset` and commit the generated file (see [Changesets](#changesets)).
6. Open a pull request against `main` describing what changed and why.

## Commit messages

Commits follow [Conventional Commits](https://www.conventionalcommits.org) and are checked by commitlint on every commit. Use a lowercase subject and, when it helps, the package as the scope:

```text
<type>(<scope>): <subject>
```

| Type | Use for | Example |
| --- | --- | --- |
| `feat` | A new feature | `feat(tabs): add a segment variant` |
| `fix` | A bug fix | `fix(input): fit addons on narrow screens` |
| `docs` | Documentation, stories, READMEs | `docs(button): add an icon-only example` |
| `refactor` | Code changes without behavior changes | `refactor(core): extract token serialization` |
| `perf` | Performance improvements | `perf(datepicker): memoize the month grid` |
| `test` | Adding or updating tests | `test(use-mask): cover escaped characters` |
| `chore` | Tooling, dependencies, maintenance | `chore: update storybook to 9.1` |
| `ci` | GitHub Actions workflows | `ci: cache the pnpm store` |

## Branch names

Name branches after the commit type: `feat/<topic>`, `fix/<topic>`, `docs/<topic>`, `chore/<topic>` (for example `fix/input-min-width`).

## Changesets

Releases are managed with [Changesets](https://github.com/changesets/changesets). A pull request that changes the published package (`@loica-ui/react`) needs a changeset describing the change and its version bump (`patch`, `minor` or `major`). Changes limited to the docs app, examples, stories or READMEs don't need one.

After a pull request is merged, the Release workflow opens a **Version packages** pull request; merging it publishes to npm and deploys the docs. A pull request that only changes the docs deploys them when it is merged, unless `main` has unpublished changesets.

A pull request runs only the checks its changes need, and **Required** sums them up for branch protection:

| Check | Runs when | What it does |
| --- | --- | --- |
| Checks | always | build, lint, tests with coverage, `check:package`, SonarCloud |
| Accessibility (1/2, 2/2) | `packages`, `apps/docs` or the workspace config change | axe on every story in light and dark mode, half each |
| Examples | `apps/example-*`, `packages/react` or the workspace config change | `pnpm check:examples`: builds both examples against the packed package, as npm would install it |

On `main`, Build runs Checks only (SonarCloud needs the analysis of `main`), and Release versions or publishes.

The two apps in `apps/` depend on `@loica-ui/react` with `workspace:^`, so a pull request that adds a component also adds it to their demo, and the Examples job builds them against the package as it would be published. A change that breaks them breaks a user. Their deploys follow npm: StackBlitz takes the published version when the docs deploy, and the Vercel demo rebuilds on a release, or when only the example changes and no changeset is pending.

## License

By contributing, you agree that your contributions are licensed under the project's [MIT License](LICENSE).
