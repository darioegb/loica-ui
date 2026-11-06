import type { StoryObj, Meta } from '@storybook/react-vite'
import { useState } from 'react'
import { defaultTheme } from '../../../../theme'
import { Chip } from '..'

const colorSchemes = Object.keys(defaultTheme.colors)

const avatar = (letter: string, color: string): React.ReactNode => (
  <img
    alt=""
    height={20}
    src={`data:image/svg+xml,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="${color}"/><text x="12" y="16.5" font-family="sans-serif" font-size="12" font-weight="700" text-anchor="middle" fill="white">${letter}</text></svg>`,
    )}`}
    width={20}
  />
)

const noop = (): void => undefined

/**
 * A compact element for a value the user has entered or picked, like a tag, a filter or a recipient.
 * It can have an icon or an image and, with `onRemove`, a button to remove it. A `Select` that allows several values
 * shows each one as a chip.
 *
 * It renders a `<span>`. The remove button is named after the chip (`Remove Design`), and an icon is decorative, so the text has to say what the chip is. A `Badge` labels a status
 * or a count and is never interactive, a `Chip` is a value that can go away.
 *
 * ### Inner elements
 *
 * The Chip draws its icon, its text and its remove button, in that order. They carry `data-loica-chip-icon`,
 * `data-loica-chip-label` and `data-loica-chip-remove`, so they can be styled from the Chip. The start of the name of
 * the remove button is the `chip.remove` text of the `LocaleProvider`.
 */
export default {
  title: 'Components/Chip',
  component: Chip,
  tags: ['autodocs'],
  parameters: {
    docs: {
      toc: {
        title: 'On this page',
        disable: false,
      },
    },
    layout: 'centered',
  },
  argTypes: {
    children: {
      control: 'text',
    },
    className: {
      control: 'text',
    },
    style: {
      control: false,
    },
    colorScheme: {
      control: 'select',
      options: colorSchemes,
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
    },
    shape: {
      control: 'radio',
      options: ['rounded', 'pill'],
    },
    variant: {
      control: 'radio',
      options: ['solid', 'outline', 'subtle', 'unstyled'],
    },
    icon: {
      control: false,
    },
    onRemove: {
      control: false,
    },
    disabled: {
      control: 'boolean',
    },
    id: {
      control: false,
    },
    title: {
      control: 'text',
    },
    hidden: {
      control: false,
    },
    'aria-label': {
      control: false,
    },
    'aria-labelledby': {
      control: false,
    },
  },
  args: {
    children: 'Design',
  },
} satisfies Meta<typeof Chip>

type Story = StoryObj<typeof Chip>

/**
 * This is the default Chip: a subtle, pill-shaped label. Its text is its **children**, or the **label** prop, so
 * the tag can close on itself: `<Chip label="React" />`.
 */
export const Default: Story = {}

/**
 * Use the **variant** prop to pick how the Chip looks: `subtle` tints it, `solid` fills it, `outline` only draws
 * its border, and `unstyled` drops the Loica styles so you can style it yourself.
 */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Chip variant="subtle">Subtle</Chip>
      <Chip variant="solid">Solid</Chip>
      <Chip variant="outline">Outline</Chip>
      <Chip variant="unstyled">Unstyled</Chip>
    </div>
  ),
}

/**
 * Use the **size** prop to change the text and the padding of the Chip.
 */
export const Sizes: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-wrap items-center gap-3">
  <Chip onRemove={() => undefined} size="sm">Size sm</Chip>
  <Chip onRemove={() => undefined} size="md">Size md</Chip>
  <Chip onRemove={() => undefined} size="lg">Size lg</Chip>
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Chip key={size} onRemove={noop} size={size}>
          Size {size}
        </Chip>
      ))}
    </div>
  ),
}

/**
 * Use the **colorScheme** prop to color the Chip with any color of the theme, including the ones you add. They are
 * shown in the `subtle` variant: `solid` fills the Chip with the color and `outline` draws its border with it.
 */
export const Colors: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-wrap items-center gap-3">
  <Chip colorScheme="primary">primary</Chip>
  <Chip colorScheme="success">success</Chip>
  <Chip colorScheme="error">error</Chip>
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      {colorSchemes.map((colorScheme) => (
        <Chip colorScheme={colorScheme as keyof typeof defaultTheme.colors} key={colorScheme}>
          {colorScheme}
        </Chip>
      ))}
    </div>
  ),
}

function RemovableExample(): React.ReactNode {
  const [tags, setTags] = useState(['Design', 'Research', 'Engineering', 'Product'])
  return (
    <div className="flex max-w-sm flex-wrap items-center justify-center gap-2">
      {tags.map((tag) => (
        <Chip key={tag} onRemove={() => setTags(tags.filter((item) => item !== tag))}>
          {tag}
        </Chip>
      ))}
      {tags.length === 0 ? <small>No tags left. Reload the story to get them back.</small> : null}
    </div>
  )
}

/**
 * With **onRemove** the Chip has a button to remove it. Its name is `Remove` followed by the text of the Chip, so
 * a screen reader says which one goes away, and the `chip.remove` text of the `LocaleProvider` translates `Remove`.
 */
export const Removable: Story = {
  parameters: {
    docs: {
      source: {
        code: `function Example() {
  const [tags, setTags] = useState(['Design', 'Research', 'Engineering', 'Product'])
  return (
    <div className="flex max-w-sm flex-wrap items-center justify-center gap-2">
      {tags.map((tag) => (
        <Chip key={tag} onRemove={() => setTags(tags.filter((item) => item !== tag))}>
          {tag}
        </Chip>
      ))}
      {tags.length === 0 ? <small>No tags left.</small> : null}
    </div>
  )
}`,
      },
    },
  },
  render: () => <RemovableExample />,
}

/**
 * An **icon** goes before the text, and it can be an image: give it `alt=""`, because it is decorative and the
 * text names the Chip.
 */
export const WithImage: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Chip icon={avatar('A', '#6d28d9')} onRemove={noop}>
        Ada Lovelace
      </Chip>
      <Chip icon={avatar('G', '#b45309')} onRemove={noop} variant="outline">
        Grace Hopper
      </Chip>
      <Chip colorScheme="primary" icon={avatar('L', '#047857')} variant="solid">
        Linus Torvalds
      </Chip>
    </div>
  ),
}

/**
 * A **disabled** Chip is dimmed and its remove button can't be used.
 */
export const Disabled: Story = {
  render: () => (
    <Chip disabled onRemove={noop}>
      Design
    </Chip>
  ),
}

/**
 * Some examples of Chip with Tailwind classes. With `variant="unstyled"` the `className` is the only class of the Chip and its inner elements are styled from it with their `data-loica-chip-*` attribute.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-wrap items-center gap-3">
  <Chip
    className="rounded-full bg-primary-solid py-0.5 pl-3 pr-1 text-xs font-semibold text-primary-on-solid [&>[data-loica-chip-remove]]:h-4 [&>[data-loica-chip-remove]]:w-4 [&>[data-loica-chip-remove]]:justify-center [&>[data-loica-chip-remove]]:rounded-full [&>[data-loica-chip-remove]]:hover:bg-white/25"
    onRemove={() => undefined}
    variant="unstyled"
  >
    Design
  </Chip>
  <Chip
    className="rounded-md border border-emerald-600 py-0.5 pl-2 pr-1 text-xs font-medium text-emerald-700 dark:text-emerald-400 [&>[data-loica-chip-remove]]:h-4 [&>[data-loica-chip-remove]]:w-4 [&>[data-loica-chip-remove]]:justify-center [&>[data-loica-chip-remove]]:rounded-sm [&>[data-loica-chip-remove]]:hover:bg-emerald-100 dark:[&>[data-loica-chip-remove]]:hover:bg-emerald-950"
    onRemove={() => undefined}
    variant="unstyled"
  >
    Research
  </Chip>
  <Chip
    className="rounded-full bg-gray-200 px-3 py-1 text-sm text-gray-900"
    variant="unstyled"
  >
    Read only
  </Chip>
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Chip
        className="rounded-full bg-primary-solid py-0.5 pl-3 pr-1 text-xs font-semibold text-primary-on-solid [&>[data-loica-chip-remove]]:h-4 [&>[data-loica-chip-remove]]:w-4 [&>[data-loica-chip-remove]]:justify-center [&>[data-loica-chip-remove]]:rounded-full [&>[data-loica-chip-remove]]:hover:bg-white/25"
        onRemove={() => undefined}
        variant="unstyled"
      >
        Design
      </Chip>
      <Chip
        className="rounded-md border border-emerald-600 py-0.5 pl-2 pr-1 text-xs font-medium text-emerald-700 dark:text-emerald-400 [&>[data-loica-chip-remove]]:h-4 [&>[data-loica-chip-remove]]:w-4 [&>[data-loica-chip-remove]]:justify-center [&>[data-loica-chip-remove]]:rounded-sm [&>[data-loica-chip-remove]]:hover:bg-emerald-100 dark:[&>[data-loica-chip-remove]]:hover:bg-emerald-950"
        onRemove={() => undefined}
        variant="unstyled"
      >
        Research
      </Chip>
      <Chip className="rounded-full bg-gray-200 px-3 py-1 text-sm text-gray-900" variant="unstyled">
        Read only
      </Chip>
    </div>
  ),
}

/**
 * Some examples of Chip with Bootstrap classes: `badge` with a `text-bg-*` color and `rounded-pill`, plus `d-inline-flex` to keep the icon and the remove button in a row (Bootstrap makes a badge `display: inline-block`).
 */
export const Bootstrap: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="d-flex flex-wrap align-items-center gap-2">
  <Chip
    className="badge rounded-pill text-bg-primary d-inline-flex align-items-center gap-2 fw-normal"
    onRemove={() => undefined}
    variant="unstyled"
  >
    Design
  </Chip>
  <Chip
    className="badge rounded-pill text-bg-success d-inline-flex align-items-center gap-2 fw-normal"
    onRemove={() => undefined}
    variant="unstyled"
  >
    Research
  </Chip>
  <Chip className="badge rounded-pill border text-body fw-normal" variant="unstyled">
    Read only
  </Chip>
</div>`,
      },
    },
  },
  render: () => (
    <div className="d-flex flex-wrap align-items-center gap-2">
      <Chip
        className="badge rounded-pill text-bg-primary d-inline-flex align-items-center gap-2 fw-normal"
        onRemove={() => undefined}
        variant="unstyled"
      >
        Design
      </Chip>
      <Chip
        className="badge rounded-pill text-bg-success d-inline-flex align-items-center gap-2 fw-normal"
        onRemove={() => undefined}
        variant="unstyled"
      >
        Research
      </Chip>
      <Chip className="badge rounded-pill border text-body fw-normal" variant="unstyled">
        Read only
      </Chip>
    </div>
  ),
}
