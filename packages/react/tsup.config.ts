// tsup.config.ts
import { promises as fsPromises, readdirSync } from 'node:fs'
import path from 'node:path'
import { transform } from 'esbuild'
import { defineConfig, type Options } from 'tsup'
import postcss from 'postcss'
import { buildCssUnits, cssMarker, unitOf } from './scripts/component-css'
import { breakpoints } from './scripts/postcss-breakpoints'
import { buildTokensCss } from './scripts/tokens-css'
import postcssModules from 'postcss-modules'

type Plugin = NonNullable<Options['esbuildPlugins']>[number]

const cssCheckFile = path.resolve('src/overlay/css-check.ts')

function cssModulePlugin({ emitCss }: { emitCss: boolean }): Plugin {
  return {
    name: 'css-module',
    setup(build): void {
      build.onResolve({ filter: /\.module\.css$/, namespace: 'file' }, (args) => ({
        path: `${args.path}#css-module`,
        namespace: 'css-module',
        pluginData: {
          pathDir: path.join(args.resolveDir, args.path),
        },
      }))
      build.onLoad({ filter: /#css-module$/, namespace: 'css-module' }, async (args) => {
        const { pluginData } = args as {
          pluginData: { pathDir: string }
        }
        const source = await fsPromises.readFile(pluginData.pathDir, 'utf8')
        let cssModule = {}
        const result = await postcss([
          breakpoints(),
          postcssModules({
            getJSON(_, json) {
              cssModule = json
            },
          }),
        ]).process(source, { from: pluginData.pathDir })
        const cssImport = emitCss ? `import "${pluginData.pathDir}"; ` : ''
        const check = `import { cssModule } from ${JSON.stringify(cssCheckFile)}; `
        return {
          pluginData: { css: result.css },
          contents: `${cssImport}${check}export default cssModule(${JSON.stringify(unitOf(pluginData.pathDir))}, ${JSON.stringify(cssModule)})`,
        }
      })
      build.onResolve({ filter: /css-check\.ts$/, namespace: 'css-module' }, (args) => ({
        path: args.path,
        namespace: 'file',
      }))
      build.onResolve({ filter: /\.module\.css$/, namespace: 'css-module' }, (args) => ({
        path: path.join(args.resolveDir, args.path, '#css-module-data'),
        namespace: 'css-module',
        pluginData: args.pluginData as { css: string },
      }))
      build.onLoad({ filter: /#css-module-data$/, namespace: 'css-module' }, (args) => ({
        contents: (args.pluginData as { css: string }).css,
        loader: 'css',
      }))
    },
  }
}

function preserveModulesPlugin(): Plugin {
  return {
    name: 'preserve-modules',
    setup(build): void {
      build.onResolve({ filter: /^\.\.?\// }, async (args) => {
        if (args.kind === 'entry-point' || args.path.endsWith('.css') || args.pluginData) return undefined
        const resolved = await build.resolve(args.path, {
          kind: args.kind,
          resolveDir: args.resolveDir,
          pluginData: true,
        })
        if (resolved.errors.length > 0) return { errors: resolved.errors }
        const relative = path
          .relative(args.resolveDir, resolved.path)
          .replace(/\.tsx?$/, '.mjs')
          .split(path.sep)
          .join('/')
        return { path: relative.startsWith('.') ? relative : `./${relative}`, external: true }
      })
    },
  }
}

const moduleEntries = ['src/**/*.{ts,tsx}', '!src/**/tests/**', '!src/**/stories/**']

const localeNames = readdirSync('src/locales')
  .filter((file) => file.endsWith('.ts'))
  .map((file) => file.replace(/\.ts$/, ''))

const entryPoints: Record<string, string> = {
  index: 'src/index.ts',
  ...Object.fromEntries(localeNames.map((name) => [`locales/${name}`, `src/locales/${name}.ts`])),
}

async function emitLocaleTypes(): Promise<void> {
  await fsPromises.mkdir('dist/locales', { recursive: true })
  await Promise.all(
    localeNames.flatMap((name) => [
      fsPromises.writeFile(
        `dist/locales/${name}.d.ts`,
        `import type { LocaleMessages } from '../index'\nexport declare const ${name}: LocaleMessages\n`,
      ),
      fsPromises.writeFile(
        `dist/locales/${name}.d.mts`,
        `import type { LocaleMessages } from '../index.mjs'\nexport declare const ${name}: LocaleMessages\n`,
      ),
    ]),
  )
}

async function emitStylesheet(): Promise<void> {
  const css = await fsPromises.readFile('dist/index.css', 'utf8')
  const tokens = buildTokensCss()
  const units = await buildCssUnits(path.resolve('src'))
  const markers = Object.keys(units).map(cssMarker).join('')
  await fsPromises.writeFile('dist/tokens.css', `@layer base,loica,components,utilities;@layer loica{${tokens}}`)
  await fsPromises.writeFile(
    'dist/styles.css',
    `@layer base,loica,components,utilities;@layer loica{${tokens}${css}${markers}}`,
  )
  await fsPromises.rm('dist/index.css')
  await emitComponentStylesheets(units)
  await emitLocaleTypes()
}

async function emitComponentStylesheets(units: Awaited<ReturnType<typeof buildCssUnits>>): Promise<void> {
  await fsPromises.mkdir('dist/css', { recursive: true })
  await Promise.all(
    Object.entries(units).map(async ([name, unit]) => {
      const { code } = await transform(unit.css + cssMarker(name), { loader: 'css', minify: true })
      const imports = unit.imports.map((dep) => `@import './${dep}.css';`).join('')
      await fsPromises.writeFile(
        `dist/css/${name}.css`,
        `@layer base,loica,components,utilities;${imports}@layer loica{${code}}`,
      )
    }),
  )
}

export default defineConfig((options) => {
  const shared: Options = {
    minify: false,
    target: 'es2020',
    tsconfig: 'tsconfig.json',
    external: ['react', 'react-dom'],
  }

  return [
    {
      ...shared,
      entry: moduleEntries,
      format: ['esm'],
      dts: { entry: 'src/index.ts' },
      esbuildPlugins: [cssModulePlugin({ emitCss: false }), preserveModulesPlugin()],
    },
    {
      ...shared,
      entry: entryPoints,
      format: ['cjs'],
      dts: { entry: 'src/index.ts' },
      esbuildPlugins: [cssModulePlugin({ emitCss: true })],
      onSuccess: emitStylesheet,
    },
  ]
})
