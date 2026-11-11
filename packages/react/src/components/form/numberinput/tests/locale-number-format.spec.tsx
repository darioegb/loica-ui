import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { numberFormat } from '../locale-number-format'
import { NumberInput } from '..'

describe('numberFormat', () => {
  it.each([
    ['en', 1234567.891, '1,234,567.891'],
    ['de', 1234567.891, '1.234.567,891'],
    ['es', 1234567.891, '1.234.567,891'],
    ['fr', 1234567.891, '1\u202f234\u202f567,891'],
    ['en-IN', 1234567.891, '12,34,567.891'],
  ])('writes %s and reads it back', (locale, value, text) => {
    const { format, parse } = numberFormat(locale)
    expect(format(value)).toBe(text)
    expect(parse(text)).toBe(value)
  })

  it('takes the separators of the locale, not the other ones', () => {
    expect(numberFormat('es').parse('1.234,5')).toBe(1234.5)
    expect(numberFormat('en').parse('1,234.5')).toBe(1234.5)
    expect(numberFormat('es').parse('1.5')).toBe(15)
  })

  it('reads the spaces of the French groups, normal or not', () => {
    const { parse } = numberFormat('fr')
    expect(parse('1\u202f234,5')).toBe(1234.5)
    expect(parse('1\u00a0234,5')).toBe(1234.5)
    expect(parse('1 234,5')).toBe(1234.5)
  })

  it('writes without groups when asked, and still reads them', () => {
    const { format, parse } = numberFormat('de', { useGrouping: false })
    expect(format(1234.5)).toBe('1234,5')
    expect(parse('1234,5')).toBe(1234.5)
  })

  it('reads the partial text of someone who is typing', () => {
    const { parse } = numberFormat('de')
    expect(parse('12,')).toBe(12)
    expect(parse(',5')).toBe(0.5)
    expect(parse('-')).toBeNull()
    expect(parse('')).toBeNull()
  })

  it.each(['abc', '12abc', '1,2,3', '1e5', ',', '- -'])('rejects %j', (text) => {
    expect(numberFormat('de').parse(text)).toBeNull()
  })

  it('reads negative numbers with the minus of the locale, a hyphen or a real minus', () => {
    expect(numberFormat('en').parse('-5')).toBe(-5)
    expect(numberFormat('sv').parse('\u22125,5')).toBe(-5.5)
    expect(numberFormat('sv').parse('-5,5')).toBe(-5.5)
    expect(numberFormat('en').parse('-0')).toBe(0)
  })

  it('writes zero without a sign', () => {
    expect(numberFormat('en').format(-0)).toBe('0')
  })

  describe('percent', () => {
    it.each([
      ['en', 0.256, '26%'],
      ['de', 0.256, '26\u00a0%'],
      ['tr', 0.256, '%26'],
    ])('writes %s and reads it back as a ratio', (locale, value, text) => {
      const { format, parse } = numberFormat(locale, { style: 'percent' })
      expect(format(value)).toBe(text)
      expect(parse(text)).toBe(0.26)
    })

    it('reads a percentage without the sign, and one that is not a round number', () => {
      const { parse } = numberFormat('en', { maximumFractionDigits: 1, style: 'percent' })
      expect(parse('7')).toBe(0.07)
      expect(parse('12.5%')).toBe(0.125)
      expect(parse('29%')).toBe(0.29)
    })
  })

  describe('currency', () => {
    it.each([
      ['en', 'USD', 1234.5, '$1,234.50'],
      ['es', 'EUR', 1234.5, '1234,50\u00a0€'],
      ['de', 'EUR', 1234.5, '1.234,50\u00a0€'],
      ['ja', 'JPY', 1234, '￥1,234'],
    ])('writes %s %s and reads it back', (locale, currency, value, text) => {
      const { format, parse } = numberFormat(locale, { currency, style: 'currency' })
      expect(format(value)).toBe(text)
      expect(parse(text)).toBe(value)
    })

    it('reads a currency that is written as a code or as a name', () => {
      const code = numberFormat('en', { currency: 'USD', currencyDisplay: 'code', style: 'currency' })
      const name = numberFormat('en', { currency: 'USD', currencyDisplay: 'name', style: 'currency' })
      expect(code.parse(code.format(1234.5))).toBe(1234.5)
      expect(name.parse(name.format(1))).toBe(1)
      expect(name.parse(name.format(5))).toBe(5)
    })

    it('reads a symbol that has a dot in it', () => {
      const { format, parse } = numberFormat('en', { currency: 'PEN', style: 'currency' })
      expect(parse(format(1234.5))).toBe(1234.5)
    })

    it('reads the accounting sign of a negative amount', () => {
      const { format, parse } = numberFormat('en', {
        currency: 'USD',
        currencySign: 'accounting',
        style: 'currency',
      })
      expect(format(-5)).toBe('($5.00)')
      expect(parse('($5.00)')).toBe(-5)
    })
  })

  describe('unit', () => {
    it.each([
      ['short', 'en'],
      ['long', 'en'],
      ['narrow', 'en'],
      ['long', 'ru'],
    ] as const)('reads a %s unit in %s', (unitDisplay, locale) => {
      const { format, parse } = numberFormat(locale, {
        style: 'unit',
        unit: 'kilometer',
        unitDisplay,
      })
      for (const value of [0.5, 1, 2, 5, 21, 1234.5]) expect(parse(format(value))).toBe(value)
    })
  })

  it('reads the sign that signDisplay adds', () => {
    const { format, parse } = numberFormat('en', { signDisplay: 'always' })
    expect(format(5)).toBe('+5')
    expect(parse('+5')).toBe(5)
  })

  it.each([
    ['en', 'USD'],
    ['es', 'EUR'],
    ['fr', 'EUR'],
    ['de-CH', 'CHF'],
    ['ar-EG', 'EGP'],
    ['hi', 'INR'],
  ])('gives back what it wrote in %s, whatever the digits of the locale', (locale, currency) => {
    const { format, parse } = numberFormat(locale, { currency, style: 'currency' })
    for (const value of [0, 1, 12.34, -5.5, 1234567.89]) expect(parse(format(value))).toBe(value)
  })

  it.each([
    [{ notation: 'compact' }, /notation 'compact'/],
    [{ notation: 'scientific' }, /notation 'scientific'/],
    [{ notation: 'engineering' }, /notation 'engineering'/],
    [{ numberingSystem: 'arab' }, /numberingSystem/],
  ] as const)('refuses an option it can not read back: %j', (options, message) => {
    expect(() => numberFormat('en', options)).toThrow(message)
  })

  it('accepts the options that are what it already does', () => {
    expect(() => numberFormat('en', { notation: 'standard', numberingSystem: 'latn' })).not.toThrow()
  })
})

describe('numberFormat in a NumberInput', () => {
  it('shows the number with the format and reads what the user types with the parse', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <NumberInput
        {...numberFormat('de', { useGrouping: true })}
        aria-label="Amount"
        defaultValue={1234.5}
        onValueChange={onValueChange}
      />,
    )
    const field = screen.getByRole('spinbutton', { name: 'Amount' })
    expect(field).toHaveValue('1.234,5')
    await user.clear(field)
    await user.type(field, '2.500,25')
    expect(onValueChange).toHaveBeenLastCalledWith(2500.25)
    await user.tab()
    expect(field).toHaveValue('2.500,25')
  })

  it('keeps the plain number in the form and the formatted text for assistive technology', () => {
    render(
      <NumberInput
        {...numberFormat('en', { currency: 'USD', style: 'currency' })}
        aria-label="Price"
        defaultValue={1234.5}
        name="price"
      />,
    )
    const field = screen.getByRole('spinbutton', { name: 'Price' })
    expect(field).toHaveValue('$1,234.50')
    expect(field).toHaveAttribute('aria-valuetext', '$1,234.50')
    expect(document.querySelector('input[name="price"]')).toHaveValue('1234.5')
  })
})
