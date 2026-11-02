import { colorVar } from '../shared.utils'

describe('colorVar', () => {
  it('defaults a bare scheme to the shade 500, with the default value as fallback', () => {
    expect(colorVar('primary')).toBe('var(--plume-color-primary-500, #5263ff)')
  })

  it('maps a shade to its variable, with the default value as fallback', () => {
    expect(colorVar('primary.900')).toBe('var(--plume-color-primary-900, #24278b)')
  })
})
