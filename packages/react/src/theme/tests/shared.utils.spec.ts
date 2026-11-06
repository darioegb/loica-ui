import { schemeVar } from '../shared.utils'

describe('schemeVar', () => {
  it('points to the variable of a color the theme derives from a scheme', () => {
    expect(schemeVar('primary', 'solid')).toBe('var(--loica-color-primary-solid)')
    expect(schemeVar('error', 'tint-text')).toBe('var(--loica-color-error-tint-text)')
  })
})
