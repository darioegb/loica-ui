import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { Stack } from '..'

describe('Stack component', () => {
  it('is a column of a div with a gap of 4 by default', () => {
    render(<Stack>Content</Stack>)
    const stack = screen.getByText('Content')
    expect(stack.tagName).toBe('DIV')
    expect(stack).toHaveClass('stack')
    expect(stack).toHaveAttribute('data-loica-stack')
    expect(stack).toHaveAttribute('data-direction', 'column')
    expect(stack).toHaveAttribute('data-gap', '4')
  })

  it('has no align, justify, wrap or stackBelow unless they are asked for', () => {
    render(<Stack>Content</Stack>)
    const stack = screen.getByText('Content')
    for (const name of ['data-align', 'data-justify', 'data-wrap', 'data-stack-below']) {
      expect(stack).not.toHaveAttribute(name)
    }
  })

  it('says every option it is given', () => {
    render(
      <Stack align="center" direction="row" gap={1.5} justify="between" stackBelow="md" wrap>
        Content
      </Stack>,
    )
    const stack = screen.getByText('Content')
    expect(stack).toHaveAttribute('data-align', 'center')
    expect(stack).toHaveAttribute('data-direction', 'row')
    expect(stack).toHaveAttribute('data-gap', '1.5')
    expect(stack).toHaveAttribute('data-justify', 'between')
    expect(stack).toHaveAttribute('data-stack-below', 'md')
    expect(stack).toHaveAttribute('data-wrap')
  })

  it.each(['baseline', 'center', 'end', 'start', 'stretch'] as const)('aligns to %s', (align) => {
    render(<Stack align={align}>Content</Stack>)
    expect(screen.getByText('Content')).toHaveAttribute('data-align', align)
  })

  it.each(['sm', 'md', 'lg', 'xl', '2xl'] as const)('stacks below %s', (stackBelow) => {
    render(<Stack stackBelow={stackBelow}>Content</Stack>)
    expect(screen.getByText('Content')).toHaveAttribute('data-stack-below', stackBelow)
  })

  it.each(['article', 'aside', 'div', 'footer', 'form', 'header', 'main', 'nav', 'section'] as const)(
    'renders a %s with no role of its own',
    (as) => {
      render(<Stack as={as}>Content</Stack>)
      const stack = screen.getByText('Content')
      expect(stack.tagName).toBe(as.toUpperCase())
      expect(stack).not.toHaveAttribute('role')
    },
  )

  it.each(['ul', 'ol'] as const)('keeps the list role of a %s, which has no bullets', (as) => {
    render(
      <Stack as={as}>
        <li>One</li>
        <li>Two</li>
      </Stack>,
    )
    const list = screen.getByRole('list')
    expect(list.tagName).toBe(as.toUpperCase())
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
  })

  it('lets the role be replaced', () => {
    render(
      <Stack as="ul" role="menu">
        <li role="menuitem">One</li>
      </Stack>,
    )
    expect(screen.getByRole('menu')).toBeInTheDocument()
  })

  it('drops the Loica class when it is unstyled and keeps the className and the attributes', () => {
    render(
      <Stack className="custom" direction="row" gap={2} variant="unstyled">
        Content
      </Stack>,
    )
    const stack = screen.getByText('Content')
    expect(stack.className).toBe('custom')
    expect(stack).toHaveAttribute('data-direction', 'row')
    expect(stack).toHaveAttribute('data-gap', '2')
  })

  it('applies the className, the style and the native attributes', () => {
    render(
      <Stack aria-label="Actions" className="custom" id="actions" role="group" style={{ color: 'red' }}>
        Content
      </Stack>,
    )
    const stack = screen.getByRole('group', { name: 'Actions' })
    expect(stack).toHaveClass('stack', 'custom')
    expect(stack).toHaveAttribute('id', 'actions')
    expect(stack).toHaveStyle({ color: 'rgb(255, 0, 0)' })
  })

  it('forwards the ref to the element', () => {
    const ref = createRef<HTMLDivElement>()
    render(<Stack ref={ref}>Content</Stack>)
    expect(ref.current).toBe(screen.getByText('Content'))
  })
})
