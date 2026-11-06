import type { StoryObj, Meta } from '@storybook/react-vite'
import { useState } from 'react'
import { Button } from '../../../interaction/button'
import { Icon } from '../../../presentation/icon'
import { Tooltip } from '..'

const placements = [
  'top-start',
  'top',
  'top-end',
  'right',
  'bottom-start',
  'bottom',
  'bottom-end',
  'left',
] as const

const saveIcon = (
  <Icon>
    <svg
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2zM17 21v-8H7v8M7 3v5h8" />
    </svg>
  </Icon>
)

/**
 * A short hint that appears when the pointer rests on an element or when it takes the focus. Wrap the element in
 * a `Tooltip` and give it a `content`. The tooltip is linked to the element with `aria-describedby` while it is
 * open, it never takes the focus, and <kbd>Esc</kbd> closes it. The pointer can move onto the tooltip without it
 * closing, so its text can be read and selected.
 *
 * Use it for a name or a hint that is nice to have, never for what the user needs to know: it doesn't appear on
 * touch screens, and an element that is disabled doesn't fire the events that open it. An icon-only button needs
 * its own `aria-label`: the tooltip describes it, it doesn't name it.
 */
export default {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: {
    docs: {
      story: { inline: false, iframeHeight: 280 },
      toc: {
        title: 'On this page',
        disable: false,
      },
    },
    layout: 'centered',
  },
  argTypes: {
    children: { control: false },
    content: { control: 'text' },
    className: { control: 'text' },
    style: { control: false },
    placement: {
      control: 'select',
      options: [
        'top',
        'top-start',
        'top-end',
        'bottom',
        'bottom-start',
        'bottom-end',
        'left',
        'left-start',
        'left-end',
        'right',
        'right-start',
        'right-end',
      ],
    },
    offset: { control: 'number' },
    openDelay: { control: 'number' },
    closeDelay: { control: 'number' },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    variant: { control: 'radio', options: ['solid', 'outline', 'unstyled'] },
    disabled: { control: 'boolean' },
    open: { control: 'boolean' },
    defaultOpen: { control: 'boolean' },
    onOpenChange: { control: false },
  },
  args: {
    content: 'Save the changes',
  },
  render: (args) => (
    <Tooltip {...args}>
      <Button>Hover or focus me</Button>
    </Tooltip>
  ),
} satisfies Meta<typeof Tooltip>

type Story = StoryObj<typeof Tooltip>

/**
 * This is the default Tooltip. It opens when the pointer rests on the button or when the button takes the focus
 * with the keyboard, and closes with <kbd>Esc</kbd>, on blur or when the pointer leaves.
 */
export const Default: Story = {}

/**
 * Use the **variant** prop to pick how the tooltip looks: `solid` is dark on a light page and light on a dark
 * one, `outline` is a bordered surface, and `unstyled` drops the Loica styles so you can style it yourself.
 */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap justify-center gap-4">
      <Tooltip content="A solid tooltip" variant="solid">
        <Button variant="outline">Solid</Button>
      </Tooltip>
      <Tooltip content="An outline tooltip" variant="outline">
        <Button variant="outline">Outline</Button>
      </Tooltip>
      <Tooltip content="An unstyled tooltip" variant="unstyled">
        <Button variant="outline">Unstyled</Button>
      </Tooltip>
    </div>
  ),
}

/**
 * Use the **size** prop to change the text and the padding of the tooltip.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap justify-center gap-4">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Tooltip content={`Size ${size}`} key={size} size={size}>
          <Button variant="outline">{`Size ${size}`}</Button>
        </Tooltip>
      ))}
    </div>
  ),
}

/**
 * Use **placement** to put the tooltip on another side, and with an alignment (`bottom-start`). When there is
 * no room, it flips to the opposite side.
 */
export const Placements: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-3 p-2 sm:grid-cols-3 sm:gap-4 sm:p-12">
      {placements.map((placement) => (
        <Tooltip content={placement} key={placement} placement={placement}>
          <Button
            className="w-full whitespace-nowrap"
            size="sm"
            variant="outline"
          >
            {placement}
          </Button>
        </Tooltip>
      ))}
    </div>
  ),
}

/**
 * **openDelay** is how long the pointer rests before the tooltip opens, and **closeDelay** how long it waits
 * after the pointer leaves. Set **openDelay** to `0` for a tooltip that opens at once. Focus always opens it
 * with no delay.
 */
export const Delays: Story = {
  render: () => (
    <div className="flex flex-wrap justify-center gap-4">
      <Tooltip content="No delay" openDelay={0}>
        <Button variant="outline">Opens at once</Button>
      </Tooltip>
      <Tooltip content="A second later" openDelay={1000}>
        <Button variant="outline">Opens after a second</Button>
      </Tooltip>
    </div>
  ),
}

/**
 * An icon-only button needs an **aria-label** to have a name. The tooltip repeats it for sighted users who
 * don't know the icon.
 */
export const IconButton: Story = {
  render: () => (
    <Tooltip content="Save">
      <Button aria-label="Save" variant="icon">
        {saveIcon}
      </Button>
    </Tooltip>
  ),
}

/**
 * The **content** can be more than text, as long as it stays short and has nothing the user has to click:
 * the tooltip never takes the focus.
 */
export const RichContent: Story = {
  render: () => (
    <Tooltip
      content={
        <span>
          <strong>Save</strong> <kbd>Ctrl</kbd> + <kbd>S</kbd>
        </span>
      }
      variant="outline"
    >
      <Button variant="outline">Save</Button>
    </Tooltip>
  ),
}

function ControlledExample(): React.ReactNode {
  const [open, setOpen] = useState(false)
  return (
    <div className="flex flex-col items-center gap-3">
      <Tooltip content="Controlled tooltip" onOpenChange={setOpen} open={open}>
        <Button variant="outline">Hover or focus me</Button>
      </Tooltip>
      <Button
        onClick={() => setOpen(!open)}
        size="sm"
      >
        {open ? 'Close the tooltip' : 'Open the tooltip'}
      </Button>
    </div>
  )
}

/**
 * Pass **open** and **onOpenChange** to control the tooltip from your own state.
 */
export const Controlled: Story = {
  parameters: {
    docs: {
      source: {
        code: `function Example() {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-col items-center gap-3">
      <Tooltip content="Controlled tooltip" onOpenChange={setOpen} open={open}>
        <Button variant="outline">Hover or focus me</Button>
      </Tooltip>
      <Button
        onClick={() => setOpen(!open)}
        size="sm"
      >
        {open ? 'Close the tooltip' : 'Open the tooltip'}
      </Button>
    </div>
  )
}`,
      },
    },
  },
  render: () => <ControlledExample />,
}

/**
 * Some examples of Tooltip with Tailwind classes. With `variant="unstyled"` the `className` is the only class of the tooltip.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-wrap justify-center gap-4">
  <Tooltip
    className="rounded-sm bg-gray-900 px-2 py-1 text-xs text-white shadow-sm"
    content="Save the changes"
    variant="unstyled"
  >
    <Button
      className="rounded-sm bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
      variant="unstyled"
    >
      Dark tooltip
    </Button>
  </Tooltip>
  <Tooltip
    className="rounded-full border border-blue-600 bg-white px-3 py-1 text-xs font-medium text-blue-700 shadow-xs"
    content="Save the changes"
    placement="bottom"
    variant="unstyled"
  >
    <Button
      className="rounded-sm bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
      variant="unstyled"
    >
      Pill tooltip
    </Button>
  </Tooltip>
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap justify-center gap-4">
      <Tooltip
        className="rounded-sm bg-gray-900 px-2 py-1 text-xs text-white shadow-sm"
        content="Save the changes"
        variant="unstyled"
      >
        <Button
          className="rounded-sm bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
          variant="unstyled"
        >
          Dark tooltip
        </Button>
      </Tooltip>
      <Tooltip
        className="rounded-full border border-blue-600 bg-white px-3 py-1 text-xs font-medium text-blue-700 shadow-xs"
        content="Save the changes"
        placement="bottom"
        variant="unstyled"
      >
        <Button
          className="rounded-sm bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
          variant="unstyled"
        >
          Pill tooltip
        </Button>
      </Tooltip>
    </div>
  ),
}

/**
 * Some examples of Tooltip with Bootstrap classes: `tooltip show` on the tooltip and `tooltip-inner` on its content, which is where Bootstrap draws the box.
 */
export const Bootstrap: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="d-flex flex-wrap justify-content-center gap-3">
  <Tooltip
    className="tooltip show"
    content={<div className="tooltip-inner">Save the changes</div>}
    variant="unstyled"
  >
    <Button className="btn btn-primary" variant="unstyled">Top</Button>
  </Tooltip>
  <Tooltip
    className="tooltip show"
    content={<div className="tooltip-inner">Save the changes</div>}
    placement="bottom"
    variant="unstyled"
  >
    <Button className="btn btn-light border" variant="unstyled">Bottom</Button>
  </Tooltip>
</div>`,
      },
    },
  },
  render: () => (
    <div className="d-flex flex-wrap justify-content-center gap-3">
      <Tooltip
        className="tooltip show"
        content={<div className="tooltip-inner">Save the changes</div>}
        variant="unstyled"
      >
        <Button className="btn btn-primary" variant="unstyled">Top</Button>
      </Tooltip>
      <Tooltip
        className="tooltip show"
        content={<div className="tooltip-inner">Save the changes</div>}
        placement="bottom"
        variant="unstyled"
      >
        <Button className="btn btn-light border" variant="unstyled">Bottom</Button>
      </Tooltip>
    </div>
  ),
}
