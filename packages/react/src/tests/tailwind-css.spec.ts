import { buildTailwindCss } from '../../scripts/tailwind-css'
import { defaultTheme } from '../theme/config'

describe('buildTailwindCss', () => {
  const css = buildTailwindCss()

  it('has no utility for the shades of a color scheme, which are not variables', () => {
    expect(css).not.toMatch(/--color-primary(-\d+)?:/)
  })

  it('points the utilities to the variables of Loica with an inline theme', () => {
    expect(css.startsWith('@theme inline {')).toBe(true)
    expect(css).toContain('--color-primary-solid: var(--loica-color-primary-solid);')
    expect(css).toContain('--color-primary-on-solid: var(--loica-color-primary-solid-contrast);')
    expect(css).toContain('--color-surface-muted: var(--loica-surface-muted);')
    expect(css).toContain('--color-border-strong: var(--loica-border-strong);')
  })

  it('has every text style with its line height, letter spacing and weight', () => {
    for (const name of Object.keys(defaultTheme.textStyles)) {
      for (const part of ['', '--line-height', '--letter-spacing', '--font-weight']) {
        expect(css).toContain(`--text-${name}${part}: var(--loica-text-${name}-`)
      }
    }
  })

  it('uses the kebab case names of the variables', () => {
    expect(css).toContain('--ease-in-out: var(--loica-easing-in-out);')
    expect(css).toContain('--container-3xl: var(--loica-container-3xl);')
  })

  it('has the utilities that Tailwind has no theme for', () => {
    expect(css).toContain('@utility z-modal {\n  z-index: var(--loica-z-modal);\n}')
    expect(css).toContain('@utility duration-fast {')
    expect(css).toContain('@utility opacity-disabled {')
    expect(css).toContain('@utility min-h-control-lg {')
  })
})
