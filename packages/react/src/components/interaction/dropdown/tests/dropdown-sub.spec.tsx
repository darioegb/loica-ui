import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { createRef } from 'react'
import {
  Dropdown,
  DropdownItem,
  DropdownItemIcon,
  DropdownItemLabel,
  DropdownMenu,
  DropdownSub,
  DropdownSubMenu,
  DropdownSubTrigger,
  DropdownTrigger,
  type DropdownProps,
  type DropdownSubProps,
} from '..'

interface ExampleProps extends Partial<Omit<DropdownProps, 'children'>> {
  delay?: DropdownSubProps['delay']
  onShare?: () => void
}

function Example({ delay, onShare, ...props }: Readonly<ExampleProps>): React.ReactNode {
  return (
    <Dropdown {...props}>
      <DropdownTrigger>
        <button>Actions</button>
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItem>Rename</DropdownItem>
        <DropdownSub delay={delay}>
          <DropdownSubTrigger>Share</DropdownSubTrigger>
          <DropdownSubMenu>
            <DropdownItem onSelect={onShare}>Email</DropdownItem>
            <DropdownItem disabled>Slack</DropdownItem>
            <DropdownSub delay={delay}>
              <DropdownSubTrigger>More</DropdownSubTrigger>
              <DropdownSubMenu>
                <DropdownItem>Link</DropdownItem>
                <DropdownItem>Embed</DropdownItem>
              </DropdownSubMenu>
            </DropdownSub>
          </DropdownSubMenu>
        </DropdownSub>
        <DropdownItem>Delete</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}

const trigger = (): HTMLElement => screen.getByRole('button', { name: 'Actions' })
const item = (name: string): HTMLElement => screen.getByRole('menuitem', { name })
const menus = (): HTMLElement[] => screen.queryAllByRole('menu')
const share = (): HTMLElement => item('Share')

async function openRoot(): Promise<void> {
  await userEvent.click(trigger())
}

async function openShare(): Promise<void> {
  await openRoot()
  share().focus()
  await userEvent.keyboard('{ArrowRight}')
}

afterEach(() => {
  document.documentElement.removeAttribute('dir')
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('DropdownSub component', () => {
  describe('the trigger', () => {
    it('is a menu item that opens a menu, closed at first', async () => {
      render(<Example />)
      await openRoot()
      expect(share()).toHaveAttribute('aria-haspopup', 'menu')
      expect(share()).toHaveAttribute('aria-expanded', 'false')
      expect(share()).not.toHaveAttribute('aria-controls')
      expect(menus()).toHaveLength(1)
    })

    it('opens the submenu with a click and points to it', async () => {
      render(<Example />)
      await openRoot()
      await userEvent.click(share())
      expect(menus()).toHaveLength(2)
      expect(share()).toHaveAttribute('aria-expanded', 'true')
      expect(share()).toHaveAttribute('aria-controls', menus()[1].id)
      expect(share()).toHaveAttribute('data-open', '')
    })

    it('names the submenu after its trigger', async () => {
      render(<Example />)
      await openShare()
      expect(menus()[1]).toHaveAccessibleName('Share')
    })

    it('has an arrow that is hidden from screen readers', async () => {
      render(<Example />)
      await openRoot()
      const chevron = share().querySelector('[data-loica-dropdown-chevron]')
      expect(chevron).toHaveAttribute('aria-hidden', 'true')
      expect(chevron).toHaveClass('chevron')
    })

    it('can be disabled', async () => {
      render(
        <Dropdown defaultOpen>
          <DropdownTrigger>
            <button>Actions</button>
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownSub>
              <DropdownSubTrigger disabled>Share</DropdownSubTrigger>
              <DropdownSubMenu>
                <DropdownItem>Email</DropdownItem>
              </DropdownSubMenu>
            </DropdownSub>
            <DropdownItem>Delete</DropdownItem>
          </DropdownMenu>
        </Dropdown>,
      )
      expect(share()).toBeDisabled()
      await userEvent.click(share(), { pointerEventsCheck: 0 })
      fireEvent.keyDown(share(), { key: 'ArrowRight' })
      expect(menus()).toHaveLength(1)
      screen.getByRole('menuitem', { name: 'Delete' }).focus()
      await userEvent.keyboard('{ArrowUp}')
      expect(share()).not.toHaveFocus()
    })

    it('shows an icon, or the parts it is given', () => {
      render(
        <Dropdown defaultOpen>
          <DropdownTrigger>
            <button>Actions</button>
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownSub>
              <DropdownSubTrigger icon={<svg data-testid="icon" />}>Share</DropdownSubTrigger>
              <DropdownSubMenu>
                <DropdownItem>Email</DropdownItem>
              </DropdownSubMenu>
            </DropdownSub>
            <DropdownSub>
              <DropdownSubTrigger>
                <DropdownItemIcon>
                  <svg data-testid="part-icon" />
                </DropdownItemIcon>
                <DropdownItemLabel>Export</DropdownItemLabel>
              </DropdownSubTrigger>
              <DropdownSubMenu>
                <DropdownItem>PDF</DropdownItem>
              </DropdownSubMenu>
            </DropdownSub>
          </DropdownMenu>
        </Dropdown>,
      )
      expect(within(share()).getByTestId('icon')).toBeInTheDocument()
      expect(within(item('Export')).getByTestId('part-icon')).toBeInTheDocument()
    })
  })

  describe('keyboard', () => {
    it('opens with ArrowRight on the first item and closes with ArrowLeft, giving the focus back', async () => {
      render(<Example />)
      await openShare()
      expect(menus()).toHaveLength(2)
      expect(item('Email')).toHaveFocus()

      await userEvent.keyboard('{ArrowLeft}')
      expect(menus()).toHaveLength(1)
      expect(share()).toHaveFocus()
    })

    it('opens with Enter and Space on the first item', async () => {
      render(<Example />)
      await openRoot()
      share().focus()
      await userEvent.keyboard('{Enter}')
      expect(item('Email')).toHaveFocus()
      await userEvent.keyboard('{ArrowLeft}')
      await userEvent.keyboard(' ')
      expect(item('Email')).toHaveFocus()
    })

    it('closes one level at a time with Escape', async () => {
      render(<Example />)
      await openShare()
      item('More').focus()
      await userEvent.keyboard('{ArrowRight}')
      expect(menus()).toHaveLength(3)

      await userEvent.keyboard('{Escape}')
      expect(menus()).toHaveLength(2)
      expect(item('More')).toHaveFocus()

      await userEvent.keyboard('{Escape}')
      expect(menus()).toHaveLength(1)
      expect(share()).toHaveFocus()

      await userEvent.keyboard('{Escape}')
      expect(menus()).toHaveLength(0)
      expect(trigger()).toHaveFocus()
    })

    it('closes the whole menu with Tab', async () => {
      render(<Example />)
      await openShare()
      await userEvent.keyboard('{Tab}')
      expect(menus()).toHaveLength(0)
      expect(trigger()).toHaveFocus()
    })

    it('moves between its items with the arrows, skipping the disabled one, and leaves the menu behind alone', async () => {
      render(<Example />)
      await openShare()
      await userEvent.keyboard('{ArrowDown}')
      expect(item('More')).toHaveFocus()
      await userEvent.keyboard('{ArrowDown}')
      expect(item('Email')).toHaveFocus()
      await userEvent.keyboard('{End}')
      expect(item('More')).toHaveFocus()
      await userEvent.keyboard('{Home}')
      expect(item('Email')).toHaveFocus()
      await userEvent.keyboard('{ArrowUp}')
      expect(item('More')).toHaveFocus()
      expect(menus()).toHaveLength(2)
    })

    it('focuses the item that starts with the typed text, in the menu where the focus is', async () => {
      render(<Example />)
      await openShare()
      await userEvent.keyboard('m')
      expect(item('More')).toHaveFocus()
    })

    it('does not move the focus of the menu behind when the arrows are pressed in the submenu', async () => {
      render(<Example />)
      await openShare()
      await userEvent.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}')
      expect(share()).toHaveAttribute('aria-expanded', 'true')
      expect(menus()).toHaveLength(2)
    })

    it('mirrors the arrows when the text runs right to left', async () => {
      document.documentElement.dir = 'rtl'
      render(<Example flip={false} />)
      await openRoot()
      share().focus()
      await userEvent.keyboard('{ArrowRight}')
      expect(menus()).toHaveLength(1)
      await userEvent.keyboard('{ArrowLeft}')
      expect(menus()).toHaveLength(2)
      expect(menus()[1]).toHaveAttribute('data-placement', 'left-start')
      await userEvent.keyboard('{ArrowRight}')
      expect(menus()).toHaveLength(1)
      expect(share()).toHaveFocus()
    })

    it('opens the submenu to the right in left to right text', async () => {
      render(<Example flip={false} />)
      await openShare()
      expect(menus()[1]).toHaveAttribute('data-placement', 'right-start')
    })
  })

  describe('selecting', () => {
    it('calls onSelect and closes the whole menu', async () => {
      const onShare = vi.fn()
      render(<Example onShare={onShare} />)
      await openShare()
      await userEvent.keyboard('{Enter}')
      expect(onShare).toHaveBeenCalledTimes(1)
      expect(menus()).toHaveLength(0)
    })

    it('stays open with closeOnSelect={false}', async () => {
      render(<Example closeOnSelect={false} />)
      await openShare()
      await userEvent.keyboard('{Enter}')
      expect(menus()).toHaveLength(2)
    })

    it('selects an item of a submenu with the pointer', async () => {
      const onShare = vi.fn()
      render(<Example onShare={onShare} />)
      await openRoot()
      await userEvent.click(share())
      await userEvent.click(item('Email'))
      expect(onShare).toHaveBeenCalledTimes(1)
      expect(menus()).toHaveLength(0)
    })
  })

  describe('the pointer', () => {
    it('opens after the delay and keeps the focus on the trigger', () => {
      vi.useFakeTimers()
      render(<Example />)
      act(() => trigger().click())
      fireEvent.pointerEnter(share(), { pointerType: 'mouse' })
      act(() => {
        vi.advanceTimersByTime(149)
      })
      expect(menus()).toHaveLength(1)
      act(() => {
        vi.advanceTimersByTime(1)
      })
      expect(menus()).toHaveLength(2)
      expect(menus()[1]).not.toHaveFocus()
    })

    it('opens at once with a delay of zero, and takes the delay it is given', () => {
      vi.useFakeTimers()
      render(<Example delay={400} />)
      act(() => trigger().click())
      fireEvent.pointerEnter(share(), { pointerType: 'mouse' })
      act(() => {
        vi.advanceTimersByTime(399)
      })
      expect(menus()).toHaveLength(1)
      act(() => {
        vi.advanceTimersByTime(1)
      })
      expect(menus()).toHaveLength(2)
    })

    it('does not open when the pointer leaves before the delay', () => {
      vi.useFakeTimers()
      render(<Example />)
      act(() => trigger().click())
      fireEvent.pointerEnter(share(), { pointerType: 'mouse' })
      act(() => {
        vi.advanceTimersByTime(100)
      })
      fireEvent.pointerLeave(share(), { pointerType: 'mouse' })
      act(() => {
        vi.advanceTimersByTime(200)
      })
      expect(menus()).toHaveLength(1)
    })

    it('does not open on hover with a finger', () => {
      vi.useFakeTimers()
      render(<Example />)
      act(() => trigger().click())
      fireEvent.pointerEnter(share(), { pointerType: 'touch' })
      act(() => {
        vi.advanceTimersByTime(500)
      })
      expect(menus()).toHaveLength(1)
    })

    it('does not open again while it is open', async () => {
      render(<Example />)
      await openShare()
      fireEvent.pointerEnter(share(), { pointerType: 'mouse' })
      expect(menus()).toHaveLength(2)
    })

    it('moves the focus to the item the pointer is over', async () => {
      render(<Example />)
      await openRoot()
      fireEvent.pointerMove(share())
      expect(share()).toHaveFocus()
      fireEvent.pointerMove(item('Rename'))
      expect(item('Rename')).toHaveFocus()
    })

    it('takes the focus to the first item with ArrowRight when it opened with the pointer', async () => {
      render(<Example />)
      await openRoot()
      await userEvent.click(share())
      expect(share()).toHaveFocus()
      await userEvent.keyboard('{ArrowRight}')
      expect(item('Email')).toHaveFocus()
    })

    it('closes when the focus goes to another item of the menu behind', async () => {
      render(<Example />)
      await openRoot()
      await userEvent.click(share())
      fireEvent.pointerMove(item('Delete'))
      expect(menus()).toHaveLength(1)
      expect(share()).toHaveAttribute('aria-expanded', 'false')
    })
  })

  describe('the safe area', () => {
    const rect = (left: number, top: number, right: number, bottom: number): DOMRect =>
      ({
        bottom,
        height: bottom - top,
        left,
        right,
        toJSON: () => ({}),
        top,
        width: right - left,
        x: left,
        y: top,
      })

    async function openByPointer(): Promise<HTMLElement> {
      render(<Example />)
      await openRoot()
      await userEvent.click(share())
      const panel = menus()[1]
      vi.spyOn(panel, 'getBoundingClientRect').mockReturnValue(rect(200, 0, 300, 100))
      return panel
    }

    it('keeps the submenu open while the pointer goes to it in a straight line', async () => {
      await openByPointer()
      fireEvent.pointerLeave(share(), { clientX: 100, clientY: 50, pointerType: 'mouse' })
      fireEvent.pointerMove(document.body, { clientX: 150, clientY: 60 })
      fireEvent.pointerMove(document.body, { clientX: 190, clientY: 20 })
      expect(menus()).toHaveLength(2)
    })

    it('does not move the focus to the items it crosses on the way', async () => {
      await openByPointer()
      share().focus()
      fireEvent.pointerLeave(share(), { clientX: 100, clientY: 50, pointerType: 'mouse' })
      fireEvent.pointerMove(item('Delete'), { clientX: 150, clientY: 60 })
      expect(item('Delete')).not.toHaveFocus()
      expect(menus()).toHaveLength(2)
    })

    it('closes it when the pointer goes somewhere else', async () => {
      await openByPointer()
      fireEvent.pointerLeave(share(), { clientX: 100, clientY: 50, pointerType: 'mouse' })
      fireEvent.pointerMove(document.body, { clientX: 100, clientY: 400 })
      expect(menus()).toHaveLength(1)
      expect(share()).toHaveAttribute('aria-expanded', 'false')
    })

    it('lets the focus follow the pointer again once it closed', async () => {
      await openByPointer()
      fireEvent.pointerLeave(share(), { clientX: 100, clientY: 50, pointerType: 'mouse' })
      fireEvent.pointerMove(document.body, { clientX: 100, clientY: 400 })
      fireEvent.pointerMove(item('Delete'))
      expect(item('Delete')).toHaveFocus()
    })

    it('stops looking at the pointer when it reaches the submenu or comes back to the trigger', async () => {
      const panel = await openByPointer()
      fireEvent.pointerLeave(share(), { clientX: 100, clientY: 50, pointerType: 'mouse' })
      fireEvent.pointerMove(item('Email'))
      fireEvent.pointerMove(document.body, { clientX: 100, clientY: 400 })
      expect(menus()).toHaveLength(2)
      expect(panel).toBeInTheDocument()

      fireEvent.pointerLeave(share(), { clientX: 100, clientY: 50, pointerType: 'mouse' })
      fireEvent.pointerMove(share())
      fireEvent.pointerMove(document.body, { clientX: 100, clientY: 400 })
      expect(menus()).toHaveLength(2)
    })

    it('does not start with a finger', async () => {
      await openByPointer()
      fireEvent.pointerLeave(share(), { clientX: 100, clientY: 50, pointerType: 'touch' })
      fireEvent.pointerMove(document.body, { clientX: 100, clientY: 400 })
      expect(menus()).toHaveLength(2)
    })

    it('finds the edge that faces the trigger when the submenu opens on the other side', async () => {
      document.documentElement.dir = 'rtl'
      render(<Example />)
      await openRoot()
      await userEvent.click(share())
      vi.spyOn(menus()[1], 'getBoundingClientRect').mockReturnValue(rect(0, 0, 100, 100))
      fireEvent.pointerLeave(share(), { clientX: 200, clientY: 50, pointerType: 'mouse' })
      fireEvent.pointerMove(document.body, { clientX: 150, clientY: 50 })
      expect(menus()).toHaveLength(2)
      fireEvent.pointerMove(document.body, { clientX: 300, clientY: 400 })
      expect(menus()).toHaveLength(1)
    })

    it('finds the edge that faces the trigger when the submenu is above or below it', async () => {
      await openByPointer()
      const panel = menus()[1]
      panel.setAttribute('data-placement', 'top-start')
      vi.spyOn(panel, 'getBoundingClientRect').mockReturnValue(rect(0, 0, 100, 100))
      fireEvent.pointerLeave(share(), { clientX: 50, clientY: 200, pointerType: 'mouse' })
      fireEvent.pointerMove(document.body, { clientX: 50, clientY: 150 })
      expect(menus()).toHaveLength(2)

      panel.setAttribute('data-placement', 'bottom-start')
      vi.spyOn(panel, 'getBoundingClientRect').mockReturnValue(rect(0, 200, 100, 300))
      fireEvent.pointerLeave(share(), { clientX: 50, clientY: 0, pointerType: 'mouse' })
      fireEvent.pointerMove(document.body, { clientX: 50, clientY: 100 })
      expect(menus()).toHaveLength(2)
      fireEvent.pointerMove(document.body, { clientX: 500, clientY: 100 })
      expect(menus()).toHaveLength(1)
    })
  })

  describe('pressing outside', () => {
    it('closes the whole menu when the press is outside every menu', async () => {
      render(
        <>
          <Example />
          <p>Page</p>
        </>,
      )
      await openShare()
      item('More').focus()
      await userEvent.keyboard('{ArrowRight}')
      expect(menus()).toHaveLength(3)
      await userEvent.click(screen.getByText('Page'))
      expect(menus()).toHaveLength(0)
    })

    it('closes only the submenus above the menu that was pressed', async () => {
      const onSelect = vi.fn()
      render(
        <Dropdown defaultOpen>
          <DropdownTrigger>
            <button>Actions</button>
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownSub>
              <DropdownSubTrigger>Share</DropdownSubTrigger>
              <DropdownSubMenu>
                <DropdownItem onSelect={onSelect}>Email</DropdownItem>
                <DropdownSub>
                  <DropdownSubTrigger>More</DropdownSubTrigger>
                  <DropdownSubMenu>
                    <DropdownItem>Link</DropdownItem>
                  </DropdownSubMenu>
                </DropdownSub>
              </DropdownSubMenu>
            </DropdownSub>
            <DropdownItem>Delete</DropdownItem>
          </DropdownMenu>
        </Dropdown>,
      )
      await userEvent.click(share())
      await userEvent.click(item('More'))
      expect(menus()).toHaveLength(3)

      fireEvent.pointerDown(menus()[1])
      expect(menus()).toHaveLength(2)

      fireEvent.pointerDown(menus()[0])
      expect(menus()).toHaveLength(1)
    })

    it('runs the item of the menu behind that was pressed', async () => {
      const onSelect = vi.fn()
      render(
        <Dropdown defaultOpen>
          <DropdownTrigger>
            <button>Actions</button>
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownSub>
              <DropdownSubTrigger>Share</DropdownSubTrigger>
              <DropdownSubMenu>
                <DropdownItem>Email</DropdownItem>
              </DropdownSubMenu>
            </DropdownSub>
            <DropdownItem onSelect={onSelect}>Delete</DropdownItem>
          </DropdownMenu>
        </Dropdown>,
      )
      await userEvent.click(share())
      await userEvent.click(item('Delete'))
      expect(onSelect).toHaveBeenCalledTimes(1)
      expect(menus()).toHaveLength(0)
    })

    it('closes the menu, and not only the submenu, when the trigger is pressed again', async () => {
      render(<Example />)
      await openShare()
      await userEvent.click(trigger())
      expect(menus()).toHaveLength(0)
    })
  })

  describe('rendering', () => {
    it('opens the submenu in a portal, with the size and variant of the menu', async () => {
      render(<Example size="lg" variant="outline" />)
      await openShare()
      const submenu = menus()[1]
      expect(submenu).toHaveClass('menu', 'lg', 'outline')
      expect(document.body).toContainElement(submenu)
      expect(submenu).toHaveStyle({ position: 'fixed' })
      expect(submenu).toHaveAttribute('data-loica-dropdown-sub-menu', '')
    })

    it('keeps the aria-label, the className and the style of the submenu', async () => {
      render(
        <Dropdown defaultOpen>
          <DropdownTrigger>
            <button>Actions</button>
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownSub>
              <DropdownSubTrigger aria-label="Share it" className="own" style={{ color: 'red' }}>
                Share
              </DropdownSubTrigger>
              <DropdownSubMenu aria-label="Ways to share" className="sub" style={{ margin: 3 }}>
                <DropdownItem>Email</DropdownItem>
              </DropdownSubMenu>
            </DropdownSub>
          </DropdownMenu>
        </Dropdown>,
      )
      const triggerItem = screen.getByRole('menuitem', { name: 'Share it' })
      expect(triggerItem).toHaveClass('item', 'own')
      expect(triggerItem).toHaveStyle({ color: 'rgb(255, 0, 0)' })
      await userEvent.click(triggerItem)
      const submenu = screen.getByRole('menu', { name: 'Ways to share' })
      expect(submenu).toHaveClass('menu', 'sub')
      expect(submenu).toHaveStyle({ margin: '3px' })
    })

    it('uses its own aria-labelledby', async () => {
      render(
        <Dropdown defaultOpen>
          <DropdownTrigger>
            <button>Actions</button>
          </DropdownTrigger>
          <DropdownMenu>
            <span id="name">Sharing</span>
            <DropdownSub>
              <DropdownSubTrigger>Share</DropdownSubTrigger>
              <DropdownSubMenu aria-labelledby="name">
                <DropdownItem>Email</DropdownItem>
              </DropdownSubMenu>
            </DropdownSub>
          </DropdownMenu>
        </Dropdown>,
      )
      await userEvent.click(share())
      expect(menus()[1]).toHaveAccessibleName('Sharing')
    })

    it('forwards the refs of the trigger and the submenu', async () => {
      const triggerRef = createRef<HTMLButtonElement>()
      const menuRef = createRef<HTMLDivElement>()
      render(
        <Dropdown defaultOpen>
          <DropdownTrigger>
            <button>Actions</button>
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownSub>
              <DropdownSubTrigger ref={triggerRef}>Share</DropdownSubTrigger>
              <DropdownSubMenu ref={menuRef}>
                <DropdownItem>Email</DropdownItem>
              </DropdownSubMenu>
            </DropdownSub>
          </DropdownMenu>
        </Dropdown>,
      )
      await userEvent.click(share())
      expect(triggerRef.current).toBe(share())
      expect(menuRef.current).toBe(menus()[1])
    })

    it('drops the Loica classes when unstyled', async () => {
      render(<Example variant="unstyled" />)
      await openShare()
      expect(menus()[1]).not.toHaveAttribute('class')
      expect(share()).not.toHaveAttribute('class')
      expect(share().querySelector('[data-loica-dropdown-chevron]')).not.toHaveAttribute('class')
    })

    it('renders nothing for the submenu while it is closed', async () => {
      render(<Example />)
      await openRoot()
      expect(screen.queryByRole('menuitem', { name: 'Email' })).toBeNull()
    })

    it('closes with the menu it belongs to', async () => {
      render(<Example />)
      await openShare()
      await userEvent.keyboard('{Escape}{Escape}')
      expect(menus()).toHaveLength(0)
      await openRoot()
      expect(menus()).toHaveLength(1)
    })
  })

  describe('usage', () => {
    it('throws when the trigger or the menu are outside a DropdownSub', () => {
      vi.spyOn(console, 'error').mockImplementation(() => undefined)
      const dropdown = (child: React.ReactNode): React.ReactNode => (
        <Dropdown>
          <DropdownTrigger>
            <button>Actions</button>
          </DropdownTrigger>
          {child}
        </Dropdown>
      )
      expect(() => render(dropdown(<DropdownSubTrigger>Share</DropdownSubTrigger>))).toThrow(
        'DropdownSubTrigger must be used within a <DropdownSub>',
      )
      expect(() => render(dropdown(<DropdownSubMenu>Share</DropdownSubMenu>))).toThrow(
        'DropdownSubMenu must be used within a <DropdownSub>',
      )
    })

    it('throws outside a Dropdown', () => {
      vi.spyOn(console, 'error').mockImplementation(() => undefined)
      expect(() => render(<DropdownSub>Share</DropdownSub>)).toThrow(
        'DropdownSub must be used within a <Dropdown>',
      )
    })
  })
})
