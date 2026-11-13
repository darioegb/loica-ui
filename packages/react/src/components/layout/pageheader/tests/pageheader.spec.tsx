import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { PageHeader } from '..'

describe('PageHeader component', () => {
  it('renders a header with the title as an h1', () => {
    render(<PageHeader title="Projects" />)
    expect(screen.getByRole('heading', { level: 1, name: 'Projects' })).toBeInTheDocument()
    expect(screen.getByRole('heading').closest('header')).toHaveAttribute('data-loica-pageheader')
  })

  it('shows the description under the title, muted', () => {
    render(<PageHeader description="All of them" title="Projects" />)
    const description = screen.getByText('All of them')
    expect(description).toHaveAttribute('data-loica-pageheader-description')
    expect(description).toHaveAttribute('data-muted')
    expect(description.previousElementSibling).toBe(screen.getByRole('heading'))
  })

  it('renders the actions after the title', () => {
    render(<PageHeader actions={<button type="button">New</button>} title="Projects" />)
    const actions = screen.getByRole('button', { name: 'New' }).parentElement
    expect(actions).toHaveAttribute('data-loica-pageheader-actions')
    expect(actions).toHaveClass('actions')
    expect(actions?.previousElementSibling).toHaveAttribute('data-loica-pageheader-text')
  })

  it('renders neither a description nor actions that it does not get', () => {
    const { container } = render(<PageHeader title="Projects" />)
    expect(container.querySelector('[data-loica-pageheader-description]')).toBeNull()
    expect(container.querySelector('[data-loica-pageheader-actions]')).toBeNull()
  })

  it.each(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const)('renders the title as %s', (titleAs) => {
    render(<PageHeader title="Projects" titleAs={titleAs} />)
    expect(screen.getByRole('heading', { level: Number(titleAs.slice(1)) })).toBeInTheDocument()
  })

  it('looks the same at every level of the title', () => {
    render(<PageHeader title="Projects" titleAs="h4" />)
    expect(screen.getByRole('heading')).toHaveAttribute('data-size', '3')
  })

  it('styles the header, its text and its actions', () => {
    const { container } = render(<PageHeader actions="Actions" description="Text" title="Projects" />)
    expect(container.querySelector('header')).toHaveClass('pageheader')
    expect(screen.getByRole('heading')).toHaveClass('heading')
    expect(screen.getByText('Text')).toHaveClass('text', 'muted')
  })

  it('drops every Loica class when it is unstyled, and keeps the data attributes', () => {
    const { container } = render(
      <PageHeader actions="Actions" className="mine" description="Text" title="Projects" variant="unstyled" />,
    )
    const header = container.querySelector('header')
    expect(header?.className).toBe('mine')
    for (const part of ['text', 'actions']) {
      expect(container.querySelector(`[data-loica-pageheader-${part}]`)).not.toHaveAttribute('class')
    }
    expect(screen.getByRole('heading')).not.toHaveAttribute('class')
    expect(screen.getByText('Text')).not.toHaveAttribute('class')
    expect(screen.getByRole('heading')).toHaveAttribute('data-loica-pageheader-title')
  })

  it('keeps the custom className', () => {
    const { container } = render(<PageHeader className="custom" title="Projects" />)
    expect(container.querySelector('header')).toHaveClass('pageheader', 'custom')
  })

  it('passes the rest of the attributes to the header', () => {
    const { container } = render(<PageHeader aria-label="Projects" data-testid="header" id="top" title="Projects" />)
    expect(container.querySelector('header')).toHaveAttribute('id', 'top')
    expect(screen.getByTestId('header')).toHaveAttribute('aria-label', 'Projects')
  })

  it('forwards the ref to the header', () => {
    const ref = createRef<HTMLElement>()
    render(<PageHeader ref={ref} title="Projects" />)
    expect(ref.current?.tagName).toBe('HEADER')
  })
})
