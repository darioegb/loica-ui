import type { StoryObj, Meta } from '@storybook/react-vite'
import { Field } from '../../../form/field'
import { Input } from '../../../form/input'
import { Text } from '..'

/**
 * A piece of text with one of the text styles of the theme: `body`, `body-sm`, `label` and `caption`. The size,
 * the weight, the line height and the letter spacing come from the tokens, so the text of a page follows the
 * theme.
 *
 * The **variant** is the text style, and `unstyled` drops the Loica styles. **as** picks the element: a `p` by
 * default, a `label` for a form control, `strong` for what is important, `small` for fine print. A Text has no
 * `colorScheme`: it takes the color around it, and **muted** uses the muted color of the theme for secondary text.
 * **weight** changes the weight of the font, and `size="inherit"` takes the font size from the element around it.
 *
 * Text has no margin props and no responsive ones: the space around it is the layout's job (a `gap`, or a class).
 */
export default {
  title: 'Components/Text',
  component: Text,
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
    as: {
      control: 'select',
      options: ['p', 'span', 'div', 'label', 'small', 'strong', 'dt', 'dd', 'li'],
    },
    muted: {
      control: 'boolean',
    },
    size: {
      control: 'radio',
      options: [undefined, 'inherit'],
    },
    truncate: {
      control: 'boolean',
    },
    weight: {
      control: 'radio',
      options: [undefined, 'normal', 'medium', 'semibold', 'bold'],
    },
    variant: {
      control: 'radio',
      options: ['body', 'body-sm', 'label', 'caption', 'unstyled'],
    },
    htmlFor: {
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
    lang: {
      control: false,
    },
    role: {
      control: false,
    },
    'aria-label': {
      control: 'text',
    },
    'aria-labelledby': {
      control: false,
    },
  },
  args: {
    children: 'The quick brown fox jumps over the lazy dog',
  },
} satisfies Meta<typeof Text>

type Story = StoryObj<typeof Text>

/**
 * This is the default Text: a paragraph with the `body` style.
 */
export const Default: Story = {}

/**
 * Use the **variant** prop to pick the text style: `body`, `body-sm`, `label` or `caption`. `unstyled` drops the
 * Loica styles so you can bring your own.
 */
export const Variants: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-col gap-3">
  <Text variant="body">Body</Text>
  <Text variant="body-sm">Body small</Text>
  <Text variant="label">Label</Text>
  <Text variant="caption">Caption</Text>
  <Text variant="unstyled">Unstyled</Text>
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-3">
      <Text variant="body">Body</Text>
      <Text variant="body-sm">Body small</Text>
      <Text variant="label">Label</Text>
      <Text variant="caption">Caption</Text>
      <Text variant="unstyled">Unstyled</Text>
    </div>
  ),
}

/**
 * **muted** uses the muted color of the theme, meant for secondary text like a description or a date.
 */
export const Muted: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-col gap-1">
  <Text variant="label">Billing</Text>
  <Text muted variant="body-sm">
    Your next invoice is on the 1st of the month.
  </Text>
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-1">
      <Text variant="label">Billing</Text>
      <Text muted variant="body-sm">
        Your next invoice is on the 1st of the month.
      </Text>
    </div>
  ),
}

/**
 * **weight** changes the weight of the font to one of the theme (`normal`, `medium`, `semibold` or `bold`) when it
 * is not the one of the **variant**.
 */
export const Weight: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-col gap-2">
  <Text weight="normal">Normal</Text>
  <Text weight="medium">Medium</Text>
  <Text weight="semibold">Semibold</Text>
  <Text weight="bold">Bold</Text>
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-2">
      <Text weight="normal">Normal</Text>
      <Text weight="medium">Medium</Text>
      <Text weight="semibold">Semibold</Text>
      <Text weight="bold">Bold</Text>
    </div>
  ),
}

/**
 * With `size="inherit"` the Text takes its font size from the element around it, so it scales with a component
 * that has its own size. The weight, the line height and the letter spacing still come from the **variant**.
 */
export const InheritSize: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-col gap-4">
  <div style={{ fontSize: '0.875rem' }}>
    <Text size="inherit">Inside a small box</Text>
  </div>
  <div style={{ fontSize: '1.5rem' }}>
    <Text size="inherit">Inside a big box</Text>
  </div>
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <div style={{ fontSize: '0.875rem' }}>
        <Text size="inherit">Inside a small box</Text>
      </div>
      <div style={{ fontSize: '1.5rem' }}>
        <Text size="inherit">Inside a big box</Text>
      </div>
    </div>
  ),
}

/**
 * `as="dt"` and `as="dd"` make the Text the term and the description of a `dl`, so a definition list needs no
 * wrapper around them.
 */
export const DefinitionList: Story = {
  parameters: {
    docs: {
      source: {
        code: `<dl className="m-0 grid grid-cols-[max-content_1fr] gap-x-6 gap-y-2">
  <Text as="dt" muted variant="label">Status</Text>
  <Text as="dd">On track</Text>
  <Text as="dt" muted variant="label">Owner</Text>
  <Text as="dd">Ana Ruiz</Text>
</dl>`,
      },
    },
  },
  render: () => (
    <dl className="m-0 grid grid-cols-[max-content_1fr] gap-x-6 gap-y-2">
      <Text as="dt" muted variant="label">
        Status
      </Text>
      <Text as="dd">On track</Text>
      <Text as="dt" muted variant="label">
        Owner
      </Text>
      <Text as="dd">Ana Ruiz</Text>
    </dl>
  ),
}

/**
 * With **truncate** the text stays on one line and ends with an ellipsis. It needs a width to fit in.
 */
export const Truncate: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div style={{ width: '14rem' }}>
  <Text truncate>A sentence that is longer than the space it has to fit in</Text>
</div>`,
      },
    },
  },
  render: () => (
    <div style={{ width: '14rem' }}>
      <Text truncate>A sentence that is longer than the space it has to fit in</Text>
    </div>
  ),
}

/**
 * **as** picks the element. Use the one that says what the text is, not the one that looks right: the style
 * comes from the **variant**.
 */
export const Elements: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-col gap-2">
  <Text as="p">A paragraph</Text>
  <Text as="div">A div</Text>
  <Text as="small" variant="caption">Fine print</Text>
  <Text as="strong" variant="label">Important</Text>
  <Text as="span">A span, inline</Text>
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-2">
      <Text as="p">A paragraph</Text>
      <Text as="div">A div</Text>
      <Text as="small" variant="caption">
        Fine print
      </Text>
      <Text as="strong" variant="label">
        Important
      </Text>
      <Text as="span">A span, inline</Text>
    </div>
  ),
}

/**
 * With `as="label"` and **htmlFor** the Text names a control. For a form, prefer `Field`, which also wires the
 * helper and the error text.
 */
export const AsLabel: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-col gap-1">
  <Text as="label" htmlFor="email" variant="label">
    Email
  </Text>
  <Input id="email" type="email" />
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-1">
      <Text as="label" htmlFor="email" variant="label">
        Email
      </Text>
      <Input id="email" type="email" />
    </div>
  ),
}

/**
 * Text does not compose with `Field`: the `Field` already renders the label and the helper text with the same
 * text styles.
 */
export const NextToField: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-col gap-3">
  <Text muted variant="body-sm">
    We only use your email to send the receipt.
  </Text>
  <Field label="Email">
    <Input type="email" />
  </Field>
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-3">
      <Text muted variant="body-sm">
        We only use your email to send the receipt.
      </Text>
      <Field label="Email">
        <Input type="email" />
      </Field>
    </div>
  ),
}

/**
 * Some examples of Text with Tailwind classes. With `variant="unstyled"` only the element is left, so the classes
 * bring the whole look, and `text-body`, `text-body-sm`, `text-label` and `text-caption` are the text styles of
 * the theme.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-col gap-2">
  <Text className="text-body text-foreground" variant="unstyled">
    With the text style of the theme
  </Text>
  <Text className="text-sm leading-6 text-muted" variant="unstyled">
    With utilities of Tailwind
  </Text>
  <Text as="span" className="self-start rounded-full bg-primary-solid px-3 py-0.5 text-xs text-primary-on-solid" variant="unstyled">
    Badge-like
  </Text>
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-2">
      <Text className="text-body text-foreground" variant="unstyled">
        With the text style of the theme
      </Text>
      <Text className="text-sm leading-6 text-muted" variant="unstyled">
        With utilities of Tailwind
      </Text>
      <Text
        as="span"
        className="self-start rounded-full bg-primary-solid px-3 py-0.5 text-xs text-primary-on-solid"
        variant="unstyled"
      >
        Badge-like
      </Text>
    </div>
  ),
}

/**
 * Some examples of Text with Bootstrap classes. The Text keeps the element and your classes bring the look.
 */
export const Bootstrap: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="d-flex flex-column gap-2">
  <Text className="lead" variant="unstyled">
    A lead paragraph
  </Text>
  <Text className="small text-body-secondary" variant="unstyled">
    A small, secondary paragraph
  </Text>
  <Text as="span" className="badge text-bg-primary align-self-start" variant="unstyled">
    Badge
  </Text>
</div>`,
      },
    },
  },
  render: () => (
    <div className="d-flex flex-column gap-2">
      <Text className="lead" variant="unstyled">
        A lead paragraph
      </Text>
      <Text className="small text-body-secondary" variant="unstyled">
        A small, secondary paragraph
      </Text>
      <Text as="span" className="badge text-bg-primary align-self-start" variant="unstyled">
        Badge
      </Text>
    </div>
  ),
}
