import { defaultTheme } from '../src/theme/config'

const loica = (name: string): string => `var(--loica-${name})`
const line = (name: string, value: string): string => `  --${name}: ${value};`
const keys = (record: object): string[] => Object.keys(record)
const kebab = (key: string): string => key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)

function colors(): string[] {
  const schemes = keys(defaultTheme.colors)
  const entries = schemes.flatMap((scheme) => [
    line(`color-${scheme}-solid`, loica(`color-${scheme}-solid`)),
    line(`color-${scheme}-on-solid`, loica(`color-${scheme}-solid-contrast`)),
    line(`color-${scheme}-text`, loica(`color-${scheme}-text`)),
    line(`color-${scheme}-tint`, loica(`color-${scheme}-tint`)),
    line(`color-${scheme}-tint-strong`, loica(`color-${scheme}-tint-strong`)),
    line(`color-${scheme}-tint-text`, loica(`color-${scheme}-tint-text`)),
  ])
  const semantic = keys(defaultTheme.semantic).map((key) =>
    line(`color-${kebab(key)}`, loica(kebab(key))),
  )
  return [...entries, ...semantic]
}

const scale = (prefix: string, record: object, token: string): string[] =>
  keys(record).map((key) => line(`${prefix}-${kebab(key)}`, loica(`${token}-${kebab(key)}`)))

function textStyles(): string[] {
  return keys(defaultTheme.textStyles).flatMap((name) => [
    line(`text-${name}`, loica(`text-${name}-size`)),
    line(`text-${name}--line-height`, loica(`text-${name}-line-height`)),
    line(`text-${name}--letter-spacing`, loica(`text-${name}-letter-spacing`)),
    line(`text-${name}--font-weight`, loica(`text-${name}-weight`)),
  ])
}

const utility = (name: string, declaration: string): string =>
  `@utility ${name} {\n  ${declaration};\n}`

function utilities(): string[] {
  return [
    ...keys(defaultTheme.zIndices).map((name) =>
      utility(`z-${name}`, `z-index: ${loica(`z-${name}`)}`),
    ),
    ...keys(defaultTheme.motion.durations).map((name) =>
      utility(`duration-${name}`, `transition-duration: ${loica(`duration-${name}`)}`),
    ),
    utility('opacity-disabled', `opacity: ${loica('opacity-disabled')}`),
    ...keys(defaultTheme.controlHeights).flatMap((name) => [
      utility(`h-control-${name}`, `height: ${loica(`control-height-${name}`)}`),
      utility(`min-h-control-${name}`, `min-height: ${loica(`control-height-${name}`)}`),
    ]),
  ]
}

/**
 * The theme for Tailwind CSS v4: `@theme inline` points every utility to the variable of Loica
 * (`bg-primary-solid` is `var(--loica-color-primary-solid)`), so they follow the theme and the color
 * mode. `inline` is what keeps the variable and not its value, which a nested provider needs. The
 * spacing, the breakpoints and the values a scale of Loica doesn't have (`shadow-sm`, `max-w-xl`...)
 * stay the ones of Tailwind v4, which are the same where both have one.
 *
 * The package doesn't publish it: the docs use it for their stories and their StackBlitz projects,
 * and show it in the Framework integration guide for the apps to copy.
 */
export function buildTailwindCss(): string {
  const theme = [
    ...colors(),
    line('font-loica', loica('font-family')),
    line('font-loica-mono', loica('font-family-mono')),
    ...scale('text', defaultTheme.typography.fontSizes, 'font-size'),
    ...textStyles(),
    ...scale('font-weight', defaultTheme.typography.fontWeights, 'font-weight'),
    ...scale('leading', defaultTheme.typography.lineHeights, 'line-height'),
    ...scale('tracking', defaultTheme.typography.letterSpacings, 'letter-spacing'),
    ...scale('radius', defaultTheme.radii, 'radius'),
    ...scale('shadow', defaultTheme.shadows, 'shadow'),
    ...scale('container', defaultTheme.containers, 'container'),
    ...scale('ease', defaultTheme.motion.easings, 'easing'),
  ]
  return `@theme inline {\n${theme.join('\n')}\n}\n\n${utilities().join('\n\n')}\n`
}
