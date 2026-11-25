import { fireEvent, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { Autocomplete } from '../../autocomplete'
import { Checkbox } from '../../checkbox'
import { ColorPicker } from '../../colorpicker'
import { DatePicker } from '../../datepicker'
import { Input } from '../../input'
import { NumberInput } from '../../numberinput'
import { PinInput } from '../../pininput'
import { RadioGroup, Radio } from '../../radio'
import { Rating } from '../../rating'
import { RichTextEditor } from '../../richtexteditor'
import { SegmentedControl } from '../../segmentedcontrol'
import { Select } from '../../select'
import { Slider } from '../../slider'
import { Textarea } from '../../textarea'
import { TimePicker } from '../../timepicker'
import { Toggle } from '../../toggle'
import { Field } from '..'

const options = [
  { label: 'One', value: 'one' },
  { label: 'Two', value: 'two' },
]

const controls: [string, () => ReactNode][] = [
  ['Autocomplete', () => <Autocomplete options={options} />],
  ['Checkbox', () => <Checkbox />],
  ['ColorPicker', () => <ColorPicker />],
  ['DatePicker', () => <DatePicker onValueChange={vi.fn()} />],
  ['Input', () => <Input />],
  ['NumberInput', () => <NumberInput />],
  ['PinInput', () => <PinInput />],
  [
    'RadioGroup',
    () => (
      <RadioGroup>
        <Radio value="a" />
      </RadioGroup>
    ),
  ],
  ['Rating', () => <Rating />],
  ['RichTextEditor', () => <RichTextEditor />],
  ['SegmentedControl', () => <SegmentedControl options={options} />],
  ['Select', () => <Select options={options} />],
  ['Slider', () => <Slider />],
  ['Textarea', () => <Textarea />],
  ['TimePicker', () => <TimePicker />],
  ['Toggle', () => <Toggle />],
]

function Harness({ control }: Readonly<{ control: () => ReactNode }>): ReactNode {
  const [invalid, setInvalid] = useState(true)
  return (
    <>
      <Field errorText="Bad value" invalid={invalid} label="Value" required>
        {control()}
      </Field>
      <button onClick={() => setInvalid(false)} type="button">
        Fix
      </button>
    </>
  )
}

const invalidElements = (container: HTMLElement): Element[] =>
  Array.from(container.querySelectorAll('[aria-invalid="true"]'))

describe('a control inside a Field follows its invalid state', () => {
  it.each(controls)('%s', (_name, control) => {
    const { container } = render(<Harness control={control} />)
    expect(screen.getByText('Bad value')).toBeInTheDocument()
    expect(invalidElements(container).length).toBeGreaterThan(0)

    fireEvent.click(screen.getByRole('button', { name: 'Fix' }))
    expect(screen.queryByText('Bad value')).not.toBeInTheDocument()
    expect(invalidElements(container)).toHaveLength(0)
  })
})
