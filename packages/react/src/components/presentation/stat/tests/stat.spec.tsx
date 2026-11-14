import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { LocaleProvider } from '../../../../locale/locale-provider'
import { Stat } from '..'

describe('Stat component', () => {
  it('is a dl with the label, the value, the change and the help', () => {
    const { container } = render(
      <Stat change="+12 %" helpText="Last month" label="Projects" trend="up" value="24" />,
    )
    const dl = container.querySelector('dl')
    expect(dl).toHaveAttribute('data-loica-stat')
    expect(dl).toHaveClass('stat')
    expect(screen.getByText('Projects').tagName).toBe('DT')
    expect(screen.getByText('24').tagName).toBe('DD')
    expect(screen.getByText('Last month')).toHaveAttribute('data-loica-stat-help')
    expect(dl?.querySelectorAll('dd')).toHaveLength(3)
  })

  it('has only the label and the value when it gets no more', () => {
    const { container } = render(<Stat label="Projects" value="24" />)
    expect(container.querySelectorAll('dd')).toHaveLength(1)
    expect(container.querySelector('svg')).toBeNull()
  })

  it('writes a number with the locale, and a text as it is', () => {
    const { rerender } = render(<Stat label="Visits" value={1284000} />)
    expect(screen.getByText('1,284,000')).toBeInTheDocument()
    rerender(<Stat label="Visits" locale="de" value={1284000} />)
    expect(screen.getByText('1.284.000')).toBeInTheDocument()
    rerender(<Stat label="Visits" value="n/a" />)
    expect(screen.getByText('n/a')).toBeInTheDocument()
  })

  it('writes a 0 as a number', () => {
    render(<Stat label="Bugs" value={0} />)
    expect(screen.getByText('0')).toHaveAttribute('data-loica-stat-value')
  })

  it('takes the locale of the LocaleProvider, and its own wins', () => {
    const { rerender } = render(
      <LocaleProvider locale="de">
        <Stat label="Visits" value={1284000} />
      </LocaleProvider>,
    )
    expect(screen.getByText('1.284.000')).toBeInTheDocument()
    rerender(
      <LocaleProvider locale="de">
        <Stat label="Visits" locale="en" value={1284000} />
      </LocaleProvider>,
    )
    expect(screen.getByText('1,284,000')).toBeInTheDocument()
  })

  it('formats a number with formatOptions', () => {
    render(<Stat formatOptions={{ style: 'percent' }} label="Rate" value={0.128} />)
    expect(screen.getByText('13%')).toBeInTheDocument()
  })

  it.each([
    ['up', 'Increase'],
    ['down', 'Decrease'],
    ['neutral', 'No change'],
  ] as const)('says a %s trend in words', (trend, words) => {
    const { container } = render(<Stat change="3" label="Bugs" trend={trend} value="9" />)
    const change = container.querySelector('[data-loica-stat-change]')
    expect(change).toHaveTextContent(`${words}: 3`)
    expect(container.querySelector('dl')).toHaveAttribute('data-trend', trend)
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })

  it('says no trend, and draws no icon, without one', () => {
    const { container } = render(<Stat change="3" label="Bugs" value="9" />)
    expect(container.querySelector('[data-loica-stat-change]')).toHaveTextContent(/^3$/)
    expect(container.querySelector('dl')).not.toHaveAttribute('data-trend')
  })

  it('takes the trend texts from the LocaleProvider', () => {
    render(
      <LocaleProvider messages={{ stat: { up: 'Sube' } }}>
        <Stat change="3" label="Bugs" trend="up" value="9" />
      </LocaleProvider>,
    )
    expect(screen.getByText(/Sube/)).toBeInTheDocument()
  })

  it('shows a change of 0', () => {
    render(<Stat change={0} label="Bugs" value="9" />)
    expect(screen.getByText('0')).toHaveAttribute('data-loica-stat-change')
  })

  it('is medium by default and says its size', () => {
    const { container, rerender } = render(<Stat label="Bugs" value="9" />)
    expect(container.querySelector('dl')).toHaveAttribute('data-size', 'md')
    rerender(<Stat label="Bugs" size="lg" value="9" />)
    expect(container.querySelector('dl')).toHaveAttribute('data-size', 'lg')
  })

  it('colors the change with a color scheme over the trend', () => {
    const { container } = render(<Stat change="3" colorScheme="error" label="Bugs" trend="up" value="9" />)
    expect(container.querySelector('dl')).toHaveStyle('--stat-change: var(--loica-color-error-text)')
  })

  it('lets the style prop override the color variable', () => {
    const { container } = render(
      <Stat colorScheme="error" label="Bugs" style={{ ['--stat-change' as string]: 'red' }} value="9" />,
    )
    expect(container.querySelector('dl')).toHaveStyle('--stat-change: red')
  })

  it('drops its class when it is unstyled, and keeps the data attributes', () => {
    const { container } = render(<Stat className="mine" label="Bugs" value="9" variant="unstyled" />)
    const dl = container.querySelector('dl')
    expect(dl?.className).toBe('mine')
    expect(dl).toHaveAttribute('data-size', 'md')
  })

  it('keeps the custom className, the attributes and the ref', () => {
    const ref = createRef<HTMLDListElement>()
    const { container } = render(<Stat className="custom" data-testid="stat" id="x" label="Bugs" ref={ref} value="9" />)
    expect(container.querySelector('dl')).toHaveClass('stat', 'custom')
    expect(screen.getByTestId('stat')).toHaveAttribute('id', 'x')
    expect(ref.current?.tagName).toBe('DL')
  })
})
