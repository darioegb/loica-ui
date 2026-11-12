import { execFileSync } from 'node:child_process'
import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'

const root = execFileSync('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim()
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim()
const changed = (...paths) => git('diff', '--name-only', 'HEAD^', 'HEAD', '--', ...paths) !== ''
const app = 'apps/example-next-app'
const manifest = 'packages/react/package.json'

const versionAt = (revision) => JSON.parse(git('show', `${revision}:${manifest}`)).version
const released = () => versionAt('HEAD^') !== JSON.parse(readFileSync(path.join(root, manifest), 'utf8')).version
const pendingChangesets = () =>
  readdirSync(path.join(root, '.changeset')).some((file) => file.endsWith('.md') && file !== 'README.md')

const deploy =
  process.env.VERCEL_ENV === 'production'
    ? released() || (changed(app) && !pendingChangesets())
    : changed(app, 'packages/react', 'pnpm-lock.yaml', 'pnpm-workspace.yaml', 'turbo.json', 'package.json')

console.log(deploy ? 'Building the example' : 'Skipping the build')
process.exit(deploy ? 1 : 0)
