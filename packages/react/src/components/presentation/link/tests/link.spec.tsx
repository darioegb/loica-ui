import { fireEvent, render, screen } from '@testing-library/react'
import { createRef, forwardRef } from 'react'
import { LinkProvider } from '../../../../link'
import type { LinkComponentProps } from '../../../../link'
import { LocaleProvider } from '../../../../locale/locale-provider'
import { Link } from '..'

const RouterLink = forwardRef<HTMLAnchorElement, LinkComponentProps>(
  ({ children, href, ...rest }: LinkComponentProps, ref) => (
    <a {...rest} data-router="" href={`/app${href}`} ref={ref}>
      {children}
    </a>
  ),
)
RouterLink.displayName = 'RouterLink'

describe('Link component', () => {
  it('renders an anchor with its children and href', () => {
    render(<Link href="/docs">Docs</Link>)
    const link = screen.getByRole('link', { name: 'Docs' })
    expect(link.tagName).toBe('A')
    expect(link).toHaveAttribute('href', '/docs')
    expect(link).toHaveAttribute('data-loica-link')
  })

  it('is underlined with the primary color by default', () => {
    render(<Link href="/docs">Docs</Link>)
    const link = screen.getByRole('link')
    expect(link).toHaveClass('link', 'underline')
    expect(link).toHaveStyle('--link-color: var(--loica-color-primary-text)')
  })

  it.each(['underline', 'hover'] as const)('applies the %s variant', (variant) => {
    render(
      <Link href="/docs" variant={variant}>
        Docs
      </Link>,
    )
    expect(screen.getByRole('link')).toHaveClass('link', variant)
  })

  it('takes its content from label, and children win', () => {
    const { rerender } = render(<Link href="/docs" label="From the label" />)
    expect(screen.getByRole('link', { name: 'From the label' })).toBeInTheDocument()
    rerender(
      <Link href="/docs" label="From the label">
        From the children
      </Link>,
    )
    expect(screen.getByRole('link', { name: 'From the children' })).toBeInTheDocument()
  })

  it('names an external link made with a label', () => {
    render(<Link external href="https://example.com" label="Example" />)
    expect(screen.getByRole('link', { name: /^Example\s?\(opens in a new tab\)$/ })).toBeInTheDocument()
  })

  it('takes the size of the text around it, unless it has a size', () => {
    const { rerender } = render(<Link href="/docs" label="Docs" />)
    for (const size of ['sm', 'md', 'lg']) expect(screen.getByRole('link')).not.toHaveClass(size)
    rerender(<Link href="/docs" label="Docs" size="md" />)
    expect(screen.getByRole('link')).toHaveClass('link', 'md')
  })

  it('exposes the color scheme as CSS variables, and lets the style override them', () => {
    render(
      <Link colorScheme="error" href="/docs" style={{ '--link-hover-color': 'red' } as React.CSSProperties}>
        Docs
      </Link>,
    )
    const link = screen.getByRole('link')
    expect(link).toHaveStyle('--link-color: var(--loica-color-error-text)')
    expect(link).toHaveStyle('--link-hover-color: red')
  })

  it('keeps the custom className and the native attributes', () => {
    render(
      <Link className="custom" href="/docs" hrefLang="en" id="docs" title="Read the docs">
        Docs
      </Link>,
    )
    const link = screen.getByRole('link')
    expect(link).toHaveClass('link', 'custom')
    expect(link).toHaveAttribute('hreflang', 'en')
    expect(link).toHaveAttribute('id', 'docs')
    expect(link).toHaveAttribute('title', 'Read the docs')
  })

  it('drops the Loica classes when unstyled', () => {
    render(
      <Link className="custom" href="/docs" variant="unstyled">
        Docs
      </Link>,
    )
    const link = screen.getByRole('link')
    expect(link).toHaveClass('custom')
    expect(link).not.toHaveClass('link')
    expect(link).not.toHaveClass('underline')
  })

  it('forwards the ref and calls onClick', () => {
    const ref = createRef<HTMLAnchorElement>()
    const onClick = vi.fn((event: React.MouseEvent) => event.preventDefault())
    render(
      <Link href="/docs" onClick={onClick} ref={ref}>
        Docs
      </Link>,
    )
    expect(ref.current).toBe(screen.getByRole('link'))
    fireEvent.click(screen.getByRole('link'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  describe('with the LinkProvider', () => {
    it('renders the link of the provider for a path of the app', () => {
      render(
        <LinkProvider component={RouterLink}>
          <Link href="/docs">Docs</Link>
        </LinkProvider>,
      )
      const link = screen.getByRole('link', { name: 'Docs' })
      expect(link).toHaveAttribute('data-router')
      expect(link).toHaveAttribute('href', '/app/docs')
    })

    it.each([
      ['an absolute URL', { href: 'https://example.com' }],
      ['a mailto', { href: 'mailto:hi@example.com' }],
      ['a target of its own', { href: '/docs', target: '_blank' }],
      ['an external link', { external: true, href: '/docs' }],
    ])('leaves %s as a plain anchor', (_name, props) => {
      render(
        <LinkProvider component={RouterLink}>
          <Link {...props}>Docs</Link>
        </LinkProvider>,
      )
      expect(document.querySelector('[data-router]')).toBeNull()
    })
  })

  describe('disabled', () => {
    it('has no href, is announced as disabled and leaves the tab order', () => {
      render(
        <Link disabled href="/docs">
          Docs
        </Link>,
      )
      const link = screen.getByRole('link', { name: 'Docs' })
      expect(link).not.toHaveAttribute('href')
      expect(link).toHaveAttribute('aria-disabled', 'true')
      expect(link).toHaveAttribute('tabindex', '-1')
      expect(link).toHaveAttribute('data-disabled')
    })

    it('ignores its clicks and is never the link of the provider', () => {
      const onClick = vi.fn()
      render(
        <LinkProvider component={RouterLink}>
          <Link disabled href="/docs" onClick={onClick}>
            Docs
          </Link>
        </LinkProvider>,
      )
      fireEvent.click(screen.getByRole('link'))
      expect(onClick).not.toHaveBeenCalled()
      expect(document.querySelector('[data-router]')).toBeNull()
    })

    it('is not disabled by default', () => {
      render(<Link href="/docs">Docs</Link>)
      const link = screen.getByRole('link')
      expect(link).not.toHaveAttribute('aria-disabled')
      expect(link).not.toHaveAttribute('tabindex')
      expect(link).not.toHaveAttribute('data-disabled')
    })
  })

  describe('external', () => {
    it('opens in a new tab with a safe rel', () => {
      render(
        <Link external href="https://example.com">
          Example
        </Link>,
      )
      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
      expect(link).toHaveAttribute('data-external')
    })

    it('tells screen readers that it opens in a new tab', () => {
      render(
        <Link external href="https://example.com">
          Example
        </Link>,
      )
      expect(
        screen.getByRole('link', { name: /^Example\s?\(opens in a new tab\)$/ }),
      ).toBeInTheDocument()
    })

    it('reads the text from the LocaleProvider', () => {
      render(
        <LocaleProvider messages={{ link: { external: 'se abre en una pestana nueva' } }}>
          <Link external href="https://example.com">
            Ejemplo
          </Link>
        </LocaleProvider>,
      )
      expect(
        screen.getByRole('link', { name: /^Ejemplo\s?\(se abre en una pestana nueva\)$/ }),
      ).toBeInTheDocument()
    })

    it('keeps the target and the rel of its own', () => {
      render(
        <Link external href="https://example.com" rel="author" target="_top">
          Example
        </Link>,
      )
      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('target', '_top')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer author')
    })

    it('adds nothing when it is not external', () => {
      render(
        <Link href="https://example.com" rel="author">
          Example
        </Link>,
      )
      const link = screen.getByRole('link', { name: 'Example' })
      expect(link).not.toHaveAttribute('target')
      expect(link).toHaveAttribute('rel', 'author')
      expect(link).not.toHaveAttribute('data-external')
    })
  })
})
