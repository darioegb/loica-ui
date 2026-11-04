import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { Card, CardBody, CardFooter, CardHeader } from '..'

describe('Card component', () => {

  describe('title and description', () => {
    it('renders them in a header and a body, with the children in the same body', () => {
      const { container } = render(
        <Card description="10 projects." title="Plan">
          <a href="#upgrade">Upgrade</a>
        </Card>,
      )
      const card = container.firstElementChild
      expect(card?.children[0]).toHaveAttribute('data-plume-card-header')
      expect(card?.children[0]).toHaveTextContent('Plan')
      expect(card?.children[1]).toHaveAttribute('data-plume-card-body')
      expect(card?.children[1]).toHaveTextContent('10 projects.Upgrade')
      expect(card).not.toHaveAttribute('title')
    })

    it('puts the title before the parts it is given', () => {
      const { container } = render(
        <Card description="Intro" title="Plan">
          <CardFooter>Footer</CardFooter>
        </Card>,
      )
      const parts = Array.from(container.firstElementChild?.children ?? [], (part) =>
        part.getAttributeNames().find((name) => name.startsWith('data-plume-card-')),
      )
      expect(parts).toEqual(['data-plume-card-header', 'data-plume-card-body', 'data-plume-card-footer'])
    })

    it('renders only a header for a title alone', () => {
      const { container } = render(<Card title="Plan" />)
      expect(container.firstElementChild?.children).toHaveLength(1)
    })

    it('leaves the children as they are without them', () => {
      const { container } = render(<Card>Text</Card>)
      expect(container.firstElementChild?.innerHTML).toBe('Text')
    })
  })
  it('renders its parts', () => {
    render(
      <Card>
        <CardHeader>Title</CardHeader>
        <CardBody>Content</CardBody>
        <CardFooter>Actions</CardFooter>
      </Card>,
    )
    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
    expect(screen.getByText('Actions')).toBeInTheDocument()
  })

  it('is an elevated medium card by default', () => {
    render(<Card data-testid="card">Content</Card>)
    expect(screen.getByText('Content')).toHaveClass('card', 'md', 'elevated')
  })

  it.each(['elevated', 'outline', 'filled'] as const)('supports the %s variant', (variant) => {
    render(<Card variant={variant}>Content</Card>)
    expect(screen.getByText('Content')).toHaveClass('card', variant)
  })

  it.each(['sm', 'md', 'lg'] as const)('supports the %s size', (size) => {
    render(<Card size={size}>Content</Card>)
    expect(screen.getByText('Content')).toHaveClass(size)
  })

  it('keeps the custom className and style', () => {
    render(
      <Card className="custom" style={{ width: '160px' }}>
        Content
      </Card>,
    )
    const card = screen.getByText('Content')
    expect(card).toHaveClass('card', 'custom')
    expect(card).toHaveStyle({ width: '160px' })
  })

  it('drops the Plume classes when unstyled', () => {
    render(
      <Card className="custom" variant="unstyled">
        Content
      </Card>,
    )
    const card = screen.getByText('Content')
    expect(card).toHaveClass('custom')
    expect(card).not.toHaveClass('card')
  })

  it('has no role of its own and takes one with a name', () => {
    const { rerender } = render(<Card>Content</Card>)
    expect(screen.getByText('Content')).not.toHaveAttribute('role')

    rerender(
      <Card aria-label="Weekly report" role="region">
        Content
      </Card>,
    )
    expect(screen.getByRole('region', { name: 'Weekly report' })).toBeInTheDocument()
  })

  it('forwards the ref to the root element', () => {
    const ref = createRef<HTMLDivElement>()
    render(<Card ref={ref}>Content</Card>)
    expect(ref.current).toBe(screen.getByText('Content'))
  })

  it.each([
    ['CardHeader', CardHeader, 'header'],
    ['CardBody', CardBody, 'body'],
    ['CardFooter', CardFooter, 'footer'],
  ] as const)('%s takes className, style and a ref', (_name, Part, className) => {
    const ref = createRef<HTMLDivElement>()
    render(
      <Card>
        <Part className="custom" ref={ref} style={{ width: '80px' }}>
          Part
        </Part>
      </Card>,
    )
    const part = screen.getByText('Part')
    expect(part).toHaveClass(className, 'custom')
    expect(part).toHaveStyle({ width: '80px' })
    expect(ref.current).toBe(part)
  })
})

describe('Card parts model', () => {
  it('marks the root and every part with its data attribute', () => {
    const { container } = render(
      <Card>
        <CardHeader>Title</CardHeader>
        <CardBody>Content</CardBody>
        <CardFooter>Actions</CardFooter>
      </Card>,
    )
    for (const part of ['card', 'card-header', 'card-body', 'card-footer']) {
      expect(container.querySelector(`[data-plume-${part}]`)).not.toBeNull()
    }
  })

  it('drops the Plume classes of every part when unstyled', () => {
    render(
      <Card variant="unstyled">
        <CardHeader className="mine">Title</CardHeader>
        <CardBody>Content</CardBody>
        <CardFooter>Actions</CardFooter>
      </Card>,
    )
    expect(screen.getByText('Title').className).toBe('mine')
    expect(screen.getByText('Content')).not.toHaveAttribute('class')
    expect(screen.getByText('Actions')).not.toHaveAttribute('class')
  })

  it.each([
    ['CardHeader', <CardHeader key="a">Part</CardHeader>],
    ['CardBody', <CardBody key="a">Part</CardBody>],
    ['CardFooter', <CardFooter key="a">Part</CardFooter>],
  ])('%s throws outside a Card', (name, part) => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    expect(() => render(part)).toThrow(`${name} must be used within a <Card>`)
    error.mockRestore()
  })
})
