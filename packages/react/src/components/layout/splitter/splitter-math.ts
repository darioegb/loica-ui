export interface SplitterLimits {
  collapsedSize: number
  collapsible: boolean
  max: number
  min: number
}

export interface SplitterBounds {
  highest: number
  lowest: number
}

const EPSILON = 0.001

export const sameSizes = (a: readonly number[], b: readonly number[]): boolean =>
  a.length === b.length && a.every((size, index) => Math.abs(size - b[index]) < EPSILON)

export function normalizeSizes(sizes: readonly number[] | undefined, count: number): number[] {
  const equal = Array.from({ length: count }, () => 100 / count)
  if (!sizes || sizes.length !== count) return equal
  const valid = sizes.every((size) => Number.isFinite(size) && size >= 0)
  const total = sizes.reduce((sum, size) => sum + size, 0)
  if (!valid || total <= 0) return equal
  return Math.abs(total - 100) < EPSILON ? [...sizes] : sizes.map((size) => (size / total) * 100)
}

export function pairBounds(
  sizes: readonly number[],
  index: number,
  limits: readonly SplitterLimits[],
): SplitterBounds {
  const total = sizes[index] + sizes[index + 1]
  const first = limits[index]
  const second = limits[index + 1]
  const lowest = Math.max(first.min, total - second.max)
  const highest = Math.min(first.max, total - second.min)
  return { highest: Math.max(lowest, highest), lowest }
}

export function resizePair(
  sizes: readonly number[],
  index: number,
  delta: number,
  limits: readonly SplitterLimits[],
): number[] {
  const total = sizes[index] + sizes[index + 1]
  const first = limits[index]
  const second = limits[index + 1]
  const wanted = sizes[index] + delta
  const { highest, lowest } = pairBounds(sizes, index, limits)

  let next: number
  if (first.collapsible && wanted < first.min / 2) next = first.collapsedSize
  else if (second.collapsible && total - wanted < second.min / 2) {
    next = total - second.collapsedSize
  } else next = Math.min(highest, Math.max(lowest, wanted))

  const result = [...sizes]
  result[index] = next
  result[index + 1] = total - next
  return result
}

export function setPanelSize(
  sizes: readonly number[],
  handle: number,
  panel: number,
  size: number,
): number[] {
  const total = sizes[handle] + sizes[handle + 1]
  const neighbor = panel === handle ? handle + 1 : handle
  const result = [...sizes]
  result[panel] = size
  result[neighbor] = total - size
  return result
}

export const isCollapsed = (size: number, limits: SplitterLimits): boolean =>
  limits.collapsible && size <= limits.collapsedSize + EPSILON
