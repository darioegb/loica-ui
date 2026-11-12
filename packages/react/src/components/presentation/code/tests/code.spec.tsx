import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { Code } from '..'

describe('Code component', () => {
  it('renders a code element with its children', () => {
    render(<Code>npm install</Code>)
    const code = screen.getByText('npm install')
    expect(code.tagName).toBe('CODE')
    expect(code).toHaveAttribute('data-loica-code')
  })

  it('is subtle by default', () => {
    render(<Code>x</Code>)
    expect(screen.getByText('x')).toHaveClass('code', 'subtle')
  })

  it.each(['subtle', 'outline'] as const)('applies the %s variant', (variant) => {
    render(<Code variant={variant}>x</Code>)
    expect(screen.getByText('x')).toHaveClass('code', variant)
  })

  it('exposes the color scheme as CSS variables', () => {
    render(<Code colorScheme="success">x</Code>)
    expect(screen.getByText('x')).toHaveStyle('--code-tint: var(--loica-color-success-tint)')
  })

  it('lets the style prop override the color variables', () => {
    render(<Code style={{ '--code-tint': 'red' } as React.CSSProperties}>x</Code>)
    expect(screen.getByText('x')).toHaveStyle('--code-tint: red')
  })

  it('keeps the custom className and the native attributes', () => {
    render(
      <Code className="custom" id="cmd" lang="en">
        x
      </Code>,
    )
    const code = screen.getByText('x')
    expect(code).toHaveClass('code', 'custom')
    expect(code).toHaveAttribute('id', 'cmd')
    expect(code).toHaveAttribute('lang', 'en')
  })

  it('drops the Loica classes when unstyled', () => {
    render(
      <Code className="custom" variant="unstyled">
        x
      </Code>,
    )
    const code = screen.getByText('x')
    expect(code).toHaveClass('custom')
    expect(code).not.toHaveClass('code')
    expect(code).not.toHaveClass('subtle')
  })

  it('forwards the ref to the code element', () => {
    const ref = createRef<HTMLElement>()
    render(<Code ref={ref}>x</Code>)
    expect(ref.current).toBe(screen.getByText('x'))
  })
})
