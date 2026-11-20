import { fireEvent, render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { createRef } from 'react'
import { LocaleProvider } from '../../../../locale'
import { Splitter, SplitterHandle, SplitterPanel, type SplitterProps } from '..'

const handles = (): HTMLElement[] => screen.getAllByRole('separator')
const handle = (index = 0): HTMLElement => handles()[index]
const panel = (name: string): HTMLElement => screen.getByText(name)
const grow = (name: string): string => panel(name).style.flexGrow

function Example(props: Readonly<Partial<SplitterProps>>): React.ReactNode {
  return (
    <Splitter aria-label="Layout" defaultSizes={[30, 70]} {...props}>
      <SplitterPanel>Left</SplitterPanel>
      <SplitterPanel>Right</SplitterPanel>
    </Splitter>
  )
}

const measure = (total = 1000, panels = 2): void => {
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
    this: HTMLElement,
  ) {
    const size = this.hasAttribute('data-loica-splitter-panel') ? total / panels : 0
    return { height: size, width: size } as DOMRect
  })
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('Splitter component', () => {
  describe('structure', () => {
    it('renders the panels and adds a handle between them', () => {
      render(<Example />)
      expect(handles()).toHaveLength(1)
      expect(panel('Left')).toHaveAttribute('data-loica-splitter-panel')
      expect(handle()).toHaveAttribute('data-loica-splitter-handle')
    })

    it('adds a handle between every pair of panels that has none', () => {
      render(
        <Splitter>
          <SplitterPanel>A</SplitterPanel>
          <SplitterPanel>B</SplitterPanel>
          <SplitterPanel>C</SplitterPanel>
        </Splitter>,
      )
      expect(handles()).toHaveLength(2)
    })

    it('keeps the handles it is given and fills the missing ones', () => {
      render(
        <Splitter>
          <SplitterPanel>A</SplitterPanel>
          <SplitterHandle aria-label="First" />
          <SplitterPanel>B</SplitterPanel>
          <SplitterPanel>C</SplitterPanel>
        </Splitter>,
      )
      expect(handles()).toHaveLength(2)
      expect(handle(0)).toHaveAccessibleName('First')
    })

    it('drops a handle that is not between two panels', () => {
      render(
        <Splitter>
          <SplitterHandle />
          <SplitterPanel>A</SplitterPanel>
          <SplitterPanel>B</SplitterPanel>
          <SplitterHandle />
        </Splitter>,
      )
      expect(handles()).toHaveLength(1)
    })

    it('ignores what is not an element', () => {
      render(
        <Splitter>
          text
          {null}
          <SplitterPanel>A</SplitterPanel>
          <SplitterPanel>B</SplitterPanel>
        </Splitter>,
      )
      expect(handles()).toHaveLength(1)
    })

    it('forwards the ref, className, style and native attributes to the root', () => {
      const ref = createRef<HTMLDivElement>()
      render(<Splitter className="mine" data-testid="root" ref={ref} style={{ height: 10 }}>
          <SplitterPanel>Left</SplitterPanel>
          <SplitterPanel>Right</SplitterPanel>
        </Splitter>)
      const root = screen.getByTestId('root')
      expect(ref.current).toBe(root)
      expect(root).toHaveClass('mine')
      expect(root).toHaveStyle({ height: '10px' })
      expect(root).toHaveAttribute('data-orientation', 'horizontal')
      expect(root).toHaveAttribute('data-loica-splitter')
    })

    it('forwards the ref, className and attributes of a panel and a handle', () => {
      const panelRef = createRef<HTMLDivElement>()
      const handleRef = createRef<HTMLDivElement>()
      render(
        <Splitter>
          <SplitterPanel className="panel" data-testid="p" id="mine" ref={panelRef}>
            A
          </SplitterPanel>
          <SplitterHandle className="grip" data-testid="h" ref={handleRef} />
          <SplitterPanel>B</SplitterPanel>
        </Splitter>,
      )
      expect(panelRef.current).toBe(screen.getByTestId('p'))
      expect(screen.getByTestId('p')).toHaveClass('panel')
      expect(handleRef.current).toBe(screen.getByTestId('h'))
      expect(screen.getByTestId('h')).toHaveClass('grip')
      expect(screen.getByTestId('h')).toHaveAttribute('aria-controls', 'mine')
    })

    it('keeps the limits out of the DOM', () => {
      render(
        <Splitter>
          <SplitterPanel collapsedSize={2} collapsible data-testid="p" maxSize={80} minSize={10}>
            A
          </SplitterPanel>
          <SplitterPanel>B</SplitterPanel>
        </Splitter>,
      )
      const element = screen.getByTestId('p')
      expect(element).not.toHaveAttribute('collapsible')
      expect(element).not.toHaveAttribute('minsize')
    })

    it('throws when a part is outside a Splitter', () => {
      vi.spyOn(console, 'error').mockImplementation(() => undefined)
      expect(() => render(<SplitterHandle />)).toThrow(
        'SplitterHandle must be used within a <Splitter>',
      )
      expect(() => render(<SplitterPanel />)).toThrow(
        'SplitterPanel must be used within a <Splitter>',
      )
    })
  })

  describe('sizes', () => {
    it('shares the space equally by default', () => {
      render(<Example defaultSizes={undefined} />)
      expect(grow('Left')).toBe('50')
      expect(grow('Right')).toBe('50')
    })

    it('starts at the default sizes', () => {
      render(<Example />)
      expect(grow('Left')).toBe('30')
      expect(grow('Right')).toBe('70')
    })

    it('scales sizes that do not add up to 100', () => {
      render(<Example defaultSizes={[1, 3]} />)
      expect(grow('Left')).toBe('25')
    })

    it('follows the sizes of a controlled splitter', () => {
      const { rerender } = render(<Example sizes={[20, 80]} />)
      expect(grow('Left')).toBe('20')
      rerender(<Example sizes={[60, 40]} />)
      expect(grow('Left')).toBe('60')
    })

    it('does not change a controlled splitter until the app does', async () => {
      const onSizesChange = vi.fn()
      render(<Example onSizesChange={onSizesChange} sizes={[30, 70]} />)
      handle().focus()
      await userEvent.keyboard('{ArrowRight}')
      expect(onSizesChange).toHaveBeenCalledWith([35, 65])
      expect(grow('Left')).toBe('30')
    })

    it('puts the size of the panel before the handle in its attributes', () => {
      render(<Example defaultSizes={[30.4, 69.6]} />)
      expect(handle()).toHaveAttribute('aria-valuenow', '30')
      expect(handle()).toHaveAttribute('aria-valuemin', '0')
      expect(handle()).toHaveAttribute('aria-valuemax', '100')
    })

    it('reports the limits as the range of the handle', () => {
      render(
        <Splitter defaultSizes={[30, 70]}>
          <SplitterPanel maxSize={60} minSize={10}>
            A
          </SplitterPanel>
          <SplitterPanel minSize={20}>B</SplitterPanel>
        </Splitter>,
      )
      expect(handle()).toHaveAttribute('aria-valuemin', '10')
      expect(handle()).toHaveAttribute('aria-valuemax', '60')
    })

    it('starts again from an equal share when the panels change', () => {
      const { rerender } = render(<Example />)
      rerender(
        <Splitter defaultSizes={[30, 70]}>
          <SplitterPanel>Left</SplitterPanel>
          <SplitterPanel>Middle</SplitterPanel>
          <SplitterPanel>Right</SplitterPanel>
        </Splitter>,
      )
      expect(grow('Middle')).toBe(String(100 / 3))
    })
  })

  describe('accessibility', () => {
    it('is a window splitter: a separator you can focus, with its value', () => {
      render(<Example />)
      expect(handle()).toHaveAttribute('role', 'separator')
      expect(handle()).toHaveAttribute('tabindex', '0')
      expect(handle()).toHaveAttribute('aria-orientation', 'vertical')
      expect(handle().getAttribute('aria-controls')).toBe(panel('Left').id)
    })

    it('has a horizontal separator for panels one under the other', () => {
      render(<Example orientation="vertical" />)
      expect(handle()).toHaveAttribute('aria-orientation', 'horizontal')
      expect(screen.getByLabelText('Layout')).toHaveAttribute('data-orientation', 'vertical')
    })

    it('has a name, and numbers the handles when there are several', () => {
      const { rerender } = render(<Example />)
      expect(handle()).toHaveAccessibleName('Resize panels')
      rerender(
        <Splitter>
          <SplitterPanel>A</SplitterPanel>
          <SplitterPanel>B</SplitterPanel>
          <SplitterPanel>C</SplitterPanel>
        </Splitter>,
      )
      expect(handle(0)).toHaveAccessibleName('Resize panels 1 of 2')
      expect(handle(1)).toHaveAccessibleName('Resize panels 2 of 2')
    })

    it('reads its name from the LocaleProvider, and the aria-label of the handle wins', () => {
      render(
        <LocaleProvider messages={{ splitter: { resize: () => 'Redimensionar' } }}>
          <Splitter>
            <SplitterPanel>A</SplitterPanel>
            <SplitterPanel>B</SplitterPanel>
            <SplitterHandle aria-label="Propio" />
            <SplitterPanel>C</SplitterPanel>
          </Splitter>
        </LocaleProvider>,
      )
      expect(handle(0)).toHaveAccessibleName('Redimensionar')
      expect(handle(1)).toHaveAccessibleName('Propio')
    })

    it('writes the counts of the name with the digits of the locale', () => {
      render(
        <LocaleProvider locale="ar-EG">
          <Splitter>
            <SplitterPanel>A</SplitterPanel>
            <SplitterPanel>B</SplitterPanel>
            <SplitterPanel>C</SplitterPanel>
          </Splitter>
        </LocaleProvider>,
      )
      expect(handle(0)).toHaveAccessibleName('Resize panels ١ of ٢')
    })
  })

  describe('keyboard', () => {
    it('moves the handle with the arrows of its direction', async () => {
      render(<Example />)
      handle().focus()
      await userEvent.keyboard('{ArrowRight}')
      expect(grow('Left')).toBe('35')
      await userEvent.keyboard('{ArrowLeft}{ArrowLeft}')
      expect(grow('Left')).toBe('25')
      await userEvent.keyboard('{ArrowDown}{ArrowUp}')
      expect(grow('Left')).toBe('25')
    })

    it('uses the up and down arrows when the panels are one under the other', async () => {
      render(<Example orientation="vertical" />)
      handle().focus()
      await userEvent.keyboard('{ArrowDown}')
      expect(grow('Left')).toBe('35')
      await userEvent.keyboard('{ArrowUp}{ArrowUp}')
      expect(grow('Left')).toBe('25')
      await userEvent.keyboard('{ArrowRight}')
      expect(grow('Left')).toBe('25')
    })

    it('takes its step from the prop', async () => {
      render(<Example step={1} />)
      handle().focus()
      await userEvent.keyboard('{ArrowRight}')
      expect(grow('Left')).toBe('31')
    })

    it('goes to the limits with Home and End', async () => {
      render(
        <Splitter defaultSizes={[30, 70]}>
          <SplitterPanel maxSize={60} minSize={10}>
            Left
          </SplitterPanel>
          <SplitterPanel>Right</SplitterPanel>
        </Splitter>,
      )
      handle().focus()
      await userEvent.keyboard('{End}')
      expect(grow('Left')).toBe('60')
      await userEvent.keyboard('{Home}')
      expect(grow('Left')).toBe('10')
    })

    it('stops at the limits', async () => {
      render(
        <Splitter defaultSizes={[30, 70]}>
          <SplitterPanel minSize={28}>Left</SplitterPanel>
          <SplitterPanel>Right</SplitterPanel>
        </Splitter>,
      )
      handle().focus()
      await userEvent.keyboard('{ArrowLeft}{ArrowLeft}')
      expect(grow('Left')).toBe('28')
    })

    it('reverses the arrows in right to left text', async () => {
      render(
        <div dir="rtl" style={{ direction: 'rtl' }}>
          <Example />
        </div>,
      )
      handle().focus()
      await userEvent.keyboard('{ArrowLeft}')
      expect(grow('Left')).toBe('35')
      await userEvent.keyboard('{ArrowRight}')
      expect(grow('Left')).toBe('30')
    })

    it('leaves the keys it does not use', () => {
      const onKeyDown = vi.fn()
      render(
        <Splitter defaultSizes={[30, 70]}>
          <SplitterPanel>Left</SplitterPanel>
          <SplitterHandle onKeyDown={onKeyDown} />
          <SplitterPanel>Right</SplitterPanel>
        </Splitter>,
      )
      handle().focus()
      const allowed = fireEvent.keyDown(handle(), { key: 'a' })
      expect(allowed).toBe(true)
      expect(onKeyDown).toHaveBeenCalled()
    })

    it('lets the handler of the handle stop the key', () => {
      render(
        <Splitter defaultSizes={[30, 70]}>
          <SplitterPanel>Left</SplitterPanel>
          <SplitterHandle onKeyDown={(event) => event.preventDefault()} />
          <SplitterPanel>Right</SplitterPanel>
        </Splitter>,
      )
      fireEvent.keyDown(handle(), { key: 'ArrowRight' })
      expect(grow('Left')).toBe('30')
    })

    it('calls onSizesChange and onResizeEnd with the new sizes', async () => {
      const onSizesChange = vi.fn()
      const onResizeEnd = vi.fn()
      render(<Example onResizeEnd={onResizeEnd} onSizesChange={onSizesChange} />)
      handle().focus()
      await userEvent.keyboard('{ArrowRight}')
      expect(onSizesChange).toHaveBeenCalledWith([35, 65])
      expect(onResizeEnd).toHaveBeenCalledWith([35, 65])
    })

    it('does not call onSizesChange when nothing moved', async () => {
      const onSizesChange = vi.fn()
      render(
        <Splitter defaultSizes={[30, 70]} onSizesChange={onSizesChange}>
          <SplitterPanel minSize={30}>Left</SplitterPanel>
          <SplitterPanel>Right</SplitterPanel>
        </Splitter>,
      )
      handle().focus()
      await userEvent.keyboard('{ArrowLeft}')
      expect(onSizesChange).not.toHaveBeenCalled()
    })
  })

  describe('pointer', () => {
    it('resizes by the distance the pointer moves, in percent of the panels', () => {
      measure(1000)
      render(<Example />)
      fireEvent.pointerDown(handle(), { button: 0, clientX: 300, pointerId: 1 })
      fireEvent.pointerMove(handle(), { clientX: 400, pointerId: 1 })
      expect(grow('Left')).toBe('40')
      expect(grow('Right')).toBe('60')
      fireEvent.pointerMove(handle(), { clientX: 250, pointerId: 1 })
      expect(grow('Left')).toBe('25')
    })

    it('measures from where the drag started, not from the last move', () => {
      measure(1000)
      render(<Example />)
      fireEvent.pointerDown(handle(), { button: 0, clientX: 300, pointerId: 1 })
      fireEvent.pointerMove(handle(), { clientX: 350, pointerId: 1 })
      fireEvent.pointerMove(handle(), { clientX: 400, pointerId: 1 })
      expect(grow('Left')).toBe('40')
    })

    it('uses the height when the panels are one under the other', () => {
      measure(1000)
      render(<Example orientation="vertical" />)
      fireEvent.pointerDown(handle(), { button: 0, clientX: 0, clientY: 300, pointerId: 1 })
      fireEvent.pointerMove(handle(), { clientX: 900, clientY: 400, pointerId: 1 })
      expect(grow('Left')).toBe('40')
    })

    it('goes the other way in right to left text', () => {
      measure(1000)
      render(
        <div dir="rtl" style={{ direction: 'rtl' }}>
          <Example />
        </div>,
      )
      fireEvent.pointerDown(handle(), { button: 0, clientX: 700, pointerId: 1 })
      fireEvent.pointerMove(handle(), { clientX: 600, pointerId: 1 })
      expect(grow('Left')).toBe('40')
    })

    it('stops at the limits of the panels', () => {
      measure(1000)
      render(
        <Splitter defaultSizes={[30, 70]}>
          <SplitterPanel maxSize={50} minSize={20}>
            Left
          </SplitterPanel>
          <SplitterPanel>Right</SplitterPanel>
        </Splitter>,
      )
      fireEvent.pointerDown(handle(), { button: 0, clientX: 300, pointerId: 1 })
      fireEvent.pointerMove(handle(), { clientX: 900, pointerId: 1 })
      expect(grow('Left')).toBe('50')
      fireEvent.pointerMove(handle(), { clientX: 0, pointerId: 1 })
      expect(grow('Left')).toBe('20')
    })

    it('marks the splitter and the handle while it drags, and calls onResizeEnd once at the end', () => {
      measure(1000)
      const onResizeEnd = vi.fn()
      render(<Example data-testid="root" onResizeEnd={onResizeEnd} />)
      fireEvent.pointerDown(handle(), { button: 0, clientX: 300, pointerId: 1 })
      expect(handle()).toHaveAttribute('data-dragging')
      expect(screen.getByTestId('root')).toHaveAttribute('data-dragging')
      fireEvent.pointerMove(handle(), { clientX: 400, pointerId: 1 })
      expect(onResizeEnd).not.toHaveBeenCalled()
      fireEvent.pointerUp(handle(), { pointerId: 1 })
      expect(handle()).not.toHaveAttribute('data-dragging')
      expect(screen.getByTestId('root')).not.toHaveAttribute('data-dragging')
      expect(onResizeEnd).toHaveBeenCalledTimes(1)
      expect(onResizeEnd).toHaveBeenCalledWith([40, 60])
    })

    it('ends a drag once, when the pointer is released and the capture is lost after it', () => {
      measure(1000)
      const onResizeEnd = vi.fn()
      render(<Example onResizeEnd={onResizeEnd} />)
      fireEvent.pointerDown(handle(), { button: 0, clientX: 300, pointerId: 1 })
      fireEvent.pointerUp(handle(), { pointerId: 1 })
      fireEvent.lostPointerCapture(handle(), { pointerId: 1 })
      expect(onResizeEnd).toHaveBeenCalledTimes(1)
    })

    it('does not report an end without a drag', () => {
      const onResizeEnd = vi.fn()
      render(<Example onResizeEnd={onResizeEnd} />)
      fireEvent.lostPointerCapture(handle(), { pointerId: 1 })
      fireEvent.pointerUp(handle(), { pointerId: 1 })
      expect(onResizeEnd).not.toHaveBeenCalled()
    })

    it('ends when the pointer is cancelled or the capture is lost', () => {
      measure(1000)
      const onResizeEnd = vi.fn()
      render(<Example onResizeEnd={onResizeEnd} />)
      fireEvent.pointerDown(handle(), { button: 0, clientX: 300, pointerId: 1 })
      fireEvent.pointerCancel(handle(), { pointerId: 1 })
      expect(onResizeEnd).toHaveBeenCalledTimes(1)
      fireEvent.pointerDown(handle(), { button: 0, clientX: 300, pointerId: 1 })
      fireEvent.lostPointerCapture(handle(), { pointerId: 1 })
      expect(onResizeEnd).toHaveBeenCalledTimes(2)
    })

    it('releases the pointer it captured', () => {
      measure(1000)
      const capture = vi.fn()
      const release = vi.fn()
      render(<Example />)
      Object.assign(handle(), {
        hasPointerCapture: () => true,
        releasePointerCapture: release,
        setPointerCapture: capture,
      })
      fireEvent.pointerDown(handle(), { button: 0, clientX: 300, pointerId: 7 })
      expect(capture).toHaveBeenCalledWith(7)
      fireEvent.pointerUp(handle(), { pointerId: 7 })
      expect(release).toHaveBeenCalledWith(7)
    })

    it('ignores a move without a press, and other buttons', () => {
      measure(1000)
      render(<Example />)
      fireEvent.pointerMove(handle(), { clientX: 400, pointerId: 1 })
      expect(grow('Left')).toBe('30')
      fireEvent.pointerDown(handle(), { button: 2, clientX: 300, pointerId: 1 })
      fireEvent.pointerMove(handle(), { clientX: 400, pointerId: 1 })
      expect(grow('Left')).toBe('30')
      expect(handle()).not.toHaveAttribute('data-dragging')
    })

    it('does not start without a size to measure', () => {
      render(<Example />)
      fireEvent.pointerDown(handle(), { button: 0, clientX: 300, pointerId: 1 })
      expect(handle()).not.toHaveAttribute('data-dragging')
    })

    it('lets the handlers of the handle run, and stop the drag', () => {
      measure(1000)
      const onPointerDown = vi.fn((event: React.PointerEvent) => event.preventDefault())
      const onPointerMove = vi.fn()
      render(
        <Splitter defaultSizes={[30, 70]}>
          <SplitterPanel>Left</SplitterPanel>
          <SplitterHandle onPointerDown={onPointerDown} onPointerMove={onPointerMove} />
          <SplitterPanel>Right</SplitterPanel>
        </Splitter>,
      )
      fireEvent.pointerDown(handle(), { button: 0, clientX: 300, pointerId: 1 })
      fireEvent.pointerMove(handle(), { clientX: 400, pointerId: 1 })
      expect(onPointerDown).toHaveBeenCalled()
      expect(onPointerMove).toHaveBeenCalled()
      expect(grow('Left')).toBe('30')
    })

    it('resizes the pair of the handle that moves', () => {
      measure(900, 3)
      render(
        <Splitter defaultSizes={[20, 30, 50]}>
          <SplitterPanel>A</SplitterPanel>
          <SplitterPanel>B</SplitterPanel>
          <SplitterPanel>C</SplitterPanel>
        </Splitter>,
      )
      fireEvent.pointerDown(handle(1), { button: 0, clientX: 500, pointerId: 1 })
      fireEvent.pointerMove(handle(1), { clientX: 590, pointerId: 1 })
      expect(grow('A')).toBe('20')
      expect(grow('B')).toBe('40')
      expect(grow('C')).toBe('40')
    })
  })

  describe('disabled', () => {
    it('keeps the handle from resizing and from taking the focus', () => {
      measure(1000)
      render(
        <Splitter defaultSizes={[30, 70]}>
          <SplitterPanel>Left</SplitterPanel>
          <SplitterHandle disabled />
          <SplitterPanel>Right</SplitterPanel>
        </Splitter>,
      )
      expect(handle()).toHaveAttribute('aria-disabled', 'true')
      expect(handle()).toHaveAttribute('data-disabled')
      expect(handle()).not.toHaveAttribute('tabindex')
      fireEvent.pointerDown(handle(), { button: 0, clientX: 300, pointerId: 1 })
      fireEvent.pointerMove(handle(), { clientX: 400, pointerId: 1 })
      fireEvent.keyDown(handle(), { key: 'ArrowRight' })
      fireEvent.doubleClick(handle())
      expect(grow('Left')).toBe('30')
    })
  })

  describe('collapsing', () => {
    function Collapsible(props: Readonly<Partial<SplitterProps>>): React.ReactNode {
      return (
        <Splitter defaultSizes={[30, 70]} {...props}>
          <SplitterPanel collapsible minSize={20}>
            Left
          </SplitterPanel>
          <SplitterPanel>Right</SplitterPanel>
        </Splitter>
      )
    }

    it('collapses with Enter and opens at the size it had', async () => {
      render(<Collapsible defaultSizes={[35, 65]} />)
      handle().focus()
      await userEvent.keyboard('{Enter}')
      expect(grow('Left')).toBe('0')
      expect(panel('Left')).toHaveAttribute('data-collapsed')
      expect(panel('Left')).toHaveStyle({ visibility: 'hidden' })
      await userEvent.keyboard('{Enter}')
      expect(grow('Left')).toBe('35')
      expect(panel('Left')).not.toHaveAttribute('data-collapsed')
    })

    it('collapses and opens with a double click', () => {
      render(<Collapsible />)
      fireEvent.doubleClick(handle())
      expect(grow('Left')).toBe('0')
      fireEvent.doubleClick(handle())
      expect(grow('Left')).toBe('30')
    })

    it('lets a handler of the handle stop the double click', () => {
      render(
        <Splitter defaultSizes={[30, 70]}>
          <SplitterPanel collapsible>Left</SplitterPanel>
          <SplitterHandle onDoubleClick={(event) => event.preventDefault()} />
          <SplitterPanel>Right</SplitterPanel>
        </Splitter>,
      )
      fireEvent.doubleClick(handle())
      expect(grow('Left')).toBe('30')
    })

    it('opens to an equal share, or to its minimum when that is more, if it never had a size', async () => {
      const { unmount } = render(<Collapsible defaultSizes={[0, 100]} />)
      handle().focus()
      await userEvent.keyboard('{Enter}')
      expect(grow('Left')).toBe('50')
      unmount()
      render(
        <Splitter defaultSizes={[0, 100]}>
          <SplitterPanel collapsible minSize={60}>
            Left
          </SplitterPanel>
          <SplitterPanel>Right</SplitterPanel>
        </Splitter>,
      )
      handle().focus()
      await userEvent.keyboard('{Enter}')
      expect(grow('Left')).toBe('60')
    })

    it('collapses the second panel when only that one can', async () => {
      render(
        <Splitter defaultSizes={[70, 30]}>
          <SplitterPanel>Left</SplitterPanel>
          <SplitterPanel collapsible>Right</SplitterPanel>
        </Splitter>,
      )
      handle().focus()
      await userEvent.keyboard('{Enter}')
      expect(grow('Right')).toBe('0')
      expect(grow('Left')).toBe('100')
      await userEvent.keyboard('{Enter}')
      expect(grow('Right')).toBe('30')
    })

    it('does nothing with Enter when neither panel can collapse', async () => {
      render(<Example />)
      handle().focus()
      await userEvent.keyboard('{Enter}')
      fireEvent.doubleClick(handle())
      expect(grow('Left')).toBe('30')
    })

    it('keeps a rail visible with a collapsed size', async () => {
      render(
        <Splitter defaultSizes={[30, 70]}>
          <SplitterPanel collapsedSize={5} collapsible>
            Left
          </SplitterPanel>
          <SplitterPanel>Right</SplitterPanel>
        </Splitter>,
      )
      handle().focus()
      await userEvent.keyboard('{Enter}')
      expect(grow('Left')).toBe('5')
      expect(panel('Left')).toHaveAttribute('data-collapsed')
      expect(panel('Left').style.visibility).toBe('')
    })

    it('collapses when dragged under half of its minimum, and opens when dragged back', () => {
      measure(1000)
      render(<Collapsible />)
      fireEvent.pointerDown(handle(), { button: 0, clientX: 300, pointerId: 1 })
      fireEvent.pointerMove(handle(), { clientX: 80, pointerId: 1 })
      expect(grow('Left')).toBe('0')
      fireEvent.pointerMove(handle(), { clientX: 120, pointerId: 1 })
      expect(grow('Left')).toBe('20')
      fireEvent.pointerUp(handle(), { pointerId: 1 })
    })

    it('does not collapse a panel with the arrows', async () => {
      render(<Collapsible defaultSizes={[20, 80]} />)
      handle().focus()
      await userEvent.keyboard('{ArrowLeft}{ArrowLeft}')
      expect(grow('Left')).toBe('20')
    })
  })

  describe('variants', () => {
    it('adds the classes of the variant to the handle', () => {
      const { rerender } = render(<Example />)
      expect(handle().className).toContain('handle')
      expect(handle().className).toContain('line')
      rerender(<Example variant="bar" />)
      expect(handle().className).toContain('bar')
    })

    it('drops every class of Loica when it is unstyled, and keeps the structure data', () => {
      render(
        <Splitter className="mine" data-testid="root" defaultSizes={[30, 70]} variant="unstyled">
          <SplitterPanel>Left</SplitterPanel>
          <SplitterHandle className="grip" />
          <SplitterPanel>Right</SplitterPanel>
        </Splitter>,
      )
      expect(screen.getByTestId('root').className).toBe('mine')
      expect(handle().className).toBe('grip')
      expect(handle()).toHaveAttribute('data-loica-splitter-handle')
    })

    it('colors the handle with a scheme of the theme', () => {
      render(<Example colorScheme="error" data-testid="root" />)
      expect(screen.getByTestId('root').style.getPropertyValue('--splitter-active')).toContain(
        'error',
      )
    })
  })
})
