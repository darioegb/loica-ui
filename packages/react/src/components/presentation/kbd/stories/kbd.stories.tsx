import type { StoryObj, Meta } from '@storybook/react-vite'
import { defaultTheme } from '../../../../theme'
import { Text } from '../../text'
import { Kbd } from '..'

const colorSchemes = Object.keys(defaultTheme.colors)

/**
 * A key that the user presses, such as <kbd>Esc</kbd> or one key of a shortcut.
 * It is an inline `<kbd>` that scales with the text around it, and it keeps its text on one line.
 * Write a shortcut with one Kbd per key and the separator as plain text.
 *
 * Its font is the `--loica-font-family-mono` token of the theme. Without a **size** it takes the size of the text
 * around it; with one, it uses the sizes of the theme.
 */
export default {
  title: 'Components/Kbd',
  component: Kbd,
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
      description: 'The key.',
      table: { type: { summary: 'ReactNode' } },
    },
    className: {
      control: 'text',
      description: 'Custom CSS class for the Kbd.',
      table: { type: { summary: 'string' } },
    },
    style: {
      control: false,
      description:
        'Inline styles for the Kbd. They are applied after the color variables, so they can override them (e.g. `--kbd-text`).',
      table: { type: { summary: 'CSSProperties' } },
    },
    colorScheme: {
      control: 'select',
      options: colorSchemes,
    },
    label: {
      control: 'text',
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
    },
    variant: {
      control: 'radio',
      options: ['outline', 'subtle', 'unstyled'],
    },
  },
  args: {
    label: 'Esc',
  },
} satisfies Meta<typeof Kbd>

type Story = StoryObj<typeof Kbd>

/**
 * The default Kbd is outlined with the secondary color. Its text can be the **label** prop, so it closes on itself:
 * `children` take its place when both are set.
 */
export const Default: Story = {}

/**
 * Use the **variant** prop to pick how the Kbd looks: `outline` draws the edge of the key and
 * `subtle` tints its background.
 */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <Kbd variant="outline">outline</Kbd>
      <Kbd variant="subtle">subtle</Kbd>
      <Kbd variant="unstyled">unstyled</Kbd>
    </div>
  ),
}

/**
 * Use the **size** prop to give it a size of the theme. Without it, the Kbd takes the size of the text around it.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <Kbd label="Esc" size="sm" />
      <Kbd label="Esc" size="md" />
      <Kbd label="Esc" size="lg" />
    </div>
  ),
}

/**
 * Use the **colorScheme** prop to pick a color from the theme. The `outline` variant draws the
 * border and the text with it.
 */
export const Colors: Story = {
  render: () => (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {colorSchemes.map((scheme) => (
        <Kbd colorScheme={scheme as keyof typeof defaultTheme.colors} key={scheme}>
          {scheme}
        </Kbd>
      ))}
    </div>
  ),
}

/**
 * A shortcut is one Kbd per key, with the separator as text between them. The Kbd takes the size of
 * the text around it.
 */
export const Shortcut: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Text>
  Press <Kbd>Ctrl</Kbd> + <Kbd>K</Kbd> to open the search, or <Kbd>Esc</Kbd> to close it.
</Text>`,
      },
    },
  },
  render: () => (
    <div className="max-w-md">
      <Text>
        Press <Kbd>Ctrl</Kbd> + <Kbd>K</Kbd> to open the search, or <Kbd>Esc</Kbd> to close it.
      </Text>
    </div>
  ),
}

/**
 * Some examples of Kbd with Tailwind classes. With `variant="unstyled"` the `className` is the only class of the key.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Text>
  Press{' '}
  <Kbd
    className="rounded-sm border border-border border-b-2 bg-surface px-1.5 font-mono text-[0.875em] text-foreground"
    variant="unstyled"
  >
    Ctrl
  </Kbd>
  {' + '}
  <Kbd
    className="rounded-sm border border-border border-b-2 bg-surface px-1.5 font-mono text-[0.875em] text-foreground"
    variant="unstyled"
  >
    K
  </Kbd>
</Text>`,
      },
    },
  },
  render: () => (
    <Text>
      Press{' '}
      <Kbd
        className="rounded-sm border border-border border-b-2 bg-surface px-1.5 font-mono text-[0.875em] text-foreground"
        variant="unstyled"
      >
        Ctrl
      </Kbd>
      {' + '}
      <Kbd
        className="rounded-sm border border-border border-b-2 bg-surface px-1.5 font-mono text-[0.875em] text-foreground"
        variant="unstyled"
      >
        K
      </Kbd>
    </Text>
  ),
}

/**
 * Some examples of Kbd with Bootstrap classes: the `<kbd>` of Bootstrap already has a dark key
 * look that follows the color mode, so `variant="unstyled"` is enough.
 */
export const Bootstrap: Story = {
  parameters: {
    docs: {
      source: {
        code: `<p>
  Press <Kbd variant="unstyled">Ctrl</Kbd> + <Kbd variant="unstyled">K</Kbd>
</p>`,
      },
    },
  },
  render: () => (
    <p>
      Press <Kbd variant="unstyled">Ctrl</Kbd> + <Kbd variant="unstyled">K</Kbd>
    </p>
  ),
}
