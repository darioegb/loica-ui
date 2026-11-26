import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { useState } from 'react'
import { Paginator, PaginatorList, PaginatorPageSize } from '..'
import type { PaginatorChange } from '..'

const chooseSize = async (size: number): Promise<void> => {
  await userEvent.click(screen.getByRole('combobox', { name: 'Items per page' }))
  await userEvent.click(screen.getByRole('option', { name: String(size) }))
}

describe('Paginator onChange', () => {
  it('gives the new page and the current size when a page is picked', async () => {
    const onChange = vi.fn()
    render(
      <Paginator onChange={onChange} pageSize={20} total={100}>
        <PaginatorList />
      </Paginator>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Next page' }))
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenLastCalledWith({ page: 2, pageSize: 20 })
    await userEvent.click(screen.getByRole('button', { name: 'Page 4' }))
    expect(onChange).toHaveBeenLastCalledWith({ page: 4, pageSize: 20 })
  })

  it('gives the size and the page that keeps the first item in view, once', async () => {
    const onChange = vi.fn()
    render(
      <Paginator defaultPage={3} onChange={onChange} total={100}>
        <PaginatorList />
        <PaginatorPageSize />
      </Paginator>,
    )
    await chooseSize(20)
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith({ page: 2, pageSize: 20 })
  })

  it('is called when the size changes and the page stays the same', async () => {
    const onChange = vi.fn()
    const onPageChange = vi.fn()
    render(
      <Paginator onChange={onChange} onPageChange={onPageChange} total={100}>
        <PaginatorPageSize />
      </Paginator>,
    )
    await chooseSize(50)
    expect(onPageChange).not.toHaveBeenCalled()
    expect(onChange).toHaveBeenCalledWith({ page: 1, pageSize: 50 })
  })

  it('is called after onPageSizeChange and onPageChange, which still work', async () => {
    const calls: string[] = []
    render(
      <Paginator
        defaultPage={3}
        onChange={() => calls.push('change')}
        onPageChange={() => calls.push('page')}
        onPageSizeChange={() => calls.push('size')}
        total={100}
      >
        <PaginatorPageSize />
      </Paginator>,
    )
    await chooseSize(20)
    expect(calls).toEqual(['size', 'page', 'change'])
  })

  it('is not called when the user picks the page or the size that is already there', async () => {
    const onChange = vi.fn()
    render(
      <Paginator onChange={onChange} pageSize={10} total={100}>
        <PaginatorList />
        <PaginatorPageSize />
      </Paginator>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Page 1, current page' }))
    await chooseSize(10)
    expect(onChange).not.toHaveBeenCalled()
  })

  it('keeps a controlled Paginator in step with one state for both values', async () => {
    const seen: PaginatorChange[] = []
    function Controlled(): React.ReactNode {
      const [state, setState] = useState<PaginatorChange>({ page: 3, pageSize: 10 })
      return (
        <Paginator
          onChange={(next) => {
            seen.push(next)
            setState(next)
          }}
          page={state.page}
          pageSize={state.pageSize}
          total={100}
        >
          <PaginatorList />
          <PaginatorPageSize />
        </Paginator>
      )
    }
    render(<Controlled />)
    await chooseSize(20)
    expect(seen).toEqual([{ page: 2, pageSize: 20 }])
    expect(screen.getByRole('button', { name: 'Page 2, current page' })).toBeInTheDocument()
  })
})
