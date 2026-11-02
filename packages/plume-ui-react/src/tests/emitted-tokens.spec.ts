import path from 'node:path'
import { getEmittedTokens } from '../../scripts/emitted-tokens'

describe('getEmittedTokens', () => {
  const emitted = getEmittedTokens(path.join(__dirname, '..'))

  it('has the tokens the stylesheets read', () => {
    expect(emitted).toContain('--plume-surface')
    expect(emitted).toContain('--plume-radius-3')
    expect(emitted).toContain('--plume-z-modal')
  })

  it('has the tokens of a color scheme that a component reads by its name', () => {
    expect(emitted).toContain('--plume-color-teal-solid')
    expect(emitted).toContain('--plume-color-teal-tint-text')
    expect(emitted).not.toContain('--plume-color-teal-300')
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
    expect(emitted).not.toContain('--plume-color-primary-300')
    expect(emitted).not.toContain('--plume-space-48')
    expect(emitted).not.toContain('--plume-container-7xl')
    expect(emitted).not.toContain('--plume-font-family-mono')
  })
})
