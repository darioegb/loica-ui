import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { createRef, type CSSProperties } from 'react'
import {
  Accordion,
  AccordionBody,
  AccordionContent,
  AccordionHeading,
  AccordionIcon,
  AccordionItem,
  AccordionTitle,
  AccordionTrigger,
} from '..'

describe('Accordion parts', () => {
  it('renders the default composition from the parts', () => {
    const { container } = render(
      <Accordion>
        <AccordionItem value="a">
          <AccordionTrigger>Alpha</AccordionTrigger>
          <AccordionContent>Content</AccordionContent>
        </AccordionItem>
      </Accordion>,
    )
    const heading = container.querySelector('[data-loica-accordion-heading]')
    expect(heading?.tagName).toBe('H3')
    expect(heading?.querySelector('[data-loica-accordion-trigger]')).not.toBeNull()
    expect(screen.getByText('Alpha')).toHaveAttribute('data-loica-accordion-title')
    expect(container.querySelector('[data-loica-accordion-icon] svg')).not.toBeNull()
  })

  it('takes the level of the heading from the trigger or from AccordionHeading', () => {
    render(
      <Accordion>
        <AccordionItem value="a">
          <AccordionTrigger headingLevel={5}>Alpha</AccordionTrigger>
        </AccordionItem>
        <AccordionItem value="b">
          <AccordionHeading level={2}>
            <AccordionTrigger>Beta</AccordionTrigger>
          </AccordionHeading>
        </AccordionItem>
      </Accordion>,
    )
    expect(screen.getByRole('heading', { level: 5 })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
    expect(screen.getAllByRole('heading')).toHaveLength(2)
  })

  it('does not wrap the trigger twice when it sits inside an AccordionHeading', () => {
    const { container } = render(
      <Accordion>
        <AccordionItem value="a">
          <AccordionHeading>
            <AccordionTrigger>Alpha</AccordionTrigger>
          </AccordionHeading>
        </AccordionItem>
      </Accordion>,
    )
    expect(container.querySelectorAll('[data-loica-accordion-heading]')).toHaveLength(1)
  })

  it('composes the title and the icon of the trigger in any order', () => {
    render(
      <Accordion>
        <AccordionItem value="a">
          <AccordionTrigger>
            <AccordionIcon>
              <b>+</b>
            </AccordionIcon>
            <AccordionTitle>Alpha</AccordionTitle>
          </AccordionTrigger>
        </AccordionItem>
      </Accordion>,
    )
    const button = screen.getByRole('button')
    expect(button.firstElementChild).toHaveAttribute('data-loica-accordion-icon')
    expect(button.lastElementChild).toHaveAttribute('data-loica-accordion-title')
    expect(screen.getByText('+')).toBeInTheDocument()
  })

  it('omits the icon when the trigger is given icon null, and when it is not composed', () => {
    const { container, rerender } = render(
      <Accordion>
        <AccordionItem value="a">
          <AccordionTrigger icon={null}>Alpha</AccordionTrigger>
        </AccordionItem>
      </Accordion>,
    )
    expect(container.querySelector('[data-loica-accordion-icon]')).toBeNull()
    rerender(
      <Accordion>
        <AccordionItem value="a">
          <AccordionTrigger>
            <AccordionTitle>Alpha</AccordionTitle>
          </AccordionTrigger>
        </AccordionItem>
      </Accordion>,
    )
    expect(container.querySelector('[data-loica-accordion-icon]')).toBeNull()
  })

  it('puts the body inside the collapse, bare, when AccordionBody is composed', async () => {
    const { container } = render(
      <Accordion>
        <AccordionItem value="a">
          <AccordionTrigger>Alpha</AccordionTrigger>
          <AccordionContent>
            <AccordionBody className="mine">Content</AccordionBody>
          </AccordionContent>
        </AccordionItem>
      </Accordion>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Alpha' }))
    const body = screen.getByText('Content')
    expect(body).toHaveAttribute('data-loica-accordion-body')
    expect(body).toHaveClass('mine')
    expect(body.parentElement).not.toHaveAttribute('class')
    expect(container.querySelectorAll('[data-loica-accordion-body]')).toHaveLength(1)
  })

  it('keeps the Loica class on the collapse body when AccordionBody is not composed', () => {
    render(
      <Accordion>
        <AccordionItem value="a">
          <AccordionTrigger>Alpha</AccordionTrigger>
          <AccordionContent>Content</AccordionContent>
        </AccordionItem>
      </Accordion>,
    )
    expect(screen.getByText('Content')).toHaveAttribute('class')
  })

  it('forwards the ref, the style and the state attributes of every part', async () => {
    const heading = createRef<HTMLHeadingElement>()
    const title = createRef<HTMLSpanElement>()
    const icon = createRef<HTMLSpanElement>()
    const body = createRef<HTMLDivElement>()
    render(
      <Accordion>
        <AccordionItem value="a">
          <AccordionHeading ref={heading} style={{ '--probe': 'red' } as CSSProperties}>
            <AccordionTrigger>
              <AccordionTitle ref={title} style={{ '--probe': 'blue' } as CSSProperties}>
                Alpha
              </AccordionTitle>
              <AccordionIcon ref={icon} style={{ '--probe': 'green' } as CSSProperties} />
            </AccordionTrigger>
          </AccordionHeading>
          <AccordionContent>
            <AccordionBody ref={body} style={{ '--probe': 'pink' } as CSSProperties}>
              Content
            </AccordionBody>
          </AccordionContent>
        </AccordionItem>
      </Accordion>,
    )
    expect(heading.current).toHaveStyle('--probe: red')
    expect(title.current).toHaveStyle('--probe: blue')
    expect(icon.current).toHaveStyle('--probe: green')
    expect(body.current).toHaveStyle('--probe: pink')
    expect(heading.current).not.toHaveAttribute('data-open')
    await userEvent.click(screen.getByRole('button'))
    for (const element of [heading, title, icon, body]) {
      expect(element.current).toHaveAttribute('data-open')
    }
  })

  it('marks the heading as disabled with the item', () => {
    render(
      <Accordion>
        <AccordionItem disabled value="a">
          <AccordionTrigger>Alpha</AccordionTrigger>
        </AccordionItem>
      </Accordion>,
    )
    expect(screen.getByRole('heading')).toHaveAttribute('data-disabled')
  })

  it('drops the Loica classes of the parts when it is unstyled', () => {
    render(
      <Accordion variant="unstyled">
        <AccordionItem value="a">
          <AccordionHeading className="h">
            <AccordionTrigger>
              <AccordionTitle>Alpha</AccordionTitle>
              <AccordionIcon />
            </AccordionTrigger>
          </AccordionHeading>
          <AccordionContent>
            <AccordionBody>Content</AccordionBody>
          </AccordionContent>
        </AccordionItem>
      </Accordion>,
    )
    expect(screen.getByRole('heading')).toHaveAttribute('class', 'h')
    expect(document.querySelector('[data-loica-accordion-icon]')).not.toHaveAttribute('class')
    expect(screen.getByText('Content')).not.toHaveAttribute('class')
  })

  it.each([
    ['AccordionHeading', <AccordionHeading key="x" />],
    ['AccordionTitle', <AccordionTitle key="x" />],
    ['AccordionIcon', <AccordionIcon key="x" />],
    ['AccordionBody', <AccordionBody key="x" />],
  ])('throws when %s is rendered outside its root', (name, element) => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    expect(() => render(element)).toThrow(`${name} must be used within`)
    error.mockRestore()
  })
})
