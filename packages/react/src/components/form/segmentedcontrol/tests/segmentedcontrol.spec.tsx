import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { createRef, useState } from 'react'
import { Field } from '../../field'
import {
  SegmentedControl,
  SegmentedControlItem,
  type SegmentedControlOption,
  type SegmentedControlProps,
} from '..'

const views: SegmentedControlOption[] = [
  { label: 'Day', value: 'day' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
]

function Views(props: SegmentedControlProps): React.ReactNode {
  return <SegmentedControl aria-label="View" options={views} {...props} />
}

const radio = (name: string): HTMLInputElement =>
  screen.getByRole<HTMLInputElement>('radio', { name })
const group = (): HTMLElement => screen.getByRole('radiogroup', { name: 'View' })

describe('SegmentedControl component', () => {
  it('renders a radiogroup with a radio for each option', () => {
    render(<Views />)
    expect(group()).toBeInTheDocument()
    expect(screen.getAllByRole('radio').map((input) => input.getAttribute('value'))).toEqual([
      'day',
      'week',
      'month',
    ])
    expect(radio('Week')).toBeInTheDocument()
  })

  it('shows the value of an option that has no label', () => {
    render(<SegmentedControl aria-label="View" options={[{ value: 'day' }]} />)
    expect(radio('day')).toBeInTheDocument()
  })

  it('shares one generated name, or the one it is given', () => {
    const { rerender } = render(<Views />)
    const names = screen.getAllByRole('radio').map((input) => input.getAttribute('name'))
    expect(names[0]).toBeTruthy()
    expect(new Set(names).size).toBe(1)

    rerender(<Views name="view" />)
    expect(radio('Day')).toHaveAttribute('name', 'view')
  })

  it('builds its items from children when it gets them, and ignores the options', () => {
    render(
      <SegmentedControl aria-label="View" options={views}>
        <SegmentedControlItem value="list">List</SegmentedControlItem>
        <SegmentedControlItem value="grid">Grid</SegmentedControlItem>
      </SegmentedControl>,
    )
    expect(screen.getAllByRole('radio')).toHaveLength(2)
    expect(radio('Grid')).toBeInTheDocument()
  })

  it('selects the defaultValue and follows the clicks when uncontrolled', async () => {
    const onValueChange = vi.fn()
    render(<Views defaultValue="week" onValueChange={onValueChange} />)
    expect(radio('Week')).toBeChecked()

    await userEvent.click(screen.getByText('Month'))
    expect(radio('Month')).toBeChecked()
    expect(radio('Week')).not.toBeChecked()
    expect(onValueChange).toHaveBeenCalledWith('month', expect.anything())
  })

  it('marks the selected segment with data-checked', async () => {
    render(<Views defaultValue="day" />)
    expect(screen.getByText('Day')).toHaveAttribute('data-checked')
    expect(screen.getByText('Week')).not.toHaveAttribute('data-checked')

    await userEvent.click(screen.getByText('Week'))
    expect(screen.getByText('Week')).toHaveAttribute('data-checked')
    expect(screen.getByText('Day')).not.toHaveAttribute('data-checked')
  })

  it('stays where it is when controlled until the value changes', async () => {
    function Controlled(): React.ReactNode {
      const [value, setValue] = useState('day')
      return (
        <>
          <Views onValueChange={(next) => setValue(next)} value={value} />
          <output>{value}</output>
        </>
      )
    }
    render(<Controlled />)
    await userEvent.click(screen.getByText('Week'))
    expect(screen.getByRole('status')).toHaveTextContent('week')
    expect(radio('Week')).toBeChecked()

    const onValueChange = vi.fn()
    render(<Views onValueChange={onValueChange} value="day" />)
    await userEvent.click(screen.getAllByText('Month')[1])
    expect(onValueChange).toHaveBeenCalledWith('month', expect.anything())
    expect(screen.getAllByRole('radio', { name: 'Day' })[1]).toBeChecked()
  })

  it('is one tab stop and the arrow keys move the selection', async () => {
    render(
      <>
        <button type="button">before</button>
        <Views defaultValue="day" />
      </>,
    )
    await userEvent.tab()
    await userEvent.tab()
    expect(radio('Day')).toHaveFocus()

    await userEvent.keyboard('{ArrowRight}')
    expect(radio('Week')).toHaveFocus()
    expect(radio('Week')).toBeChecked()

    await userEvent.keyboard('{ArrowDown}')
    expect(radio('Month')).toBeChecked()

    await userEvent.keyboard('{ArrowLeft}')
    expect(radio('Week')).toBeChecked()
  })

  it('skips a disabled option with the keyboard and does not select it with a click', async () => {
    const onValueChange = vi.fn()
    render(
      <Views
        defaultValue="day"
        onValueChange={onValueChange}
        options={[
          { label: 'Day', value: 'day' },
          { disabled: true, label: 'Week', value: 'week' },
          { label: 'Month', value: 'month' },
        ]}
      />,
    )
    expect(radio('Week')).toBeDisabled()
    expect(screen.getByText('Week')).toHaveAttribute('data-disabled')

    await userEvent.click(screen.getByText('Week'))
    expect(onValueChange).not.toHaveBeenCalled()

    radio('Day').focus()
    await userEvent.keyboard('{ArrowRight}')
    expect(radio('Month')).toBeChecked()
  })

  it('disables every segment', async () => {
    const onValueChange = vi.fn()
    render(<Views disabled onValueChange={onValueChange} />)
    screen.getAllByRole('radio').forEach((input) => expect(input).toBeDisabled())
    expect(group()).toHaveAttribute('data-disabled')
    expect(screen.getByText('Day')).toHaveAttribute('data-disabled')

    await userEvent.click(screen.getByText('Day'))
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it('keeps the selection when it is read only', async () => {
    const onValueChange = vi.fn()
    render(<Views defaultValue="day" onValueChange={onValueChange} readOnly />)
    expect(group()).toHaveAttribute('data-readonly')

    await userEvent.click(screen.getByText('Week'))
    expect(onValueChange).not.toHaveBeenCalled()
    expect(radio('Day')).toBeChecked()
  })

  it('takes part in a form with its name and value, and can be required', () => {
    const { container } = render(
      <form>
        <Views defaultValue="week" name="view" required />
      </form>,
    )
    const data = new FormData(container.querySelector('form') as HTMLFormElement)
    expect(data.get('view')).toBe('week')
    expect(group()).toHaveAttribute('aria-required', 'true')
    expect(radio('Day')).toBeRequired()
  })

  it('is named by the label of a Field', () => {
    render(
      <Field label="Calendar view">
        <SegmentedControl options={views} />
      </Field>,
    )
    expect(screen.getByRole('radiogroup', { name: 'Calendar view' })).toBeInTheDocument()
  })

  it('names a segment that has only an icon with its aria-label', () => {
    render(
      <SegmentedControl aria-label="Alignment">
        <SegmentedControlItem aria-label="Align left" value="left">
          <svg aria-hidden="true" />
        </SegmentedControlItem>
      </SegmentedControl>,
    )
    expect(screen.getByRole('radio', { name: 'Align left' })).toBeInTheDocument()
  })

  it('reports it is invalid', () => {
    render(<Views aria-invalid />)
    expect(group()).toHaveAttribute('data-invalid')
  })

  it('lays the segments out in the orientation it is given', () => {
    const { rerender } = render(<Views />)
    expect(group()).toHaveAttribute('data-orientation', 'horizontal')
    rerender(<Views orientation="vertical" />)
    expect(group()).toHaveAttribute('data-orientation', 'vertical')
  })

  it('forwards the ref to the root and takes className, style and native attributes', () => {
    const ref = createRef<HTMLDivElement>()
    render(
      <SegmentedControl
        aria-label="View"
        className="mine"
        data-testid="root"
        id="views"
        options={views}
        ref={ref}
        style={{ margin: 3 }}
      />,
    )
    expect(ref.current).toBe(group())
    expect(group()).toHaveClass('mine')
    expect(group().style.margin).toBe('3px')
    expect(group()).toHaveAttribute('data-testid', 'root')
    expect(group()).toHaveAttribute('id', 'views')
  })

  it('forwards the ref and the attributes of an item to its label', () => {
    const ref = createRef<HTMLLabelElement>()
    render(
      <SegmentedControl aria-label="View">
        <SegmentedControlItem className="seg" data-testid="seg" ref={ref} value="day">
          Day
        </SegmentedControlItem>
      </SegmentedControl>,
    )
    expect(ref.current?.tagName).toBe('LABEL')
    expect(ref.current).toHaveClass('seg')
    expect(ref.current).toHaveAttribute('data-testid', 'seg')
    expect(ref.current).toContainElement(radio('Day'))
  })

  it('uses the value as the text of an item without children', () => {
    render(
      <SegmentedControl aria-label="View">
        <SegmentedControlItem value="day" />
      </SegmentedControl>,
    )
    expect(radio('day')).toBeInTheDocument()
  })

  describe('styles', () => {
    it('has the Loica classes by default, and the size and the variant change them', () => {
      const { rerender } = render(<Views />)
      const solid = group().className
      expect(solid).toMatch(/segmentedcontrol/)

      rerender(<Views size="lg" variant="outline" />)
      expect(group().className).not.toBe(solid)
    })

    it('puts the color of the scheme in variables', () => {
      render(<Views colorScheme="success" />)
      expect(group().style.getPropertyValue('--segmentedcontrol-solid')).toContain('success')
    })

    it('drops every Loica class when it is unstyled and keeps the user class', () => {
      render(<Views className="mine" variant="unstyled" />)
      expect(group().className).toBe('mine')
      expect(group()).toHaveAttribute('data-loica-segmentedcontrol')
      expect(radio('Day')).toHaveAttribute('data-loica-segmentedcontrol-input')
    })
  })
})
