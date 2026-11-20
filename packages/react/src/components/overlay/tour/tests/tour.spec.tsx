import { act, render, screen, within } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { createRef, useRef, useState, type ComponentPropsWithRef } from 'react'
import { LocaleProvider } from '../../../../locale/locale-provider'
import {
  Tour,
  TourContent,
  TourNext,
  TourPanel,
  TourPrevious,
  TourProgress,
  TourSkip,
  TourSpotlight,
  TourTitle,
  type TourProps,
  type TourStep,
} from '..'

const steps: TourStep[] = [
  { content: 'Find a project by its name.', target: '#search', title: 'Search' },
  { target: '#create', title: 'Create' },
  { content: 'Your account.', target: '#profile', title: 'Profile' },
]

function Page(props: Readonly<Partial<ComponentPropsWithRef<typeof Tour>>>): React.ReactNode {
  return (
    <>
      <input aria-label="Search" id="search" />
      <button id="create">Create</button>
      <button id="profile">Profile</button>
      <Tour defaultOpen steps={steps} {...props} />
    </>
  )
}

const panel = (): HTMLElement => screen.getByRole('dialog')
const button = (name: string): HTMLElement => within(panel()).getByRole('button', { name })
const spotlight = (): HTMLElement | null => document.querySelector('[data-loica-tour-spotlight]')
const blocker = (): HTMLElement => document.querySelector<HTMLElement>('[data-loica-tour-blocker]') as HTMLElement

const rectOf = (element: Element, box: Partial<DOMRect>): void => {
  vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
    bottom: 0,
    height: 0,
    left: 0,
    right: 0,
    toJSON: () => ({}),
    top: 0,
    width: 0,
    x: 0,
    y: 0,
    ...box,
  })
}

afterEach(() => {
  document.documentElement.removeAttribute('dir')
  vi.restoreAllMocks()
})

describe('Tour component', () => {
  describe('opening and closing', () => {
    it('renders nothing while it is closed', () => {
      render(<Page defaultOpen={false} />)
      expect(screen.queryByRole('dialog')).toBeNull()
      expect(document.querySelector('[data-loica-tour]')).toBeNull()
    })

    it('renders nothing without steps', () => {
      render(<Page steps={[]} />)
      expect(screen.queryByRole('dialog')).toBeNull()
    })

    it('can be open at first, with a panel named by the title and described by the content', () => {
      render(<Page />)
      expect(panel()).toHaveAccessibleName('Search')
      expect(panel()).toHaveAccessibleDescription('Find a project by its name.')
    })

    it('has no description for a step without content', () => {
      render(<Page defaultStep={1} />)
      expect(panel()).not.toHaveAttribute('aria-describedby')
      expect(document.querySelector('[data-loica-tour-content]')).toBeNull()
    })

    it('opens and closes with `open`, and does not close itself when controlled', async () => {
      const onOpenChange = vi.fn()
      const { rerender } = render(<Page defaultOpen={undefined} onOpenChange={onOpenChange} open />)
      await userEvent.click(button('Skip'))
      expect(onOpenChange).toHaveBeenCalledWith(false)
      expect(panel()).toBeInTheDocument()

      rerender(<Page defaultOpen={undefined} onOpenChange={onOpenChange} open={false} />)
      expect(screen.queryByRole('dialog')).toBeNull()
    })

    it('closes with the reason `finish` on the last step', async () => {
      const onClose = vi.fn()
      const onOpenChange = vi.fn()
      render(<Page defaultStep={2} onClose={onClose} onOpenChange={onOpenChange} />)
      await userEvent.click(button('Done'))
      expect(onClose).toHaveBeenCalledWith('finish')
      expect(onOpenChange).toHaveBeenCalledWith(false)
      expect(screen.queryByRole('dialog')).toBeNull()
    })

    it('closes with the reason `skip`', async () => {
      const onClose = vi.fn()
      render(<Page onClose={onClose} />)
      await userEvent.click(button('Skip'))
      expect(onClose).toHaveBeenCalledWith('skip')
      expect(screen.queryByRole('dialog')).toBeNull()
    })

    it('closes with the reason `escape` on Escape', async () => {
      const onClose = vi.fn()
      render(<Page onClose={onClose} />)
      await userEvent.keyboard('{Escape}')
      expect(onClose).toHaveBeenCalledWith('escape')
      expect(screen.queryByRole('dialog')).toBeNull()
    })

    it('stays open when the page is pressed', async () => {
      const onClose = vi.fn()
      render(<Page onClose={onClose} />)
      await userEvent.click(blocker())
      await userEvent.click(document.body)
      expect(onClose).not.toHaveBeenCalled()
      expect(panel()).toBeInTheDocument()
    })
  })

  describe('the steps', () => {
    it('goes through the steps with the buttons and shows the progress', async () => {
      const onStepChange = vi.fn()
      render(<Page onStepChange={onStepChange} />)
      expect(panel()).toHaveTextContent('Step 1 of 3')
      expect(screen.queryByRole('button', { name: 'Previous' })).toBeNull()

      await userEvent.click(button('Next'))
      expect(panel()).toHaveAccessibleName('Create')
      expect(panel()).toHaveTextContent('Step 2 of 3')
      expect(onStepChange).toHaveBeenLastCalledWith(1)

      await userEvent.click(button('Next'))
      expect(button('Done')).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'Skip' })).toBeNull()
      expect(screen.queryByRole('button', { name: 'Next' })).toBeNull()

      await userEvent.click(button('Previous'))
      expect(panel()).toHaveAccessibleName('Create')
      expect(onStepChange).toHaveBeenLastCalledWith(1)
    })

    it('starts at `defaultStep`, and keeps a step that is out of range inside the list', () => {
      const { unmount } = render(<Page defaultStep={1} />)
      expect(panel()).toHaveAccessibleName('Create')
      unmount()

      render(<Page defaultStep={9} />)
      expect(panel()).toHaveAccessibleName('Profile')
    })

    it('shows the step it is given, and leaves the change to the app when it is controlled', async () => {
      const onStepChange = vi.fn()
      render(<Page onStepChange={onStepChange} step={1} />)
      await userEvent.click(button('Next'))
      expect(onStepChange).toHaveBeenCalledWith(2)
      expect(panel()).toHaveAccessibleName('Create')
    })

    it('goes back to `defaultStep` when it closes, so a new tour starts at the beginning', async () => {
      function Restart(): React.ReactNode {
        const [open, setOpen] = useState(true)
        return (
          <>
            <button onClick={() => setOpen(true)}>Restart</button>
            <Page defaultOpen={undefined} onOpenChange={setOpen} open={open} />
          </>
        )
      }
      render(<Restart />)
      await userEvent.click(button('Next'))
      await userEvent.click(button('Skip'))
      await userEvent.click(screen.getByText('Restart'))
      expect(panel()).toHaveAccessibleName('Search')
    })

    it('keeps the step it is given when it closes and the step is controlled', async () => {
      const onStepChange = vi.fn()
      render(<Page onStepChange={onStepChange} step={1} />)
      await userEvent.click(button('Skip'))
      expect(onStepChange).not.toHaveBeenCalled()
    })
  })

  describe('the target', () => {
    it('puts a spotlight around the target, with the padding', () => {
      const search = document.createElement('input')
      document.body.append(search)
      rectOf(search, { height: 30, left: 40, top: 20, width: 100 })
      render(<Tour defaultOpen spotlightPadding={4} steps={[{ target: search, title: 'Search' }]} />)
      expect(spotlight()).toHaveStyle({ height: '38px', left: '36px', top: '16px', width: '108px' })
      search.remove()
    })

    it('takes a selector, an element or a ref', () => {
      function WithRef(): React.ReactNode {
        const ref = useRef<HTMLButtonElement>(null)
        return (
          <>
            <button ref={ref}>Anchor</button>
            <Tour defaultOpen steps={[{ target: ref, title: 'Ref' }]} />
          </>
        )
      }
      const { unmount } = render(<WithRef />)
      expect(spotlight()).toBeInTheDocument()
      unmount()

      render(<Page steps={[{ target: document.body, title: 'Element' }]} />)
      expect(spotlight()).toBeInTheDocument()
    })

    it('follows the target when the page scrolls or resizes', () => {
      render(<Page />)
      const search = document.getElementById('search') as HTMLElement
      rectOf(search, { height: 10, left: 5, top: 50, width: 60 })
      act(() => {
        window.dispatchEvent(new Event('scroll'))
      })
      expect(spotlight()).toHaveStyle({ top: '44px', left: '-1px' })
      rectOf(search, { height: 10, left: 5, top: 70, width: 60 })
      act(() => {
        window.dispatchEvent(new Event('resize'))
      })
      expect(spotlight()).toHaveStyle({ top: '64px' })
    })

    it('moves the spotlight to the target of the next step', async () => {
      render(<Page />)
      rectOf(document.getElementById('create') as HTMLElement, { height: 10, left: 90, top: 90, width: 10 })
      await userEvent.click(button('Next'))
      expect(spotlight()).toHaveStyle({ left: '84px', top: '84px' })
    })

    it('shows a step with no target, or whose target is not in the page, centered and with the page dimmed', () => {
      const { unmount } = render(<Tour defaultOpen steps={[{ title: 'Welcome' }]} />)
      expect(spotlight()).toBeNull()
      expect(panel()).toHaveAttribute('data-centered', '')
      expect(panel()).toHaveStyle({ position: 'fixed' })
      expect(blocker()).toHaveClass('dim')
      unmount()

      const missing = render(<Tour defaultOpen steps={[{ target: '#missing', title: 'Missing' }]} />)
      expect(spotlight()).toBeNull()
      expect(panel()).toHaveAttribute('data-centered', '')
      missing.unmount()

      render(<Tour defaultOpen steps={[{ target: '[', title: 'Invalid' }]} />)
      expect(panel()).toHaveAttribute('data-centered', '')
    })

    it('scrolls the target into view', () => {
      const scrollIntoView = vi.fn()
      Element.prototype.scrollIntoView = scrollIntoView
      render(<Page />)
      expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'center', inline: 'nearest' })
      delete (Element.prototype as Partial<Element>).scrollIntoView
    })

    it('scrolls without animation when the user asks for less motion', () => {
      const scrollIntoView = vi.fn()
      Element.prototype.scrollIntoView = scrollIntoView
      vi.stubGlobal(
        'matchMedia',
        vi.fn().mockReturnValue({ matches: true }),
      )
      render(<Page />)
      expect(scrollIntoView).toHaveBeenCalledWith(expect.objectContaining({ behavior: 'auto' }))
      vi.unstubAllGlobals()
      delete (Element.prototype as Partial<Element>).scrollIntoView
    })

    it('opens on the side of the step, or on the one of the tour', () => {
      const { unmount } = render(<Page placement="bottom-end" />)
      expect(panel()).toHaveAttribute('data-placement', 'bottom-end')
      unmount()

      render(<Page steps={[{ placement: 'bottom-start', target: '#search', title: 'Search' }]} />)
      expect(panel()).toHaveAttribute('data-placement', 'bottom-start')
    })
  })

  describe('blocking the page', () => {
    it('blocks the page and the scroll, as a modal', () => {
      render(<Page />)
      expect(panel()).toHaveAttribute('aria-modal', 'true')
      expect(document.body).toHaveStyle({ overflow: 'hidden' })
      expect(blocker().style.clipPath).toBe('')
    })

    it('lets the user use the target of an interactive step', () => {
      render(
        <Page steps={[{ interactive: true, target: '#search', title: 'Type here' }]} />,
      )
      expect(panel()).not.toHaveAttribute('aria-modal')
      expect(document.body).not.toHaveStyle({ overflow: 'hidden' })
      expect(blocker().style.clipPath).toContain('polygon(')
    })

    it('blocks an interactive step that has no target to use', () => {
      render(<Tour defaultOpen steps={[{ interactive: true, title: 'Welcome' }]} />)
      expect(panel()).toHaveAttribute('aria-modal', 'true')
      expect(document.body).toHaveStyle({ overflow: 'hidden' })
    })

    it('releases the scroll when it closes', async () => {
      render(<Page />)
      await userEvent.click(button('Skip'))
      expect(document.body).not.toHaveStyle({ overflow: 'hidden' })
    })
  })

  describe('focus', () => {
    it('moves the focus to the panel, on every step, and gives it back when it closes', async () => {
      function Opener(): React.ReactNode {
        const [open, setOpen] = useState(false)
        return (
          <>
            <button onClick={() => setOpen(true)}>Start</button>
            <Page defaultOpen={undefined} onOpenChange={setOpen} open={open} />
          </>
        )
      }
      render(<Opener />)
      const start = screen.getByText('Start')
      start.focus()
      await userEvent.click(start)
      expect(panel()).toHaveFocus()

      await userEvent.click(button('Next'))
      expect(panel()).toHaveFocus()

      await userEvent.keyboard('{Escape}')
      expect(start).toHaveFocus()
    })

    it('keeps Tab inside the panel', async () => {
      render(<Page />)
      await userEvent.tab()
      expect(button('Skip')).toHaveFocus()
      await userEvent.tab()
      expect(button('Next')).toHaveFocus()
      await userEvent.tab()
      expect(button('Skip')).toHaveFocus()
      await userEvent.tab({ shift: true })
      expect(button('Next')).toHaveFocus()
    })

    it('lets Tab leave the panel on an interactive step', async () => {
      render(
        <Page steps={[{ interactive: true, target: '#search', title: 'Type here' }]} />,
      )
      expect(panel()).toHaveFocus()
      await userEvent.tab({ shift: true })
      expect(document.getElementById('profile')).toHaveFocus()
    })
  })

  describe('texts', () => {
    it('takes the texts of the LocaleProvider', () => {
      render(
        <LocaleProvider
          locale="es"
          messages={{
            tour: {
              next: 'Siguiente',
              progress: (current, total) => `Paso ${current} de ${total}`,
              skip: 'Omitir',
            },
          }}
        >
          <Page />
        </LocaleProvider>,
      )
      expect(button('Siguiente')).toBeInTheDocument()
      expect(button('Omitir')).toBeInTheDocument()
      expect(panel()).toHaveTextContent('Paso 1 de 3')
    })

    it('writes the progress with the digits of the locale', () => {
      render(
        <LocaleProvider locale="ar-EG">
          <Page />
        </LocaleProvider>,
      )
      expect(panel()).toHaveTextContent('Step ١ of ٣')
    })

    it('shows the previous and done texts', () => {
      render(
        <LocaleProvider messages={{ tour: { done: 'Finish', previous: 'Back' } }}>
          <Page defaultStep={2} />
        </LocaleProvider>,
      )
      expect(button('Finish')).toBeInTheDocument()
      expect(button('Back')).toBeInTheDocument()
    })
  })

  describe('right to left', () => {
    it('works with the text running right to left', async () => {
      document.documentElement.dir = 'rtl'
      render(<Page />)
      await userEvent.click(button('Next'))
      expect(panel()).toHaveAccessibleName('Create')
    })
  })

  describe('styling', () => {
    it('applies the classes of the panel, the size and the variant', () => {
      render(<Page size="lg" variant="outline" />)
      expect(panel()).toHaveClass('panel', 'lg', 'outline')
      expect(document.querySelector('[data-loica-tour]')).toHaveClass('tour')
    })

    it('exposes the color scheme as a CSS variable, which the style can override', () => {
      const { unmount } = render(<Page colorScheme="success" />)
      expect(document.querySelector('[data-loica-tour]')).toHaveStyle(
        '--tour-solid: var(--loica-color-success-solid)',
      )
      unmount()

      render(<Page style={{ '--tour-solid': 'red' } as React.CSSProperties} />)
      expect(document.querySelector('[data-loica-tour]')).toHaveStyle('--tour-solid: red')
    })

    it('keeps the custom className and forwards the ref to the root', () => {
      const ref = createRef<HTMLDivElement>()
      render(<Page className="custom" ref={ref} />)
      expect(ref.current).toBe(document.querySelector('[data-loica-tour]'))
      expect(ref.current).toHaveClass('tour', 'custom')
    })

    it('drops the Loica classes when unstyled, buttons included', () => {
      render(<Page variant="unstyled" />)
      expect(panel()).not.toHaveAttribute('class')
      expect(document.querySelector('[data-loica-tour]')).not.toHaveClass('tour')
      expect(blocker()).not.toHaveAttribute('class')
      expect(spotlight()).not.toHaveAttribute('class')
      expect(button('Next')).not.toHaveClass('button')
      expect(button('Skip')).not.toHaveClass('button')
    })
  })
})

describe('Tour parts', () => {
  function Composed(props: Readonly<Partial<TourProps>>): React.ReactNode {
    return (
      <Page {...props}>
        <TourSpotlight className="ring" data-testid="ring" />
        <TourPanel className="box" data-testid="box">
          <TourTitle className="heading" />
          <TourContent className="text" />
          <TourProgress className="count" />
          <TourSkip className="skip">Omit</TourSkip>
          <TourPrevious className="back" />
          <TourNext className="go" />
        </TourPanel>
      </Page>
    )
  }

  it('take their class, and the spotlight and the panel their ref and attributes', () => {
    render(<Composed />)
    expect(screen.getByTestId('ring')).toHaveClass('spotlight', 'ring')
    expect(screen.getByTestId('box')).toHaveClass('panel', 'box')
    expect(screen.getByText('Search')).toHaveClass('title', 'heading')
    expect(screen.getByText('Find a project by its name.')).toHaveClass('content', 'text')
    expect(screen.getByText('Step 1 of 3')).toHaveClass('progress', 'count')
    expect(screen.getByRole('button', { name: 'Omit' })).toHaveClass('skip')
  })

  it('forward their refs', () => {
    const panelRef = createRef<HTMLDialogElement>()
    const titleRef = createRef<HTMLDivElement>()
    const nextRef = createRef<HTMLButtonElement>()
    render(
      <Tour defaultOpen steps={steps}>
        <TourPanel ref={panelRef}>
          <TourTitle ref={titleRef} />
          <TourNext ref={nextRef} />
        </TourPanel>
      </Tour>,
    )
    expect(panelRef.current).toBe(panel())
    expect(titleRef.current).toBe(screen.getByText('Search'))
    expect(nextRef.current).toBe(button('Next'))
  })

  it('render a button with the text they are given, and run its own click before the action', async () => {
    const onClick = vi.fn()
    render(
      <Tour defaultOpen steps={steps}>
        <TourPanel>
          <TourTitle />
          <TourNext onClick={onClick}>Go on</TourNext>
        </TourPanel>
      </Tour>,
    )
    await userEvent.click(button('Go on'))
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(panel()).toHaveAccessibleName('Create')
  })

  it('leave the action to the app when the click is prevented', async () => {
    render(
      <Tour defaultOpen steps={steps}>
        <TourPanel>
          <TourTitle />
          <TourNext onClick={(event) => event.preventDefault()} />
        </TourPanel>
      </Tour>,
    )
    await userEvent.click(button('Next'))
    expect(panel()).toHaveAccessibleName('Search')
  })

  it('go back through the previous button', async () => {
    render(
      <Tour defaultStep={1} defaultOpen steps={steps}>
        <TourPanel>
          <TourTitle />
          <TourPrevious />
        </TourPanel>
      </Tour>,
    )
    await userEvent.click(button('Previous'))
    expect(panel()).toHaveAccessibleName('Search')
  })

  it('lets the buttons take their own variant', () => {
    render(
      <Tour defaultOpen steps={steps}>
        <TourPanel>
          <TourTitle />
          <TourNext variant="outline" />
        </TourPanel>
      </Tour>,
    )
    expect(button('Next')).toHaveClass('outline')
  })

  it('throw outside a Tour', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
    expect(() => render(<TourTitle />)).toThrow('TourTitle must be used within a <Tour>')
    expect(() => render(<TourPanel />)).toThrow('TourPanel must be used within a <Tour>')
  })
})
