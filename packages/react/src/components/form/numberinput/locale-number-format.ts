const SAMPLES = [0, 0.5, 1, 2, 5, 11, 21, 100, 1234567.5]
const SYMBOL_TYPES = new Set<string>(['currency', 'literal', 'percentSign', 'unit'])
const BIDI_MARKS = /[\u200e\u200f\u061c]/g
const NEGATIVE = /[-\u2212]/
const READABLE = /^(?:\d+(?:\.\d*)?|\.\d+)$/

export interface NumberInputFormat {
  /** Writes a number as the locale and the options say. */
  format: (value: number) => string
  /** Reads back what `format` writes, or `null` when the text is not a number. */
  parse: (text: string) => number | null
}

const isAccounting = (text: string): boolean => {
  const open = text.indexOf('(')
  return open !== -1 && text.includes(')', open)
}

const partOf = (parts: Intl.NumberFormatPart[], type: Intl.NumberFormatPartTypes): string =>
  parts.find((part) => part.type === type)?.value ?? ''

function assertReadable(options: Intl.NumberFormatOptions): void {
  if (options.notation !== undefined && options.notation !== 'standard') {
    throw new RangeError(`numberFormat can't read back notation '${options.notation}'`)
  }
  if (options.numberingSystem !== undefined && options.numberingSystem !== 'latn') {
    throw new RangeError('numberFormat reads only Latin digits, so numberingSystem has to be latn')
  }
}

/**
 * The `format` and the `parse` of a `NumberInput` for a locale, to spread on it. The `parse` is the
 * inverse of the `format`: it takes the separators and the symbols that the locale and the options
 * write, so `1.234,5` is `1234.5` in `de` and `1,234.5` is `1234.5` in `en`. Digits are always Latin,
 * because the field reads only those. It throws a `RangeError` for an option it can't read back:
 * `notation` other than `standard`, or a `numberingSystem` other than `latn`.
 */
export function numberFormat(
  locale: string,
  options: Intl.NumberFormatOptions = {},
): NumberInputFormat {
  assertReadable(options)
  const formatter = new Intl.NumberFormat(locale, { ...options, numberingSystem: 'latn' })
  const plain = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 1,
    numberingSystem: 'latn',
    useGrouping: true,
  }).formatToParts(-1234567.5)
  const parts = SAMPLES.flatMap((sample) => formatter.formatToParts(sample))
  const group = partOf(parts, 'group') || partOf(plain, 'group')
  const decimal = partOf(parts, 'decimal') || partOf(plain, 'decimal')
  const minus = partOf(plain, 'minusSign')
  const symbols = [
    ...new Set(
      parts
        .filter((part) => SYMBOL_TYPES.has(part.type) && part.value.trim() !== '')
        .map((part) => part.value.replace(BIDI_MARKS, '')),
    ),
  ].sort((first, second) => second.length - first.length)
  const isPercent = options.style === 'percent'

  const format = (value: number): string => formatter.format(value === 0 ? 0 : value)

  const parse = (text: string): number | null => {
    let rest = text.replace(BIDI_MARKS, '')
    for (const symbol of symbols) rest = rest.split(symbol).join('')
    const negative =
      NEGATIVE.test(rest) || (minus !== '' && rest.includes(minus)) || isAccounting(rest)
    rest = rest.replace(/[\s+()\-\u2212]/g, '')
    if (minus !== '') rest = rest.split(minus).join('')
    if (group !== '') rest = rest.split(group).join('')
    if (decimal !== '') rest = rest.split(decimal).join('.')
    if (!READABLE.test(rest)) return null
    const magnitude = Number(isPercent ? `${rest}e-2` : rest)
    if (!Number.isFinite(magnitude)) return null
    return negative && magnitude !== 0 ? -magnitude : magnitude
  }

  return { format, parse }
}
