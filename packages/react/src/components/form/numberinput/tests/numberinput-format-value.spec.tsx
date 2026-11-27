import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { NumberInput, numberFormat } from '..'

const spin = (): HTMLElement => screen.getByRole('spinbutton')

const dollars = (value: number): string => `$${value.toFixed(2)}`
const euros = (value: number): string => `EUR ${value.toFixed(2)}`

const readWith =
  (prefix: string) =>
  (text: string): number | null => {
    const parsed = Number(text.replace(prefix, ''))
    return Number.isNaN(parsed) || text.trim() === '' ? null : parsed
  }

describe('NumberInput formatValue and parseValue', () => {
  it('shows the number as formatValue writes it and exposes it as the value text', () => {
    render(<NumberInput aria-label="Price" defaultValue={5} formatValue={dollars} />)
    expect(spin()).toHaveValue('$5.00')
    expect(spin()).toHaveAttribute('aria-valuetext', '$5.00')
    expect(spin()).toHaveAttribute('aria-valuenow', '5')
  })

  it('reads what the user types with parseValue', async () => {
    const onValueChange = vi.fn()
    render(
      <NumberInput
        aria-label="Price"
        formatValue={dollars}
        onValueChange={onValueChange}
        parseValue={readWith('$')}
      />,
    )
    await userEvent.type(spin(), '$12')
    expect(onValueChange).toHaveBeenLastCalledWith(12)
    await userEvent.tab()
    expect(spin()).toHaveValue('$12.00')
  })

  it('wins over format and parse when both are given', async () => {
    const onValueChange = vi.fn()
    render(
      <NumberInput
        aria-label="Price"
        defaultValue={5}
        format={euros}
        formatValue={dollars}
        onValueChange={onValueChange}
        parse={readWith('EUR ')}
        parseValue={readWith('$')}
      />,
    )
    expect(spin()).toHaveValue('$5.00')
    await userEvent.clear(spin())
    await userEvent.type(spin(), '$7')
    expect(onValueChange).toHaveBeenLastCalledWith(7)
  })

  it('keeps working with the old names', async () => {
    const onValueChange = vi.fn()
    render(
      <NumberInput
        aria-label="Price"
        defaultValue={5}
        format={euros}
        onValueChange={onValueChange}
        parse={readWith('EUR ')}
      />,
    )
    expect(spin()).toHaveValue('EUR 5.00')
    expect(spin()).toHaveAttribute('aria-valuetext', 'EUR 5.00')
    await userEvent.clear(spin())
    await userEvent.type(spin(), 'EUR 9')
    expect(onValueChange).toHaveBeenLastCalledWith(9)
  })

  it('has no value text without either name', () => {
    render(<NumberInput aria-label="Price" defaultValue={5} />)
    expect(spin()).not.toHaveAttribute('aria-valuetext')
  })

  it('lets formatValue win over the locale', () => {
    render(
      <NumberInput
        aria-label="Price"
        defaultValue={1.5}
        formatValue={(n) => `$${n}`}
        locale="es"
      />,
    )
    expect(spin()).toHaveValue('$1.5')
  })

  it('submits the number with a hidden input, not the formatted text', () => {
    const { container } = render(
      <NumberInput aria-label="Price" defaultValue={5} formatValue={(n) => `$${n}`} name="price" />,
    )
    expect(container.querySelector('input[type="hidden"]')).toHaveValue('5')
  })
})

describe('numberFormat names', () => {
  it('gives the new names and the old ones, which are the same functions', () => {
    const result = numberFormat('de', { useGrouping: true })
    expect(result.formatValue).toBe(result.format)
    expect(result.parseValue).toBe(result.parse)
    expect(result.formatValue(1234.5)).toBe('1.234,5')
    expect(result.parseValue('1.234,5')).toBe(1234.5)
  })

  it('is spread on a NumberInput with both names', async () => {
    render(
      <NumberInput
        {...numberFormat('de', { useGrouping: true })}
        aria-label="Amount"
        defaultValue={1234.5}
      />,
    )
    expect(spin()).toHaveValue('1.234,5')
    await userEvent.clear(spin())
    await userEvent.type(spin(), '2.000,5')
    await userEvent.tab()
    expect(spin()).toHaveValue('2.000,5')
  })
})
