import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { Text } from '..'

describe('Text component', () => {
  it('is a paragraph with the body style by default', () => {
    render(<Text>Content</Text>)
    const text = screen.getByText('Content')
    expect(text.tagName).toBe('P')
    expect(text).toHaveClass('text', 'body')
    expect(text).toHaveAttribute('data-loica-text')
    expect(text).toHaveAttribute('data-variant', 'body')
  })

  it.each([
    ['body-sm', 'bodySm'],
    ['label', 'label'],
    ['caption', 'caption'],
  ] as const)('supports the %s style', (variant, className) => {
    render(<Text variant={variant}>Content</Text>)
    expect(screen.getByText('Content')).toHaveClass('text', className)
  })

  it.each(['dd', 'div', 'dt', 'label', 'li', 'p', 'small', 'span', 'strong'] as const)('renders a %s', (as) => {
    render(<Text as={as}>Content</Text>)
    expect(screen.getByText('Content').tagName).toBe(as.toUpperCase())
  })

  it('names a control when it is a label', () => {
    render(
      <>
        <Text as="label" htmlFor="name">
          Name
        </Text>
        <input id="name" />
      </>,
    )
    expect(screen.getByLabelText('Name')).toBeInTheDocument()
  })

  it('can be muted and truncated, and says so', () => {
    render(
      <Text muted truncate>
        Content
      </Text>,
    )
    const text = screen.getByText('Content')
    expect(text).toHaveClass('muted', 'truncate')
    expect(text).toHaveAttribute('data-muted')
    expect(text).toHaveAttribute('data-truncate')
  })

  it('has neither unless it is asked for', () => {
    render(<Text>Content</Text>)
    const text = screen.getByText('Content')
    expect(text).not.toHaveClass('muted', 'truncate')
    expect(text).not.toHaveAttribute('data-muted')
    expect(text).not.toHaveAttribute('data-truncate')
  })

  it('can be a term and its description inside a definition list', () => {
    render(
      <dl>
        <Text as="dt" variant="label">
          Status
        </Text>
        <Text as="dd">Done</Text>
      </dl>,
    )
    expect(screen.getByRole('term')).toHaveTextContent('Status')
    expect(screen.getByRole('definition')).toHaveTextContent('Done')
  })

  it('takes its font size from the element around it with size inherit, and keeps the rest of the variant', () => {
    render(
      <Text size="inherit" variant="label">
        Content
      </Text>,
    )
    const text = screen.getByText('Content')
    expect(text).toHaveClass('label', 'sizeInherit')
    expect(text).toHaveAttribute('data-size', 'inherit')
  })

  it('has no size class and no data-size unless it is asked for', () => {
    render(<Text>Content</Text>)
    const text = screen.getByText('Content')
    expect(text).not.toHaveClass('sizeInherit')
    expect(text).not.toHaveAttribute('data-size')
    expect(text).not.toHaveAttribute('data-weight')
  })

  it.each([
    ['normal', 'weightNormal'],
    ['medium', 'weightMedium'],
    ['semibold', 'weightSemibold'],
    ['bold', 'weightBold'],
  ] as const)('has the %s weight of the theme', (weight, className) => {
    render(<Text weight={weight}>Content</Text>)
    const text = screen.getByText('Content')
    expect(text).toHaveClass('body', className)
    expect(text).toHaveAttribute('data-weight', weight)
  })

  it('ignores the size and the weight when it is unstyled, but says them', () => {
    render(
      <Text size="inherit" variant="unstyled" weight="bold">
        Content
      </Text>,
    )
    const text = screen.getByText('Content')
    expect(text.className).toBe('')
    expect(text).toHaveAttribute('data-size', 'inherit')
    expect(text).toHaveAttribute('data-weight', 'bold')
  })

  it('drops the Loica classes when it is unstyled and keeps the className', () => {
    render(
      <Text className="custom" muted variant="unstyled">
        Content
      </Text>,
    )
    const text = screen.getByText('Content')
    expect(text.className).toBe('custom')
    expect(text).toHaveAttribute('data-variant', 'unstyled')
  })

  it('keeps the truncation when it is unstyled', () => {
    render(
      <Text truncate variant="unstyled">
        Content
      </Text>,
    )
    expect(screen.getByText('Content')).toHaveClass('truncate')
  })

  it('applies the style, the id and the language', () => {
    render(
      <Text id="intro" lang="es" style={{ color: 'red' }}>
        Content
      </Text>,
    )
    const text = screen.getByText('Content')
    expect(text).toHaveAttribute('id', 'intro')
    expect(text).toHaveAttribute('lang', 'es')
    expect(text).toHaveStyle({ color: 'rgb(255, 0, 0)' })
  })

  it('forwards the ref to the element', () => {
    const ref = createRef<HTMLElement>()
    render(<Text ref={ref}>Content</Text>)
    expect(ref.current).toBe(screen.getByText('Content'))
  })
})
