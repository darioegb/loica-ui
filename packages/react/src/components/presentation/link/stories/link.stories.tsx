import type { StoryObj, Meta } from '@storybook/react-vite'
import { defaultTheme } from '../../../../theme'
import { Text } from '../../text'
import { Link } from '..'

const colorSchemes = Object.keys(defaultTheme.colors)

/**
 * A link that inherits the size and the weight of the text around it.
 * It underlines by default, because a link inside a text has to be told apart by more than its color,
 * and it draws the focus ring of the theme. With `external` it opens in a new tab and says so to
 * screen readers, with a text you can translate in the `LocaleProvider` (`link.external`).
 *
 * It renders the link of the `LinkProvider`, so with the `Link` of your router it navigates without
 * reloading the page; a disabled link, an absolute URL, `mailto:` or a `target` of its own stays a
 * plain `<a>`.
 */
export default {
  title: 'Components/Link',
  component: Link,
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
      description: 'The text of the link.',
      table: { type: { summary: 'ReactNode' } },
    },
    className: {
      control: 'text',
      description: 'Custom CSS class for the Link.',
      table: { type: { summary: 'string' } },
    },
    style: {
      control: false,
      description:
        'Inline styles for the Link. They are applied after the color variables, so they can override them (e.g. `--link-hover-color`).',
      table: { type: { summary: 'CSSProperties' } },
    },
    colorScheme: {
      control: 'select',
      options: colorSchemes,
    },
    disabled: {
      control: 'boolean',
    },
    external: {
      control: 'boolean',
    },
    variant: {
      control: 'radio',
      options: ['underline', 'hover', 'unstyled'],
    },
  },
  args: {
    children: 'Read the docs',
    href: '#docs',
  },
} satisfies Meta<typeof Link>

type Story = StoryObj<typeof Link>

/**
 * The default Link is underlined and uses the primary color.
 */
export const Default: Story = {}

/**
 * Use the **variant** prop to pick how the Link looks: `underline` always underlines it, and `hover`
 * only on hover and focus. Use `hover` where the place says it is a link, such as a menu: a link
 * inside a text needs the underline.
 */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <Link href="#docs" variant="underline">
        underline
      </Link>
      <Link href="#docs" variant="hover">
        hover
      </Link>
      <Link href="#docs" variant="unstyled">
        unstyled
      </Link>
    </div>
  ),
}

/**
 * Use the **colorScheme** prop to pick a color from the theme. The color of the text, its hover and
 * its pressed state follow the color mode.
 */
export const Colors: Story = {
  render: () => (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {colorSchemes.map((scheme) => (
        <Link colorScheme={scheme as keyof typeof defaultTheme.colors} href="#docs" key={scheme}>
          {scheme}
        </Link>
      ))}
    </div>
  ),
}

/**
 * Inside a text, the Link takes the size and the weight of the text around it.
 */
export const InText: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Text>
  Read the <Link href="/docs">documentation</Link> or <Link href="/guides">the guides</Link>.
</Text>
<Text variant="caption">
  It is as small as this text, because it takes its size from it.
</Text>`,
      },
    },
  },
  render: () => (
    <div className="flex max-w-md flex-col gap-3">
      <Text>
        Read the <Link href="#docs">documentation</Link> or <Link href="#guides">the guides</Link>.
      </Text>
      <Text variant="caption">
        It is as <Link href="#docs">small</Link> as this text, because it takes its size from it.
      </Text>
    </div>
  ),
}

/**
 * **external** opens the link in a new tab with `rel="noopener noreferrer"`, and adds a text for
 * screen readers: "opens in a new tab", from the `link.external` key of the `LocaleProvider`. A
 * link that is external stays a plain `<a>` even with a `LinkProvider`.
 */
export const External: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Link external href="https://example.com">
  Example
</Link>`,
      },
    },
  },
  args: {
    children: 'Example',
    external: true,
    href: 'https://example.com',
  },
}

/**
 * A **disabled** link has no `href`, is announced as disabled, ignores its clicks and leaves the tab
 * order.
 */
export const Disabled: Story = {
  args: {
    children: 'Not available yet',
    disabled: true,
  },
}

/**
 * Some examples of Link with Tailwind classes. With `variant="unstyled"` the `className` is the only class of the link.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Text>
  Read the{' '}
  <Link
    className="font-medium text-primary-text underline underline-offset-4 hover:no-underline focus-visible:outline-2 focus-visible:outline-primary-text"
    href="/docs"
    variant="unstyled"
  >
    documentation
  </Link>
  .
</Text>`,
      },
    },
  },
  render: () => (
    <Text>
      Read the{' '}
      <Link
        className="font-medium text-primary-text underline underline-offset-4 hover:no-underline focus-visible:outline-2 focus-visible:outline-primary-text"
        href="#docs"
        variant="unstyled"
      >
        documentation
      </Link>
      .
    </Text>
  ),
}

/**
 * Some examples of Link with Bootstrap classes: `link-body-emphasis` and the `link-underline` helpers. Bootstrap's `link-primary` is below 4.5:1 in dark mode, so it is not used for text.
 */
export const Bootstrap: Story = {
  parameters: {
    docs: {
      source: {
        code: `<p>
  Read the{' '}
  <Link className="link-body-emphasis link-underline-opacity-75" href="/docs" variant="unstyled">
    documentation
  </Link>
  .
</p>`,
      },
    },
  },
  render: () => (
    <p>
      Read the{' '}
      <Link className="link-body-emphasis link-underline-opacity-75" href="#docs" variant="unstyled">
        documentation
      </Link>
      .
    </p>
  ),
}
