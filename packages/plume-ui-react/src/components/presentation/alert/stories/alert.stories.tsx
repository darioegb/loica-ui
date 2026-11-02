import type { StoryObj, Meta } from '@storybook/react-vite'
import { Button } from '../../../interaction/button'
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '..'

const statuses = ['info', 'success', 'warning', 'error'] as const

/**
 * A message that stays in the page, next to the content it is about: a notice, a confirmation, a warning or an
 * error. It is the inline counterpart of the `Toast`, which appears for a moment and goes away on its own.
 *
 * The **status** gives it its color and its icon. It is also its role: an `error` is announced right away
 * (`role="alert"`) and the other statuses politely (`role="status"`), so a screen reader reads a message that shows
 * up after something the user did. When the Alert is part of the page from the start, use **role** to change it
 * (`note` for a message that doesn't need to be announced).
 *
 * Put a `AlertTitle` and a `AlertDescription` inside, or just the text. With **dismissible** it gets a close
 * button, named by the `close` text of the `LocaleProvider`, and it goes away when it is pressed. **onDismiss** tells you, so you can keep
 * it away. An **action**, such as a button or a link, goes at the end.
 *
 * The `Alert` draws the icon, the content, the action and the close button from its props (**icon**, the children,
 * **action** and **dismissible**). Only the title and the description are parts, because you write them. Each element
 * carries a `data-plume-alert-*` attribute (`icon`, `content`, `action`, `dismiss`), so it can be styled from the
 * parent, or by putting your own element in **icon** or **action**.
 */
export default {
  title: 'Components/Alert',
  component: Alert,
  tags: ['autodocs'],
  parameters: {
    docs: {
      importNames: [
        'Alert',
        'AlertDescription',
        'AlertTitle',
      ],
      toc: {
        title: 'On this page',
        disable: false,
      },
    },
    layout: 'centered',
  },
  argTypes: {
    children: {
      control: false,
    },
    status: {
      control: 'radio',
      options: statuses,
    },
    variant: {
      control: 'radio',
      options: ['subtle', 'solid', 'outline', 'unstyled'],
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
    },
    icon: {
      control: false,
    },
    action: {
      control: false,
    },
    dismissible: {
      control: 'boolean',
    },
    className: {
      control: 'text',
    },
    style: {
      control: false,
    },
    onDismiss: {
      control: false,
    },
    id: {
      control: false,
    },
    title: {
      control: 'text',
    },
    hidden: {
      control: 'boolean',
    },
    role: {
      control: 'text',
    },
    'aria-label': {
      control: 'text',
    },
    'aria-labelledby': {
      control: false,
    },
  },
  args: {
    style: { width: '28rem', maxWidth: '100%' },
  },
  render: (args) => (
    <Alert {...args}>
      <AlertTitle>Your trial ends tomorrow</AlertTitle>
      <AlertDescription>Choose a plan to keep your projects and your history.</AlertDescription>
    </Alert>
  ),
} satisfies Meta<typeof Alert>

type Story = StoryObj<typeof Alert>

/**
 * This is the default Alert: an info message with a title and a description.
 */
export const Default: Story = {}

/**
 * Use the **variant** prop to pick how the Alert looks: `subtle` tints the background, `solid` fills it,
 * `outline` draws its border, and `unstyled` drops the Plume styles so you can style it yourself.
 */
export const Variants: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-col gap-3">
  <Alert variant="subtle">
    <AlertTitle>Subtle</AlertTitle>
    <AlertDescription>An alert with the subtle variant.</AlertDescription>
  </Alert>
  <Alert variant="solid">
    <AlertTitle>Solid</AlertTitle>
    <AlertDescription>An alert with the solid variant.</AlertDescription>
  </Alert>
  <Alert variant="outline">
    <AlertTitle>Outline</AlertTitle>
    <AlertDescription>An alert with the outline variant.</AlertDescription>
  </Alert>
  <Alert className="flex gap-2 rounded-md border border-gray-400 p-3" variant="unstyled">
    <AlertTitle>Unstyled</AlertTitle>
    <AlertDescription>An alert with the unstyled variant.</AlertDescription>
  </Alert>
</div>`,
      },
    },
  },
  render: (args) => (
    <div className="flex flex-col gap-3">
      {(['subtle', 'solid', 'outline'] as const).map((variant) => (
        <Alert {...args} key={variant} variant={variant}>
          <AlertTitle>{variant[0].toUpperCase() + variant.slice(1)}</AlertTitle>
          <AlertDescription>An alert with the {variant} variant.</AlertDescription>
        </Alert>
      ))}
      <Alert
        {...args}
        className="flex gap-2 rounded-md border border-gray-400 p-3"
        variant="unstyled"
      >
        <AlertTitle>Unstyled</AlertTitle>
        <AlertDescription>An alert with the unstyled variant.</AlertDescription>
      </Alert>
    </div>
  ),
}

/**
 * Use the **size** prop to change the padding and the text of the Alert.
 */
export const Sizes: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-col gap-3">
  <Alert size="sm">
    <AlertTitle>Size sm</AlertTitle>
    <AlertDescription>The padding and the text follow the size.</AlertDescription>
  </Alert>
  <Alert size="md">
    <AlertTitle>Size md</AlertTitle>
    <AlertDescription>The padding and the text follow the size.</AlertDescription>
  </Alert>
  <Alert size="lg">
    <AlertTitle>Size lg</AlertTitle>
    <AlertDescription>The padding and the text follow the size.</AlertDescription>
  </Alert>
</div>`,
      },
    },
  },
  render: (args) => (
    <div className="flex flex-col gap-3">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Alert {...args} key={size} size={size}>
          <AlertTitle>Size {size}</AlertTitle>
          <AlertDescription>The padding and the text follow the size.</AlertDescription>
        </Alert>
      ))}
    </div>
  ),
}

/**
 * The color of an Alert is its **status**: `info`, `success`, `warning` or `error`. It also sets the icon and the
 * role. The other variants use the same colors: `solid` fills the Alert with it and `outline` draws its border.
 */
export const Colors: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-col gap-3">
  <Alert status="info">
    <AlertTitle>Info</AlertTitle>
    <AlertDescription>An alert with the info status.</AlertDescription>
  </Alert>
  <Alert status="success">
    <AlertTitle>Success</AlertTitle>
    <AlertDescription>An alert with the success status.</AlertDescription>
  </Alert>
  <Alert status="warning">
    <AlertTitle>Warning</AlertTitle>
    <AlertDescription>An alert with the warning status.</AlertDescription>
  </Alert>
  <Alert status="error">
    <AlertTitle>Error</AlertTitle>
    <AlertDescription>An alert with the error status.</AlertDescription>
  </Alert>
</div>`,
      },
    },
  },
  render: (args) => (
    <div className="flex flex-col gap-3">
      {statuses.map((status) => (
        <Alert {...args} key={status} status={status} variant="subtle">
          <AlertTitle>{status[0].toUpperCase() + status.slice(1)}</AlertTitle>
          <AlertDescription>An alert with the {status} status.</AlertDescription>
        </Alert>
      ))}
    </div>
  ),
}

/**
 * The title and the description are optional: an Alert can be a single line of text.
 */
export const TextOnly: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      <Alert {...args}>Your changes were saved.</Alert>
      <Alert {...args}>
        <AlertTitle>Only a title</AlertTitle>
      </Alert>
    </div>
  ),
}

/**
 * By default the icon is the one of the status. Pass your own **icon**, or `false` to show none.
 */
export const Icons: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      <Alert
        {...args}
        icon={
          <svg
            fill="none"
            height="1em"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="1em"
          >
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0" />
          </svg>
        }
      >
        <AlertTitle>A custom icon</AlertTitle>
      </Alert>
      <Alert {...args} icon={false}>
        <AlertTitle>No icon</AlertTitle>
      </Alert>
    </div>
  ),
}

/**
 * With **dismissible** the Alert has a close button and goes away when it is pressed. **onDismiss** tells you,
 * so you can keep it away the next time. Translate the name of the button with the `close` text of the `LocaleProvider`.
 */
export const Dismissible: Story = {
  args: { dismissible: true, status: 'success' },
}

/**
 * An **action** goes at the end of the Alert: a button or a link to what the user can do about the message.
 */
export const WithAction: Story = {
  args: {
    action: <Button colorScheme="warning" size="sm">Choose a plan</Button>,
    dismissible: true,
    status: 'warning',
  },
}

/**
 * An `error` is announced right away (`role="alert"`) and the other statuses politely (`role="status"`). When the
 * Alert is part of the page from the start, give it `role="note"` so it is not announced when the page loads.
 * Use `as="h2"` in the title when it belongs in the outline of the page.
 */
export const Accessibility: Story = {
  render: (args) => (
    <Alert {...args} role="note" status="warning">
      <AlertTitle as="h2">Scheduled maintenance</AlertTitle>
      <AlertDescription>The service will be down on Sunday from 02:00 to 04:00.</AlertDescription>
    </Alert>
  ),
}

/**
 * The title and the description are parts you write inside the Alert, and they go in its content. The **icon** takes
 * your own element, and the **action** goes at the end.
 */
export const Compound: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Alert
  action={<Button colorScheme="warning" size="sm">Choose a plan</Button>}
  dismissible
  icon="⚠️"
  status="warning"
>
  <AlertTitle as="h3">Your trial ends tomorrow</AlertTitle>
  <AlertDescription>Choose a plan to keep your projects.</AlertDescription>
</Alert>`,
      },
    },
  },
  render: (args) => (
    <Alert
      {...args}
      action={<Button colorScheme="warning" size="sm">Choose a plan</Button>}
      dismissible
      icon="⚠️"
      status="warning"
    >
      <AlertTitle as="h3">Your trial ends tomorrow</AlertTitle>
      <AlertDescription>Choose a plan to keep your projects.</AlertDescription>
    </Alert>
  ),
}

/**
 * Some examples of Alert with Tailwind classes. With `variant="unstyled"` the Alert has no Plume styles, so it takes the classes you give it. The inner elements are styled from the parent with their `data-plume-alert-*` attribute, or with your own element in `icon`.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Alert
  className="w-[28rem] max-w-full rounded-lg border-l-4 border-blue-700 bg-blue-50 text-blue-900 [&_[data-plume-alert-content]]:text-sm [&_[data-plume-alert-dismiss]]:rounded-sm [&_[data-plume-alert-dismiss]]:p-1 [&_[data-plume-alert-dismiss]]:hover:bg-blue-100"
  dismissible
  icon={<span className="text-blue-700">ℹ</span>}
  status="info"
  style={{ padding: '0.75rem 1rem' }}
  variant="unstyled"
>
  <AlertTitle className="font-semibold">Your trial ends tomorrow</AlertTitle>
  <AlertDescription>Choose a plan to keep your projects.</AlertDescription>
</Alert>`,
      },
    },
  },
  render: () => (
    <Alert
      className="w-[28rem] max-w-full rounded-lg border-l-4 border-blue-700 bg-blue-50 text-blue-900 [&_[data-plume-alert-content]]:text-sm [&_[data-plume-alert-dismiss]]:rounded-sm [&_[data-plume-alert-dismiss]]:p-1 [&_[data-plume-alert-dismiss]]:hover:bg-blue-100"
      dismissible
      icon={<span className="text-blue-700">ℹ</span>}
      status="info"
      style={{ padding: '0.75rem 1rem' }}
      variant="unstyled"
    >
      <AlertTitle className="font-semibold">Your trial ends tomorrow</AlertTitle>
      <AlertDescription>Choose a plan to keep your projects.</AlertDescription>
    </Alert>
  ),
}

/**
 * Some examples of Alert with Bootstrap classes: `alert` and `alert-primary`. The close button has no class of its
 * own, so it takes the look of the parent; put a `btn` in the `action` when you want a Bootstrap button.
 */
export const Bootstrap: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Alert
  action={<button className="btn btn-primary btn-sm" type="button">Choose a plan</button>}
  className="alert alert-primary d-flex align-items-start gap-2 mb-0"
  icon={<span className="text-primary">ℹ</span>}
  status="info"
  style={{ width: '28rem', maxWidth: '100%' }}
  variant="unstyled"
>
  <AlertTitle className="fw-semibold">Your trial ends tomorrow</AlertTitle>
  <AlertDescription>Choose a plan to keep your projects.</AlertDescription>
</Alert>`,
      },
    },
  },
  render: () => (
    <Alert
      action={<button className="btn btn-primary btn-sm" type="button">Choose a plan</button>}
      className="alert alert-primary d-flex align-items-start gap-2 mb-0"
      icon={<span className="text-primary">ℹ</span>}
      status="info"
      style={{ width: '28rem', maxWidth: '100%' }}
      variant="unstyled"
    >
      <AlertTitle className="fw-semibold">Your trial ends tomorrow</AlertTitle>
      <AlertDescription>Choose a plan to keep your projects.</AlertDescription>
    </Alert>
  ),
}
