import { defaultTheme } from '../src/theme/config'
import { getDefaultCssVars } from '../src/theme/default-css-vars'
import { getEmittedTokens } from './emitted-tokens'

type Plume = (name: string) => string

const line = (name: string, value: string): string => `  --${name}: ${value};`
const keys = (record: object): string[] => Object.keys(record)
const kebab = (key: string): string => key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)

function colors(plume: Plume): string[] {
  const schemes = keys(defaultTheme.colors)
  const entries = schemes.flatMap((scheme) => [
    line(`color-${scheme}-solid`, plume(`color-${scheme}-solid`)),
    line(`color-${scheme}-on-solid`, plume(`color-${scheme}-solid-contrast`)),
    line(`color-${scheme}-text`, plume(`color-${scheme}-text`)),
    line(`color-${scheme}-tint`, plume(`color-${scheme}-tint`)),
    line(`color-${scheme}-tint-strong`, plume(`color-${scheme}-tint-strong`)),
    line(`color-${scheme}-tint-text`, plume(`color-${scheme}-tint-text`)),
  ])
  const semantic = keys(defaultTheme.semantic).map((key) =>
    line(`color-${kebab(key)}`, plume(kebab(key))),
  )
  return [...entries, ...semantic]
}

const scale = (plume: Plume, prefix: string, record: object, token: string): string[] =>
  keys(record).map((key) => line(`${prefix}-${kebab(key)}`, plume(`${token}-${kebab(key)}`)))

function textStyles(plume: Plume): string[] {
  return keys(defaultTheme.textStyles).flatMap((name) => [
    line(`text-${name}`, plume(`text-${name}-size`)),
    line(`text-${name}--line-height`, plume(`text-${name}-line-height`)),
    line(`text-${name}--letter-spacing`, plume(`text-${name}-letter-spacing`)),
    line(`text-${name}--font-weight`, plume(`text-${name}-weight`)),
  ])
}

const utility = (name: string, declaration: string): string =>
  `@utility ${name} {\n  ${declaration};\n}`

function utilities(plume: Plume): string[] {
  return [
    ...keys(defaultTheme.zIndices).map((name) =>
      utility(`z-${name}`, `z-index: ${plume(`z-${name}`)}`),
    ),
    ...keys(defaultTheme.motion.durations).map((name) =>
      utility(`duration-${name}`, `transition-duration: ${plume(`duration-${name}`)}`),
    ),
    utility('opacity-disabled', `opacity: ${plume('opacity-disabled')}`),
    ...keys(defaultTheme.controlHeights).flatMap((name) => [
      utility(`h-control-${name}`, `height: ${plume(`control-height-${name}`)}`),
      utility(`min-h-control-${name}`, `min-height: ${plume(`control-height-${name}`)}`),
    ]),
  ]
}

/**
 * The theme for Tailwind CSS v4: `@theme inline` points every utility to the variable of Plume
 * (`bg-primary-solid` is `var(--plume-color-primary-solid)`), so they follow the theme and the color
 * mode. `inline` is what keeps the variable and not its value, which a nested provider needs. The
 * variables `tokens.css` doesn't declare (the long spaces scale, the largest containers...) carry
 * the default value as fallback, so the utilities work without declaring them. The spacing, the breakpoints and the
 * container widths of Tailwind v4 are already the ones of Plume.
 *
 * The package doesn't publish it: the docs use it for their stories and their StackBlitz projects,
 * and show it in the Framework integration guide for the apps to copy.
 */
export function buildTailwindCss(srcDir: string): string {
  const emitted = getEmittedTokens(srcDir)
  const defaults = getDefaultCssVars('light')
  const plume: Plume = (name) => {
    const token = `--plume-${name}`
    return emitted.has(token) ? `var(${token})` : `var(${token}, ${defaults[token]})`
  }
  const theme = [
    ...colors(plume),
    line('font-plume', plume('font-family')),
    line('font-plume-mono', plume('font-family-mono')),
    ...scale(plume, 'text', defaultTheme.typography.fontSizes, 'font-size'),
    ...textStyles(plume),
    ...scale(plume, 'font-weight', defaultTheme.typography.fontWeights, 'font-weight'),
    ...scale(plume, 'leading', defaultTheme.typography.lineHeights, 'line-height'),
    ...scale(plume, 'tracking', defaultTheme.typography.letterSpacings, 'letter-spacing'),
    ...scale(plume, 'radius', defaultTheme.radii, 'radius'),
    ...scale(plume, 'shadow', defaultTheme.shadows, 'shadow'),
    ...scale(plume, 'container', defaultTheme.containers, 'container'),
    ...scale(plume, 'ease', defaultTheme.motion.easings, 'easing'),
  ]
  return `@theme inline {\n${theme.join('\n')}\n}\n\n${utilities(plume).join('\n\n')}\n`
}
