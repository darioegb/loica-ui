import { createRef } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { TimePicker, TimePickerInput } from '..'
import { LocaleProvider } from '../../../../locale/locale-provider'

const classesOf = (selector: string): string[] =>
  Array.from(document.querySelectorAll<HTMLElement>(selector)).map((node) => node.className.trim())

describe('TimePicker contract', () => {
  it('forwards the ref to the native input and marks it', () => {
    const ref = createRef<HTMLInputElement>()
    render(<TimePicker ref={ref} />)
    expect(ref.current).toBe(screen.getByRole('textbox'))
    expect(ref.current).toHaveAttribute('data-plume-timepicker-input')
  })

  it('forwards the ref of the TimePickerInput to the native input', () => {
    const rootRef = createRef<HTMLInputElement>()
    const ref = createRef<HTMLInputElement>()
    render(
      <TimePicker ref={rootRef}>
        <TimePickerInput ref={ref} />
      </TimePicker>,
    )
    expect(rootRef.current).toBe(screen.getByRole('textbox'))
    expect(ref.current).toBe(screen.getByRole('textbox'))
  })

  it('takes the default placeholder from the texts', () => {
    const { rerender } = render(<TimePicker />)
    expect(screen.getByRole('textbox')).toHaveAttribute('placeholder', 'hh:mm')
    rerender(<TimePicker hour12 />)
    expect(screen.getByRole('textbox')).toHaveAttribute('placeholder', 'hh:mm AM')
    rerender(
      <LocaleProvider
        messages={{ timePicker: { placeholder: (period) => `hh:mm${period ? '' : ' 24h'}` } }}
      >
        <TimePicker />
      </LocaleProvider>,
    )
    expect(screen.getByRole('textbox')).toHaveAttribute('placeholder', 'hh:mm 24h')
  })

  it('renders the format hint and describes the input with it', () => {
    render(<TimePicker />)
    const hint = document.querySelector('[data-plume-timepicker-format-hint]')
    expect(hint).toHaveTextContent('Format: hh:mm')
    expect(document.querySelectorAll('[data-plume-timepicker-format-hint]')).toHaveLength(1)
    expect(screen.getByRole('textbox').getAttribute('aria-describedby')).toContain(hint?.id)
  })

  it('drops every Plume class of the parts with the unstyled variant', () => {
    render(<TimePicker defaultValue="09:30" hour12 variant="unstyled" />)
    fireEvent.click(screen.getByRole('button', { name: 'Open time picker' }))
    for (const name of ['trigger', 'panel', 'column', 'option']) {
      const classes = classesOf(`[data-plume-timepicker-${name}]`)
      expect(classes.length).toBeGreaterThan(0)
      for (const className of classes) expect(className).toBe('')
    }
  })

  it('computes no colors in JavaScript', () => {
    const { container } = render(<TimePicker colorScheme="primary" />)
    const style = (container.firstChild as HTMLElement).getAttribute('style') ?? ''
    expect(style).not.toContain('color-mix')
    expect(style).toContain('--plume-color-primary-tint')
  })
})
