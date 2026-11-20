import { act, fireEvent, render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { createRef } from 'react'
import {
  DropdownItem,
  DropdownMenu,
  DropdownSeparator,
  DropdownSub,
  DropdownSubMenu,
  DropdownSubTrigger,
} from '../../dropdown'
import { ContextMenu, ContextMenuTrigger, type ContextMenuProps } from '..'

function Example({
  onSelect,
  ...props
}: Readonly<Partial<ContextMenuProps> & { onSelect?: () => void }>): React.ReactNode {
  return (
    <ContextMenu {...props}>
      <ContextMenuTrigger>
        <button data-testid="area">Right click here</button>
      </ContextMenuTrigger>
      <DropdownMenu aria-label="Actions">
        <DropdownItem onSelect={onSelect}>Open</DropdownItem>
        <DropdownItem>Rename</DropdownItem>
        <DropdownSeparator />
        <DropdownSub>
          <DropdownSubTrigger>Share</DropdownSubTrigger>
          <DropdownSubMenu>
            <DropdownItem>Email</DropdownItem>
          </DropdownSubMenu>
        </DropdownSub>
        <DropdownItem>Delete</DropdownItem>
      </DropdownMenu>
    </ContextMenu>
  )
}

const area = (): HTMLElement => screen.getByTestId('area')
const menus = (): HTMLElement[] => screen.queryAllByRole('menu')
const item = (name: string): HTMLElement => screen.getByRole('menuitem', { name })
const anchor = (): HTMLElement | null => document.querySelector('[data-loica-contextmenu-anchor]')

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('ContextMenu component', () => {
  describe('with the pointer', () => {
    it('is closed at first', () => {
      render(<Example />)
      expect(menus()).toHaveLength(0)
      expect(anchor()).toBeNull()
    })

    it('opens where the secondary button was pressed, and keeps the menu of the browser away', () => {
      render(<Example />)
      const allowed = fireEvent.contextMenu(area(), { clientX: 120, clientY: 80 })
      expect(allowed).toBe(false)
      expect(screen.getByRole('menu')).toBeInTheDocument()
      expect(anchor()).toHaveStyle({ left: '120px', position: 'fixed', top: '80px' })
      expect(screen.getByRole('menu')).toHaveAccessibleName('Actions')
    })

    it('does not move the focus to an item', () => {
      render(<Example />)
      fireEvent.contextMenu(area(), { clientX: 10, clientY: 10 })
      expect(screen.getByRole('menu')).toHaveFocus()
    })

    it('opens again where the pointer is when it is pressed with the menu open', () => {
      render(<Example />)
      fireEvent.contextMenu(area(), { clientX: 10, clientY: 10 })
      const first = anchor()
      fireEvent.contextMenu(area(), { clientX: 300, clientY: 200 })
      expect(menus()).toHaveLength(1)
      expect(anchor()).not.toBe(first)
      expect(anchor()).toHaveStyle({ left: '300px', top: '200px' })
    })

    it('closes with Escape and gives the focus back to where it was', async () => {
      render(<Example />)
      area().focus()
      fireEvent.contextMenu(area(), { clientX: 10, clientY: 10 })
      await userEvent.keyboard('{Escape}')
      expect(menus()).toHaveLength(0)
      expect(anchor()).toBeNull()
      expect(area()).toHaveFocus()
    })

    it('closes with a press outside', async () => {
      render(
        <>
          <Example />
          <p>Page</p>
        </>,
      )
      fireEvent.contextMenu(area(), { clientX: 10, clientY: 10 })
      await userEvent.click(screen.getByText('Page'))
      expect(menus()).toHaveLength(0)
    })

    it('reports the changes, and runs and closes on select', async () => {
      const onOpenChange = vi.fn()
      const onSelect = vi.fn()
      render(<Example onOpenChange={onOpenChange} onSelect={onSelect} />)
      fireEvent.contextMenu(area(), { clientX: 10, clientY: 10 })
      expect(onOpenChange).toHaveBeenLastCalledWith(true)
      await userEvent.click(item('Open'))
      expect(onSelect).toHaveBeenCalledTimes(1)
      expect(onOpenChange).toHaveBeenLastCalledWith(false)
      expect(menus()).toHaveLength(0)
    })

    it('stays open with closeOnSelect={false}', async () => {
      render(<Example closeOnSelect={false} />)
      fireEvent.contextMenu(area(), { clientX: 10, clientY: 10 })
      await userEvent.click(item('Open'))
      expect(menus()).toHaveLength(1)
    })

    it('moves between the items with the arrows', async () => {
      render(<Example />)
      fireEvent.contextMenu(area(), { clientX: 10, clientY: 10 })
      await userEvent.keyboard('{ArrowDown}')
      expect(item('Open')).toHaveFocus()
      await userEvent.keyboard('{ArrowDown}')
      expect(item('Rename')).toHaveFocus()
    })

    it('has the submenus of the Dropdown', async () => {
      render(<Example />)
      fireEvent.contextMenu(area(), { clientX: 10, clientY: 10 })
      item('Share').focus()
      await userEvent.keyboard('{ArrowRight}')
      expect(menus()).toHaveLength(2)
      expect(item('Email')).toHaveFocus()
      await userEvent.keyboard('{Escape}')
      expect(menus()).toHaveLength(1)
    })

    it('closes the whole menu when the press is outside while a submenu is open', async () => {
      render(
        <>
          <Example />
          <p>Page</p>
        </>,
      )
      fireEvent.contextMenu(area(), { clientX: 10, clientY: 10 })
      await userEvent.click(item('Share'))
      expect(menus()).toHaveLength(2)
      await userEvent.click(screen.getByText('Page'))
      expect(menus()).toHaveLength(0)
    })
  })

  describe('with the keyboard', () => {
    it('opens with the context menu key, on the first item, below the element', async () => {
      render(<Example />)
      vi.spyOn(area(), 'getBoundingClientRect').mockReturnValue({
        bottom: 90,
        height: 40,
        left: 30,
        right: 130,
        toJSON: () => ({}),
        top: 50,
        width: 100,
        x: 30,
        y: 50,
      })
      area().focus()
      await userEvent.keyboard('{ContextMenu}')
      expect(item('Open')).toHaveFocus()
      expect(anchor()).toHaveStyle({ left: '30px', top: '90px' })
    })

    it('opens with Shift + F10', async () => {
      render(<Example />)
      area().focus()
      await userEvent.keyboard('{Shift>}{F10}{/Shift}')
      expect(item('Open')).toHaveFocus()
    })

    it('ignores F10 without Shift and the other keys', async () => {
      render(<Example />)
      area().focus()
      await userEvent.keyboard('{F10}a{Enter}')
      expect(menus()).toHaveLength(0)
    })

    it('gives the focus back to the element when it closes', async () => {
      render(<Example />)
      area().focus()
      await userEvent.keyboard('{ContextMenu}')
      await userEvent.keyboard('{Escape}')
      expect(area()).toHaveFocus()
    })

    it('opens at the element that has the focus inside the area', async () => {
      render(
        <ContextMenu>
          <ContextMenuTrigger>
            <ul>
              <li>
                <button>First row</button>
              </li>
            </ul>
          </ContextMenuTrigger>
          <DropdownMenu aria-label="Row">
            <DropdownItem>Edit</DropdownItem>
          </DropdownMenu>
        </ContextMenu>,
      )
      const row = screen.getByRole('button', { name: 'First row' })
      const spy = vi.spyOn(row, 'getBoundingClientRect').mockReturnValue({
        bottom: 60,
        height: 20,
        left: 5,
        right: 55,
        toJSON: () => ({}),
        top: 40,
        width: 50,
        x: 5,
        y: 40,
      })
      row.focus()
      await userEvent.keyboard('{ContextMenu}')
      expect(spy).toHaveBeenCalled()
      expect(anchor()).toHaveStyle({ left: '5px', top: '60px' })
    })
  })

  describe('with a finger', () => {
    it('opens after a long press', () => {
      vi.useFakeTimers()
      render(<Example />)
      fireEvent.pointerDown(area(), { clientX: 40, clientY: 70, pointerType: 'touch' })
      act(() => {
        vi.advanceTimersByTime(499)
      })
      expect(menus()).toHaveLength(0)
      act(() => {
        vi.advanceTimersByTime(1)
      })
      expect(menus()).toHaveLength(1)
      expect(anchor()).toHaveStyle({ left: '40px', top: '70px' })
    })

    it('does not open when the finger is lifted first', () => {
      vi.useFakeTimers()
      render(<Example />)
      fireEvent.pointerDown(area(), { clientX: 40, clientY: 70, pointerType: 'touch' })
      fireEvent.pointerUp(area(), { pointerType: 'touch' })
      act(() => {
        vi.advanceTimersByTime(800)
      })
      expect(menus()).toHaveLength(0)
    })

    it('does not open when the press is cancelled', () => {
      vi.useFakeTimers()
      render(<Example />)
      fireEvent.pointerDown(area(), { clientX: 40, clientY: 70, pointerType: 'touch' })
      fireEvent.pointerCancel(area(), { pointerType: 'touch' })
      act(() => {
        vi.advanceTimersByTime(800)
      })
      expect(menus()).toHaveLength(0)
    })

    it('does not open when the finger moves far, and keeps waiting when it barely moves', () => {
      vi.useFakeTimers()
      render(<Example />)
      fireEvent.pointerDown(area(), { clientX: 40, clientY: 70, pointerType: 'touch' })
      fireEvent.pointerMove(area(), { clientX: 43, clientY: 72, pointerType: 'touch' })
      act(() => {
        vi.advanceTimersByTime(500)
      })
      expect(menus()).toHaveLength(1)
      fireEvent.keyDown(document.body, { key: 'Escape' })

      fireEvent.pointerDown(area(), { clientX: 40, clientY: 70, pointerType: 'touch' })
      fireEvent.pointerMove(area(), { clientX: 80, clientY: 70, pointerType: 'touch' })
      act(() => {
        vi.advanceTimersByTime(800)
      })
      expect(menus()).toHaveLength(0)
    })

    it('ignores a move when no press is waiting', () => {
      render(<Example />)
      fireEvent.pointerMove(area(), { clientX: 80, clientY: 70, pointerType: 'touch' })
      expect(menus()).toHaveLength(0)
    })

    it('does not wait for a long press with a mouse', () => {
      vi.useFakeTimers()
      render(<Example />)
      fireEvent.pointerDown(area(), { clientX: 40, clientY: 70, pointerType: 'mouse' })
      act(() => {
        vi.advanceTimersByTime(800)
      })
      expect(menus()).toHaveLength(0)
    })

    it('restarts the wait when the finger is pressed again', () => {
      vi.useFakeTimers()
      render(<Example />)
      fireEvent.pointerDown(area(), { clientX: 40, clientY: 70, pointerType: 'touch' })
      act(() => {
        vi.advanceTimersByTime(300)
      })
      fireEvent.pointerDown(area(), { clientX: 41, clientY: 71, pointerType: 'touch' })
      act(() => {
        vi.advanceTimersByTime(300)
      })
      expect(menus()).toHaveLength(0)
      act(() => {
        vi.advanceTimersByTime(200)
      })
      expect(menus()).toHaveLength(1)
    })

    it('forgets the long press when the area leaves the page', () => {
      vi.useFakeTimers()
      const { unmount } = render(<Example />)
      fireEvent.pointerDown(area(), { clientX: 40, clientY: 70, pointerType: 'touch' })
      unmount()
      expect(() =>
        act(() => {
          vi.advanceTimersByTime(800)
        }),
      ).not.toThrow()
    })
  })

  describe('the trigger', () => {
    it('leaves the menu of the browser when it is disabled', () => {
      render(
        <ContextMenu>
          <ContextMenuTrigger disabled>
            <button data-testid="area">Area</button>
          </ContextMenuTrigger>
          <DropdownMenu aria-label="Actions">
            <DropdownItem>Open</DropdownItem>
          </DropdownMenu>
        </ContextMenu>,
      )
      expect(fireEvent.contextMenu(area(), { clientX: 1, clientY: 1 })).toBe(true)
      fireEvent.keyDown(area(), { key: 'ContextMenu' })
      expect(menus()).toHaveLength(0)
      expect(area()).not.toHaveAttribute('data-loica-contextmenu-trigger')
    })

    it('adds its className and style to the element even when it is disabled', () => {
      render(
        <ContextMenu>
          <ContextMenuTrigger className="extra" disabled style={{ color: 'red' }}>
            <button data-testid="area">Area</button>
          </ContextMenuTrigger>
          <DropdownMenu aria-label="Actions">
            <DropdownItem>Open</DropdownItem>
          </DropdownMenu>
        </ContextMenu>,
      )
      expect(area()).toHaveClass('extra')
      expect(area()).toHaveStyle({ color: 'rgb(255, 0, 0)' })
    })

    it('marks the area and its state', () => {
      render(<Example />)
      expect(area()).toHaveAttribute('data-loica-contextmenu-trigger', '')
      expect(area()).not.toHaveAttribute('data-open')
      fireEvent.contextMenu(area(), { clientX: 1, clientY: 1 })
      expect(area()).toHaveAttribute('data-open', '')
    })

    it('keeps the handlers, the className and the style of its element', () => {
      const onContextMenu = vi.fn()
      render(
        <ContextMenu>
          <ContextMenuTrigger className="extra" style={{ color: 'red' }}>
            <div
              className="own"
              data-testid="area"
              onContextMenu={onContextMenu}
              style={{ margin: 4 }}
            >
              Area
            </div>
          </ContextMenuTrigger>
          <DropdownMenu aria-label="Actions">
            <DropdownItem>Open</DropdownItem>
          </DropdownMenu>
        </ContextMenu>,
      )
      expect(area()).toHaveClass('own', 'extra')
      expect(area()).toHaveStyle({ color: 'rgb(255, 0, 0)', margin: '4px' })
      fireEvent.contextMenu(area(), { clientX: 1, clientY: 1 })
      expect(onContextMenu).toHaveBeenCalledTimes(1)
      expect(menus()).toHaveLength(1)
    })

    it('keeps the className of its element when it has none of its own', () => {
      render(
        <ContextMenu>
          <ContextMenuTrigger>
            <div className="own" data-testid="area">
              Area
            </div>
          </ContextMenuTrigger>
          <DropdownMenu aria-label="Actions">
            <DropdownItem>Open</DropdownItem>
          </DropdownMenu>
        </ContextMenu>,
      )
      expect(area()).toHaveClass('own')
    })

    it('does not open when the handler of its element prevents the default', () => {
      render(
        <ContextMenu>
          <ContextMenuTrigger>
            <div data-testid="area" onContextMenu={(event) => event.preventDefault()}>
              Area
            </div>
          </ContextMenuTrigger>
          <DropdownMenu aria-label="Actions">
            <DropdownItem>Open</DropdownItem>
          </DropdownMenu>
        </ContextMenu>,
      )
      fireEvent.contextMenu(area(), { clientX: 1, clientY: 1 })
      expect(menus()).toHaveLength(0)
    })

    it('renders a div for text, and forwards the ref', () => {
      const ref = createRef<HTMLElement>()
      render(
        <ContextMenu>
          <ContextMenuTrigger className="box" ref={ref}>
            Area of text
          </ContextMenuTrigger>
          <DropdownMenu aria-label="Actions">
            <DropdownItem>Open</DropdownItem>
          </DropdownMenu>
        </ContextMenu>,
      )
      const text = screen.getByText('Area of text')
      expect(text.tagName).toBe('DIV')
      expect(text).toHaveClass('box')
      expect(ref.current).toBe(text)
      fireEvent.contextMenu(text, { clientX: 1, clientY: 1 })
      expect(menus()).toHaveLength(1)
    })

    it('forwards the ref to its element', () => {
      const ref = createRef<HTMLElement>()
      render(
        <ContextMenu>
          <ContextMenuTrigger ref={ref}>
            <section data-testid="area">Area</section>
          </ContextMenuTrigger>
          <DropdownMenu aria-label="Actions">
            <DropdownItem>Open</DropdownItem>
          </DropdownMenu>
        </ContextMenu>,
      )
      expect(ref.current).toBe(area())
    })

    it('opens the menu of the closest area when one is inside another', () => {
      render(
        <>
          <ContextMenu>
            <ContextMenuTrigger>
              <div data-testid="outer">
                <ContextMenu>
                  <ContextMenuTrigger>
                    <div data-testid="inner">Inner</div>
                  </ContextMenuTrigger>
                  <DropdownMenu aria-label="Inner menu">
                    <DropdownItem>Inner action</DropdownItem>
                  </DropdownMenu>
                </ContextMenu>
              </div>
            </ContextMenuTrigger>
            <DropdownMenu aria-label="Outer menu">
              <DropdownItem>Outer action</DropdownItem>
            </DropdownMenu>
          </ContextMenu>
        </>,
      )
      fireEvent.contextMenu(screen.getByTestId('inner'), { clientX: 1, clientY: 1 })
      expect(menus()).toHaveLength(1)
      expect(screen.getByRole('menu')).toHaveAccessibleName('Inner menu')
    })
  })

  describe('rendering', () => {
    it('is an elevated medium menu by default, and takes the size and variant', () => {
      const { unmount } = render(<Example />)
      fireEvent.contextMenu(area(), { clientX: 1, clientY: 1 })
      expect(screen.getByRole('menu')).toHaveClass('menu', 'md', 'elevated')
      unmount()

      render(<Example size="sm" variant="outline" />)
      fireEvent.contextMenu(area(), { clientX: 1, clientY: 1 })
      expect(screen.getByRole('menu')).toHaveClass('menu', 'sm', 'outline')
    })

    it('drops the Loica classes when unstyled', () => {
      render(<Example variant="unstyled" />)
      fireEvent.contextMenu(area(), { clientX: 1, clientY: 1 })
      expect(screen.getByRole('menu')).not.toHaveAttribute('class')
    })

    it('hides the point it is anchored to from assistive technology', () => {
      render(<Example />)
      fireEvent.contextMenu(area(), { clientX: 1, clientY: 1 })
      expect(anchor()).toHaveAttribute('aria-hidden', 'true')
    })

    it('takes the flip and shift options', () => {
      render(<Example flip={false} shift={false} />)
      fireEvent.contextMenu(area(), { clientX: 1, clientY: 1 })
      expect(screen.getByRole('menu')).toHaveAttribute('data-placement', 'bottom-start')
    })
  })

  describe('usage', () => {
    it('throws when the trigger is outside a ContextMenu', () => {
      vi.spyOn(console, 'error').mockImplementation(() => undefined)
      expect(() =>
        render(
          <ContextMenuTrigger>
            <div>Area</div>
          </ContextMenuTrigger>,
        ),
      ).toThrow('ContextMenuTrigger must be used within a <ContextMenu>')
    })
  })
})
