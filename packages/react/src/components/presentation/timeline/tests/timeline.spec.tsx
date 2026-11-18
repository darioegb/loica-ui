import { render, screen, within } from '@testing-library/react'
import { createRef } from 'react'
import { Timeline, TimelineItem } from '..'

describe('Timeline component', () => {
  it('renders an ordered list of items', () => {
    render(
      <Timeline aria-label="Activity">
        <TimelineItem title="Created" />
        <TimelineItem title="Assigned" />
      </Timeline>,
    )
    const list = screen.getByRole('list', { name: 'Activity' })
    expect(list.tagName).toBe('OL')
    expect(within(list).getAllByRole('listitem')).toHaveLength(2)
  })

  it('shows the title, the time and the content of an item', () => {
    render(
      <Timeline>
        <TimelineItem dateTime="2026-06-15T09:30" time="15 Jun, 09:30" title="Project created">
          Ana Torres opened it.
        </TimelineItem>
      </Timeline>,
    )
    expect(screen.getByText('Project created')).toBeInTheDocument()
    expect(screen.getByText('Ana Torres opened it.')).toBeInTheDocument()
    const time = screen.getByText('15 Jun, 09:30')
    expect(time.tagName).toBe('TIME')
    expect(time).toHaveAttribute('datetime', '2026-06-15T09:30')
  })

  it('leaves out what an item does not have', () => {
    const { container } = render(
      <Timeline>
        <TimelineItem title="Only a title" />
      </Timeline>,
    )
    expect(container.querySelector('time')).toBeNull()
    expect(container.querySelector('[data-loica-timeline-body]')).toBeNull()

    const bare = render(
      <Timeline>
        <TimelineItem />
      </Timeline>,
    )
    expect(bare.container.querySelector('[data-loica-timeline-header]')).toBeNull()
  })

  it('writes the time as plain text when there is no dateTime, since a time element needs a valid one', () => {
    render(
      <Timeline>
        <TimelineItem time="3 hours ago" />
      </Timeline>,
    )
    const time = screen.getByText('3 hours ago')
    expect(time.tagName).toBe('SPAN')
    expect(time).toHaveAttribute('data-loica-timeline-time')
  })

  it('hides the marker from assistive technology and shows the icon in it', () => {
    const { container } = render(
      <Timeline>
        <TimelineItem icon={<svg data-testid="icon" />} title="Done" />
        <TimelineItem title="Dot" />
      </Timeline>,
    )
    const markers = container.querySelectorAll('[data-loica-timeline-marker]')
    expect(markers[0]).toHaveAttribute('aria-hidden', 'true')
    expect(markers[0]).toContainElement(screen.getByTestId('icon'))
    expect(markers[1]).toBeEmptyDOMElement()
  })

  it('sets the color of the markers from the Timeline, and an item can set its own', () => {
    const { container } = render(
      <Timeline colorScheme="info">
        <TimelineItem title="Inherits" />
        <TimelineItem colorScheme="error" title="Own" />
      </Timeline>,
    )
    const list = container.querySelector('ol') as HTMLElement
    const items = container.querySelectorAll<HTMLElement>('li')
    expect(list.style.getPropertyValue('--timeline-solid')).toContain('info')
    expect(items[0].style.getPropertyValue('--timeline-solid')).toBe('')
    expect(items[1].style.getPropertyValue('--timeline-solid')).toContain('error')
  })

  it('forwards the refs and takes className, style and native attributes', () => {
    const listRef = createRef<HTMLOListElement>()
    const itemRef = createRef<HTMLLIElement>()
    render(
      <Timeline className="mine" data-testid="list" ref={listRef} style={{ margin: 3 }}>
        <TimelineItem className="seg" data-testid="item" ref={itemRef} style={{ margin: 5 }}>
          Body
        </TimelineItem>
      </Timeline>,
    )
    expect(listRef.current?.tagName).toBe('OL')
    expect(listRef.current).toHaveClass('mine')
    expect(listRef.current?.style.margin).toBe('3px')
    expect(itemRef.current?.tagName).toBe('LI')
    expect(itemRef.current).toHaveClass('seg')
    expect(itemRef.current?.style.margin).toBe('5px')
  })

  it('has a class for each variant', () => {
    const classes = (['subtle', 'solid', 'outline'] as const).map((variant) => {
      const { container, unmount } = render(
        <Timeline variant={variant}>
          <TimelineItem title="Item" />
        </Timeline>,
      )
      const list = (container.querySelector('ol') as HTMLElement).className
      unmount()
      return list
    })
    expect(new Set(classes).size).toBe(3)
    classes.forEach((name) => expect(name).toMatch(/timeline/))
  })

  it('has no Loica class when it is unstyled, and keeps the structure attributes', () => {
    const { container } = render(
      <Timeline className="mine" variant="unstyled">
        <TimelineItem title="Item" />
      </Timeline>,
    )
    const list = container.querySelector('ol') as HTMLElement
    expect(list.className).toBe('mine')
    expect(list).toHaveAttribute('data-loica-timeline')
    expect(container.querySelector('[data-loica-timeline-item]')).not.toBeNull()
  })
})
