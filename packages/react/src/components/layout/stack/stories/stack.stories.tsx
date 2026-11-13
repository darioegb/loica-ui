import type { StoryObj, Meta } from '@storybook/react-vite'
import { Stack } from '..'

/**
 * Lines its children up in a column or a row, with the same space between them. It is the layout you would write
 * with `display: flex` and a `gap`, with the values of the theme.
 *
 * **direction** is `column` by default, and **gap** is a key of the `spaces` of the theme. **align** and
 * **justify** place the children on the cross and the main axis, and **wrap** lets a row go to the next line.
 * **stackBelow** turns a row into a column on a narrow screen, with a breakpoint of the theme and no media query of
 * your own. **as** picks the element, such as a `section`, a `nav` or a `ul`.
 *
 * Every option is a fixed set of values, resolved with the `data-*` attributes of the element and static CSS, so a
 * Stack costs no style at runtime. For that reason it takes no responsive object such as
 * `direction={{ base: 'column', md: 'row' }}`: use **stackBelow**, or `variant="unstyled"` with your own classes.
 */
export default {
  title: 'Components/Stack',
  component: Stack,
  tags: ['autodocs'],
  parameters: {
    docs: {
      toc: {
        title: 'On this page',
        disable: false,
      },
    },
    layout: 'padded',
  },
  argTypes: {
    children: {
      control: false,
    },
    className: {
      control: 'text',
    },
    style: {
      control: false,
    },
    align: {
      control: 'radio',
      options: [undefined, 'start', 'center', 'end', 'stretch', 'baseline'],
    },
    as: {
      control: 'select',
      options: ['div', 'section', 'header', 'footer', 'nav', 'main', 'aside', 'article', 'form', 'ul', 'ol'],
    },
    direction: {
      control: 'radio',
      options: ['column', 'row'],
    },
    gap: {
      control: 'select',
      options: [1, 1.5, 2, 3, 4, 5, 6, 8, 10, 12, 14, 16, 20],
    },
    justify: {
      control: 'radio',
      options: [undefined, 'start', 'center', 'end', 'between'],
    },
    stackBelow: {
      control: 'radio',
      options: [undefined, 'sm', 'md', 'lg', 'xl', '2xl'],
    },
    variant: {
      control: 'radio',
      options: ['default', 'unstyled'],
    },
    wrap: {
      control: 'boolean',
    },
  },
  args: {
    direction: 'column',
    gap: 4,
  },
} satisfies Meta<typeof Stack>

type Story = StoryObj<typeof Stack>

/**
 * This is the default Stack: a column with a gap of `4`. Change its props in the Controls panel.
 */
export const Default: Story = {
  render: (args) => (
    <Stack {...args}>
      <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">One</div>
      <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">Two</div>
      <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">Three</div>
    </Stack>
  ),
}

/**
 * Use **variant** to pick the look: `default` lays the children out, and `unstyled` drops the Loica styles, so
 * the element is a bare `div` that you lay out with your own classes.
 */
export const Variants: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-col gap-6">
  <Stack>
    <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">One</div>
    <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">Two</div>
    <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">Three</div>
  </Stack>
  <Stack variant="unstyled">
    <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">One</div>
    <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">Two</div>
    <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">Three</div>
  </Stack>
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6">
      <Stack>
        <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">One</div>
        <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">Two</div>
        <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">Three</div>
      </Stack>
      <Stack variant="unstyled">
        <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">One</div>
        <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">Two</div>
        <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">Three</div>
      </Stack>
    </div>
  ),
}

/**
 * A Stack goes down, in a `column`, unless **direction** is `row`, which puts the children side by side.
 */
export const Direction: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-col gap-6">
  <Stack direction="column">
    <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">One</div>
    <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">Two</div>
    <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">Three</div>
  </Stack>
  <Stack direction="row">
    <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">One</div>
    <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">Two</div>
    <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">Three</div>
  </Stack>
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6">
      <Stack direction="column">
        <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">One</div>
        <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">Two</div>
        <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">Three</div>
      </Stack>
      <Stack direction="row">
        <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">One</div>
        <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">Two</div>
        <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">Three</div>
      </Stack>
    </div>
  ),
}

/**
 * **gap** is the space between the children, a key of the `spaces` of the theme: `1` is `0.25rem`, `4` is `1rem` and
 * `10` is `2.5rem`.
 */
export const Gap: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-col gap-6">
  <Stack direction="row" gap={1}>
    <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">One</div>
    <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">Two</div>
    <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">Three</div>
  </Stack>
  <Stack direction="row" gap={4}>
    <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">One</div>
    <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">Two</div>
    <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">Three</div>
  </Stack>
  <Stack direction="row" gap={10}>
    <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">One</div>
    <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">Two</div>
    <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">Three</div>
  </Stack>
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6">
      <Stack direction="row" gap={1}>
        <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">One</div>
        <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">Two</div>
        <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">Three</div>
      </Stack>
      <Stack direction="row" gap={4}>
        <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">One</div>
        <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">Two</div>
        <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">Three</div>
      </Stack>
      <Stack direction="row" gap={10}>
        <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">One</div>
        <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">Two</div>
        <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">Three</div>
      </Stack>
    </div>
  ),
}

/**
 * **align** puts the children on the cross axis: up and down in a `row`, across in a `column`. Without it they
 * stretch.
 */
export const Align: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-col gap-6">
  <Stack align="start" direction="row">
    <div className="rounded-md bg-primary-tint px-3 py-1 text-primary-tint-text">Short</div>
    <div className="rounded-md bg-primary-tint px-3 py-6 text-primary-tint-text">Tall</div>
    <div className="rounded-md bg-primary-tint px-3 py-3 text-primary-tint-text">Medium</div>
  </Stack>
  <Stack align="center" direction="row">
    <div className="rounded-md bg-primary-tint px-3 py-1 text-primary-tint-text">Short</div>
    <div className="rounded-md bg-primary-tint px-3 py-6 text-primary-tint-text">Tall</div>
    <div className="rounded-md bg-primary-tint px-3 py-3 text-primary-tint-text">Medium</div>
  </Stack>
  <Stack align="end" direction="row">
    <div className="rounded-md bg-primary-tint px-3 py-1 text-primary-tint-text">Short</div>
    <div className="rounded-md bg-primary-tint px-3 py-6 text-primary-tint-text">Tall</div>
    <div className="rounded-md bg-primary-tint px-3 py-3 text-primary-tint-text">Medium</div>
  </Stack>
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6">
      <Stack align="start" direction="row">
        <div className="rounded-md bg-primary-tint px-3 py-1 text-primary-tint-text">Short</div>
        <div className="rounded-md bg-primary-tint px-3 py-6 text-primary-tint-text">Tall</div>
        <div className="rounded-md bg-primary-tint px-3 py-3 text-primary-tint-text">Medium</div>
      </Stack>
      <Stack align="center" direction="row">
        <div className="rounded-md bg-primary-tint px-3 py-1 text-primary-tint-text">Short</div>
        <div className="rounded-md bg-primary-tint px-3 py-6 text-primary-tint-text">Tall</div>
        <div className="rounded-md bg-primary-tint px-3 py-3 text-primary-tint-text">Medium</div>
      </Stack>
      <Stack align="end" direction="row">
        <div className="rounded-md bg-primary-tint px-3 py-1 text-primary-tint-text">Short</div>
        <div className="rounded-md bg-primary-tint px-3 py-6 text-primary-tint-text">Tall</div>
        <div className="rounded-md bg-primary-tint px-3 py-3 text-primary-tint-text">Medium</div>
      </Stack>
    </div>
  ),
}

/**
 * **justify** shares the free space on the main axis. `between` pushes the first child to the start and the last to the
 * end, as a toolbar with a title and its actions does.
 */
export const Justify: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-col gap-6">
  <Stack direction="row" justify="start">
    <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">One</div>
    <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">Two</div>
  </Stack>
  <Stack direction="row" justify="center">
    <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">One</div>
    <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">Two</div>
  </Stack>
  <Stack direction="row" justify="end">
    <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">One</div>
    <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">Two</div>
  </Stack>
  <Stack direction="row" justify="between">
    <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">One</div>
    <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">Two</div>
  </Stack>
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6">
      <Stack direction="row" justify="start">
        <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">One</div>
        <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">Two</div>
      </Stack>
      <Stack direction="row" justify="center">
        <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">One</div>
        <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">Two</div>
      </Stack>
      <Stack direction="row" justify="end">
        <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">One</div>
        <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">Two</div>
      </Stack>
      <Stack direction="row" justify="between">
        <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">One</div>
        <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">Two</div>
      </Stack>
    </div>
  ),
}

/**
 * With **wrap**, a `row` lets the children go to the next line when they don't fit, as tags or filters do.
 */
export const Wrap: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="w-72">
  <Stack direction="row" gap={2} wrap>
    <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">Design</div>
    <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">Frontend</div>
    <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">Accessibility</div>
    <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">Backend</div>
    <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">Docs</div>
  </Stack>
</div>`,
      },
    },
  },
  render: () => (
    <div className="w-72">
      <Stack direction="row" gap={2} wrap>
        <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">Design</div>
        <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">Frontend</div>
        <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">Accessibility</div>
        <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">Backend</div>
        <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">Docs</div>
      </Stack>
    </div>
  ),
}

/**
 * **stackBelow** turns a `row` into a `column` on a screen narrower than a breakpoint of the theme, with no
 * media query of your own. Resize the window: here the row stacks below `md` (48rem). The widths are the ones of the
 * default theme.
 */
export const StackBelow: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Stack direction="row" stackBelow="md">
  <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">One</div>
  <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">Two</div>
  <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">Three</div>
</Stack>`,
      },
    },
  },
  render: () => (
    <Stack direction="row" stackBelow="md">
      <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">One</div>
      <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">Two</div>
      <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">Three</div>
    </Stack>
  ),
}

/**
 * **as** picks the element for the landmark or the list the content is. A `ul` or an `ol` has no bullets and keeps its
 * `list` role for assistive technology.
 */
export const AsList: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Stack as="ul" gap={2}>
  <li className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">One</li>
  <li className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">Two</li>
  <li className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">Three</li>
</Stack>`,
      },
    },
  },
  render: () => (
    <Stack as="ul" gap={2}>
      <li className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">One</li>
      <li className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">Two</li>
      <li className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">Three</li>
    </Stack>
  ),
}

/**
 * With `variant="unstyled"` the Stack is a bare element, so a Tailwind class, as `flex flex-wrap gap-3 md:flex-row`,
 * lays it out the way you want.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Stack className="flex flex-col gap-3 md:flex-row" variant="unstyled">
  <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">One</div>
  <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">Two</div>
  <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">Three</div>
</Stack>`,
      },
    },
  },
  render: () => (
    <Stack className="flex flex-col gap-3 md:flex-row" variant="unstyled">
      <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">One</div>
      <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">Two</div>
      <div className="rounded-md bg-primary-tint px-3 py-2 text-primary-tint-text">Three</div>
    </Stack>
  ),
}

/**
 * The same with Bootstrap classes: `d-flex`, `flex-column` and `gap-3` on an `unstyled` Stack.
 */
export const Bootstrap: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Stack className="d-flex flex-column flex-md-row gap-3" variant="unstyled">
  <div className="border rounded p-2">One</div>
  <div className="border rounded p-2">Two</div>
  <div className="border rounded p-2">Three</div>
</Stack>`,
      },
    },
  },
  render: () => (
    <Stack className="d-flex flex-column flex-md-row gap-3" variant="unstyled">
      <div className="border rounded p-2">One</div>
      <div className="border rounded p-2">Two</div>
      <div className="border rounded p-2">Three</div>
    </Stack>
  ),
}
