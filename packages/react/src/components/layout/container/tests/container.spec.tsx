import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { Container } from '..'

describe('Container component', () => {
  it('is a div with the width and the gutter of the theme by default', () => {
    render(<Container>Content</Container>)
    const container = screen.getByText('Content')
    expect(container.tagName).toBe('DIV')
    expect(container).toHaveClass('container')
    expect(container).toHaveAttribute('data-loica-container')
    expect(container).toHaveAttribute('data-size', '3xl')
    expect(container).toHaveAttribute('data-gutter', '4')
  })

  it.each(['3xs', '2xs', 'xs', 'sm', 'md', 'lg', '3xl', 'full'] as const)(
    'says its %s size',
    (size) => {
      render(<Container size={size}>Content</Container>)
      expect(screen.getByText('Content')).toHaveAttribute('data-size', size)
    },
  )

  it('says its gutter, with a fraction too', () => {
    render(<Container gutter={1.5}>Content</Container>)
    expect(screen.getByText('Content')).toHaveAttribute('data-gutter', '1.5')
  })

  it.each(['article', 'aside', 'footer', 'header', 'main', 'nav', 'section'] as const)(
    'renders a %s',
    (as) => {
      render(<Container as={as}>Content</Container>)
      expect(screen.getByText('Content').tagName).toBe(as.toUpperCase())
    },
  )

  it('drops the Loica class when it is unstyled and keeps the className and the attributes', () => {
    render(
      <Container className="custom" size="md" variant="unstyled">
        Content
      </Container>,
    )
    const container = screen.getByText('Content')
    expect(container.className).toBe('custom')
    expect(container).toHaveAttribute('data-size', 'md')
  })

  it('applies the className, the style and the native attributes', () => {
    render(
      <Container aria-label="Page" className="custom" id="page" role="region" style={{ color: 'red' }}>
        Content
      </Container>,
    )
    const container = screen.getByRole('region', { name: 'Page' })
    expect(container).toHaveClass('container', 'custom')
    expect(container).toHaveAttribute('id', 'page')
    expect(container).toHaveStyle({ color: 'rgb(255, 0, 0)' })
  })

  it('forwards the ref to the element', () => {
    const ref = createRef<HTMLDivElement>()
    render(<Container ref={ref}>Content</Container>)
    expect(ref.current).toBe(screen.getByText('Content'))
  })
})
