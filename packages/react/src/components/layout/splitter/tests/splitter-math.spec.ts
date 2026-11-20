import {
  isCollapsed,
  normalizeSizes,
  pairBounds,
  resizePair,
  sameSizes,
  setPanelSize,
  type SplitterLimits,
} from '../splitter-math'

const free: SplitterLimits = { collapsedSize: 0, collapsible: false, max: 100, min: 0 }

describe('splitter math', () => {
  describe('normalizeSizes', () => {
    it('shares the space equally without sizes', () => {
      expect(normalizeSizes(undefined, 4)).toEqual([25, 25, 25, 25])
    })

    it('shares the space equally when the count does not match', () => {
      expect(normalizeSizes([30, 70], 3)).toEqual([100 / 3, 100 / 3, 100 / 3])
    })

    it('keeps sizes that add up to 100', () => {
      expect(normalizeSizes([30, 70], 2)).toEqual([30, 70])
    })

    it('scales sizes that do not add up to 100', () => {
      expect(normalizeSizes([1, 3], 2)).toEqual([25, 75])
    })

    it('shares the space equally with a negative or non numeric size, or none at all', () => {
      expect(normalizeSizes([-1, 101], 2)).toEqual([50, 50])
      expect(normalizeSizes([Number.NaN, 50], 2)).toEqual([50, 50])
      expect(normalizeSizes([0, 0], 2)).toEqual([50, 50])
    })
  })

  describe('sameSizes', () => {
    it('compares with a tolerance, and by length', () => {
      expect(sameSizes([30, 70], [30.0001, 69.9999])).toBe(true)
      expect(sameSizes([30, 70], [31, 69])).toBe(false)
      expect(sameSizes([30, 70], [30, 70, 0])).toBe(false)
    })
  })

  describe('pairBounds', () => {
    it('is bounded by the minimum of both panels and the maximum of both', () => {
      const limits = [{ ...free, max: 60, min: 10 }, { ...free, max: 90, min: 20 }]
      expect(pairBounds([40, 60], 0, limits)).toEqual({ highest: 60, lowest: 10 })
      const tight = [{ ...free, min: 10 }, { ...free, max: 70, min: 40 }]
      expect(pairBounds([40, 60], 0, tight)).toEqual({ highest: 60, lowest: 30 })
    })

    it('never has the highest under the lowest', () => {
      const limits = [{ ...free, min: 80 }, { ...free, min: 80 }]
      const { highest, lowest } = pairBounds([50, 50], 0, limits)
      expect(highest).toBeGreaterThanOrEqual(lowest)
    })
  })

  describe('resizePair', () => {
    it('moves the share of one panel to its neighbor', () => {
      expect(resizePair([30, 70], 0, 10, [free, free])).toEqual([40, 60])
      expect(resizePair([30, 70], 0, -10, [free, free])).toEqual([20, 80])
    })

    it('leaves the other panels as they are', () => {
      expect(resizePair([20, 30, 50], 1, 10, [free, free, free])).toEqual([20, 40, 40])
    })

    it('stops at the minimum and the maximum of the panels', () => {
      const limits = [{ ...free, max: 50, min: 20 }, { ...free, min: 30 }]
      expect(resizePair([30, 70], 0, -100, limits)[0]).toBe(20)
      expect(resizePair([30, 70], 0, 100, limits)[0]).toBe(50)
      const second = [free, { ...free, max: 60 }]
      expect(resizePair([30, 70], 0, -100, second)[0]).toBe(40)
    })

    it('always adds up to the same total', () => {
      const result = resizePair([30, 70], 0, 12.5, [free, free])
      expect(result[0] + result[1]).toBeCloseTo(100)
    })

    it('collapses the first panel when it goes under half of its minimum', () => {
      const limits = [{ collapsedSize: 0, collapsible: true, max: 100, min: 20 }, free]
      expect(resizePair([30, 70], 0, -21, limits)).toEqual([0, 100])
      expect(resizePair([30, 70], 0, -15, limits)[0]).toBe(20)
    })

    it('collapses the second panel when it goes under half of its minimum', () => {
      const limits = [free, { collapsedSize: 4, collapsible: true, max: 100, min: 20 }]
      expect(resizePair([70, 30], 0, 21, limits)).toEqual([96, 4])
      expect(resizePair([70, 30], 0, 15, limits)[1]).toBe(20)
    })

    it('opens a collapsed panel to its minimum when it is dragged past half of it', () => {
      const limits = [{ collapsedSize: 0, collapsible: true, max: 100, min: 20 }, free]
      expect(resizePair([0, 100], 0, 5, limits)).toEqual([0, 100])
      expect(resizePair([0, 100], 0, 10, limits)).toEqual([20, 80])
    })

    it('does not collapse a panel that is not collapsible', () => {
      const limits = [{ ...free, min: 20 }, free]
      expect(resizePair([30, 70], 0, -100, limits)[0]).toBe(20)
    })
  })

  describe('setPanelSize', () => {
    it('gives the neighbor the rest, whichever panel of the pair changes', () => {
      expect(setPanelSize([30, 70], 0, 0, 10)).toEqual([10, 90])
      expect(setPanelSize([30, 70], 0, 1, 10)).toEqual([90, 10])
      expect(setPanelSize([20, 30, 50], 1, 2, 10)).toEqual([20, 70, 10])
    })
  })

  describe('isCollapsed', () => {
    it('needs a collapsible panel at its collapsed size', () => {
      const limits = { collapsedSize: 4, collapsible: true, max: 100, min: 20 }
      expect(isCollapsed(4, limits)).toBe(true)
      expect(isCollapsed(10, limits)).toBe(false)
      expect(isCollapsed(0, free)).toBe(false)
    })
  })
})
