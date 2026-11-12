import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { Kbd } from '..'

describe('Kbd component', () => {
  it('renders a kbd element with its children', () => {
    render(<Kbd>Ctrl</Kbd>)
    const key = screen.getByText('Ctrl')
    expect(key.tagName).toBe('KBD')
    expect(key).toHaveAttribute('data-loica-kbd')
  })

  it('is outlined by default', () => {
    render(<Kbd>K</Kbd>)
    expect(screen.getByText('K')).toHaveClass('kbd', 'outline')
  })

  it.each(['subtle', 'outline'] as const)('applies the %s variant', (variant) => {
    render(<Kbd variant={variant}>K</Kbd>)
    expect(screen.getByText('K')).toHaveClass('kbd', variant)
  })

  it('takes its content from label, and children win', () => {
    const { rerender } = render(<Kbd label="Esc" />)
    expect(screen.getByText('Esc')).toBeInTheDocument()
    rerender(<Kbd label="Esc">Enter</Kbd>)
    expect(screen.getByText('Enter')).toBeInTheDocument()
    expect(screen.queryByText('Esc')).toBeNull()
  })

  it('takes the size of the text around it, unless it has a size', () => {
    const { rerender } = render(<Kbd>K</Kbd>)
    for (const size of ['sm', 'md', 'lg']) expect(screen.getByText('K')).not.toHaveClass(size)
    rerender(<Kbd size="sm">K</Kbd>)
    expect(screen.getByText('K')).toHaveClass('kbd', 'sm')
  })

  it('exposes the color scheme as CSS variables', () => {
    render(<Kbd colorScheme="info">K</Kbd>)
    expect(screen.getByText('K')).toHaveStyle('--kbd-text: var(--loica-color-info-text)')
  })

  it('lets the style prop override the color variables', () => {
    render(<Kbd style={{ '--kbd-text': 'red' } as React.CSSProperties}>K</Kbd>)
    expect(screen.getByText('K')).toHaveStyle('--kbd-text: red')
  })

  it('keeps the custom className and the native attributes', () => {
    render(
      <Kbd aria-label="Control" className="custom">
        Ctrl
      </Kbd>,
    )
    const key = screen.getByText('Ctrl')
    expect(key).toHaveClass('kbd', 'custom')
    expect(key).toHaveAttribute('aria-label', 'Control')
  })

  it('drops the Loica classes when unstyled', () => {
    render(
      <Kbd className="custom" variant="unstyled">
        K
      </Kbd>,
    )
    const key = screen.getByText('K')
    expect(key).toHaveClass('custom')
    expect(key).not.toHaveClass('kbd')
    expect(key).not.toHaveClass('outline')
  })

  it('forwards the ref to the kbd element', () => {
    const ref = createRef<HTMLElement>()
    render(<Kbd ref={ref}>K</Kbd>)
    expect(ref.current).toBe(screen.getByText('K'))
  })
})
