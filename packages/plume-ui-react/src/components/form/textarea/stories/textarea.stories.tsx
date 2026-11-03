import type { StoryObj, Meta } from '@storybook/react-vite'
import { defaultTheme } from '../../../../theme'
import { Field } from '../../field'
import { Textarea } from '..'
import { LocaleProvider } from '../../../../locale'

const colorSchemes = Object.keys(defaultTheme.colors)

/**
 * A multi-line text field for longer answers such as comments or a bio.
 * It renders a native `<textarea>`, so it works with forms and the keyboard out of the box,
 * and the `ref` points to it.
 *
 * With **showCount** it adds a character counter under the field, and an invisible message a screen reader gets near
 * the limit. Then `className` and `style` go to the wrapper of the three, which carries `data-plume-textarea-group`;
 * the textarea, the count and the message carry `data-plume-textarea-field`, `-count` and `-status`, so they can be
 * styled from the parent. The native props (`value`, `defaultValue`, `maxLength`, `placeholder`, `rows`...) and the
 * `register` of react-hook-form go to the `<textarea>`.
 */
export default {
  title: 'Components/Textarea',
  component: Textarea,
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
    variant: {
      control: 'radio',
      options: ['outline', 'filled', 'underline', 'unstyled'],
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
    },
    shape: {
      control: 'radio',
      options: ['rounded', 'pill'],
    },
    showCount: {
      control: 'boolean',
    },
    resize: {
      control: 'radio',
      options: ['none', 'vertical', 'horizontal', 'both'],
    },
    rows: {
      control: 'number',
    },
    cols: {
      control: 'number',
    },
    placeholder: {
      control: 'text',
    },
    value: {
      control: 'text',
    },
    defaultValue: {
      control: 'text',
    },
    maxLength: {
      control: 'number',
    },
    minLength: {
      control: 'number',
    },
    name: {
      control: 'text',
    },
    wrap: {
      control: 'radio',
      options: ['soft', 'hard', 'off'],
    },
    disabled: {
      control: 'boolean',
    },
    readOnly: {
      control: 'boolean',
    },
    required: {
      control: 'boolean',
    },
    id: {
      control: false,
    },
    'aria-label': {
      control: 'text',
    },
    'aria-labelledby': {
      control: false,
    },
    'aria-describedby': {
      control: false,
    },
    'aria-invalid': {
      control: 'boolean',
    },
    onChange: {
      control: false,
    },
    onBlur: {
      control: false,
    },
    onFocus: {
      control: false,
    },
  },
  args: {
    'aria-label': 'Comments',
    placeholder: 'Write something',
    disabled: false,
  },
} satisfies Meta<typeof Textarea>

type Story = StoryObj<typeof Textarea>

/**
 * This is the default Textarea.
 */
export const Default: Story = {}

/**
 * Use the **variant** prop to pick how the Textarea looks. `unstyled` leaves the native textarea so you can
 * style it yourself.
 */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Textarea aria-label="Outline" placeholder="Outline" variant="outline" />
      <Textarea aria-label="Filled" placeholder="Filled" variant="filled" />
      <Textarea aria-label="Underline" placeholder="Underline" variant="underline" />
      <Textarea
        aria-label="Unstyled"
        className="border border-gray-400 rounded-sm p-2"
        placeholder="Unstyled"
        variant="unstyled"
      />
    </div>
  ),
}

/**
 * Use the **size** prop to change the text size and the padding.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Textarea aria-label="Small" placeholder="Small" size="sm" />
      <Textarea aria-label="Medium" placeholder="Medium" size="md" />
      <Textarea aria-label="Large" placeholder="Large" size="lg" />
    </div>
  ),
}

/**
 * Every color of the theme in the default `outline` variant. The **colorScheme** sets the color of
 * the focus border and ring, in every variant.
 */
export const Colors: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Textarea aria-label="primary" colorScheme="primary" placeholder="Focus me: primary" rows={1} />
<Textarea aria-label="success" colorScheme="success" placeholder="Focus me: success" rows={1} />
<Textarea aria-label="warning" colorScheme="warning" placeholder="Focus me: warning" rows={1} />`,
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      {colorSchemes.map((scheme) => (
        <Textarea
          aria-label={scheme}
          colorScheme={scheme as keyof typeof defaultTheme.colors}
          key={scheme}
          placeholder={`Focus me: ${scheme}`}
          rows={1}
        />
      ))}
    </div>
  ),
}

/**
 * **showCount** shows how many characters there are under the Textarea, and with a **maxLength** how many are
 * allowed. The count describes the field to a screen reader when it gets the focus, and near the limit a polite
 * message says how many characters are left. The `textarea.count` and `textarea.remaining` texts of the `LocaleProvider` change them.
 */
export const CharacterCount: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Textarea aria-label="Notes" placeholder="Without a limit" showCount />
      <Textarea
        aria-label="Bio"
        defaultValue="I write documentation."
        maxLength={120}
        placeholder="With a limit"
        showCount
      />
      <LocaleProvider messages={{ textarea: { count: (count, max) => `${(max ?? 0) - count} left` } }}>
        <Textarea
          aria-label="Short bio"
          defaultValue="Almost there, only a few more characters can fit in this one"
          maxLength={64}
          showCount
        />
      </LocaleProvider>
    </div>
  ),
}

/**
 * Use **rows** for the initial height and **resize** to control how the user can change it.
 */
export const RowsAndResize: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Textarea aria-label="Six rows" placeholder="Six rows" rows={6} />
      <Textarea aria-label="Not resizable" placeholder="Not resizable" resize="none" />
      <Textarea aria-label="Resizable both ways" placeholder="Resizable both ways" resize="both" />
    </div>
  ),
}

/**
 * A **disabled** Textarea can't be changed or focused. A **readOnly** one can be focused and selected but not changed.
 */
export const DisabledAndReadOnly: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Textarea aria-label="Disabled" disabled placeholder="Disabled" />
      <Textarea aria-label="Read only" defaultValue="Read only text" readOnly />
    </div>
  ),
}

/**
 * **aria-invalid** switches the Textarea to the error color scheme.
 */
export const Invalid: Story = {
  args: {
    'aria-invalid': true,
    defaultValue: 'Too short',
  },
}

/**
 * Wrap it in a **Field** to add a label, a helper and an error text. The Field wires the accessibility attributes.
 */
export const WithField: Story = {
  render: () => (
    <Field
      errorText="Write at least 10 characters"
      helperText="Tell us about yourself"
      label="Bio"
      required
    >
      <Textarea defaultValue="Too short" placeholder="Your bio" />
    </Field>
  ),
}

/**
 * Some examples of Textarea with Tailwind classes. With `variant="unstyled"` the `className` is the only class of the `<textarea>`. With a count it goes to the wrapper, so the textarea and the count are styled with parent selectors.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex w-72 max-w-full flex-col gap-4">
  <Textarea
    className="block w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm focus:border-blue-500 focus:outline-hidden focus:ring-3 focus:ring-blue-200"
    placeholder="Tell us more"
    variant="unstyled"
  />
  <Textarea
    className="block w-full resize-none rounded-2xl border-2 border-emerald-600 bg-transparent px-4 py-3 text-sm focus:outline-hidden focus:ring-3 focus:ring-emerald-200"
    placeholder="Rounded and fixed"
    rows={4}
    variant="unstyled"
  />
  <Textarea
    aria-label="With a count"
    className="[&_textarea]:block [&_textarea]:w-full [&_textarea]:rounded-lg [&_textarea]:border [&_textarea]:border-gray-300 [&_textarea]:bg-transparent [&_textarea]:px-3 [&_textarea]:py-2 [&_textarea]:text-sm [&_textarea]:focus:border-blue-500 [&_textarea]:focus:outline-hidden [&_textarea]:focus:ring-3 [&_textarea]:focus:ring-blue-200 [&_[data-plume-textarea-count]]:mt-1 [&_[data-plume-textarea-count]]:block [&_[data-plume-textarea-count]]:text-right [&_[data-plume-textarea-count]]:text-xs [&_[data-plume-textarea-count]]:text-gray-600 dark:[&_[data-plume-textarea-count]]:text-gray-400 [&_[data-plume-textarea-count][data-limit]]:font-semibold [&_[data-plume-textarea-count][data-limit]]:text-red-600"
    maxLength={80}
    placeholder="With a count"
    showCount
    variant="unstyled"
  />
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex w-72 max-w-full flex-col gap-4">
      <Textarea
        className="block w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm focus:border-blue-500 focus:outline-hidden focus:ring-3 focus:ring-blue-200"
        placeholder="Tell us more"
        variant="unstyled"
      />
      <Textarea
        className="block w-full resize-none rounded-2xl border-2 border-emerald-600 bg-transparent px-4 py-3 text-sm focus:outline-hidden focus:ring-3 focus:ring-emerald-200"
        placeholder="Rounded and fixed"
        rows={4}
        variant="unstyled"
      />
      <Textarea
        aria-label="With a count"
        className="[&_textarea]:block [&_textarea]:w-full [&_textarea]:rounded-lg [&_textarea]:border [&_textarea]:border-gray-300 [&_textarea]:bg-transparent [&_textarea]:px-3 [&_textarea]:py-2 [&_textarea]:text-sm [&_textarea]:focus:border-blue-500 [&_textarea]:focus:outline-hidden [&_textarea]:focus:ring-3 [&_textarea]:focus:ring-blue-200 [&_[data-plume-textarea-count]]:mt-1 [&_[data-plume-textarea-count]]:block [&_[data-plume-textarea-count]]:text-right [&_[data-plume-textarea-count]]:text-xs [&_[data-plume-textarea-count]]:text-gray-600 dark:[&_[data-plume-textarea-count]]:text-gray-400 [&_[data-plume-textarea-count][data-limit]]:font-semibold [&_[data-plume-textarea-count][data-limit]]:text-red-600"
        maxLength={80}
        placeholder="With a count"
        showCount
        variant="unstyled"
      />
    </div>
  ),
}

/**
 * Some examples of Textarea with Bootstrap classes: `form-control`, with its size and validation states. With `showCount` the classes go to the wrapper, which Bootstrap has no class for, so use the count with the Plume look.
 */
export const Bootstrap: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="d-flex flex-column gap-3" style={{ width: '18rem', maxWidth: '100%' }}>
  <Textarea className="form-control" placeholder="Default textarea" variant="unstyled" />
  <Textarea
    className="form-control form-control-sm"
    placeholder="Small textarea"
    variant="unstyled"
  />
  <Textarea
    className="form-control is-invalid"
    defaultValue="Invalid value"
    placeholder="Invalid textarea"
    style={{ backgroundImage: 'none' }}
    variant="unstyled"
  />
</div>`,
      },
    },
  },
  render: () => (
    <div className="d-flex flex-column gap-3" style={{ width: '18rem', maxWidth: '100%' }}>
      <Textarea className="form-control" placeholder="Default textarea" variant="unstyled" />
      <Textarea
        className="form-control form-control-sm"
        placeholder="Small textarea"
        variant="unstyled"
      />
      <Textarea
        className="form-control is-invalid"
        defaultValue="Invalid value"
        placeholder="Invalid textarea"
        style={{ backgroundImage: 'none' }}
        variant="unstyled"
      />
    </div>
  ),
}
