import type { StoryObj, Meta } from '@storybook/react-vite'
import { defaultTheme } from '../../../../theme'
import { Text } from '../../text'
import { Code } from '..'

const colorSchemes = Object.keys(defaultTheme.colors)

/**
 * A piece of code inside a text, such as a command or the name of a prop.
 * It is an inline `<code>` in a monospace font, and it scales with the text around it, so it
 * fits a paragraph, a heading or a small note without a size of its own. A block of code is
 * not its job: it is meant for a few words, and it wraps if it has to.
 *
 * The font is the `--code-font-family` variable, which has a monospace stack by default.
 */
export default {
  title: 'Components/Code',
  component: Code,
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
      description: 'The code.',
      table: { type: { summary: 'ReactNode' } },
    },
    className: {
      control: 'text',
      description: 'Custom CSS class for the Code.',
      table: { type: { summary: 'string' } },
    },
    style: {
      control: false,
      description:
        'Inline styles for the Code. They are applied after the color variables, so they can override them (e.g. `--code-tint`).',
      table: { type: { summary: 'CSSProperties' } },
    },
    colorScheme: {
      control: 'select',
      options: colorSchemes,
    },
    variant: {
      control: 'radio',
      options: ['subtle', 'outline', 'unstyled'],
    },
  },
  args: {
    children: 'pnpm add @loica-ui/react',
  },
} satisfies Meta<typeof Code>

type Story = StoryObj<typeof Code>

/**
 * The default Code is tinted with the secondary color.
 */
export const Default: Story = {}

/**
 * Use the **variant** prop to pick how the Code looks: `subtle` tints the background and `outline`
 * only draws a border.
 */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <Code variant="subtle">subtle</Code>
      <Code variant="outline">outline</Code>
      <Code variant="unstyled">unstyled</Code>
    </div>
  ),
}

/**
 * Use the **colorScheme** prop to pick a color from the theme. The tinted background and its text
 * follow the color mode.
 */
export const Colors: Story = {
  render: () => (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {colorSchemes.map((scheme) => (
        <Code colorScheme={scheme as keyof typeof defaultTheme.colors} key={scheme}>
          {scheme}
        </Code>
      ))}
    </div>
  ),
}

/**
 * Inside a text, the Code takes the size of the text around it, so the same component fits a
 * paragraph and a note in a small size.
 */
export const InText: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Text>
  Run <Code>pnpm add @loica-ui/react</Code> and import the styles.
</Text>
<Text variant="caption">
  The size comes from <Code>font-size</Code>, not from the Code.
</Text>`,
      },
    },
  },
  render: () => (
    <div className="flex max-w-md flex-col gap-3">
      <Text>
        Run <Code>pnpm add @loica-ui/react</Code> and import the styles.
      </Text>
      <Text variant="caption">
        The size comes from <Code>font-size</Code>, not from the Code.
      </Text>
    </div>
  ),
}

/**
 * Some examples of Code with Tailwind classes. With `variant="unstyled"` the `className` is the only class of the code.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Text>
  Install it with{' '}
  <Code
    className="rounded-sm bg-surface-muted px-1.5 py-0.5 font-mono text-[0.875em] text-foreground"
    variant="unstyled"
  >
    pnpm add @loica-ui/react
  </Code>
  .
</Text>`,
      },
    },
  },
  render: () => (
    <Text>
      Install it with{' '}
      <Code
        className="rounded-sm bg-surface-muted px-1.5 py-0.5 font-mono text-[0.875em] text-foreground"
        variant="unstyled"
      >
        pnpm add @loica-ui/react
      </Code>
      .
    </Text>
  ),
}

/**
 * Some examples of Code with Bootstrap classes: the `<code>` of Bootstrap already has its own color, and `bg-body-secondary` and `rounded` add the box.
 */
export const Bootstrap: Story = {
  parameters: {
    docs: {
      source: {
        code: `<p>
  Install it with{' '}
  <Code className="rounded bg-body-secondary px-1 text-body" variant="unstyled">
    pnpm add @loica-ui/react
  </Code>
  .
</p>`,
      },
    },
  },
  render: () => (
    <p>
      Install it with{' '}
      <Code className="rounded bg-body-secondary px-1 text-body" variant="unstyled">
        pnpm add @loica-ui/react
      </Code>
      .
    </p>
  ),
}
