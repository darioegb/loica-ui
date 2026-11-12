import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { DescriptionDetails, DescriptionList, DescriptionTerm } from '..'

const list = (props = {}) => (
  <DescriptionList aria-label="Facts" {...props}>
    <DescriptionTerm>Status</DescriptionTerm>
    <DescriptionDetails>Active</DescriptionDetails>
    <DescriptionTerm>Owner</DescriptionTerm>
    <DescriptionDetails>Ana</DescriptionDetails>
  </DescriptionList>
)

describe('DescriptionList component', () => {
  it('renders a dl with its terms and details', () => {
    const { container } = render(list())
    const dl = container.querySelector('dl')
    expect(dl).toHaveAttribute('data-loica-descriptionlist')
    expect(dl?.querySelectorAll('dt')).toHaveLength(2)
    expect(dl?.querySelectorAll('dd')).toHaveLength(2)
    expect(screen.getByText('Status').tagName).toBe('DT')
    expect(screen.getByText('Active').tagName).toBe('DD')
  })

  it('is stacked and medium by default', () => {
    const { container } = render(list())
    const dl = container.querySelector('dl')
    expect(dl).toHaveClass('descriptionlist')
    expect(dl).toHaveAttribute('data-layout', 'stacked')
    expect(dl).toHaveAttribute('data-size', 'md')
  })

  it.each(['inline', 'stacked'] as const)('says the %s layout', (layout) => {
    const { container } = render(list({ layout }))
    expect(container.querySelector('dl')).toHaveAttribute('data-layout', layout)
  })

  it.each(['sm', 'md', 'lg'] as const)('says the %s size', (size) => {
    const { container } = render(list({ size }))
    expect(container.querySelector('dl')).toHaveAttribute('data-size', size)
  })

  it('marks the terms and the details so they can be styled', () => {
    render(list())
    expect(screen.getByText('Status')).toHaveAttribute('data-loica-description-term')
    expect(screen.getByText('Active')).toHaveAttribute('data-loica-description-details')
  })

  it('drops its class when it is unstyled, and keeps the data attributes', () => {
    const { container } = render(list({ className: 'mine', variant: 'unstyled' }))
    const dl = container.querySelector('dl')
    expect(dl?.className).toBe('mine')
    expect(dl).toHaveAttribute('data-layout', 'stacked')
  })

  it('keeps the custom className', () => {
    const { container } = render(list({ className: 'custom' }))
    expect(container.querySelector('dl')).toHaveClass('descriptionlist', 'custom')
  })

  it('passes the rest of the attributes to its elements', () => {
    render(
      <DescriptionList id="facts" style={{ color: 'red' }}>
        <DescriptionTerm className="term" data-testid="term">
          Status
        </DescriptionTerm>
        <DescriptionDetails className="details" id="status">
          Active
        </DescriptionDetails>
      </DescriptionList>,
    )
    expect(document.getElementById('facts')).toHaveAttribute('style', 'color: red;')
    expect(screen.getByTestId('term')).toHaveClass('term')
    expect(screen.getByText('Active')).toHaveClass('details')
    expect(screen.getByText('Active')).toHaveAttribute('id', 'status')
  })

  it('forwards the refs', () => {
    const listRef = createRef<HTMLDListElement>()
    const termRef = createRef<HTMLElement>()
    const detailsRef = createRef<HTMLElement>()
    render(
      <DescriptionList ref={listRef}>
        <DescriptionTerm ref={termRef}>Status</DescriptionTerm>
        <DescriptionDetails ref={detailsRef}>Active</DescriptionDetails>
      </DescriptionList>,
    )
    expect(listRef.current?.tagName).toBe('DL')
    expect(termRef.current?.tagName).toBe('DT')
    expect(detailsRef.current?.tagName).toBe('DD')
  })
})
