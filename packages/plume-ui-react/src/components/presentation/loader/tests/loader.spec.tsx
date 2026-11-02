import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { Loader } from '..'
import { LocaleProvider } from '../../../../locale'

describe('Loader component', () => {
  it('is a status named Loading by default', () => {
    render(<Loader />)
    expect(screen.getByRole('status', { name: 'Loading' })).toHaveAttribute('data-plume-loader', '')
  })

  it('takes its name from the label, then from the LocaleProvider', () => {
    const { rerender } = render(
      <LocaleProvider messages={{ loader: { label: 'Cargando' } }}>
        <Loader />
      </LocaleProvider>,
    )
    expect(screen.getByRole('status')).toHaveAccessibleName('Cargando')
    rerender(
      <LocaleProvider messages={{ loader: { label: 'Cargando' } }}>
        <Loader label="Guardando" />
      </LocaleProvider>,
    )
    expect(screen.getByRole('status')).toHaveAccessibleName('Guardando')
  })

  it('is a md spinner by default', () => {
    render(<Loader />)
    expect(screen.getByRole('status')).toHaveClass('spinner', 'md')
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
  })

  it.each(['dots', 'bars'] as const)('renders three items for %s', (variant) => {
    render(<Loader size="lg" variant={variant} />)
    const loader = screen.getByRole('status')
    expect(loader).toHaveClass(variant, 'lg')
    expect(loader.children).toHaveLength(3)
  })

  it('maps the color scheme and its shades to a CSS variable', () => {
    const { rerender } = render(<Loader colorScheme="primary" />)
    expect(screen.getByRole('status')).toHaveStyle('--loader-color: var(--plume-color-primary-500)')
    rerender(<Loader colorScheme="primary.700" style={{ opacity: 0.5 }} />)
    expect(screen.getByRole('status')).toHaveStyle({
      '--loader-color': 'var(--plume-color-primary-700)',
      opacity: '0.5',
    })
  })

  it('takes the color of the text without a color scheme', () => {
    render(<Loader style={{ opacity: 0.5 }} />)
    expect(screen.getByRole('status').style.getPropertyValue('--loader-color')).toBe('')
  })

  it('drops its classes and items when unstyled', () => {
    render(<Loader className="mine" variant="unstyled" />)
    expect(screen.getByRole('status')).toHaveAttribute('class', 'mine')
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
  })

  it('forwards the native attributes and the ref', () => {
    const ref = createRef<HTMLOutputElement>()
    render(<Loader hidden={false} id="busy" ref={ref} title="Wait" />)
    expect(ref.current).toBe(screen.getByRole('status'))
    expect(ref.current).toHaveAttribute('id', 'busy')
    expect(ref.current).toHaveAttribute('title', 'Wait')
  })
})
