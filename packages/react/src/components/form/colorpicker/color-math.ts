export type ColorFormat = 'hex' | 'rgb' | 'hsl'

export interface Hsva {
  a: number
  h: number
  s: number
  v: number
}

export interface Rgba {
  a: number
  b: number
  g: number
  r: number
}

export interface Hsla {
  a: number
  h: number
  l: number
  s: number
}

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value))

const NUMBER = String.raw`(-?\d+(?:\.\d+)?)`
const SEPARATOR = String.raw`\s*[,\s]\s*`
const ALPHA = String.raw`(?:\s*[,/]\s*(\d+(?:\.\d+)?)(%)?)?`
const HEX = /^#?([\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/i
const RGB = new RegExp(
  String.raw`^rgba?\(\s*${NUMBER}${SEPARATOR}${NUMBER}${SEPARATOR}${NUMBER}${ALPHA}\s*\)$`,
  'i',
)
const HSL = new RegExp(
  String.raw`^hsla?\(\s*${NUMBER}(?:deg)?${SEPARATOR}${NUMBER}%?${SEPARATOR}${NUMBER}%?${ALPHA}\s*\)$`,
  'i',
)

const toAlpha = (value: string | undefined, percent: string | undefined): number => {
  if (value === undefined) return 1
  return clamp(percent ? Number(value) / 100 : Number(value), 0, 1)
}

export function hsvaToRgba({ a, h, s, v }: Hsva): Rgba {
  const chroma = v * s
  const x = chroma * (1 - Math.abs(((h / 60) % 2) - 1))
  const offset = v - chroma
  const sector = Math.floor((((h % 360) + 360) % 360) / 60)
  const [r, g, b] = [
    [chroma, x, 0],
    [x, chroma, 0],
    [0, chroma, x],
    [0, x, chroma],
    [x, 0, chroma],
    [chroma, 0, x],
  ][sector]
  return { a, b: (b + offset) * 255, g: (g + offset) * 255, r: (r + offset) * 255 }
}

export function rgbaToHsva({ a, b, g, r }: Rgba, fallbackHue = 0): Hsva {
  const [red, green, blue] = [r / 255, g / 255, b / 255]
  const max = Math.max(red, green, blue)
  const delta = max - Math.min(red, green, blue)
  let h = fallbackHue
  if (delta !== 0) {
    if (max === red) h = ((green - blue) / delta) % 6
    else if (max === green) h = (blue - red) / delta + 2
    else h = (red - green) / delta + 4
    h = (h * 60 + 360) % 360
  }
  return { a, h, s: max === 0 ? 0 : delta / max, v: max }
}

export function hsvaToHsla({ a, h, s, v }: Hsva): Hsla {
  const l = v * (1 - s / 2)
  return { a, h, l, s: l === 0 || l === 1 ? 0 : (v - l) / Math.min(l, 1 - l) }
}

export function hslaToHsva({ a, h, l, s }: Hsla): Hsva {
  const v = l + s * Math.min(l, 1 - l)
  return { a, h, s: v === 0 ? 0 : 2 * (1 - l / v), v }
}

export function parseColor(text: string, fallbackHue = 0): Hsva | null {
  const source = text.trim()
  const hex = HEX.exec(source)?.[1]
  if (hex) {
    const full = hex.length <= 4 ? [...hex].map((digit) => digit + digit).join('') : hex
    const [r, g, b, a = 255] = [0, 2, 4, 6]
      .slice(0, full.length / 2)
      .map((start) => Number.parseInt(full.slice(start, start + 2), 16))
    return rgbaToHsva({ a: a / 255, b, g, r }, fallbackHue)
  }
  const rgb = RGB.exec(source)
  if (rgb) {
    const [r, g, b] = [rgb[1], rgb[2], rgb[3]].map((channel) => clamp(Number(channel), 0, 255))
    return rgbaToHsva({ a: toAlpha(rgb[4], rgb[5]), b, g, r }, fallbackHue)
  }
  const hsl = HSL.exec(source)
  if (hsl) {
    return hslaToHsva({
      a: toAlpha(hsl[4], hsl[5]),
      h: ((Number(hsl[1]) % 360) + 360) % 360,
      l: clamp(Number(hsl[3]), 0, 100) / 100,
      s: clamp(Number(hsl[2]), 0, 100) / 100,
    })
  }
  return null
}

const hexByte = (channel: number): string =>
  Math.round(clamp(channel, 0, 255)).toString(16).padStart(2, '0')

const roundAlpha = (alpha: number): number => Math.round(clamp(alpha, 0, 1) * 100) / 100

export function formatColor(color: Hsva, format: ColorFormat, alpha: boolean): string {
  const opacity = alpha ? roundAlpha(color.a) : 1
  const translucent = opacity < 1
  if (format === 'hsl') {
    const { h, l, s } = hsvaToHsla(color)
    const channels = `${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%`
    return translucent ? `hsla(${channels}, ${opacity})` : `hsl(${channels})`
  }
  const { b, g, r } = hsvaToRgba(color)
  if (format === 'rgb') {
    const channels = `${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}`
    return translucent ? `rgba(${channels}, ${opacity})` : `rgb(${channels})`
  }
  return `#${hexByte(r)}${hexByte(g)}${hexByte(b)}${translucent ? hexByte(color.a * 255) : ''}`
}

export const cssColor = (color: Hsva): string => {
  const { a, b, g, r } = hsvaToRgba(color)
  return `rgb(${Math.round(r)} ${Math.round(g)} ${Math.round(b)} / ${roundAlpha(a)})`
}
