import { fireEvent, render, screen } from '@testing-library/react'
import type { FormEvent, MouseEvent } from 'react'
import { createRef } from 'react'
import { Button } from '..'

describe('Button component', () => {
  const handleClick = vi.fn()
  it('renders button correctly', () => {
    const { getByText } = render(<Button onClick={handleClick}>Click Me</Button>)
    const button = getByText('Click Me')
    expect(button).toBeInTheDocument()
  })

  it('renders button type submit', () => {
    const { getByText } = render(
      <Button onClick={handleClick} type="submit">
        Click Me
      </Button>,
    )
    const button = getByText('Click Me')
    expect(button).toBeInTheDocument()
  })

  it('handles click event', () => {
    const { getByText } = render(<Button onClick={handleClick}>Click Me</Button>)
    const button = getByText('Click Me')

    fireEvent.click(button)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('disables the button when disabled prop is true', () => {
    const { getByText } = render(
      <Button disabled onClick={handleClick}>
        Click Me
      </Button>,
    )
    const button = getByText('Click Me') as HTMLButtonElement
    expect(button.disabled).toBe(true)
  })

  it('applies custom styles', () => {
    const { getByText } = render(
      <Button onClick={handleClick} style={{ backgroundColor: 'blue' }}>
        Click Me
      </Button>,
    )
    const button = getByText('Click Me') as HTMLButtonElement
    expect(button.style.backgroundColor).toBe('blue')
  })

  it('applies className', () => {
    const { getByText } = render(
      <Button className="custom-button" onClick={handleClick}>
        Click Me
      </Button>,
    )
    const button = getByText('Click Me')
    expect(button.classList.contains('custom-button')).toBe(true)
  })

  it('renders children', () => {
    const { container } = render(
      <Button onClick={handleClick}>
        <span>Click Me</span>
      </Button>,
    )
    const button = container.querySelector('button')
    const span = button?.querySelector('span')
    expect(span).toBeInTheDocument()
  })

  it('takes its content from label when it has no children', () => {
    const { rerender } = render(<Button label="Save" />)
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
    rerender(<Button label="Save">Send</Button>)
    expect(screen.getByRole('button', { name: 'Send' })).toBeInTheDocument()
    rerender(<Button label="Save" loading />)
    expect(screen.getByRole('button', { name: /Save/ })).toHaveAttribute('aria-busy', 'true')
  })

  it('renders button with icons around the content', () => {
    const { getByRole } = render(
      <Button iconLeft={<span>👈</span>} iconRight={<span>👉</span>}>
        Go
      </Button>,
    )
    expect(getByRole('button')).toHaveTextContent('👈Go👉')
  })

  it('forwards the native attributes of the button', () => {
    const { getByRole } = render(
      <Button aria-pressed form="profile" name="intent" value="save">
        Save
      </Button>,
    )
    const button = getByRole('button')
    expect(button).toHaveAttribute('form', 'profile')
    expect(button).toHaveAttribute('name', 'intent')
    expect(button).toHaveAttribute('value', 'save')
    expect(button).toHaveAttribute('aria-pressed', 'true')
  })

  it('shows the loading text only while loading', () => {
    const { getByRole, rerender } = render(<Button loadingText="Saving">Save</Button>)
    expect(getByRole('button')).toHaveTextContent('Save')
    expect(getByRole('button')).not.toHaveTextContent('Saving')

    rerender(
      <Button loading loadingText="Saving">
        Save
      </Button>,
    )
    expect(getByRole('button')).toHaveTextContent('Saving')
    expect(getByRole('button')).not.toHaveTextContent('Save')
  })

  it('shows a Loader named Loading while loading', () => {
    const { getByLabelText } = render(<Button loading>Save</Button>)
    expect(getByLabelText('Loading')).toHaveAttribute('data-loica-loader', '')
  })

  it('hides the icons while loading', () => {
    const { queryByText } = render(
      <Button iconLeft={<span>👈</span>} loading>
        Save
      </Button>,
    )
    expect(queryByText('👈')).not.toBeInTheDocument()
  })

  it('hides the content but keeps it in the name while loading without text', () => {
    const { getByRole, getByText } = render(<Button loading>Save</Button>)
    expect(getByText('Save')).toHaveStyle({ position: 'absolute' })
    expect(getByRole('button')).toHaveAccessibleName(/Save/)
  })

  it('stays focusable and announced as busy while loading', () => {
    const { getByRole } = render(<Button loading>Save</Button>)
    const button = getByRole('button', { name: /Save/ })
    expect(button).toHaveAttribute('aria-busy', 'true')
    expect(button).toHaveAttribute('aria-disabled', 'true')
    expect(button).toHaveAttribute('data-loading', '')
    expect(button).not.toBeDisabled()
    button.focus()
    expect(button).toHaveFocus()
  })

  it('ignores the clicks while loading and does not submit the form', () => {
    const onClick = vi.fn()
    const onSubmit = vi.fn((event: FormEvent) => event.preventDefault())
    const parentClick = vi.fn()
    const { container, getByRole } = render(
      <form onSubmit={onSubmit}>
        <Button loading onClick={onClick} type="submit">
          Save
        </Button>
      </form>,
    )
    container.addEventListener('click', parentClick)
    fireEvent.click(getByRole('button'))
    expect(onClick).not.toHaveBeenCalled()
    expect(onSubmit).not.toHaveBeenCalled()
    expect(parentClick).not.toHaveBeenCalled()
  })

  it('does not set aria-busy or aria-disabled when it is not loading', () => {
    const { getByRole } = render(<Button>Save</Button>)
    expect(getByRole('button')).not.toHaveAttribute('aria-busy')
    expect(getByRole('button')).not.toHaveAttribute('aria-disabled')
  })

  it('stays natively disabled when it is disabled and loading', () => {
    const { getByRole } = render(
      <Button disabled loading>
        Save
      </Button>,
    )
    expect(getByRole('button')).toBeDisabled()
    expect(getByRole('button')).not.toHaveAttribute('aria-disabled')
  })

  it('renders solid button', () => {
    const { getByText } = render(<Button variant="solid">Solid Button</Button>)
    const buttonElement = getByText('Solid Button')
    expect(buttonElement).toHaveClass('solid')
  })

  it('renders outline button', () => {
    const { getByText } = render(<Button variant="outline">Outline Button</Button>)
    const buttonElement = getByText('Outline Button')
    expect(buttonElement).toHaveClass('outline')
  })

  it('renders unstyled button', () => {
    const { getByRole } = render(
      <Button disabled variant="unstyled">
        Click me
      </Button>,
    )

    expect(getByRole('button')).not.toHaveAttribute('class')
  })

  it('renders link button', () => {
    const { getByText } = render(<Button variant="link">Link Button</Button>)
    const buttonElement = getByText('Link Button')
    expect(buttonElement).toHaveClass('link')
  })

  it('renders icon button', () => {
    const { getByText } = render(<Button variant="icon">🚀</Button>)
    const buttonElement = getByText('🚀')
    expect(buttonElement).toHaveClass('icon')
  })

  it('renders small button', () => {
    const { getByText } = render(<Button size="sm">Small Button</Button>)
    const buttonElement = getByText('Small Button')
    expect(buttonElement).toHaveClass('sm solid')
  })

  it('renders medium button', () => {
    const { getByText } = render(<Button size="md">Medium Button</Button>)
    const buttonElement = getByText('Medium Button')
    expect(buttonElement).toHaveClass('solid')
  })

  it('renders large button', () => {
    const { getByText } = render(<Button size="lg">Large Button</Button>)
    const buttonElement = getByText('Large Button')
    expect(buttonElement).toHaveClass('lg solid')
  })

  it('renders pill button', () => {
    const { getByText } = render(<Button shape="pill">Pill Button</Button>)
    const buttonElement = getByText('Pill Button')
    expect(buttonElement).toHaveClass('pill solid')
  })

  it('maps the color scheme to palette CSS variables', () => {
    const { getByText } = render(<Button colorScheme="success">Success</Button>)
    const { style } = getByText('Success')
    expect(style.getPropertyValue('--button-color')).toBe('var(--loica-color-success-text)')
    expect(style.getPropertyValue('--button-solid-bg')).toBe('var(--loica-color-success-solid)')
    expect(style.getPropertyValue('--button-contrast-color')).toBe(
      'var(--loica-color-success-solid-contrast)',
    )
  })

  describe('as a link', () => {
    it('renders an anchor with the look of a button when it has href', () => {
      render(
        <Button href="/docs" rel="noreferrer" target="_blank" variant="outline">
          Docs
        </Button>,
      )
      const link = screen.getByRole('link', { name: 'Docs' })
      expect(link.tagName).toBe('A')
      expect(link).toHaveAttribute('href', '/docs')
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noreferrer')
      expect(link).toHaveAttribute('data-loica-button')
      expect(link).not.toHaveAttribute('type')
      expect(link.className.split(' ')).toContain('outline')
    })

    it('calls onClick and gives the anchor to the ref', () => {
      const onClick = vi.fn((event: MouseEvent<HTMLButtonElement>) => event.preventDefault())
      const ref = createRef<HTMLButtonElement>()
      render(
        <Button href="/docs" onClick={onClick} ref={ref}>
          Docs
        </Button>,
      )
      fireEvent.click(screen.getByRole('link', { name: 'Docs' }))
      expect(onClick).toHaveBeenCalledTimes(1)
      expect(ref.current).toBe(screen.getByRole('link', { name: 'Docs' }))
    })

    it('has no href and ignores its clicks when disabled', () => {
      const onClick = vi.fn()
      render(
        <Button disabled href="/docs" onClick={onClick}>
          Docs
        </Button>,
      )
      const link = screen.getByRole('link', { name: 'Docs' })
      expect(link).not.toHaveAttribute('href')
      expect(link).toHaveAttribute('aria-disabled', 'true')
      expect(link).toHaveAttribute('data-disabled')
      expect(link).toHaveAttribute('tabindex', '-1')
      fireEvent.click(link)
      expect(onClick).not.toHaveBeenCalled()
    })

    it('has no href and ignores its clicks while loading, and keeps the focus', () => {
      const onClick = vi.fn()
      render(
        <Button href="/docs" loading onClick={onClick}>
          Docs
        </Button>,
      )
      const link = screen.getByRole('link', { name: /Docs/ })
      expect(link).not.toHaveAttribute('href')
      expect(link).toHaveAttribute('aria-busy', 'true')
      expect(link).toHaveAttribute('aria-disabled', 'true')
      expect(link).not.toHaveAttribute('tabindex')
      fireEvent.click(link)
      expect(onClick).not.toHaveBeenCalled()
    })
  })
})
