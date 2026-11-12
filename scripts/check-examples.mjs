import { execFileSync } from 'node:child_process'
import {
  cpSync,
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  realpathSync,
  renameSync,
  rmSync,
} from 'node:fs'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const packageDir = path.join(root, 'packages/react')
const examples = ['example-vite', 'example-next-app']

if (!existsSync(path.join(packageDir, 'dist/index.mjs'))) {
  throw new Error('Build @loica-ui/react first: pnpm --filter @loica-ui/react build')
}

const work = mkdtempSync(path.join(tmpdir(), 'loica-pack-'))
const run = (command, args, cwd) => execFileSync(command, args, { cwd, stdio: 'inherit' })

try {
  run('pnpm', ['pack', '--pack-destination', work], packageDir)
  const tarball = readdirSync(work).find((name) => name.endsWith('.tgz'))
  run('tar', ['-xzf', tarball], work)
  const packed = path.join(work, 'package')

  for (const example of examples) {
    const exampleDir = path.join(root, 'apps', example)
    const target = path.join(exampleDir, 'node_modules/@loica-ui/react')
    const saved = path.join(work, `${example}-saved`)
    const hadTarget = existsSync(target) || isLink(target)
    if (hadTarget) renameSync(target, saved)
    try {
      mkdirSync(path.dirname(target), { recursive: true })
      cpSync(packed, target, { recursive: true })
      const resolved = realpathSync(
        createRequire(path.join(exampleDir, 'package.json')).resolve('@loica-ui/react/package.json'),
      )
      if (!resolved.startsWith(target)) throw new Error(`${example} resolves @loica-ui/react to ${resolved}`)
      const { name } = JSON.parse(readFileSync(path.join(exampleDir, 'package.json'), 'utf8'))
      console.log(`\n${example}: building against the packed @loica-ui/react`)
      run('pnpm', ['--filter', name, 'build'], root)
    } finally {
      rmSync(target, { force: true, recursive: true })
      if (hadTarget) renameSync(saved, target)
    }
  }
} finally {
  rmSync(work, { force: true, recursive: true })
}

function isLink(file) {
  try {
    return lstatSync(file).isSymbolicLink()
  } catch {
    return false
  }
}
