import { render, screen, within } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { createRef, useState } from 'react'
import { LocaleProvider } from '../../../../locale/locale-provider'
import { CommandPalette, CommandPaletteGroup, CommandPaletteItem, type CommandPaletteProps } from '..'
import { defaultFilter, nodeText } from '../commandpalette-filter'

function Palette(props: CommandPaletteProps & { onGo?: () => void }): React.ReactNode {
  const { onGo, ...rest } = props
  return (
    <CommandPalette open {...rest}>
      <CommandPaletteGroup heading="Navigation">
        <CommandPaletteItem keywords={['home']} onSelect={onGo} shortcut="G D">
          Dashboard
        </CommandPaletteItem>
        <CommandPaletteItem icon={<svg data-testid="icon" />}>Projects</CommandPaletteItem>
      </CommandPaletteGroup>
      <CommandPaletteGroup heading="Actions">
        <CommandPaletteItem>Crear proyecto</CommandPaletteItem>
        <CommandPaletteItem disabled>Delete everything</CommandPaletteItem>
      </CommandPaletteGroup>
    </CommandPalette>
  )
}

const input = (): HTMLInputElement => screen.getByRole<HTMLInputElement>('combobox')
const option = (name: string | RegExp): HTMLElement => screen.getByRole('option', { name })
const visible = (): string[] =>
  screen
    .queryAllByRole('option')
    .map((element) => element.textContent ?? '')

describe('CommandPalette component', () => {
  it('renders nothing while it is closed', () => {
    render(<Palette open={false} />)
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('opens a dialog with a search box and a listbox, named by its label', () => {
    render(<Palette />)
    expect(screen.getByRole('dialog', { name: 'Command palette' })).toBeInTheDocument()
    expect(input()).toHaveAttribute('aria-label', 'Type a command or search')
    expect(input()).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('listbox')).toHaveAttribute('id', input().getAttribute('aria-controls'))
    expect(screen.getAllByRole('option')).toHaveLength(4)
  })

  it('focuses the search box when it opens', () => {
    render(<Palette />)
    expect(input()).toHaveFocus()
  })

  it('names its groups and hides the icon and shows the shortcut as keys', () => {
    render(<Palette />)
    expect(screen.getByRole('group', { name: 'Navigation' })).toBeInTheDocument()
    expect(screen.getByTestId('icon').closest('[aria-hidden]')).toHaveAttribute('aria-hidden', 'true')
    const keys = within(option(/^Dashboard/)).getAllByText(/^[GD]$/)
    expect(keys.map((key) => key.tagName)).toEqual(['KBD', 'KBD'])
  })

  it('accepts the shortcut as a list of keys', () => {
    render(
      <CommandPalette open>
        <CommandPaletteItem shortcut={['Ctrl', 'K']}>Open</CommandPaletteItem>
      </CommandPalette>,
    )
    expect(screen.getByText('Ctrl').tagName).toBe('KBD')
  })

  it('filters while the user types, ignoring case and accents, and by keyword', async () => {
    render(<Palette />)
    await userEvent.type(input(), 'PROYECTO')
    expect(visible()).toEqual(['Crear proyecto'])

    await userEvent.clear(input())
    await userEvent.type(input(), 'proyécto')
    expect(visible()).toEqual(['Crear proyecto'])

    await userEvent.clear(input())
    await userEvent.type(input(), 'home')
    expect(visible()).toEqual(['DashboardGD'])
  })

  it('needs every word of the query', async () => {
    render(<Palette />)
    await userEvent.type(input(), 'crear pro')
    expect(visible()).toEqual(['Crear proyecto'])
    await userEvent.type(input(), ' zzz')
    expect(visible()).toEqual([])
  })

  it('hides a group when none of its items matches', async () => {
    render(<Palette />)
    await userEvent.type(input(), 'dash')
    const actions = screen.getByRole('group', { name: 'Actions' })
    expect(within(actions).queryAllByRole('option')).toHaveLength(0)
    expect(within(screen.getByRole('group', { name: 'Navigation' })).getAllByRole('option')).toHaveLength(1)
  })

  it('says it when nothing matches, in the page and to assistive technology', async () => {
    render(<Palette />)
    await userEvent.type(input(), 'zzz')
    expect(screen.getAllByText('No results')).toHaveLength(2)
    expect(screen.getByRole('status')).toHaveTextContent('No results')
  })

  it('announces how many results there are', async () => {
    render(<Palette />)
    expect(screen.getByRole('status')).toHaveTextContent('4 results')
    await userEvent.type(input(), 'dash')
    expect(screen.getByRole('status')).toHaveTextContent('1 result')
  })

  it('has the first item active and moves with the arrow keys, wrapping at the ends', async () => {
    render(<Palette />)
    expect(input()).toHaveAttribute('aria-activedescendant', option(/^Dashboard/).id)
    expect(option(/^Dashboard/)).toHaveAttribute('aria-selected', 'true')

    await userEvent.keyboard('{ArrowDown}')
    expect(option('Projects')).toHaveAttribute('aria-selected', 'true')
    expect(option(/^Dashboard/)).toHaveAttribute('aria-selected', 'false')

    await userEvent.keyboard('{ArrowDown}{ArrowDown}')
    expect(option(/^Dashboard/)).toHaveAttribute('data-active')

    await userEvent.keyboard('{ArrowUp}')
    expect(option('Crear proyecto')).toHaveAttribute('data-active')
  })

  it('moves ten at a time with PageDown and PageUp', async () => {
    render(<Palette />)
    await userEvent.keyboard('{PageDown}')
    expect(option('Crear proyecto')).toHaveAttribute('data-active')
    await userEvent.keyboard('{PageUp}')
    expect(option(/^Dashboard/)).toHaveAttribute('data-active')
  })

  it('skips a disabled item', async () => {
    render(<Palette />)
    await userEvent.keyboard('{ArrowUp}')
    expect(option('Crear proyecto')).toHaveAttribute('data-active')
    expect(option('Delete everything')).toHaveAttribute('aria-disabled', 'true')
  })

  it('makes the first match active again when the query changes', async () => {
    render(<Palette />)
    await userEvent.keyboard('{ArrowDown}')
    await userEvent.type(input(), 'p')
    expect(option('Projects')).toHaveAttribute('data-active')
    await userEvent.type(input(), 'roje')
    expect(visible()).toEqual(['Projects'])
    expect(option('Projects')).toHaveAttribute('data-active')
  })

  it('makes active the item the pointer moves over', async () => {
    render(<Palette />)
    await userEvent.hover(option('Crear proyecto'))
    expect(option('Crear proyecto')).toHaveAttribute('data-active')
    await userEvent.hover(option('Delete everything'))
    expect(option('Delete everything')).not.toHaveAttribute('data-active')
  })

  it('runs onSelect with Enter on the active item and closes', async () => {
    const onGo = vi.fn()
    const onOpenChange = vi.fn()
    render(<Palette onGo={onGo} onOpenChange={onOpenChange} />)
    await userEvent.keyboard('{Enter}')
    expect(onGo).toHaveBeenCalledTimes(1)
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('runs onSelect with a click', async () => {
    const onGo = vi.fn()
    render(<Palette onGo={onGo} />)
    await userEvent.click(option(/^Dashboard/))
    expect(onGo).toHaveBeenCalledTimes(1)
  })

  it('picks an item that has the focus with Enter or Space, and keeps the focus in the search box on a press', async () => {
    const onGo = vi.fn()
    render(<Palette closeOnSelect={false} onGo={onGo} />)
    option(/^Dashboard/).focus()
    await userEvent.keyboard('{Enter}')
    await userEvent.keyboard(' ')
    expect(onGo).toHaveBeenCalledTimes(2)

    input().focus()
    await userEvent.pointer({ keys: '[MouseLeft>]', target: option(/^Projects/) })
    expect(input()).toHaveFocus()
  })

  it('calls the handlers of the item as well', async () => {
    const onKeyDown = vi.fn()
    const onMouseDown = vi.fn()
    const onPointerMove = vi.fn()
    render(
      <CommandPalette open>
        <CommandPaletteItem onKeyDown={onKeyDown} onMouseDown={onMouseDown} onPointerMove={onPointerMove}>
          Only
        </CommandPaletteItem>
      </CommandPalette>,
    )
    option('Only').focus()
    await userEvent.keyboard('a')
    await userEvent.pointer({ keys: '[MouseLeft>]', target: option('Only') })
    await userEvent.hover(option('Only'))
    expect(onKeyDown).toHaveBeenCalled()
    expect(onMouseDown).toHaveBeenCalled()
    expect(onPointerMove).toHaveBeenCalled()
  })

  it('stays open after picking when closeOnSelect is false', async () => {
    const onOpenChange = vi.fn()
    const onGo = vi.fn()
    render(<Palette closeOnSelect={false} onGo={onGo} onOpenChange={onOpenChange} />)
    await userEvent.keyboard('{Enter}')
    expect(onGo).toHaveBeenCalled()
    expect(onOpenChange).not.toHaveBeenCalled()
  })

  it('does not pick a disabled item', async () => {
    const onOpenChange = vi.fn()
    render(<Palette onOpenChange={onOpenChange} />)
    await userEvent.click(option('Delete everything'))
    expect(onOpenChange).not.toHaveBeenCalled()
  })

  it('lets an onClick of the item prevent the pick', async () => {
    const onSelect = vi.fn()
    render(
      <CommandPalette open>
        <CommandPaletteItem onClick={(event) => event.preventDefault()} onSelect={onSelect}>
          Stay
        </CommandPaletteItem>
      </CommandPalette>,
    )
    await userEvent.click(option('Stay'))
    expect(onSelect).not.toHaveBeenCalled()
  })

  it('does nothing with Enter when no item matches', async () => {
    const onOpenChange = vi.fn()
    render(<Palette onOpenChange={onOpenChange} />)
    await userEvent.type(input(), 'zzz{Enter}')
    expect(onOpenChange).not.toHaveBeenCalled()
  })

  it('closes with Escape and with a click outside, unless it is told not to', async () => {
    const onOpenChange = vi.fn()
    const { rerender } = render(<Palette onOpenChange={onOpenChange} />)
    await userEvent.keyboard('{Escape}')
    expect(onOpenChange).toHaveBeenCalledWith(false)

    onOpenChange.mockClear()
    rerender(<Palette closeOnEscape={false} onOpenChange={onOpenChange} />)
    await userEvent.keyboard('{Escape}')
    expect(onOpenChange).not.toHaveBeenCalled()
  })

  it('can be opened and closed without being controlled', async () => {
    render(
      <CommandPalette defaultOpen>
        <CommandPaletteItem>Only</CommandPaletteItem>
      </CommandPalette>,
    )
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('starts with an empty search every time it opens', async () => {
    function Toggle(): React.ReactNode {
      const [open, setOpen] = useState(true)
      return (
        <>
          <button onClick={() => setOpen(!open)} type="button">
            toggle
          </button>
          <CommandPalette onOpenChange={setOpen} open={open}>
            <CommandPaletteItem>Dashboard</CommandPaletteItem>
          </CommandPalette>
        </>
      )
    }
    render(<Toggle />)
    await userEvent.type(input(), 'dash')
    await userEvent.keyboard('{Escape}')
    await userEvent.click(screen.getByRole('button', { name: 'toggle' }))
    expect(input()).toHaveValue('')
  })

  it('reports the query and can be controlled', async () => {
    const onQueryChange = vi.fn()
    const { rerender } = render(<Palette onQueryChange={onQueryChange} />)
    await userEvent.type(input(), 'p')
    expect(onQueryChange).toHaveBeenCalledWith('p')

    rerender(<Palette onQueryChange={onQueryChange} query="dash" />)
    expect(input()).toHaveValue('dash')
    expect(visible()).toEqual(['DashboardGD'])
  })

  it('shows every item with filter false, for results that the app filters', () => {
    render(<Palette filter={false} query="zzz" />)
    expect(visible()).toHaveLength(4)
  })

  it('takes its own filter', async () => {
    const filter = vi.fn((value: string, query: string) => value.startsWith(query))
    render(<Palette filter={filter} />)
    await userEvent.type(input(), 'Pro')
    expect(visible()).toEqual(['Projects'])
    expect(filter).toHaveBeenCalledWith('Projects', 'Pro', [])
  })

  it('matches the value of an item whose children are not only text', async () => {
    render(
      <CommandPalette open>
        <CommandPaletteItem value="settings">
          <strong>Preferences</strong>
        </CommandPaletteItem>
        <CommandPaletteItem>
          <b>Bold</b> text
        </CommandPaletteItem>
      </CommandPalette>,
    )
    await userEvent.type(input(), 'sett')
    expect(visible()).toEqual(['Preferences'])
    await userEvent.clear(input())
    await userEvent.type(input(), 'bold text')
    expect(visible()).toEqual(['Bold text'])
  })

  it('takes its texts from the LocaleProvider and its props', async () => {
    render(
      <LocaleProvider
        locale="es"
        messages={{
          commandPalette: {
            empty: 'Sin resultados',
            label: 'Paleta',
            placeholder: 'Busca',
            results: (count) => `${count} coincidencias`,
          },
        }}
      >
        <Palette />
      </LocaleProvider>,
    )
    expect(screen.getByRole('dialog', { name: 'Paleta' })).toBeInTheDocument()
    expect(input()).toHaveAttribute('placeholder', 'Busca')
    expect(screen.getByRole('status')).toHaveTextContent('4 coincidencias')
    await userEvent.type(input(), 'zzz')
    expect(screen.getAllByText('Sin resultados')).toHaveLength(2)
  })

  it('takes the placeholder and the name of the dialog as props', () => {
    render(<Palette aria-label="Search the app" placeholder="Find anything" />)
    expect(screen.getByRole('dialog', { name: 'Search the app' })).toBeInTheDocument()
    expect(input()).toHaveAttribute('placeholder', 'Find anything')
    expect(input()).toHaveAttribute('aria-label', 'Find anything')
  })

  it('forwards the ref to the dialog and takes className and style', () => {
    const ref = createRef<HTMLDialogElement>()
    render(
      <CommandPalette className="mine" open ref={ref} style={{ margin: 3 }}>
        <CommandPaletteItem>Only</CommandPaletteItem>
      </CommandPalette>,
    )
    expect(ref.current).toBe(screen.getByRole('dialog'))
    expect(ref.current).toHaveClass('mine')
    expect(ref.current?.style.margin).toBe('3px')
  })

  it('has no Loica class when it is unstyled, and keeps the structure attributes', () => {
    render(<Palette className="mine" variant="unstyled" />)
    expect(screen.getByRole('dialog').className).toBe('mine')
    expect(screen.getByRole('listbox')).not.toHaveAttribute('class')
    expect(option('Projects')).not.toHaveAttribute('class')
    expect(option('Projects')).toHaveAttribute('data-loica-commandpalette-item')
  })

  it('throws when an item is used outside a palette', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
    expect(() => render(<CommandPaletteItem>Lost</CommandPaletteItem>)).toThrow(
      'CommandPaletteItem must be used within a <CommandPalette>',
    )
  })

  it('does not let a keystroke while composing move the selection', () => {
    render(<Palette />)
    input().dispatchEvent(
      new KeyboardEvent('keydown', { bubbles: true, isComposing: true, key: 'ArrowDown' }),
    )
    expect(option(/^Dashboard/)).toHaveAttribute('data-active')
  })
})

describe('the filter', () => {
  it('reads the text of any node', () => {
    expect(nodeText(['a', 1, <b key="b">c</b>, null, false])).toBe('a1c')
  })

  it('matches every word, ignoring case and accents', () => {
    expect(defaultFilter('Café Münster', 'CAFE mun', [], 'en')).toBe(true)
    expect(defaultFilter('Café', 'tea', [], 'en')).toBe(false)
    expect(defaultFilter('Café', '   ', [], 'en')).toBe(true)
    expect(defaultFilter('Home', 'start', ['start page'], 'en')).toBe(true)
  })
})
