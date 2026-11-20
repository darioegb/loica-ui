import {
  clamp,
  cssColor,
  formatColor,
  hslaToHsva,
  hsvaToHsla,
  hsvaToRgba,
  parseColor,
  rgbaToHsva,
} from '../color-math'

describe('color math', () => {
  it('clamps a value into a range', () => {
    expect([clamp(5, 0, 3), clamp(-1, 0, 3), clamp(2, 0, 3)]).toEqual([3, 0, 2])
  })

  describe('hsvaToRgba', () => {
    it.each([
      [{ a: 1, h: 0, s: 1, v: 1 }, { a: 1, b: 0, g: 0, r: 255 }],
      [{ a: 1, h: 60, s: 1, v: 1 }, { a: 1, b: 0, g: 255, r: 255 }],
      [{ a: 1, h: 120, s: 1, v: 1 }, { a: 1, b: 0, g: 255, r: 0 }],
      [{ a: 1, h: 180, s: 1, v: 1 }, { a: 1, b: 255, g: 255, r: 0 }],
      [{ a: 1, h: 240, s: 1, v: 1 }, { a: 1, b: 255, g: 0, r: 0 }],
      [{ a: 0.5, h: 300, s: 1, v: 1 }, { a: 0.5, b: 255, g: 0, r: 255 }],
      [{ a: 1, h: 0, s: 0, v: 0.5 }, { a: 1, b: 127.5, g: 127.5, r: 127.5 }],
    ])('turns %j into %j', (hsva, rgba) => {
      expect(hsvaToRgba(hsva)).toEqual(rgba)
    })

    it('wraps a hue out of range', () => {
      expect(hsvaToRgba({ a: 1, h: 360, s: 1, v: 1 })).toEqual({ a: 1, b: 0, g: 0, r: 255 })
      expect(hsvaToRgba({ a: 1, h: -120, s: 1, v: 1 })).toEqual({ a: 1, b: 255, g: 0, r: 0 })
    })
  })

  describe('rgbaToHsva', () => {
    it('goes back to the same color from each sector', () => {
      for (const hue of [0, 45, 90, 150, 200, 255, 300, 330]) {
        const back = rgbaToHsva(hsvaToRgba({ a: 1, h: hue, s: 0.8, v: 0.7 }))
        expect(back.h).toBeCloseTo(hue, 5)
        expect(back.s).toBeCloseTo(0.8, 5)
        expect(back.v).toBeCloseTo(0.7, 5)
      }
    })

    it('keeps the fallback hue of a gray, which has none', () => {
      expect(rgbaToHsva({ a: 1, b: 128, g: 128, r: 128 }, 200)).toMatchObject({ h: 200, s: 0 })
    })

    it('has no saturation for black', () => {
      expect(rgbaToHsva({ a: 1, b: 0, g: 0, r: 0 })).toEqual({ a: 1, h: 0, s: 0, v: 0 })
    })
  })

  describe('hsl', () => {
    it('converts both ways', () => {
      const hsla = hsvaToHsla({ a: 1, h: 120, s: 1, v: 1 })
      expect(hsla).toEqual({ a: 1, h: 120, l: 0.5, s: 1 })
      expect(hslaToHsva(hsla)).toEqual({ a: 1, h: 120, s: 1, v: 1 })
    })

    it('has no saturation for black and for white', () => {
      expect(hsvaToHsla({ a: 1, h: 0, s: 0, v: 0 }).s).toBe(0)
      expect(hsvaToHsla({ a: 1, h: 0, s: 0, v: 1 }).s).toBe(0)
      expect(hslaToHsva({ a: 1, h: 0, l: 0, s: 0 }).s).toBe(0)
    })
  })

  describe('parseColor', () => {
    it.each([
      ['#ff0000', '#ff0000'],
      ['FF0000', '#ff0000'],
      ['#f00', '#ff0000'],
      ['#f008', '#ff000088'],
      ['#ff000080', '#ff000080'],
      ['rgb(255, 0, 0)', '#ff0000'],
      ['rgb(255 0 0)', '#ff0000'],
      ['rgba(255, 0, 0, 0.5)', '#ff000080'],
      ['rgb(255 0 0 / 50%)', '#ff000080'],
      ['hsl(0, 100%, 50%)', '#ff0000'],
      ['hsl(0deg 100% 50%)', '#ff0000'],
      ['hsla(120, 100%, 50%, 0.5)', '#00ff0080'],
      ['hsl(360, 100%, 50%)', '#ff0000'],
      ['  #00F  ', '#0000ff'],
    ])('reads %s', (text, hex) => {
      const color = parseColor(text)
      expect(color && formatColor(color, 'hex', true)).toBe(hex)
    })

    it('clamps the channels', () => {
      const color = parseColor('rgb(300, -5, 0)')
      expect(color && formatColor(color, 'hex', false)).toBe('#ff0000')
      expect(parseColor('hsl(0, 200%, 50%)')).not.toBeNull()
    })

    it.each(['', 'red', '#12', '#12345', 'rgb(1, 2)', 'hsl(a, b, c)', 'rgb(1, 2, 3, 4, 5)'])(
      'rejects %j',
      (text) => {
        expect(parseColor(text)).toBeNull()
      },
    )

    it('keeps the hue it is given for a gray', () => {
      expect(parseColor('#808080', 210)?.h).toBe(210)
    })
  })

  describe('formatColor', () => {
    const color = { a: 0.5, h: 0, s: 1, v: 1 }

    it('writes hex, with the alpha only when it is below 1', () => {
      expect(formatColor(color, 'hex', true)).toBe('#ff000080')
      expect(formatColor({ ...color, a: 1 }, 'hex', true)).toBe('#ff0000')
    })

    it('writes rgb and hsl, with the alpha only when it is below 1', () => {
      expect(formatColor(color, 'rgb', true)).toBe('rgba(255, 0, 0, 0.5)')
      expect(formatColor({ ...color, a: 1 }, 'rgb', true)).toBe('rgb(255, 0, 0)')
      expect(formatColor(color, 'hsl', true)).toBe('hsla(0, 100%, 50%, 0.5)')
      expect(formatColor({ ...color, a: 1 }, 'hsl', true)).toBe('hsl(0, 100%, 50%)')
    })

    it('drops the alpha when it is not asked for', () => {
      expect(formatColor(color, 'hex', false)).toBe('#ff0000')
      expect(formatColor(color, 'rgb', false)).toBe('rgb(255, 0, 0)')
      expect(formatColor(color, 'hsl', false)).toBe('hsl(0, 100%, 50%)')
    })

    it('rounds the alpha to two decimals', () => {
      expect(formatColor({ ...color, a: 0.3333 }, 'rgb', true)).toBe('rgba(255, 0, 0, 0.33)')
    })
  })

  it('writes a color for the CSS, with its alpha', () => {
    expect(cssColor({ a: 0.25, h: 240, s: 1, v: 1 })).toBe('rgb(0 0 255 / 0.25)')
  })
})
