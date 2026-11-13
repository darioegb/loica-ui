import { getContrastRatio } from '../../utils/colors'
import { deepMerge } from '../../utils/merge'
import { defaultDarkTheme, defaultTheme } from '../config'
import { themeToCssVars } from '../theme-to-css-vars'
import type { Theme } from '../theme.types'

type Ramp = Record<string, string>

const ramp = (color: string, overrides: Ramp = {}): Ramp => ({
  ...Object.fromEntries(
    ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'].map((key) => [
      key,
      color,
    ]),
  ),
  ...overrides,
})

const withColors = (colors: Record<string, Ramp>, base: Theme = defaultTheme): Theme => ({
  ...base,
  colors: colors as unknown as Theme['colors'],
})

const darkTheme = deepMerge<Theme>(defaultTheme, defaultDarkTheme as Theme)

describe('themeToCssVars', () => {
  it('emits the derived colors of every color scheme and not its shades', () => {
    const vars = themeToCssVars(defaultTheme)
    const tokens = [
      'solid',
      'solid-contrast',
      'solid-hover',
      'solid-active',
      'text',
      'text-hover',
      'text-active',
      'tint',
      'tint-strong',
      'tint-text',
    ]
    for (const scheme of Object.keys(defaultTheme.colors)) {
      const names = Object.keys(vars).filter((key) => key.startsWith(`--loica-color-${scheme}-`))
      expect(names.map((name) => name.slice(`--loica-color-${scheme}-`.length)).sort()).toEqual(
        [...tokens].sort(),
      )
    }
  })

  it('emits the semantic colors in kebab case', () => {
    const vars = themeToCssVars(defaultTheme)
    expect(vars['--loica-background']).toBe(defaultTheme.semantic.background)
    expect(vars['--loica-surface-muted']).toBe(defaultTheme.semantic.surfaceMuted)
  })

  it('emits the typography, spacing and layout scales', () => {
    const vars = themeToCssVars(defaultTheme)
    expect(vars['--loica-font-family']).toBe(defaultTheme.typography.fontFamily)
    expect(vars['--loica-z-modal']).toBe(String(defaultTheme.zIndices.modal))
    for (const scale of [
      'font-size',
      'font-weight',
      'line-height',
      'space',
      'radius',
      'z',
      'shadow',
    ]) {
      expect(Object.keys(vars).some((key) => key.startsWith(`--loica-${scale}-`))).toBe(true)
    }
  })

  it('does not emit the breakpoints, the sizes or the contrast of the base shade', () => {
    const keys = Object.keys(themeToCssVars(defaultTheme))
    expect(keys.some((key) => key.startsWith('--loica-breakpoint-'))).toBe(false)
    expect(keys.some((key) => key.startsWith('--loica-size-'))).toBe(false)
    expect(keys).not.toContain('--loica-color-primary-contrast')
  })

  it('emits motion, focus ring, border, control and opacity tokens', () => {
    const vars = themeToCssVars(defaultTheme)
    expect(vars['--loica-container-lg']).toBe('32rem')
    expect(vars['--loica-container-3xl']).toBe('48rem')
    expect(vars['--loica-container-5xl']).toBe('64rem')
    expect(vars['--loica-container-7xl']).toBe('80rem')
    expect(vars['--loica-duration-normal']).toBe(defaultTheme.motion.durations.normal)
    expect(vars['--loica-easing-in-out']).toBe(defaultTheme.motion.easings.inOut)
    expect(vars['--loica-focus-ring-width']).toBe(defaultTheme.focusRing.width)
    expect(vars['--loica-focus-ring-offset']).toBe(defaultTheme.focusRing.offset)
    expect(vars['--loica-focus-ring-color']).toBe(defaultTheme.focusRing.color)
    expect(vars['--loica-border-width-thin']).toBe(defaultTheme.borderWidths.thin)
    expect(vars['--loica-border-width-medium']).toBe(defaultTheme.borderWidths.medium)
    expect(vars['--loica-border-width-thick']).toBe(defaultTheme.borderWidths.thick)
    expect(vars['--loica-control-height-md']).toBe(defaultTheme.controlHeights.md)
    expect(vars['--loica-opacity-disabled']).toBe('0.5')
    expect(vars['--loica-backdrop']).toBe(defaultTheme.semantic.backdrop)
  })

  it('names the half steps of the spacing scale without a dot', () => {
    const vars = themeToCssVars(defaultTheme)
    expect(vars['--loica-space-1-5']).toBe('0.375rem')
    expect(Object.keys(vars).some((key) => key.includes('.'))).toBe(false)
  })

  it('emits the larger sizes and the letter spacings', () => {
    const vars = themeToCssVars(defaultTheme)
    expect(vars['--loica-font-size-4xl']).toBe('2.25rem')
    expect(vars['--loica-letter-spacing-tight']).toBe('-0.025em')
  })

  it('emits the four properties of every text style', () => {
    const vars = themeToCssVars(defaultTheme)
    for (const name of Object.keys(defaultTheme.textStyles)) {
      for (const property of ['size', 'weight', 'line-height', 'letter-spacing']) {
        expect(vars[`--loica-text-${name}-${property}`]).toBeTruthy()
      }
    }
    expect(vars['--loica-text-heading-1-size']).toBe('var(--loica-font-size-4xl)')
  })

  it('emits the focus ring inset, the overlays and the target size', () => {
    const vars = themeToCssVars(defaultTheme)
    expect(vars['--loica-focus-ring-inset']).toBe('calc(var(--loica-focus-ring-width) * -1)')
    expect(vars['--loica-overlay-hover']).toBe('8%')
    expect(vars['--loica-overlay-active']).toBe('14%')
    expect(vars['--loica-target-min']).toBe('1.5rem')
  })

  it('makes the border lighter on hover in dark mode, not darker', () => {
    const vars = themeToCssVars(darkTheme)
    expect(vars['--loica-border-hover']).not.toBe(defaultTheme.semantic.borderHover)
    expect(getContrastRatio(vars['--loica-border-hover'], vars['--loica-background'])).toBeGreaterThan(
      getContrastRatio(vars['--loica-border-strong'], vars['--loica-background']),
    )
  })

  it('has its own shadows and backdrop in dark mode', () => {
    const vars = themeToCssVars(darkTheme)
    expect(vars['--loica-shadow-md']).not.toBe(themeToCssVars(defaultTheme)['--loica-shadow-md'])
    expect(vars['--loica-backdrop']).not.toBe(defaultTheme.semantic.backdrop)
  })

  it('includes custom color schemes', () => {
    const vars = themeToCssVars(withColors({ salmon: ramp('#fa8072') }))
    expect(vars['--loica-color-salmon-tint']).toBe('#fa8072')
  })

  it('pairs dark fills with white text', () => {
    const vars = themeToCssVars(withColors({ ink: ramp('#1e3a8a') }))
    expect(vars['--loica-color-ink-solid']).toBe('#1e3a8a')
    expect(vars['--loica-color-ink-solid-contrast']).toBe('#ffffff')
    expect(vars['--loica-color-ink-solid-hover']).toMatch(/^rgb\(/)
    expect(vars['--loica-color-ink-solid-active']).toMatch(/^rgb\(/)
  })

  it('keeps light fills on the base shade with black text', () => {
    const vars = themeToCssVars(withColors({ sun: ramp('#facc15') }))
    expect(vars['--loica-color-sun-solid']).toBe('#facc15')
    expect(vars['--loica-color-sun-solid-contrast']).toBe('#000000')
  })

  it('uses a darker shade for text when the base fails AA on light surfaces', () => {
    const vars = themeToCssVars(withColors({ sky: ramp('#7dd3fc', { 800: '#075985' }) }))
    expect(vars['--loica-color-sky-text']).toBe('#075985')
    expect(vars['--loica-color-sky-tint']).toBe('#7dd3fc')
  })

  it('falls back to the darkest shade when no shade reaches AA', () => {
    const vars = themeToCssVars(withColors({ gray: ramp('#a1a1aa', { 950: '#b4b4bb' }) }))
    expect(vars['--loica-color-gray-text']).toBe('#b4b4bb')
  })

  it('lightens the text and uses dark tints on dark themes', () => {
    const vars = themeToCssVars(
      withColors(
        {
          ink: ramp('#1e3a8a', {
            200: '#bfdbfe',
            800: '#1e40af',
            900: '#1e3a5f',
          }),
        },
        darkTheme,
      ),
    )
    expect(vars['--loica-color-ink-text']).toBe('#bfdbfe')
    expect(vars['--loica-color-ink-text-hover']).toMatch(/^rgb\(/)
    expect(vars['--loica-color-ink-tint']).toBe('#1e3a5f')
    expect(vars['--loica-color-ink-tint-strong']).toBe('#1e40af')
  })

  it('picks text that reads on the tints, which the text color does not always do', () => {
    const light = themeToCssVars(withColors({ sky: ramp('#7dd3fc', { 800: '#075985' }) }))
    expect(light['--loica-color-sky-tint-text']).toBe('#075985')

    const dark = themeToCssVars(
      withColors(
        {
          ink: ramp('#1e3a8a', {
            200: '#bfdbfe',
            800: '#1e40af',
            900: '#1e3a5f',
          }),
        },
        darkTheme,
      ),
    )
    expect(dark['--loica-color-ink-tint-text']).toBe('#bfdbfe')
  })

  it('falls back to the lightest shade on dark themes when no shade reaches AA', () => {
    const vars = themeToCssVars(withColors({ dim: ramp('#3f3f46', { 50: '#52525b' }) }, darkTheme))
    expect(vars['--loica-color-dim-text']).toBe('#52525b')
  })
})
