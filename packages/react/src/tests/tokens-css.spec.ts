import { buildTokensCss } from '../../scripts/tokens-css'
import { defaultTheme } from '../theme/config'

describe('tokens.css', () => {
  const css = buildTokensCss()

  it('declares the light tokens on :root and the dark ones on the dark mode', () => {
    expect(css).toContain(`:root,[data-loica-color-mode='light']{--loica-color-primary-solid:`)
    expect(css).toContain(`[data-loica-color-mode='dark']{--loica-color-primary-text:`)
  })

  it('declares the tokens of every color scheme', () => {
    for (const scheme of Object.keys(defaultTheme.colors)) {
      expect(css).toContain(`--loica-color-${scheme}-solid:`)
      expect(css).toContain(`--loica-color-${scheme}-tint-text:`)
    }
  })

  it('stops the motion when the user asks for less', () => {
    const reduced = css.slice(css.indexOf('@media(prefers-reduced-motion:reduce)'))
    for (const name of Object.keys(defaultTheme.motion.durations)) {
      expect(reduced).toContain(`--loica-duration-${name}:0s!important`)
    }
    expect(reduced).toContain('[data-loica-color-mode]')
  })

  it('leaves the other tokens alone in that query', () => {
    const reduced = css.slice(css.indexOf('@media(prefers-reduced-motion:reduce)'))
    expect(reduced).not.toContain('--loica-space-')
  })
})
