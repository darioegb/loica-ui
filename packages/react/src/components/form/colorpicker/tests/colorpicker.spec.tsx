import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { createRef, useState } from 'react'
import { LocaleProvider } from '../../../../locale/locale-provider'
import { Field } from '../../field'
import {
  ColorPicker,
  ColorPickerAlpha,
  ColorPickerArea,
  ColorPickerChannels,
  ColorPickerEyeDropper,
  ColorPickerHue,
  ColorPickerInput,
  ColorPickerPanel,
  ColorPickerSwatches,
  type ColorPickerProps,
} from '..'

const field = (): HTMLInputElement => {
  const element = document.querySelector<HTMLInputElement>('[data-loica-colorpicker-field]')
  if (!element) throw new Error('The field is not in the page')
  return element
}
const trigger = (): HTMLElement => screen.getByRole('button', { name: 'Open color picker' })
const area = (): HTMLElement => screen.getByRole('slider', { name: 'Saturation and brightness' })
const slider = (name: string): HTMLInputElement =>
  screen.getByRole<HTMLInputElement>('slider', { name: new RegExp(`^${name}$`) })
const channel = (name: string): HTMLInputElement =>
  screen.getAllByLabelText(name).find((element) => element.getAttribute('type') !== 'range') as HTMLInputElement

const type = async (input: HTMLElement, text: string): Promise<void> => {
  await userEvent.clear(input)
  await userEvent.type(input, text)
}

const box = { bottom: 100, height: 100, left: 0, right: 100, top: 0, width: 100, x: 0, y: 0 }

function Controlled(props: Readonly<Partial<ColorPickerProps> & { start?: string }>): React.ReactNode {
  const { start = '#ff0000', ...rest } = props
  const [value, setValue] = useState(start)
  return (
    <>
      <ColorPicker {...rest} onValueChange={setValue} value={value} />
      <output data-testid="value">{value}</output>
      <button onClick={() => setValue('#0000ff')} type="button">
        Blue
      </button>
    </>
  )
}

afterEach(() => {
  Reflect.deleteProperty(window, 'EyeDropper')
})

describe('ColorPicker component', () => {
  describe('rendering', () => {
    it('renders a text field with the color in the format, and a button that opens the panel', () => {
      render(<ColorPicker aria-label="Brand" defaultValue="#F00" />)
      expect(field()).toHaveValue('#ff0000')
      expect(field()).toHaveAccessibleName('Brand')
      expect(trigger()).toHaveAttribute('aria-haspopup', 'dialog')
      expect(trigger()).toHaveAttribute('aria-expanded', 'false')
    })

    it('shows nothing, and an empty preview, when there is no color', () => {
      render(<ColorPicker aria-label="Brand" placeholder="Pick a color" />)
      expect(field()).toHaveValue('')
      expect(field()).toHaveAttribute('placeholder', 'Pick a color')
      expect(trigger().querySelector('[data-loica-colorpicker-preview]')).toHaveAttribute('data-empty')
    })

    it('writes the color in the format of the picker, whatever it is given in', () => {
      const { rerender } = render(<ColorPicker aria-label="Brand" defaultValue="hsl(0, 100%, 50%)" format="rgb" />)
      expect(field()).toHaveValue('rgb(255, 0, 0)')
      rerender(<ColorPicker aria-label="Brand" defaultValue="hsl(0, 100%, 50%)" format="hsl" />)
      expect(field()).toHaveValue('hsl(0, 100%, 50%)')
    })

    it('leaves the opacity out unless it has alpha', () => {
      render(<ColorPicker aria-label="Brand" defaultValue="#ff000080" />)
      expect(field()).toHaveValue('#ff0000')
    })

    it('keeps the opacity with alpha', () => {
      render(<ColorPicker alpha aria-label="Brand" defaultValue="#ff000080" />)
      expect(field()).toHaveValue('#ff000080')
    })

    it('forwards the ref to the input, and puts the class and style on the root', () => {
      const ref = createRef<HTMLInputElement>()
      const { container } = render(
        <ColorPicker aria-label="Brand" className="mine" ref={ref} style={{ margin: '3px' }} />,
      )
      expect(ref.current).toBe(field())
      expect(container.firstElementChild).toHaveClass('mine')
      expect(container.firstElementChild).toHaveStyle({ margin: '3px' })
    })

    it('has the name and the attributes of a native input', () => {
      render(<ColorPicker aria-invalid disabled={false} aria-label="Brand" id="brand" name="brand" required />)
      expect(field()).toHaveAttribute('name', 'brand')
      expect(field()).toHaveAttribute('id', 'brand')
      expect(field()).toBeRequired()
      expect(field()).toBeInvalid()
    })

    it('is named by a Field', () => {
      render(
        <Field label="Brand color">
          <ColorPicker />
        </Field>,
      )
      expect(screen.getByLabelText('Brand color')).toBe(field())
    })

    it('submits the color with its name', () => {
      const { container } = render(
        <form>
          <ColorPicker aria-label="Brand" defaultValue="#00ff00" name="brand" />
        </form>,
      )
      expect(new FormData(container.querySelector('form') as HTMLFormElement).get('brand')).toBe('#00ff00')
    })

    it('drops the Loica classes when it is unstyled', async () => {
      const { container } = render(<ColorPicker aria-label="Brand" className="mine" defaultValue="#f00" variant="unstyled" />)
      await userEvent.click(trigger())
      expect(container.querySelector('[data-loica-colorpicker-preview]')).not.toHaveClass('preview')
      expect(area()).not.toHaveClass('area')
      expect(screen.getByRole('dialog')).not.toHaveClass('panel')
    })

    it('has the Loica classes in the other variants', async () => {
      render(<ColorPicker aria-label="Brand" defaultValue="#f00" variant="filled" />)
      await userEvent.click(trigger())
      expect(area()).toHaveClass('area')
      expect(screen.getByRole('dialog')).toHaveClass('panel')
    })
  })

  describe('the field', () => {
    it('takes a typed color when it loses the focus', async () => {
      const onValueChange = vi.fn()
      render(<ColorPicker aria-label="Brand" onValueChange={onValueChange} />)
      await type(field(), '#00FF00')
      expect(onValueChange).not.toHaveBeenCalled()
      await userEvent.tab()
      expect(onValueChange).toHaveBeenCalledOnce()
      expect(onValueChange).toHaveBeenCalledWith('#00ff00')
      expect(field()).toHaveValue('#00ff00')
    })

    it('takes a typed color with Enter', async () => {
      const onValueChange = vi.fn()
      render(<ColorPicker aria-label="Brand" onValueChange={onValueChange} />)
      await type(field(), '0000ff{Enter}')
      expect(onValueChange).toHaveBeenCalledWith('#0000ff')
    })

    it('reads a color in any format and writes it in its own', async () => {
      const onValueChange = vi.fn()
      render(<ColorPicker aria-label="Brand" format="rgb" onValueChange={onValueChange} />)
      await type(field(), 'hsl(120, 100%, 50%){Enter}')
      expect(onValueChange).toHaveBeenCalledWith('rgb(0, 255, 0)')
      expect(field()).toHaveValue('rgb(0, 255, 0)')
    })

    it('goes back to the color when what is typed is not one', async () => {
      const onValueChange = vi.fn()
      render(<ColorPicker aria-label="Brand" defaultValue="#ff0000" onValueChange={onValueChange} />)
      await type(field(), 'banana')
      await userEvent.tab()
      expect(onValueChange).not.toHaveBeenCalled()
      expect(field()).toHaveValue('#ff0000')
    })

    it('clears the color when it is emptied', async () => {
      const onValueChange = vi.fn()
      render(<ColorPicker aria-label="Brand" defaultValue="#ff0000" onValueChange={onValueChange} />)
      await userEvent.clear(field())
      await userEvent.tab()
      expect(onValueChange).toHaveBeenCalledWith('')
      expect(field()).toHaveValue('')
    })

    it('does not call back when the color does not change', async () => {
      const onValueChange = vi.fn()
      render(<ColorPicker aria-label="Brand" defaultValue="#ff0000" onValueChange={onValueChange} />)
      await type(field(), '#F00{Enter}')
      expect(onValueChange).not.toHaveBeenCalled()
    })

    it('does nothing on blur when nothing was typed', async () => {
      const onValueChange = vi.fn()
      render(<ColorPicker aria-label="Brand" defaultValue="#ff0000" onValueChange={onValueChange} />)
      field().focus()
      await userEvent.tab()
      expect(onValueChange).not.toHaveBeenCalled()
    })
  })

  describe('controlled', () => {
    it('follows the value', async () => {
      render(<Controlled aria-label="Brand" />)
      expect(field()).toHaveValue('#ff0000')
      await userEvent.click(screen.getByRole('button', { name: 'Blue' }))
      expect(field()).toHaveValue('#0000ff')
    })

    it('goes back when the parent does not take the change', async () => {
      render(<ColorPicker aria-label="Brand" onValueChange={vi.fn()} value="#ff0000" />)
      await type(field(), '#00ff00{Enter}')
      expect(field()).toHaveValue('#ff0000')
    })

    it('keeps the hue when the color is a gray, which has none', async () => {
      render(<Controlled aria-label="Brand" />)
      await userEvent.click(trigger())
      fireEvent.change(slider('Hue'), { target: { value: '200' } })
      await type(field(), '#808080{Enter}')
      expect(slider('Hue').value).toBe('200')
    })

    it('shows nothing for a value that is not a color', () => {
      render(<ColorPicker aria-label="Brand" onValueChange={vi.fn()} value="banana" />)
      expect(field()).toHaveValue('')
    })
  })

  describe('the popup', () => {
    it('opens with the trigger, names itself and takes the focus into the area', async () => {
      render(<ColorPicker aria-label="Brand" defaultValue="#ff0000" />)
      expect(screen.queryByRole('dialog')).toBeNull()
      await userEvent.click(trigger())
      expect(screen.getByRole('dialog', { name: 'Color picker' })).toBeInTheDocument()
      expect(trigger()).toHaveAttribute('aria-expanded', 'true')
      expect(trigger()).toHaveAttribute('aria-controls', screen.getByRole('dialog').id)
      expect(area()).toHaveFocus()
    })

    it('closes with the trigger', async () => {
      render(<ColorPicker aria-label="Brand" />)
      await userEvent.click(trigger())
      await userEvent.click(trigger())
      expect(screen.queryByRole('dialog')).toBeNull()
    })

    it('closes with Escape and gives the focus back to the field', async () => {
      render(<ColorPicker aria-label="Brand" />)
      await userEvent.click(trigger())
      await userEvent.keyboard('{Escape}')
      expect(screen.queryByRole('dialog')).toBeNull()
      expect(field()).toHaveFocus()
    })

    it('closes on a press outside', async () => {
      render(
        <>
          <button type="button">Outside</button>
          <ColorPicker aria-label="Brand" />
        </>,
      )
      await userEvent.click(trigger())
      await userEvent.click(screen.getByRole('button', { name: 'Outside' }))
      await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    })

    it('closes when the focus leaves it', async () => {
      render(
        <>
          <ColorPicker aria-label="Brand" />
          <button type="button">Next</button>
        </>,
      )
      await userEvent.click(trigger())
      fireEvent.blur(field(), { relatedTarget: screen.getByRole('button', { name: 'Next' }) })
      expect(screen.queryByRole('dialog')).toBeNull()
    })

    it('stays open while the focus moves inside', async () => {
      render(<ColorPicker aria-label="Brand" />)
      await userEvent.click(trigger())
      fireEvent.blur(field(), { relatedTarget: area() })
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it.each([['disabled'], ['readOnly']])('does not open when it is %s', async (prop) => {
      render(<ColorPicker aria-label="Brand" {...{ [prop]: true }} />)
      expect(trigger()).toBeDisabled()
      await userEvent.click(trigger())
      expect(screen.queryByRole('dialog')).toBeNull()
    })

    it('is always in the page, as a group, with the `panel` prop and no field', () => {
      render(<ColorPicker aria-label="Brand" defaultValue="#ff0000" panel />)
      expect(screen.queryByRole('textbox', { name: 'Brand' })).toBeNull()
      expect(screen.queryByRole('button', { name: 'Open color picker' })).toBeNull()
      expect(screen.getByRole('group', { name: 'Color picker' })).toBeInTheDocument()
      expect(area()).toBeInTheDocument()
    })

    it('has no Loica class for the inline panel when it is unstyled', () => {
      render(<ColorPicker panel variant="unstyled" />)
      expect(screen.getByRole('group', { name: 'Color picker' })).not.toHaveClass('inline')
    })
  })

  describe('the area', () => {
    const rendered = (props: Partial<ColorPickerProps> & { start?: string } = {}): void => {
      render(<Controlled panel {...props} />)
      area().getBoundingClientRect = () => ({ ...box, toJSON: () => ({}) })
    }
    const value = (): string => screen.getByTestId('value').textContent ?? ''

    it('is a slider that says its saturation and brightness', () => {
      rendered()
      expect(area()).toHaveAttribute('aria-valuenow', '100')
      expect(area()).toHaveAttribute('aria-valuetext', 'Saturation 100 %, brightness 100 %')
      expect(area()).toHaveAttribute('tabindex', '0')
    })

    it('moves with the arrow keys, and ten times as much with Shift', () => {
      rendered()
      fireEvent.keyDown(area(), { key: 'ArrowLeft' })
      expect(area()).toHaveAttribute('aria-valuetext', 'Saturation 99 %, brightness 100 %')
      fireEvent.keyDown(area(), { key: 'ArrowDown', shiftKey: true })
      expect(area()).toHaveAttribute('aria-valuetext', 'Saturation 99 %, brightness 90 %')
      fireEvent.keyDown(area(), { key: 'ArrowRight' })
      fireEvent.keyDown(area(), { key: 'ArrowUp', shiftKey: true })
      expect(area()).toHaveAttribute('aria-valuetext', 'Saturation 100 %, brightness 100 %')
      expect(value()).toBe('#ff0000')
    })

    it('keeps the arrows as they look in right-to-left text', () => {
      document.documentElement.dir = 'rtl'
      rendered()
      fireEvent.keyDown(area(), { key: 'ArrowLeft' })
      expect(area()).toHaveAttribute('aria-valuetext', 'Saturation 99 %, brightness 100 %')
      document.documentElement.removeAttribute('dir')
    })

    it('stops at the edges', () => {
      rendered({ start: '#ffffff' })
      fireEvent.keyDown(area(), { key: 'ArrowLeft', shiftKey: true })
      fireEvent.keyDown(area(), { key: 'ArrowUp', shiftKey: true })
      expect(area()).toHaveAttribute('aria-valuetext', 'Saturation 0 %, brightness 100 %')
      expect(value()).toBe('#ffffff')
    })

    it('ignores the other keys', () => {
      rendered()
      const event = fireEvent.keyDown(area(), { key: 'a' })
      expect(event).toBe(true)
      expect(value()).toBe('#ff0000')
    })

    it('goes to where it is pressed, and follows the pointer while it is down', () => {
      rendered()
      fireEvent.pointerDown(area(), { clientX: 0, clientY: 0, pointerId: 1 })
      expect(value()).toBe('#ffffff')
      fireEvent.pointerMove(area(), { clientX: 100, clientY: 100, pointerId: 1 })
      expect(value()).toBe('#000000')
      fireEvent.pointerMove(area(), { clientX: 50, clientY: 50, pointerId: 1 })
      expect(area()).toHaveAttribute('aria-valuetext', 'Saturation 50 %, brightness 50 %')
      fireEvent.pointerUp(area(), { pointerId: 1 })
      fireEvent.pointerMove(area(), { clientX: 100, clientY: 0, pointerId: 1 })
      expect(area()).toHaveAttribute('aria-valuetext', 'Saturation 50 %, brightness 50 %')
    })

    it('keeps inside the area when the pointer leaves it', () => {
      rendered()
      fireEvent.pointerDown(area(), { clientX: 50, clientY: 50, pointerId: 1 })
      fireEvent.pointerMove(area(), { clientX: 900, clientY: -900, pointerId: 1 })
      expect(area()).toHaveAttribute('aria-valuetext', 'Saturation 100 %, brightness 100 %')
    })

    it('stops following when the pointer is cancelled or loses its capture', () => {
      rendered()
      fireEvent.pointerDown(area(), { clientX: 50, clientY: 50, pointerId: 1 })
      fireEvent.pointerCancel(area(), { pointerId: 1 })
      fireEvent.pointerMove(area(), { clientX: 0, clientY: 0, pointerId: 1 })
      expect(area()).toHaveAttribute('aria-valuetext', 'Saturation 50 %, brightness 50 %')
      fireEvent.pointerDown(area(), { clientX: 50, clientY: 50, pointerId: 1 })
      fireEvent.lostPointerCapture(area(), { pointerId: 1 })
      fireEvent.pointerMove(area(), { clientX: 0, clientY: 0, pointerId: 1 })
      expect(area()).toHaveAttribute('aria-valuetext', 'Saturation 50 %, brightness 50 %')
    })

    it('takes the pointer, when the browser lets it', () => {
      rendered()
      area().setPointerCapture = vi.fn()
      fireEvent.pointerDown(area(), { clientX: 10, clientY: 10, pointerId: 7 })
      expect(area().setPointerCapture).toHaveBeenCalledWith(7)
      expect(area()).toHaveFocus()
    })

    it('does nothing in an area with no size', () => {
      rendered()
      area().getBoundingClientRect = () => ({ ...box, height: 0, toJSON: () => ({}), width: 0 })
      fireEvent.pointerDown(area(), { clientX: 10, clientY: 10, pointerId: 1 })
      expect(value()).toBe('#ff0000')
    })

    it.each([['disabled'], ['readOnly']])('does not move when it is %s', (prop) => {
      rendered({ [prop]: true })
      expect(area()).toHaveAttribute('tabindex', '-1')
      fireEvent.keyDown(area(), { key: 'ArrowLeft' })
      fireEvent.pointerDown(area(), { clientX: 0, clientY: 0, pointerId: 1 })
      expect(value()).toBe('#ff0000')
    })

    it('says it is disabled', () => {
      rendered({ disabled: true })
      expect(area()).toHaveAttribute('aria-disabled', 'true')
    })
  })

  describe('the sliders', () => {
    it('change the hue', () => {
      const onValueChange = vi.fn()
      render(<ColorPicker defaultValue="#ff0000" onValueChange={onValueChange} panel />)
      expect(slider('Hue').value).toBe('0')
      fireEvent.change(slider('Hue'), { target: { value: '120' } })
      expect(onValueChange).toHaveBeenLastCalledWith('#00ff00')
      expect(slider('Hue').value).toBe('120')
      expect(slider('Hue')).toHaveAttribute('aria-valuetext', '120°')
    })

    it('have no opacity slider without alpha', () => {
      render(<ColorPicker panel />)
      expect(screen.queryByRole('slider', { name: 'Opacity' })).toBeNull()
    })

    it('change the opacity with alpha', () => {
      const onValueChange = vi.fn()
      render(<ColorPicker alpha defaultValue="#ff0000" onValueChange={onValueChange} panel />)
      expect(slider('Opacity').value).toBe('100')
      fireEvent.change(slider('Opacity'), { target: { value: '50' } })
      expect(onValueChange).toHaveBeenLastCalledWith('#ff000080')
      expect(slider('Opacity')).toHaveAttribute('aria-valuetext', '50 %')
    })

    it('are bare in the unstyled variant', () => {
      render(<ColorPicker alpha panel variant="unstyled" />)
      expect(slider('Hue')).not.toHaveClass('thumb')
    })

    it.each([['disabled'], ['readOnly']])('are blocked when it is %s', (prop) => {
      render(<ColorPicker alpha panel {...{ [prop]: true }} />)
      expect(slider('Hue')).toBeDisabled()
      expect(slider('Opacity')).toBeDisabled()
    })
  })

  describe('the channels', () => {
    it('show a field for the hex color, which takes a color when it loses the focus', async () => {
      const onValueChange = vi.fn()
      render(<ColorPicker defaultValue="#ff0000" onValueChange={onValueChange} panel />)
      expect(channel('Hex')).toHaveValue('#ff0000')
      await type(channel('Hex'), '#00f')
      await userEvent.tab()
      expect(onValueChange).toHaveBeenCalledWith('#0000ff')
    })

    it('show the opacity in percent with alpha', async () => {
      const onValueChange = vi.fn()
      render(<ColorPicker alpha defaultValue="#ff000080" onValueChange={onValueChange} panel />)
      expect(channel('Opacity')).toHaveValue('50')
      await type(channel('Opacity'), '25{Enter}')
      expect(onValueChange).toHaveBeenLastCalledWith('#ff000040')
    })

    it('show red, green and blue in rgb', async () => {
      const onValueChange = vi.fn()
      render(<ColorPicker defaultValue="#ff0000" format="rgb" onValueChange={onValueChange} panel />)
      expect(channel('Red')).toHaveValue('255')
      expect(channel('Green')).toHaveValue('0')
      expect(channel('Blue')).toHaveValue('0')
      expect(screen.queryByLabelText('Hex')).toBeNull()
      await type(channel('Green'), '128{Enter}')
      expect(onValueChange).toHaveBeenLastCalledWith('rgb(255, 128, 0)')
      await type(channel('Red'), '0{Enter}')
      expect(onValueChange).toHaveBeenLastCalledWith('rgb(0, 128, 0)')
      await type(channel('Blue'), '64{Enter}')
      expect(onValueChange).toHaveBeenLastCalledWith('rgb(0, 128, 64)')
    })

    it('show hue, saturation and lightness in hsl', async () => {
      const onValueChange = vi.fn()
      render(<ColorPicker alpha defaultValue="hsl(0, 100%, 50%)" format="hsl" onValueChange={onValueChange} panel />)
      expect(channel('Hue')).toHaveValue('0')
      expect(channel('Saturation')).toHaveValue('100')
      expect(channel('Lightness')).toHaveValue('50')
      await type(channel('Hue'), '120{Enter}')
      expect(onValueChange).toHaveBeenLastCalledWith('hsl(120, 100%, 50%)')
      await type(channel('Lightness'), '25{Enter}')
      expect(onValueChange).toHaveBeenLastCalledWith('hsl(120, 100%, 25%)')
      await type(channel('Saturation'), '50{Enter}')
      expect(onValueChange).toHaveBeenLastCalledWith('hsl(120, 50%, 25%)')
      await type(channel('Opacity'), '50{Enter}')
      expect(onValueChange).toHaveBeenLastCalledWith('hsla(120, 50%, 25%, 0.5)')
    })

    it('keep a number between its limits, and ignore what is not one', async () => {
      const onValueChange = vi.fn()
      render(<ColorPicker defaultValue="#ff0000" format="rgb" onValueChange={onValueChange} panel />)
      await type(channel('Blue'), '999{Enter}')
      expect(onValueChange).toHaveBeenLastCalledWith('rgb(255, 0, 255)')
      onValueChange.mockClear()
      await type(channel('Blue'), 'abc{Enter}')
      await type(channel('Blue'), '{Enter}')
      expect(onValueChange).not.toHaveBeenCalled()
      expect(channel('Blue')).toHaveValue('255')
    })

    it('are blocked when it is disabled', () => {
      render(<ColorPicker disabled format="rgb" panel />)
      expect(channel('Red')).toBeDisabled()
    })

    it('are bare in the unstyled variant', () => {
      render(<ColorPicker panel variant="unstyled" />)
      expect(channel('Hex').closest('label')).not.toHaveClass('channel')
    })
  })

  describe('the swatches', () => {
    it('are buttons that pick a color, and show the one that is picked', async () => {
      const onValueChange = vi.fn()
      render(
        <ColorPicker
          defaultValue="#ef4444"
          onValueChange={onValueChange}
          panel
          swatches={['#ef4444', 'rgb(34 197 94)', 'hsl(217 91% 60%)']}
        />,
      )
      const group = screen.getByRole('group', { name: 'Swatches' })
      const swatches = within(group).getAllByRole('button')
      expect(swatches.map((swatch) => swatch.getAttribute('aria-label'))).toEqual([
        '#ef4444',
        'rgb(34 197 94)',
        'hsl(217 91% 60%)',
      ])
      expect(swatches[0]).toHaveAttribute('aria-pressed', 'true')
      expect(swatches[1]).toHaveAttribute('aria-pressed', 'false')
      await userEvent.click(swatches[1])
      expect(onValueChange).toHaveBeenCalledWith('#22c55e')
      expect(swatches[1]).toHaveAttribute('aria-pressed', 'true')
    })

    it('leave out the colors that cannot be read', () => {
      render(<ColorPicker panel swatches={['#ef4444', 'banana']} />)
      expect(within(screen.getByRole('group', { name: 'Swatches' })).getAllByRole('button')).toHaveLength(1)
    })

    it('are not shown when there are none, or none can be read', () => {
      const { rerender } = render(<ColorPicker panel />)
      expect(screen.queryByRole('group', { name: 'Swatches' })).toBeNull()
      rerender(<ColorPicker panel swatches={['banana']} />)
      expect(screen.queryByRole('group', { name: 'Swatches' })).toBeNull()
    })

    it('are blocked when it is disabled', () => {
      render(<ColorPicker disabled panel swatches={['#ef4444']} />)
      expect(screen.getByRole('button', { name: '#ef4444' })).toBeDisabled()
    })

    it('are bare in the unstyled variant', () => {
      render(<ColorPicker panel swatches={['#ef4444']} variant="unstyled" />)
      expect(screen.getByRole('button', { name: '#ef4444' })).not.toHaveClass('swatch')
    })
  })

  describe('the eyedropper', () => {
    const dropper = (open: () => Promise<{ sRGBHex: string }>): void => {
      Object.defineProperty(window, 'EyeDropper', {
        configurable: true,
        value: class {
          open = open
        },
      })
    }

    it('is not shown in a browser that has none', () => {
      render(<ColorPicker panel />)
      expect(screen.queryByRole('button', { name: 'Pick a color from the screen' })).toBeNull()
    })

    it('takes a color from the screen', async () => {
      dropper(() => Promise.resolve({ sRGBHex: '#123456' }))
      const onValueChange = vi.fn()
      render(<ColorPicker onValueChange={onValueChange} panel />)
      await userEvent.click(await screen.findByRole('button', { name: 'Pick a color from the screen' }))
      await waitFor(() => expect(onValueChange).toHaveBeenCalledWith('#123456'))
    })

    it('keeps the color when the user closes it without picking', async () => {
      dropper(() => Promise.reject(new DOMException('closed', 'AbortError')))
      const onValueChange = vi.fn()
      render(<ColorPicker defaultValue="#ff0000" onValueChange={onValueChange} panel />)
      await userEvent.click(await screen.findByRole('button', { name: 'Pick a color from the screen' }))
      expect(onValueChange).not.toHaveBeenCalled()
    })

    it('is left out with eyeDropper off', () => {
      dropper(() => Promise.resolve({ sRGBHex: '#123456' }))
      render(<ColorPicker eyeDropper={false} panel />)
      expect(screen.queryByRole('button', { name: 'Pick a color from the screen' })).toBeNull()
    })

    it('is blocked when it is disabled', async () => {
      dropper(() => Promise.resolve({ sRGBHex: '#123456' }))
      render(<ColorPicker disabled panel />)
      expect(await screen.findByRole('button', { name: 'Pick a color from the screen' })).toBeDisabled()
    })

    it('does nothing if the browser takes the dropper away', async () => {
      dropper(() => Promise.resolve({ sRGBHex: '#123456' }))
      const onValueChange = vi.fn()
      render(<ColorPicker onValueChange={onValueChange} panel />)
      const button = await screen.findByRole('button', { name: 'Pick a color from the screen' })
      Reflect.deleteProperty(window, 'EyeDropper')
      await userEvent.click(button)
      expect(onValueChange).not.toHaveBeenCalled()
    })

    it('is bare in the unstyled variant', async () => {
      dropper(() => Promise.resolve({ sRGBHex: '#123456' }))
      render(<ColorPicker panel variant="unstyled" />)
      expect(await screen.findByRole('button', { name: 'Pick a color from the screen' })).not.toHaveClass('icon')
    })
  })

  describe('texts', () => {
    it('come from the LocaleProvider', async () => {
      render(
        <LocaleProvider
          locale="es"
          messages={{
            colorPicker: {
              area: 'Saturación y brillo',
              areaValue: (saturation, brightness) => `Saturación ${saturation} %, brillo ${brightness} %`,
              colorPicker: 'Selector de color',
              hex: 'Hexadecimal',
              hue: 'Tono',
              openColorPicker: 'Abrir selector',
            },
          }}
        >
          <ColorPicker aria-label="Color" defaultValue="#ff0000" />
        </LocaleProvider>,
      )
      await userEvent.click(screen.getByRole('button', { name: 'Abrir selector' }))
      expect(screen.getByRole('dialog', { name: 'Selector de color' })).toBeInTheDocument()
      expect(screen.getByRole('slider', { name: 'Saturación y brillo' })).toHaveAttribute(
        'aria-valuetext',
        'Saturación 100 %, brillo 100 %',
      )
      expect(screen.getByRole('slider', { name: 'Tono' })).toBeInTheDocument()
      expect(screen.getByLabelText('Hexadecimal')).toBeInTheDocument()
    })

    it('write their numbers with the digits of the locale', () => {
      render(
        <LocaleProvider locale="ar-EG">
          <ColorPicker defaultValue="#ff0000" panel />
        </LocaleProvider>,
      )
      expect(area().getAttribute('aria-valuetext')).toContain('١٠٠')
    })
  })
})

describe('ColorPicker parts', () => {
  it('compose the picker in the order they are written', async () => {
    render(
      <ColorPicker alpha defaultValue="#ff0000" swatches={['#ef4444']}>
        <ColorPickerInput aria-label="Brand" />
        <ColorPickerPanel aria-label="Pick it">
          <ColorPickerSwatches />
          <ColorPickerAlpha />
          <ColorPickerArea />
        </ColorPickerPanel>
      </ColorPicker>,
    )
    await userEvent.click(trigger())
    const dialog = screen.getByRole('dialog', { name: 'Pick it' })
    expect(within(dialog).queryByRole('slider', { name: 'Hue' })).toBeNull()
    expect(within(dialog).queryByLabelText('Hex')).toBeNull()
    const names = within(dialog)
      .getAllByRole('group')
      .concat(within(dialog).getAllByRole('slider'))
      .map((element) => element.getAttribute('aria-label'))
    expect(names).toEqual(['Swatches', 'Opacity', 'Saturation and brightness'])
  })

  it('leave out the field when the picker has none', () => {
    render(
      <ColorPicker panel>
        <ColorPickerInput aria-label="Brand" />
        <ColorPickerPanel />
      </ColorPicker>,
    )
    expect(screen.queryByRole('textbox', { name: 'Brand' })).toBeNull()
  })

  it('take a ref, a class and a style', async () => {
    const refs = {
      alpha: createRef<HTMLInputElement>(),
      area: createRef<HTMLDivElement>(),
      channels: createRef<HTMLDivElement>(),
      hue: createRef<HTMLInputElement>(),
      input: createRef<HTMLInputElement>(),
      panel: createRef<HTMLDivElement>(),
      swatches: createRef<HTMLDivElement>(),
    }
    const mine = { className: 'mine', style: { margin: '3px' } }
    render(
      <ColorPicker alpha swatches={['#ef4444']}>
        <ColorPickerInput {...mine} aria-label="Brand" ref={refs.input} />
        <ColorPickerPanel {...mine} ref={refs.panel}>
          <ColorPickerArea {...mine} ref={refs.area} />
          <ColorPickerHue {...mine} ref={refs.hue} />
          <ColorPickerAlpha {...mine} ref={refs.alpha} />
          <ColorPickerChannels {...mine} ref={refs.channels} />
          <ColorPickerSwatches {...mine} ref={refs.swatches} />
        </ColorPickerPanel>
      </ColorPicker>,
    )
    await userEvent.click(trigger())
    expect(refs.input.current).toBe(field())
    expect(refs.input.current?.closest('[data-loica-input-group]')).toHaveClass('mine')
    for (const [name, ref] of Object.entries(refs)) {
      if (name === 'input') continue
      const element = ref.current?.closest('.mine') ?? ref.current
      expect(ref.current, name).not.toBeNull()
      expect(element, name).toHaveClass('mine')
      expect(element, name).toHaveStyle({ margin: '3px' })
    }
  })

  it('let the style of the area override its variables', () => {
    render(
      <ColorPicker panel>
        <ColorPickerPanel>
          <ColorPickerArea style={{ '--colorpicker-hue': 'red' } as React.CSSProperties} />
        </ColorPickerPanel>
      </ColorPicker>,
    )
    expect(area()).toHaveStyle('--colorpicker-hue: red')
  })

  it('change the icon of the eyedropper, and its name', async () => {
    Object.defineProperty(window, 'EyeDropper', {
      configurable: true,
      value: class {
        open = (): Promise<{ sRGBHex: string }> => Promise.resolve({ sRGBHex: '#000000' })
      },
    })
    render(
      <ColorPicker panel>
        <ColorPickerPanel>
          <ColorPickerEyeDropper aria-label="Dropper" className="mine" title="Pick">
            <b>pick</b>
          </ColorPickerEyeDropper>
        </ColorPickerPanel>
      </ColorPicker>,
    )
    const button = await screen.findByRole('button', { name: 'Dropper' })
    expect(button).toHaveTextContent('pick')
    expect(button).toHaveAttribute('title', 'Pick')
    expect(button).toHaveClass('mine')
  })

  it.each([
    ['ColorPickerInput', <ColorPickerInput key="1" />],
    ['ColorPickerPanel', <ColorPickerPanel key="2" />],
    ['ColorPickerArea', <ColorPickerArea key="3" />],
    ['ColorPickerHue', <ColorPickerHue key="4" />],
    ['ColorPickerAlpha', <ColorPickerAlpha key="5" />],
    ['ColorPickerChannels', <ColorPickerChannels key="6" />],
    ['ColorPickerSwatches', <ColorPickerSwatches key="7" />],
    ['ColorPickerEyeDropper', <ColorPickerEyeDropper key="8" />],
  ])('%s must be used within a ColorPicker', (name, element) => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    expect(() => render(element)).toThrow(`${name} must be used within a <ColorPicker>`)
    error.mockRestore()
  })
})
