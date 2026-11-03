import path from 'node:path'
import { getEmittedTokens } from '../../scripts/emitted-tokens'
import { defaultTheme } from '../theme/config'

describe('getEmittedTokens', () => {
  const emitted = getEmittedTokens(path.join(__dirname, '..'))

  it('has the tokens the stylesheets read', () => {
    expect(emitted).toContain('--plume-surface')
    expect(emitted).toContain('--plume-radius-3')
    expect(emitted).toContain('--plume-z-modal')
  })

  it('has every color of every color scheme, which a component reads by its name', () => {
    for (const scheme of Object.keys(defaultTheme.colors)) {
      expect(emitted).toContain(`--plume-color-${scheme}-solid`)
      expect(emitted).toContain(`--plume-color-${scheme}-tint-text`)
    }
  })

  it('has what a token resolves to', () => {
    expect(emitted).toContain('--plume-text-heading-2-size')
    expect(emitted).toContain('--plume-font-size-3xl')
    expect(emitted).toContain('--plume-focus-ring-width')
  })

  it('has the tokens that change with the color mode', () => {
    expect(emitted).toContain('--plume-shadow-sm')
  })

  it('leaves out the rest', () => {
    expect(emitted).not.toContain('--plume-space-48')
    expect(emitted).not.toContain('--plume-container-7xl')
    expect(emitted).not.toContain('--plume-font-family-mono')
  })
})
