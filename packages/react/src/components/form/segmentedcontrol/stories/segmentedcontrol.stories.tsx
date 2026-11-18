import type { StoryObj, Meta } from '@storybook/react-vite'
import { useState } from 'react'
import { defaultTheme } from '../../../../theme'
import { Field } from '../../field'
import { Icon } from '../../../presentation/icon'
import { SegmentedControl, SegmentedControlItem } from '..'

const colorSchemes = Object.keys(defaultTheme.colors)

const views = [
  { label: 'Day', value: 'day' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
]

/**
 * A short list of options, side by side, of which one is selected: "Day / Week / Month", the alignment of a text.
 * Use it for two to four options that change what the page shows or how a value is written; for a longer list
 * use a `Select`, and to move between sections of content use `Tabs`.
 *
 * It is a `radiogroup` of native radios, so it is one tab stop, the arrow keys move the selection (and follow the
 * direction of the page), and a form submits its **name** and value. Give the options with **options**, or write the
 * `SegmentedControlItem` of each one as children to put anything in a segment. The **value** or **defaultValue** is the
 * `value` of the selected option, and **onValueChange** gets the value the user picks. Name it with an `aria-label`,
 * or put it in a `Field`.
 */
export default {
  title: 'Components/SegmentedControl',
  component: SegmentedControl,
  tags: ['autodocs'],
  parameters: {
    docs: {
      importNames: ['SegmentedControl', 'SegmentedControlItem'],
      toc: {
        title: 'On this page',
        disable: false,
      },
    },
    layout: 'centered',
  },
  argTypes: {
    children: { control: false },
    className: { control: 'text' },
    style: { control: false },
    colorScheme: { control: 'select', options: colorSchemes },
    defaultValue: { control: 'text' },
    disabled: { control: 'boolean' },
    name: { control: 'text' },
    onValueChange: { control: false },
    options: { control: false },
    orientation: { control: 'radio', options: ['horizontal', 'vertical'] },
    readOnly: { control: 'boolean' },
    required: { control: 'boolean' },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    value: { control: false },
    variant: { control: 'radio', options: ['solid', 'outline', 'unstyled'] },
    'aria-label': { control: 'text' },
    'aria-invalid': { control: 'boolean' },
  },
  args: {
    'aria-label': 'View',
    defaultValue: 'week',
    options: views,
  },
} satisfies Meta<typeof SegmentedControl>

type Story = StoryObj<typeof SegmentedControl>

function ControlledView(): React.ReactNode {
  const [view, setView] = useState('week')
  return (
    <div className="flex flex-col items-start gap-4">
      <SegmentedControl aria-label="View" onValueChange={setView} options={views} value={view} />
      <p>Showing the {view}</p>
    </div>
  )
}

/**
 * This is the default SegmentedControl. Change its props in the Controls panel.
 */
export const Default: Story = {}

/**
 * Use **variant** to pick the look: `solid` (the default) fills the selected segment on a muted track, `outline`
 * draws the track with a border and tints the selected segment, and `unstyled` drops the Loica styles, so it is bare
 * radios hidden under their text, for you to style (see the Tailwind and Bootstrap examples).
 */
export const Variants: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-col items-start gap-8">
  <SegmentedControl aria-label="Solid" defaultValue="week" options={views} />
  <SegmentedControl aria-label="Outline" defaultValue="week" options={views} variant="outline" />
  <SegmentedControl aria-label="Unstyled" defaultValue="week" options={views} variant="unstyled" />
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-col items-start gap-8">
      <SegmentedControl aria-label="Solid" defaultValue="week" options={views} />
      <SegmentedControl aria-label="Outline" defaultValue="week" options={views} variant="outline" />
      <SegmentedControl
        aria-label="Unstyled"
        defaultValue="week"
        options={views}
        variant="unstyled"
      />
    </div>
  ),
}

/**
 * Use **size** to pick the height and the text: `sm`, `md` (the default) and `lg`, the same as the other controls.
 */
export const Sizes: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-col items-start gap-8">
  <SegmentedControl aria-label="Small" defaultValue="week" options={views} size="sm" />
  <SegmentedControl aria-label="Medium" defaultValue="week" options={views} size="md" />
  <SegmentedControl aria-label="Large" defaultValue="week" options={views} size="lg" />
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-col items-start gap-8">
      <SegmentedControl aria-label="Small" defaultValue="week" options={views} size="sm" />
      <SegmentedControl aria-label="Medium" defaultValue="week" options={views} size="md" />
      <SegmentedControl aria-label="Large" defaultValue="week" options={views} size="lg" />
    </div>
  ),
}

/**
 * Use **colorScheme** to color the selected segment with any color of the theme. In the `outline` variant the
 * segment is tinted with it instead of filled.
 */
export const Colors: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-col items-start gap-8">
  <SegmentedControl aria-label="Primary" colorScheme="primary" defaultValue="week" options={views} />
  <SegmentedControl aria-label="Secondary" colorScheme="secondary" defaultValue="week" options={views} />
  <SegmentedControl aria-label="Success" colorScheme="success" defaultValue="week" options={views} />
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-col items-start gap-8">
      {(['primary', 'secondary', 'success', 'info', 'warning', 'error'] as const).map((colorScheme) => (
        <SegmentedControl
          aria-label={colorScheme}
          colorScheme={colorScheme}
          defaultValue="week"
          key={colorScheme}
          options={views}
        />
      ))}
    </div>
  ),
}

/**
 * Pass **value** and **onValueChange** to control the selection. The value is the `value` of the option, and
 * `onValueChange` also gets the change event of the radio.
 */
export const Controlled: Story = {
  parameters: {
    docs: {
      source: {
        code: `function Example() {
  const [view, setView] = useState('week')
  return (
    <div className="flex flex-col items-start gap-4">
      <SegmentedControl aria-label="View" onValueChange={setView} options={views} value={view} />
      <p>Showing the {view}</p>
    </div>
  )
}`,
      },
    },
  },
  render: () => <ControlledView />,
}

/**
 * Give each option as a `SegmentedControlItem` to put anything in a segment, such as an icon. A segment with only an
 * icon needs an **aria-label** on its item, which names the radio. **orientation** `vertical` stacks the segments.
 */
export const WithIcons: Story = {
  parameters: {
    docs: {
      source: {
        code: `<SegmentedControl aria-label="Alignment" defaultValue="left">
  <SegmentedControlItem aria-label="Align left" value="left"><Icon size="sm">{leftIcon}</Icon></SegmentedControlItem>
  <SegmentedControlItem aria-label="Align center" value="center"><Icon size="sm">{centerIcon}</Icon></SegmentedControlItem>
  <SegmentedControlItem aria-label="Align right" value="right"><Icon size="sm">{rightIcon}</Icon></SegmentedControlItem>
</SegmentedControl>`,
      },
    },
  },
  render: () => (
    <SegmentedControl aria-label="Alignment" defaultValue="left">
      {[
        ['left', 'M4 6h16M4 12h10M4 18h14'],
        ['center', 'M4 6h16M7 12h10M5 18h14'],
        ['right', 'M4 6h16M10 12h10M6 18h14'],
      ].map(([value, path]) => (
        <SegmentedControlItem aria-label={`Align ${value}`} key={value} value={value}>
          <Icon size="sm">
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d={path} />
            </svg>
          </Icon>
        </SegmentedControlItem>
      ))}
    </SegmentedControl>
  ),
}

/**
 * **disabled** turns off every segment, an option with `disabled` (or a `SegmentedControlItem`) only that one, and
 * **readOnly** keeps the selection without letting the user change it. The arrow keys skip a disabled segment.
 */
export const States: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-col items-start gap-8">
  <SegmentedControl aria-label="One option disabled" defaultValue="day" options={[{ label: 'Day', value: 'day' }, { disabled: true, label: 'Week', value: 'week' }, { label: 'Month', value: 'month' }]} />
  <SegmentedControl aria-label="Disabled" defaultValue="week" disabled options={views} />
  <SegmentedControl aria-label="Read only" defaultValue="week" options={views} readOnly />
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-col items-start gap-8">
      <SegmentedControl
        aria-label="One option disabled"
        defaultValue="day"
        options={[
          { label: 'Day', value: 'day' },
          { disabled: true, label: 'Week', value: 'week' },
          { label: 'Month', value: 'month' },
        ]}
      />
      <SegmentedControl aria-label="Disabled" defaultValue="week" disabled options={views} />
      <SegmentedControl aria-label="Read only" defaultValue="week" options={views} readOnly />
    </div>
  ),
}

/**
 * Set **aria-invalid** to mark the control as invalid: it gets an error outline and `data-invalid`, for a form that
 * needs a choice.
 */
export const Invalid: Story = {
  parameters: {
    docs: {
      source: {
        code: `<SegmentedControl aria-invalid aria-label="View" options={views} required />`,
      },
    },
  },
  render: () => <SegmentedControl aria-invalid aria-label="View" options={views} required />,
}

/**
 * Inside a `Field`, its label names the control. With **name** a form submits the selected value, and **required**
 * marks it as required.
 */
export const WithField: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Field helperText="Changes the calendar below." label="View">
  <SegmentedControl defaultValue="week" name="view" options={views} />
</Field>`,
      },
    },
  },
  render: () => (
    <Field helperText="Changes the calendar below." label="View">
      <SegmentedControl defaultValue="week" name="view" options={views} />
    </Field>
  ),
}

/**
 * Some examples of SegmentedControl with Tailwind classes. With `variant="unstyled"` the root and each
 * `SegmentedControlItem` take your classes; the selected segment has `data-checked`, the disabled one `data-disabled`.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<SegmentedControl aria-label="View" className="gap-1 rounded-lg bg-surface-muted p-1" defaultValue="week" variant="unstyled">
  {['day', 'week', 'month'].map((view) => (
    <SegmentedControlItem
      className="rounded-md px-3 py-1.5 text-sm font-medium capitalize text-foreground has-[:focus-visible]:outline-2 data-[checked]:bg-primary-solid data-[checked]:text-white"
      key={view}
      value={view}
    >
      {view}
    </SegmentedControlItem>
  ))}
</SegmentedControl>`,
      },
    },
  },
  render: () => (
    <SegmentedControl
      aria-label="View"
      className="gap-1 rounded-lg bg-surface-muted p-1"
      defaultValue="week"
      variant="unstyled"
    >
      {['day', 'week', 'month'].map((view) => (
        <SegmentedControlItem
          className="rounded-md px-3 py-1.5 text-sm font-medium capitalize text-foreground has-[:focus-visible]:outline-2 data-[checked]:bg-primary-solid data-[checked]:text-white"
          key={view}
          value={view}
        >
          {view}
        </SegmentedControlItem>
      ))}
    </SegmentedControl>
  ),
}

/**
 * Some examples of SegmentedControl with Bootstrap classes: `btn-group` on the root and `btn border text-body`
 * on each item, with a small rule for the selected one.
 */
export const Bootstrap: Story = {
  parameters: {
    docs: {
      source: {
        code: `<>
  <style>{".bs-segmented [data-checked] { background-color: var(--bs-secondary-bg); }"}</style>
  <SegmentedControl aria-label="View" className="bs-segmented btn-group" defaultValue="week" variant="unstyled">
    {['Day', 'Week', 'Month'].map((view) => (
      <SegmentedControlItem className="btn border text-body" key={view} value={view.toLowerCase()}>
        {view}
      </SegmentedControlItem>
    ))}
  </SegmentedControl>
</>`,
      },
    },
  },
  render: () => (
    <>
      <style>{'.bs-segmented [data-checked] { background-color: var(--bs-secondary-bg); }'}</style>
      <SegmentedControl
        aria-label="View"
        className="bs-segmented btn-group"
        defaultValue="week"
        variant="unstyled"
      >
        {['Day', 'Week', 'Month'].map((view) => (
          <SegmentedControlItem
            className="btn border text-body"
            key={view}
            value={view.toLowerCase()}
          >
            {view}
          </SegmentedControlItem>
        ))}
      </SegmentedControl>
    </>
  ),
}
