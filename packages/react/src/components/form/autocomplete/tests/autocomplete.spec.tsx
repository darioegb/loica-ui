import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { createRef, useState } from 'react'
import { LocaleProvider } from '../../../../locale/locale-provider'
import { Field } from '../../field'
import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteList,
  AutocompleteLoading,
  AutocompleteOption,
  type AutocompleteProps,
} from '..'

const cities = [
  { label: 'Madrid' },
  { label: 'Málaga' },
  { label: 'Valencia' },
  { description: 'Closed', disabled: true, label: 'Sevilla' },
]

const field = (): HTMLInputElement => screen.getByRole('combobox', { name: 'City' })
const names = (): string[] =>
  screen
    .queryAllByRole('option')
    .filter((item) => !item.hidden)
    .map((item) => item.textContent ?? '')

const setup = (props: Partial<AutocompleteProps> = {}): void => {
  render(<Autocomplete aria-label="City" options={cities} {...props} />)
}

describe('Autocomplete', () => {
  describe('rendering', () => {
    it('is an input with the combobox role, tied to a listbox', () => {
      setup({ placeholder: 'Type a city' })
      expect(field()).toHaveAttribute('aria-autocomplete', 'list')
      expect(field()).toHaveAttribute('aria-expanded', 'false')
      expect(field()).toHaveAttribute('autocomplete', 'off')
      expect(field()).toHaveAttribute('placeholder', 'Type a city')
      expect(field().getAttribute('aria-controls')).toBe(
        screen.getByRole('listbox', { hidden: true }).id,
      )
      expect(screen.getByRole('listbox', { hidden: true })).toHaveAccessibleName('City')
    })

    it('forwards the ref, the className and the native attributes to the input', () => {
      const ref = createRef<HTMLInputElement>()
      render(
        <Autocomplete
          aria-label="City"
          className="mine"
          maxLength={20}
          name="city"
          options={cities}
          ref={ref}
        />,
      )
      expect(ref.current).toBe(field())
      expect(field()).toHaveClass('mine')
      expect(field()).toHaveAttribute('maxlength', '20')
      expect(field()).toHaveAttribute('name', 'city')
    })

    it('starts with the default value and does not open on its own', () => {
      setup({ defaultValue: 'Mad' })
      expect(field()).toHaveValue('Mad')
      expect(field()).toHaveAttribute('aria-expanded', 'false')
    })

    it('marks the field as disabled, read-only, required and invalid', () => {
      setup({ 'aria-invalid': true, disabled: true, required: true })
      expect(field()).toBeDisabled()
      expect(field()).toBeRequired()
      expect(field()).toHaveAttribute('aria-invalid', 'true')
    })

    it('takes the name and the id from a Field', () => {
      render(
        <Field label="Town">
          <Autocomplete options={cities} />
        </Field>,
      )
      const input = screen.getByRole('combobox', { name: 'Town' })
      expect(input).toHaveAttribute('id')
      expect(screen.getByRole('listbox', { hidden: true })).toHaveAccessibleName('Town')
    })

    it('draws the options written as children', async () => {
      render(
        <Autocomplete aria-label="City">
          <AutocompleteOption>Madrid</AutocompleteOption>
          <AutocompleteOption label="Málaga" value="mlg">
            <em>Málaga</em>
          </AutocompleteOption>
        </Autocomplete>,
      )
      await userEvent.type(field(), 'm')
      expect(names()).toEqual(['Madrid', 'Málaga'])
    })

    it('renders what is written when it is given the parts', async () => {
      render(
        <Autocomplete aria-label="City">
          <AutocompleteInput elementBefore={<span>@</span>} placeholder="Where" />
          <AutocompleteContent>
            <AutocompleteList>
              <AutocompleteOption label="Madrid" />
            </AutocompleteList>
          </AutocompleteContent>
        </Autocomplete>,
      )
      expect(screen.getByText('@')).toBeInTheDocument()
      await userEvent.type(screen.getByPlaceholderText('Where'), 'm')
      expect(names()).toEqual(['Madrid'])
    })

    it('draws the input when only the content is given, and the content when only the input is', async () => {
      const { unmount } = render(
        <Autocomplete aria-label="City">
          <AutocompleteContent>
            <AutocompleteOption label="Madrid" />
          </AutocompleteContent>
        </Autocomplete>,
      )
      await userEvent.type(field(), 'm')
      expect(names()).toEqual(['Madrid'])
      unmount()

      render(
        <Autocomplete aria-label="City" options={cities}>
          <AutocompleteInput placeholder="Own input" />
        </Autocomplete>,
      )
      await userEvent.type(screen.getByPlaceholderText('Own input'), 'val')
      expect(names()).toEqual(['Valencia'])
    })

    it.each([
      ['AutocompleteInput', <AutocompleteInput key="i" />],
      ['AutocompleteContent', <AutocompleteContent key="c" />],
      ['AutocompleteList', <AutocompleteList key="l" />],
      ['AutocompleteLoading', <AutocompleteLoading key="o" />],
      ['AutocompleteEmpty', <AutocompleteEmpty key="e" />],
      ['AutocompleteOption', <AutocompleteOption key="p" label="A" />],
    ])('%s throws outside an Autocomplete', (name, part) => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => undefined)
      expect(() => render(part)).toThrow(`${name} must be used within an <Autocomplete>`)
      error.mockRestore()
    })
  })

  describe('typing', () => {
    it('opens the list and filters the options by the text, ignoring case and accents', async () => {
      const onValueChange = vi.fn()
      const onSearchChange = vi.fn()
      setup({ onSearchChange, onValueChange })
      await userEvent.type(field(), 'ma')
      expect(field()).toHaveAttribute('aria-expanded', 'true')
      expect(names()).toEqual(['Madrid', 'Málaga'])
      expect(onValueChange).toHaveBeenNthCalledWith(1, 'm')
      expect(onValueChange).toHaveBeenLastCalledWith('ma')
      expect(onSearchChange).toHaveBeenNthCalledWith(1, 'm')
      expect(onSearchChange).toHaveBeenLastCalledWith('ma')
    })

    it('accepts a text that is not in the list and keeps it on Enter', async () => {
      const onValueChange = vi.fn()
      const onOptionSelect = vi.fn()
      setup({ onOptionSelect, onValueChange })
      await userEvent.type(field(), 'Madr')
      await userEvent.keyboard('{Enter}')
      expect(field()).toHaveValue('Madr')
      expect(field()).toHaveAttribute('aria-expanded', 'false')
      expect(onOptionSelect).not.toHaveBeenCalled()

      await userEvent.type(field(), 'idx')
      expect(field()).toHaveValue('Madridx')
      expect(field()).toHaveAttribute('aria-expanded', 'false')
    })

    it('keeps the panel closed when nothing matches, unless there is an AutocompleteEmpty', async () => {
      const { unmount } = render(<Autocomplete aria-label="City" options={cities} />)
      await userEvent.type(field(), 'zzz')
      expect(field()).toHaveAttribute('aria-expanded', 'false')
      unmount()

      render(
        <Autocomplete aria-label="City" options={cities}>
          <AutocompleteInput />
          <AutocompleteContent>
            <AutocompleteList>
              <AutocompleteOption label="Madrid" />
            </AutocompleteList>
            <AutocompleteEmpty>Nothing here</AutocompleteEmpty>
          </AutocompleteContent>
        </Autocomplete>,
      )
      await userEvent.type(field(), 'zzz')
      expect(field()).toHaveAttribute('aria-expanded', 'true')
      expect(screen.getByText('Nothing here')).toBeInTheDocument()
    })

    it('uses the empty text of the LocaleProvider', async () => {
      render(
        <LocaleProvider messages={{ select: { empty: 'Sin resultados' } }}>
          <Autocomplete aria-label="City" options={cities}>
            <AutocompleteContent>
              <AutocompleteList />
              <AutocompleteEmpty />
            </AutocompleteContent>
          </Autocomplete>
        </LocaleProvider>,
      )
      await userEvent.type(field(), 'zzz')
      expect(screen.getByText('Sin resultados')).toBeInTheDocument()
    })

    it('does not filter with filter turned off', async () => {
      setup({ filter: false })
      await userEvent.type(field(), 'zzz')
      expect(names()).toEqual(['Madrid', 'Málaga', 'Valencia', 'Sevilla Closed'])
    })

    it('does nothing when it is disabled or read-only', async () => {
      setup({ readOnly: true })
      await userEvent.type(field(), 'm')
      expect(field()).toHaveAttribute('aria-expanded', 'false')
      await userEvent.keyboard('{ArrowDown}')
      expect(field()).toHaveAttribute('aria-expanded', 'false')
    })
  })

  describe('choosing', () => {
    it('puts the label of the option in the field and gives the option to onOptionSelect', async () => {
      const onValueChange = vi.fn()
      const onSearchChange = vi.fn()
      const onOptionSelect = vi.fn()
      setup({ onOptionSelect, onSearchChange, onValueChange })
      await userEvent.type(field(), 'val')
      onSearchChange.mockClear()
      await userEvent.click(screen.getByRole('option', { name: 'Valencia' }))
      expect(field()).toHaveValue('Valencia')
      expect(field()).toHaveFocus()
      expect(field()).toHaveAttribute('aria-expanded', 'false')
      expect(onValueChange).toHaveBeenLastCalledWith('Valencia')
      expect(onOptionSelect).toHaveBeenCalledWith({
        icon: undefined,
        label: 'Valencia',
        value: 'Valencia',
      })
      expect(onSearchChange).not.toHaveBeenCalled()
    })

    it('gives the value of the option, not its label, when it has one', async () => {
      const onOptionSelect = vi.fn()
      setup({
        onOptionSelect,
        options: [{ label: 'Madrid, Spain', value: 'MAD' }],
      })
      await userEvent.type(field(), 'mad')
      await userEvent.click(screen.getByRole('option', { name: 'Madrid, Spain' }))
      expect(field()).toHaveValue('Madrid, Spain')
      expect(onOptionSelect).toHaveBeenCalledWith(expect.objectContaining({ value: 'MAD' }))
    })

    it('marks the option whose text is in the field', async () => {
      setup({ defaultValue: 'Madrid', filter: false })
      await userEvent.type(field(), '{Backspace}d')
      expect(screen.getByRole('option', { name: 'Madrid' })).toHaveAttribute('aria-selected', 'true')
      expect(screen.getByRole('option', { name: 'Valencia' })).toHaveAttribute(
        'aria-selected',
        'false',
      )
    })

    it('does not choose a disabled option', async () => {
      const onOptionSelect = vi.fn()
      setup({ onOptionSelect })
      await userEvent.type(field(), 'sev')
      await userEvent.click(screen.getByRole('option', { name: /Sevilla/ }))
      expect(onOptionSelect).not.toHaveBeenCalled()
      expect(field()).toHaveValue('sev')
    })
  })

  describe('keyboard', () => {
    it('opens with the arrows, and moves through the options', async () => {
      setup()
      field().focus()
      await userEvent.keyboard('{ArrowDown}')
      expect(field()).toHaveAttribute('aria-expanded', 'true')
      const first = screen.getByRole('option', { name: 'Madrid' })
      expect(field()).toHaveAttribute('aria-activedescendant', first.id)
      expect(first).toHaveAttribute('data-active')

      await userEvent.keyboard('{ArrowDown}')
      expect(field()).toHaveAttribute(
        'aria-activedescendant',
        screen.getByRole('option', { name: 'Málaga' }).id,
      )
      await userEvent.keyboard('{ArrowUp}{ArrowUp}')
      expect(field()).toHaveAttribute(
        'aria-activedescendant',
        screen.getByRole('option', { name: 'Valencia' }).id,
      )
    })

    it('opens on the last option with ArrowUp and with no option active on Alt+ArrowDown', async () => {
      setup()
      field().focus()
      await userEvent.keyboard('{ArrowUp}')
      expect(field()).toHaveAttribute(
        'aria-activedescendant',
        screen.getByRole('option', { name: 'Valencia' }).id,
      )
      await userEvent.keyboard('{Escape}')
      await userEvent.keyboard('{Alt>}{ArrowDown}{/Alt}')
      expect(field()).toHaveAttribute('aria-expanded', 'true')
      expect(field()).not.toHaveAttribute('aria-activedescendant')
    })

    it('skips the disabled options', async () => {
      setup()
      field().focus()
      await userEvent.keyboard('{ArrowUp}{ArrowDown}')
      expect(field()).toHaveAttribute(
        'aria-activedescendant',
        screen.getByRole('option', { name: 'Madrid' }).id,
      )
    })

    it('chooses the active option with Enter, and none is active while the user types', async () => {
      const onOptionSelect = vi.fn()
      setup({ onOptionSelect })
      await userEvent.type(field(), 'ma')
      expect(field()).not.toHaveAttribute('aria-activedescendant')
      await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}')
      expect(field()).toHaveValue('Málaga')
      expect(onOptionSelect).toHaveBeenCalledWith(expect.objectContaining({ label: 'Málaga' }))
    })

    it('forgets the active option when the text changes', async () => {
      setup()
      await userEvent.type(field(), 'm')
      await userEvent.keyboard('{ArrowDown}')
      expect(field()).toHaveAttribute('aria-activedescendant')
      await userEvent.keyboard('a')
      expect(field()).not.toHaveAttribute('aria-activedescendant')
    })

    it('closes with Escape and with Tab, and leaves the text', async () => {
      setup()
      await userEvent.type(field(), 'ma')
      await userEvent.keyboard('{Escape}')
      expect(field()).toHaveAttribute('aria-expanded', 'false')
      expect(field()).toHaveValue('ma')

      await userEvent.keyboard('{ArrowDown}')
      expect(field()).toHaveAttribute('aria-expanded', 'true')
      await userEvent.keyboard('{Tab}')
      expect(field()).toHaveAttribute('aria-expanded', 'false')
    })

    it('closes with a press outside', async () => {
      render(
        <>
          <Autocomplete aria-label="City" options={cities} />
          <button type="button">Outside</button>
        </>,
      )
      await userEvent.type(field(), 'ma')
      await userEvent.click(screen.getByRole('button', { name: 'Outside' }))
      expect(field()).toHaveAttribute('aria-expanded', 'false')
    })

    it('lets the onKeyDown of the app stop the keys', async () => {
      const onKeyDown = vi.fn((event: React.KeyboardEvent) => event.preventDefault())
      setup({ onKeyDown })
      field().focus()
      await userEvent.keyboard('{ArrowDown}')
      expect(onKeyDown).toHaveBeenCalled()
      expect(field()).toHaveAttribute('aria-expanded', 'false')
    })

    it('ignores the keys while an IME composes', async () => {
      setup()
      await userEvent.type(field(), 'ma')
      const input = field()
      input.dispatchEvent(
        new KeyboardEvent('keydown', { bubbles: true, isComposing: true, key: 'Enter' }),
      )
      expect(input).toHaveAttribute('aria-expanded', 'true')
    })
  })

  describe('controlled state', () => {
    it('shows the value it is given and reports the changes', async () => {
      const onValueChange = vi.fn()
      render(
        <Autocomplete aria-label="City" onValueChange={onValueChange} options={cities} value="Val" />,
      )
      expect(field()).toHaveValue('Val')
      await userEvent.type(field(), 'x')
      expect(onValueChange).toHaveBeenCalledWith('Valx')
      expect(field()).toHaveValue('Val')
    })

    it('opens and closes as the open prop says', async () => {
      const onOpenChange = vi.fn()
      function Controlled(): React.ReactNode {
        const [open, setOpen] = useState(true)
        return (
          <Autocomplete
            aria-label="City"
            onOpenChange={(next) => {
              onOpenChange(next)
              setOpen(next)
            }}
            open={open}
            options={cities}
          />
        )
      }
      render(<Controlled />)
      expect(field()).toHaveAttribute('aria-expanded', 'true')
      await userEvent.type(field(), 'm')
      expect(onOpenChange).not.toHaveBeenCalledWith(false)
      await userEvent.keyboard('{Escape}')
      expect(onOpenChange).toHaveBeenCalledWith(false)
      expect(field()).toHaveAttribute('aria-expanded', 'false')
    })

    it('starts open with defaultOpen', () => {
      setup({ defaultOpen: true })
      expect(field()).toHaveAttribute('aria-expanded', 'true')
    })

    it('goes back to its default value when the form resets', async () => {
      render(
        <form>
          <Autocomplete aria-label="City" defaultValue="Madrid" options={cities} />
          <button type="reset">Reset</button>
        </form>,
      )
      await userEvent.type(field(), 'x')
      expect(field()).toHaveValue('Madridx')
      await userEvent.click(screen.getByRole('button', { name: 'Reset' }))
      expect(field()).toHaveValue('Madrid')
    })

    it('sends its text in a form', () => {
      const { container } = render(
        <form>
          <Autocomplete aria-label="City" defaultValue="Madrid" name="city" options={cities} />
        </form>,
      )
      expect(new FormData(container.querySelector('form') ?? undefined).get('city')).toBe('Madrid')
    })
  })

  describe('remote search', () => {
    it('shows the loader while it is loading and marks the list busy', async () => {
      render(<Autocomplete aria-label="City" filter={false} loading options={[]} />)
      await userEvent.type(field(), 'ma')
      expect(field()).toHaveAttribute('aria-expanded', 'true')
      expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument()
      expect(screen.getByRole('listbox')).toHaveAttribute('aria-busy', 'true')
    })

    it('searches with the text and shows what comes back', async () => {
      function Remote(): React.ReactNode {
        const [results, setResults] = useState<{ label: string }[]>([])
        const [loading, setLoading] = useState(false)
        return (
          <Autocomplete
            aria-label="City"
            filter={false}
            loading={loading}
            onSearchChange={(query) => {
              setLoading(true)
              void Promise.resolve().then(() => {
                setResults(cities.filter((city) => city.label.toLowerCase().startsWith(query)))
                setLoading(false)
              })
            }}
            options={results}
          />
        )
      }
      render(<Remote />)
      await userEvent.type(field(), 'v')
      expect(await screen.findByRole('option', { name: 'Valencia' })).toBeInTheDocument()
      expect(names()).toEqual(['Valencia'])
    })
  })

  describe('variants', () => {
    it('drops the Loica classes of the input with unstyled, and keeps the parts working', async () => {
      setup({ className: 'mine', variant: 'unstyled' })
      expect(field().className).toBe('mine')
      await userEvent.type(field(), 'ma')
      expect(screen.getByRole('option', { name: 'Madrid' }).className).toBe('')
    })

    it('anchors the list to the bordered control of an input with elements', async () => {
      setup({ elementBefore: <span>@</span> })
      await userEvent.type(field(), 'm')
      expect(field()).toHaveAttribute('aria-expanded', 'true')
    })
  })
})
