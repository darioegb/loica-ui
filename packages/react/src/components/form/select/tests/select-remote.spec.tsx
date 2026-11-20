import { render, screen, within } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { useState } from 'react'
import { LocaleProvider } from '../../../../locale/locale-provider'
import {
  Select,
  SelectContent,
  SelectEmpty,
  SelectList,
  SelectLoading,
  SelectOption,
  SelectSearch,
  SelectSearchInput,
  SelectTrigger,
  type SelectProps,
} from '..'

const fruits = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Blueberry', value: 'blueberry' },
]

const trigger = (): HTMLElement => screen.getByRole('combobox', { name: 'Fruit' })
const search = (): HTMLElement => screen.getByRole('combobox', { name: 'Search' })
const option = (name: string): HTMLElement => screen.getByRole('option', { name })
const names = (): string[] => screen.queryAllByRole('option').map((item) => item.textContent ?? '')

function Remote({
  onSearchChange,
  ...props
}: Readonly<Partial<SelectProps>>): React.ReactNode {
  const [results, setResults] = useState(fruits)
  const [loading, setLoading] = useState(false)
  return (
    <Select
      aria-label="Fruit"
      filter={false}
      loading={loading}
      onSearchChange={(query) => {
        onSearchChange?.(query)
        setLoading(true)
        void Promise.resolve().then(() => {
          setResults(fruits.filter((item) => item.label.toLowerCase().startsWith(query.toLowerCase())))
          setLoading(false)
        })
      }}
      options={results}
      searchable
      {...(props as SelectProps)}
    />
  )
}

describe('Select remote search', () => {
  describe('onSearchChange', () => {
    it('is called with the text each time it changes, and with an empty string when the list closes', async () => {
      const onSearchChange = vi.fn()
      render(<Select aria-label="Fruit" onSearchChange={onSearchChange} options={fruits} searchable />)
      expect(onSearchChange).not.toHaveBeenCalled()

      await userEvent.click(trigger())
      expect(onSearchChange).not.toHaveBeenCalled()

      await userEvent.keyboard('ba')
      expect(onSearchChange).toHaveBeenNthCalledWith(1, 'b')
      expect(onSearchChange).toHaveBeenNthCalledWith(2, 'ba')

      await userEvent.keyboard('{Escape}')
      expect(onSearchChange).toHaveBeenLastCalledWith('')
      expect(onSearchChange).toHaveBeenCalledTimes(3)
    })

    it('is called with the first letter typed on the closed trigger', async () => {
      const onSearchChange = vi.fn()
      render(<Select aria-label="Fruit" onSearchChange={onSearchChange} options={fruits} searchable />)
      trigger().focus()
      await userEvent.keyboard('b')
      expect(onSearchChange).toHaveBeenCalledWith('b')
    })

    it('is not called when the list closes with nothing typed', async () => {
      const onSearchChange = vi.fn()
      render(<Select aria-label="Fruit" onSearchChange={onSearchChange} options={fruits} searchable />)
      await userEvent.click(trigger())
      await userEvent.keyboard('{Escape}')
      expect(onSearchChange).not.toHaveBeenCalled()
    })

    it('uses the latest function without calling it again', async () => {
      const first = vi.fn()
      const second = vi.fn()
      const { rerender } = render(
        <Select aria-label="Fruit" onSearchChange={first} options={fruits} searchable />,
      )
      await userEvent.click(trigger())
      rerender(<Select aria-label="Fruit" onSearchChange={second} options={fruits} searchable />)
      expect(second).not.toHaveBeenCalled()
      await userEvent.keyboard('a')
      expect(first).not.toHaveBeenCalled()
      expect(second).toHaveBeenCalledWith('a')
    })
  })

  describe('filter', () => {
    it('hides the options that do not match by default', async () => {
      render(<Select aria-label="Fruit" options={fruits} searchable />)
      await userEvent.click(trigger())
      await userEvent.keyboard('ban')
      expect(names()).toEqual(['Banana'])
    })

    it('shows every option the app passes when it is off', async () => {
      render(<Select aria-label="Fruit" filter={false} options={fruits} searchable />)
      await userEvent.click(trigger())
      await userEvent.keyboard('zzz')
      expect(names()).toEqual(['Apple', 'Banana', 'Blueberry'])
      expect(screen.queryByText('No results')).toBeNull()
    })

    it('shows the empty message when the app passes no options for a search', async () => {
      const { rerender } = render(
        <Select aria-label="Fruit" filter={false} options={fruits} searchable />,
      )
      await userEvent.click(trigger())
      await userEvent.keyboard('zzz')
      rerender(<Select aria-label="Fruit" filter={false} options={[]} searchable />)
      expect(screen.getByText('No results')).toBeInTheDocument()
    })

    it('shows no empty message while there is nothing typed', async () => {
      render(<Select aria-label="Fruit" filter={false} options={[]} searchable />)
      await userEvent.click(trigger())
      expect(screen.queryByText('No results')).toBeNull()
    })
  })

  describe('loading', () => {
    it('shows the loader and marks the list busy', async () => {
      render(<Select aria-label="Fruit" loading options={fruits} searchable />)
      await userEvent.click(trigger())
      expect(within(document.body).getByRole('status', { name: 'Loading' })).toBeInTheDocument()
      expect(screen.getByRole('listbox')).toHaveAttribute('aria-busy', 'true')
    })

    it('shows nothing when it is not loading', async () => {
      render(<Select aria-label="Fruit" options={fruits} searchable />)
      await userEvent.click(trigger())
      expect(screen.queryByRole('status', { name: 'Loading' })).toBeNull()
      expect(screen.getByRole('listbox')).not.toHaveAttribute('aria-busy')
    })

    it('keeps the empty message back while it loads', async () => {
      const { rerender } = render(
        <Select aria-label="Fruit" filter={false} options={[]} searchable />,
      )
      await userEvent.click(trigger())
      await userEvent.keyboard('zzz')
      expect(screen.getByText('No results')).toBeInTheDocument()
      rerender(<Select aria-label="Fruit" filter={false} loading options={[]} searchable />)
      expect(screen.queryByText('No results')).toBeNull()
    })

    it('takes its name from the loader text of the LocaleProvider', async () => {
      render(
        <LocaleProvider messages={{ loader: { label: 'Buscando' } }}>
          <Select aria-label="Fruit" loading options={fruits} searchable />
        </LocaleProvider>,
      )
      await userEvent.click(trigger())
      expect(screen.getByRole('status', { name: 'Buscando' })).toBeInTheDocument()
    })

    it('has its own label, children, class and style on the part', async () => {
      render(
        <Select aria-label="Fruit" loading searchable>
          <SelectTrigger aria-label="Fruit" />
          <SelectContent>
            <SelectSearch>
              <SelectSearchInput />
            </SelectSearch>
            <SelectLoading className="mine" label="Searching" style={{ color: 'red' }} />
            <SelectList>
              <SelectOption value="apple">Apple</SelectOption>
            </SelectList>
            <SelectEmpty />
          </SelectContent>
        </Select>,
      )
      await userEvent.click(trigger())
      const loading = screen.getByRole('status', { name: 'Searching' }).parentElement
      expect(loading).toHaveClass('loading', 'mine')
      expect(loading).toHaveStyle({ color: 'rgb(255, 0, 0)' })
    })

    it('replaces the loader with its children', async () => {
      render(
        <Select aria-label="Fruit" loading searchable>
          <SelectTrigger aria-label="Fruit" />
          <SelectContent>
            <SelectLoading>Searching...</SelectLoading>
            <SelectList>
              <SelectOption value="apple">Apple</SelectOption>
            </SelectList>
          </SelectContent>
        </Select>,
      )
      await userEvent.click(trigger())
      expect(screen.getByText('Searching...')).toBeInTheDocument()
      expect(screen.queryByRole('status', { name: 'Loading' })).toBeNull()
    })

    it('drops the Loica classes of the loader in the unstyled variant', async () => {
      render(<Select aria-label="Fruit" loading options={fruits} searchable variant="unstyled" />)
      await userEvent.click(trigger())
      const loading = screen.getByRole('status', { name: 'Loading' }).parentElement
      expect(loading).not.toHaveClass('loading')
      expect(loading).toHaveAttribute('data-loica-select-loading')
    })

    it('must be used within a Select', () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => undefined)
      expect(() => render(<SelectLoading />)).toThrow('SelectLoading must be used within a <Select>')
      error.mockRestore()
    })
  })

  describe('results that arrive', () => {
    it('moves the active option to the first of the new results', async () => {
      render(<Remote />)
      await userEvent.click(trigger())
      await userEvent.keyboard('b')
      expect(await screen.findByRole('option', { name: 'Banana' })).toBeInTheDocument()
      expect(names()).toEqual(['Banana', 'Blueberry'])
      expect(search()).toHaveAttribute('aria-activedescendant', option('Banana').id)
    })

    it('chooses the first of the new results with Enter', async () => {
      const onValueChange = vi.fn()
      render(<Remote onValueChange={onValueChange} />)
      await userEvent.click(trigger())
      await userEvent.keyboard('bl')
      await screen.findByRole('option', { name: 'Blueberry' })
      await userEvent.keyboard('{Enter}')
      expect(onValueChange).toHaveBeenCalledWith('blueberry')
    })

    it('keeps the active option when it is still in the results', async () => {
      const { rerender } = render(<Select aria-label="Fruit" options={fruits} searchable />)
      await userEvent.click(trigger())
      await userEvent.keyboard('{ArrowDown}')
      const before = search().getAttribute('aria-activedescendant')
      rerender(<Select aria-label="Fruit" options={[...fruits]} searchable />)
      expect(search()).toHaveAttribute('aria-activedescendant', before)
    })

    it('leaves no active option when there are no results', async () => {
      render(<Remote />)
      await userEvent.click(trigger())
      await userEvent.keyboard('zz')
      await screen.findByText('No results')
      expect(search()).not.toHaveAttribute('aria-activedescendant')
    })

    it('goes to the chosen option when it is in the new results', async () => {
      render(<Remote defaultValue="banana" />)
      await userEvent.click(trigger())
      await userEvent.keyboard('b')
      await screen.findByRole('option', { name: 'Blueberry' })
      expect(search()).toHaveAttribute('aria-activedescendant', option('Banana').id)
    })
  })

  describe('chosen options', () => {
    it('stay in the field when the next results do not have them', async () => {
      render(<Remote />)
      await userEvent.click(trigger())
      await userEvent.click(option('Apple'))
      expect(trigger()).toHaveTextContent('Apple')

      await userEvent.click(trigger())
      await userEvent.keyboard('ba')
      await screen.findByRole('option', { name: 'Banana' })
      expect(screen.queryByRole('option', { name: 'Apple' })).toBeNull()
      expect(trigger()).toHaveTextContent('Apple')
    })

    it('stay as chips when the select is multiple', async () => {
      render(<Remote multiple />)
      await userEvent.click(trigger())
      await userEvent.click(option('Apple'))
      await userEvent.keyboard('ba')
      await screen.findByRole('option', { name: 'Banana' })
      await userEvent.click(option('Banana'))
      expect(screen.getByRole('button', { name: 'Remove Apple' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Remove Banana' })).toBeInTheDocument()
    })

    it('forget an option that is not chosen any more', async () => {
      render(<Remote clearable />)
      await userEvent.click(trigger())
      await userEvent.click(option('Apple'))
      await userEvent.click(screen.getByRole('button', { name: 'Clear' }))
      expect(trigger()).not.toHaveTextContent('Apple')
    })
  })
})
