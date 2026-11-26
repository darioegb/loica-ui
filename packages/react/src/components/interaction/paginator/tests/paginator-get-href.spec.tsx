import { fireEvent, render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { forwardRef } from 'react'
import { LinkProvider, type LinkComponentProps } from '../../../../link'
import { Paginator, PaginatorList } from '..'

const getHref = (page: number): string => `#page-${page}`

const hrefs = (): Array<string | null> =>
  screen.getAllByRole('link').map((link) => link.getAttribute('href'))

describe('Paginator getHref', () => {
  it('renders every page, previous, next, first and last as a link to its page', () => {
    render(
      <Paginator defaultPage={3} getHref={getHref} showEdges total={50} pageSize={10}>
        <PaginatorList />
      </Paginator>,
    )
    expect(screen.queryByRole('button', { name: /page/i })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'First page' })).toHaveAttribute('href', '#page-1')
    expect(screen.getByRole('link', { name: 'Previous page' })).toHaveAttribute('href', '#page-2')
    expect(screen.getByRole('link', { name: 'Next page' })).toHaveAttribute('href', '#page-4')
    expect(screen.getByRole('link', { name: 'Last page' })).toHaveAttribute('href', '#page-5')
    expect(screen.getByRole('link', { name: 'Page 5' })).toHaveAttribute('href', '#page-5')
  })

  it('keeps the link of the current page, marked as current', () => {
    render(<Paginator defaultPage={2} getHref={getHref} pageSize={10} total={30} />)
    const current = screen.getByRole('link', { name: 'Page 2, current page' })
    expect(current).toHaveAttribute('href', '#page-2')
    expect(current).toHaveAttribute('aria-current', 'page')
  })

  it('leaves the parts that go nowhere without href', () => {
    render(<Paginator getHref={getHref} pageSize={10} showEdges total={30} />)
    for (const name of ['First page', 'Previous page']) {
      const part = screen.getByRole('link', { name })
      expect(part).not.toHaveAttribute('href')
      expect(part).toHaveAttribute('aria-disabled', 'true')
    }
    expect(screen.getByRole('link', { name: 'Next page' })).toHaveAttribute('href', '#page-2')
  })

  it('leaves every link without href when the Paginator is disabled', () => {
    render(<Paginator disabled getHref={getHref} pageSize={10} total={30} />)
    expect(hrefs().every((href) => href === null)).toBe(true)
  })

  it('renders buttons when there is no getHref', () => {
    render(<Paginator pageSize={10} total={30} />)
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Page 2' })).toBeInTheDocument()
  })

  it('calls onPageChange on a plain click and leaves the default alone', async () => {
    const onPageChange = vi.fn()
    const onClick = vi.fn((event: MouseEvent) => event.defaultPrevented)
    document.addEventListener('click', onClick)
    render(<Paginator getHref={getHref} onPageChange={onPageChange} pageSize={10} total={30} />)
    await userEvent.click(screen.getByRole('link', { name: 'Page 3' }))
    document.removeEventListener('click', onClick)
    expect(onPageChange).toHaveBeenCalledWith(3)
    expect(onClick).toHaveReturnedWith(false)
  })

  it('does not change the page when the click opens it somewhere else', () => {
    const onChange = vi.fn()
    render(<Paginator getHref={getHref} onChange={onChange} pageSize={10} total={30} />)
    for (const modifier of ['ctrlKey', 'metaKey', 'shiftKey', 'altKey']) {
      fireEvent.click(screen.getByRole('link', { name: 'Page 3' }), { [modifier]: true })
    }
    fireEvent.click(screen.getByRole('link', { name: 'Next page' }), { ctrlKey: true })
    expect(onChange).not.toHaveBeenCalled()
    expect(screen.getByRole('link', { name: 'Page 1, current page' })).toBeInTheDocument()
  })

  it('still changes the page of a button with a modifier when there is no getHref', () => {
    const onChange = vi.fn()
    render(<Paginator onChange={onChange} pageSize={10} total={30} />)
    fireEvent.click(screen.getByRole('button', { name: 'Page 3' }), { ctrlKey: true })
    expect(onChange).toHaveBeenCalledWith({ page: 3, pageSize: 10 })
  })

  it('follows a page that comes from outside, with no onPageChange', () => {
    const { rerender } = render(<Paginator getHref={getHref} page={1} pageSize={10} total={30} />)
    expect(screen.getByRole('link', { name: 'Page 1, current page' })).toBeInTheDocument()
    rerender(<Paginator getHref={getHref} page={2} pageSize={10} total={30} />)
    expect(screen.getByRole('link', { name: 'Page 2, current page' })).toBeInTheDocument()
  })

  it('renders the link of the LinkProvider', () => {
    const RouterLink = forwardRef<HTMLAnchorElement, LinkComponentProps>(
      ({ children, ...props }, ref) => (
        <a data-router="" ref={ref} {...props}>
          {children}
        </a>
      ),
    )
    RouterLink.displayName = 'RouterLink'
    render(
      <LinkProvider component={RouterLink}>
        <Paginator getHref={(page) => `/customers?page=${page}`} pageSize={10} total={30} />
      </LinkProvider>,
    )
    const link = screen.getByRole('link', { name: 'Page 2' })
    expect(link).toHaveAttribute('data-router')
    expect(link).toHaveAttribute('href', '/customers?page=2')
  })
})
