// Input.stories.tsx
import type { StoryObj, Meta } from '@storybook/react-vite'
import { useState } from 'react'
import { defaultTheme } from '../../../../theme'
import { Input } from '..'

const colorSchemes = Object.keys(defaultTheme.colors)

/**
 * Collect text from users with the Input component.
 * It supports multiple variants, sizes, shapes and color schemes, optional addons
 * and inline elements, validation states, and an input mask for formatted values
 * such as dates, phone numbers or card numbers.
 *
 * On its own it renders the `<input>`, and inside a group when it has addons, elements or the reveal button. The
 * native props (`id`, `name`, `placeholder`, `aria-*`...) and the `ref` go to the `<input>`, so `register` of
 * react-hook-form works on it. With a group, `className` and `style` go to the group. Every drawn element carries a
 * `data-plume-input-*` attribute (`group`, `control`, `addon`, `element`, `field` and `reveal`), so it can be styled
 * from the parent.
 */
export default {
  title: 'Components/Input',
  component: Input,
  parameters: {
    docs: {
      toc: {
        title: 'On this page',
        disable: false,
      },
    },
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    className: { control: 'text' },
    colorScheme: { control: 'select', options: colorSchemes },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    placeholder: { control: 'text' },
    addonBefore: { control: false },
    addonAfter: { control: false },
    elementBefore: { control: false },
    elementAfter: { control: false },
    shape: { control: 'inline-radio', options: ['pill', 'rounded'] },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    variant: { control: 'select', options: ['outline', 'underline', 'filled', 'unstyled'] },
    type: {
      control: 'select',
      options: [
        'text',
        'number',
        'password',
        'search',
        'date',
        'datetime-local',
        'email',
        'month',
        'tel',
        'time',
        'url',
        'week',
      ],
    },
    value: { control: 'text' },
    revealable: { control: 'boolean' },
    autoComplete: { control: 'text' },
    mask: { control: 'text' },
    defaultValue: { control: false },
    style: { control: false },
    id: { control: false },
    name: { control: false },
    required: { control: 'boolean' },
    inputMode: {
      control: 'select',
      options: ['text', 'numeric', 'decimal', 'tel', 'email', 'url', 'search', 'none'],
    },
    pattern: { control: 'text' },
    minLength: { control: 'number' },
    maxLength: { control: 'number' },
    min: { control: false },
    max: { control: false },
    onBlur: { control: false },
  },
} as Meta<typeof Input>

type Story = StoryObj<typeof Input>

export const Default: Story = {
  args: {
    disabled: false,
    placeholder: 'Input Placeholder',
    readOnly: false,
    type: 'text',
  },
}

/**
 * This is a list of Input with different variants.
 * Just adding the **variant** prop in one of these values **outline**, **underline**, **filled** and **unstyled**.
 */
export const Variants: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Input placeholder='Outline Input' variant='outline' />
<Input placeholder='Underline Input' variant='underline' />
<Input placeholder='Filled Input' variant='filled' />
<Input placeholder='Unstyled Input' variant='unstyled' />
            `,
      },
    },
  },
  render: () => (
    <div className="grid w-full gap-4 grid-cols-[repeat(auto-fill,minmax(18rem,1fr))]">
      <Input placeholder="Outline Input" variant="outline" />
      <Input placeholder="Underline Input" variant="underline" />
      <Input placeholder="Filled Input" variant="filled" />
      <Input placeholder="Unstyled Input" variant="unstyled" />
    </div>
  ),
}

/**
 * This is a list of Input with different sizes.
 * Just adding the **size** prop.
 */
export const Sizes: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Input size="sm" placeholder="Small Input" />
  <Input size="md" placeholder="Medium Input" />
  <Input size="lg" placeholder="Large Input" />
            `,
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap justify-center items-center gap-4">
      <Input placeholder="Small Input" size="sm" />
      <Input placeholder="Medium Input" size="md" />
      <Input placeholder="Large Input" size="lg" />
    </div>
  ),
}

/**
 * Every color of the theme in the default `outline` variant. The color tints the focus border and
 * ring, in every variant.
 */
export const Colors: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Input colorScheme="primary" placeholder="primary" />
<Input colorScheme="success" placeholder="success" />
<Input colorScheme="warning" placeholder="warning" />`,
      },
    },
  },
  render: () => (
    <div className="grid w-full gap-4 grid-cols-[repeat(auto-fill,minmax(18rem,1fr))]">
      {colorSchemes.map((colorScheme) => (
        <Input
          colorScheme={colorScheme as keyof typeof defaultTheme.colors}
          key={colorScheme}
          placeholder={colorScheme}
        />
      ))}
    </div>
  ),
}

const userIcon = (
  <svg
    aria-hidden="true"
    fill="none"
    height="16"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    width="16"
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const searchIcon = (
  <svg
    aria-hidden="true"
    fill="none"
    height="16"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    width="16"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
)

/**
 * **addonBefore** and **addonAfter** attach content outside the Input border, such as a URL
 * prefix or a domain suffix. **elementBefore** and **elementAfter** place content inside the
 * Input, usually an icon.
 */
export const AddonsAndElements: Story = {
  name: 'Addons & elements',
  parameters: {
    docs: {
      source: {
        code: `<Input addonBefore="https://" addonAfter=".com" placeholder="your-site" />
<Input elementBefore={<UserIcon />} placeholder="Username" />
<Input elementAfter={<SearchIcon />} placeholder="Search" />`,
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <Input addonAfter=".com" addonBefore="https://" placeholder="your-site" />
      <Input elementBefore={userIcon} placeholder="Username" />
      <Input elementAfter={searchIcon} placeholder="Search" />
      <Input addonBefore="$" elementAfter={searchIcon} placeholder="Amount" />
      <Input addonAfter=".com" addonBefore="https://" placeholder="filled" variant="filled" />
      <Input addonAfter=".com" addonBefore="https://" placeholder="underline" variant="underline" />
      <Input addonAfter=".com" addonBefore="https://" placeholder="pill" shape="pill" />
    </div>
  ),
}

/**
 * **type** is passed to the `<input>`, so `email`, `search`, `tel` and `url` work as they do natively, with the
 * right keyboard on mobile. With `type="password"`, **revealable** adds a button to show or hide the text.
 */
export const Types: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Input autoComplete="email" placeholder="Email" type="email" />
<Input placeholder="Search" type="search" />
<Input autoComplete="tel" placeholder="Phone" type="tel" />
<Input placeholder="Website" type="url" />
<Input autoComplete="current-password" placeholder="Password" revealable type="password" />`,
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <Input autoComplete="email" placeholder="Email" type="email" />
      <Input placeholder="Search" type="search" />
      <Input autoComplete="tel" placeholder="Phone" type="tel" />
      <Input placeholder="Website" type="url" />
      <Input autoComplete="current-password" placeholder="Password" revealable type="password" />
    </div>
  ),
}

export const ControlledInput: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Input
    placeholder="Controlled Input"
    value={value}
    onChange={(e) => setValue(e.target.value)}
/>`,
      },
    },
  },
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks -- ''
    const [value, setValue] = useState('')
    return (
      <Input
        onChange={(e) => {
          setValue(e.target.value)
        }}
        placeholder="Controlled Input"
        value={value}
      />
    )
  },
}

/**
 * The **mask** prop formats the value as the user types and rejects characters that don't fit.
 * `#` accepts a digit, `A` a letter and `*` a letter or digit; every other character is a
 * literal that is auto-inserted (use `\` to escape a slot character).
 */
export const Masked: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Input mask='##/##/####' placeholder='dd/mm/yyyy' />
<Input mask='(###) ###-####' placeholder='(###) ###-####' />
<Input mask='#### #### #### ####' placeholder='Card number' />
<Input mask='##:##' placeholder='hh:mm' />
<Input mask='AA-####' placeholder='Letters, then digits' />
<Input mask='***-***' placeholder='Letters or digits' />`,
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <Input mask="##/##/####" placeholder="dd/mm/yyyy" />
      <Input mask="(###) ###-####" placeholder="(###) ###-####" />
      <Input mask="#### #### #### ####" placeholder="Card number" />
      <Input mask="##:##" placeholder="hh:mm" />
      <Input mask="AA-####" placeholder="Letters, then digits" />
      <Input mask="***-***" placeholder="Letters or digits" />
    </div>
  ),
}

/**
 * Some examples of Input with custom classes from tailwind.
 * Set **variant="unstyled"** so Plume styles don't override your utility classes.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Input
  variant="unstyled"
  placeholder="Default Input"
  className="block w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:ring-3 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
/>
<Input
  variant="unstyled"
  placeholder="Pill Input"
  className="block w-full rounded-full border border-gray-200 px-4 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:ring-3 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
/>
<Input
  variant="unstyled"
  placeholder="Filled Input"
  className="block w-full rounded-lg border border-transparent bg-gray-100 px-4 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:bg-white dark:bg-gray-700 dark:text-white"
/>
<Input
  variant="unstyled"
  placeholder="Error Input"
  defaultValue="Invalid value"
  className="block w-full rounded-lg border border-red-400 px-4 py-2.5 text-sm text-red-700 focus:border-red-500 focus:ring-3 focus:ring-red-200 dark:text-red-400"
/>
<Input
  variant="unstyled"
  type="password"
  revealable
  placeholder="Password"
  className="[&_[data-plume-input-control]]:flex [&_[data-plume-input-control]]:items-center [&_input]:block [&_input]:w-full [&_input]:rounded-lg [&_input]:border [&_input]:border-gray-200 [&_input]:py-2.5 [&_input]:pl-4 [&_input]:pr-10 [&_input]:text-sm [&_input]:text-gray-700 [&_input]:focus:border-blue-500 [&_input]:focus:ring-3 [&_input]:focus:ring-blue-200 dark:[&_input]:border-gray-700 dark:[&_input]:bg-gray-800 dark:[&_input]:text-white [&_[data-plume-input-reveal]]:-ml-9 [&_[data-plume-input-reveal]]:mr-1 [&_[data-plume-input-reveal]]:flex [&_[data-plume-input-reveal]]:h-8 [&_[data-plume-input-reveal]]:w-8 [&_[data-plume-input-reveal]]:items-center [&_[data-plume-input-reveal]]:justify-center [&_[data-plume-input-reveal]]:rounded-sm [&_[data-plume-input-reveal]]:text-gray-500 [&_[data-plume-input-reveal]]:hover:text-gray-900 dark:[&_[data-plume-input-reveal]]:hover:text-white"
/>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4 w-72 max-w-full">
      <Input
        className="block w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:ring-3 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        placeholder="Default Input"
        variant="unstyled"
      />
      <Input
        className="block w-full rounded-full border border-gray-200 px-4 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:ring-3 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        placeholder="Pill Input"
        variant="unstyled"
      />
      <Input
        className="block w-full rounded-lg border border-transparent bg-gray-100 px-4 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:bg-white dark:bg-gray-700 dark:text-white"
        placeholder="Filled Input"
        variant="unstyled"
      />
      <Input
        className="block w-full rounded-lg border border-red-400 px-4 py-2.5 text-sm text-red-700 focus:border-red-500 focus:ring-3 focus:ring-red-200 dark:text-red-400"
        defaultValue="Invalid value"
        placeholder="Error Input"
        variant="unstyled"
      />
      <Input
        className="[&_[data-plume-input-control]]:flex [&_[data-plume-input-control]]:items-center [&_input]:block [&_input]:w-full [&_input]:rounded-lg [&_input]:border [&_input]:border-gray-200 [&_input]:py-2.5 [&_input]:pl-4 [&_input]:pr-10 [&_input]:text-sm [&_input]:text-gray-700 [&_input]:focus:border-blue-500 [&_input]:focus:ring-3 [&_input]:focus:ring-blue-200 dark:[&_input]:border-gray-700 dark:[&_input]:bg-gray-800 dark:[&_input]:text-white [&_[data-plume-input-reveal]]:-ml-9 [&_[data-plume-input-reveal]]:mr-1 [&_[data-plume-input-reveal]]:flex [&_[data-plume-input-reveal]]:h-8 [&_[data-plume-input-reveal]]:w-8 [&_[data-plume-input-reveal]]:items-center [&_[data-plume-input-reveal]]:justify-center [&_[data-plume-input-reveal]]:rounded-sm [&_[data-plume-input-reveal]]:text-gray-500 [&_[data-plume-input-reveal]]:hover:text-gray-900 dark:[&_[data-plume-input-reveal]]:hover:text-white"
        placeholder="Password"
        revealable
        type="password"
        variant="unstyled"
      />
    </div>
  ),
}

/**
 * Some examples of Input with custom classes from bootstrap.
 * Set **variant="unstyled"** so Plume styles don't override the bootstrap classes.
 */
export const Bootstrap: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Input variant="unstyled" className="form-control" placeholder="Default Input" />
<Input variant="unstyled" className="form-control form-control-lg" placeholder="Large Input" />
<Input variant="unstyled" className="form-control form-control-sm" placeholder="Small Input" />
<Input variant="unstyled" className="form-control is-valid" placeholder="Valid Input" defaultValue="Valid value" style={{ backgroundImage: 'none' }} />
<Input variant="unstyled" className="form-control is-invalid" placeholder="Invalid Input" defaultValue="Invalid value" style={{ backgroundImage: 'none' }} />`,
      },
    },
  },
  render: () => (
    <div className="d-flex flex-column gap-3" style={{ width: '18rem', maxWidth: '100%' }}>
      <Input className="form-control" placeholder="Default Input" variant="unstyled" />
      <Input
        className="form-control form-control-lg"
        placeholder="Large Input"
        variant="unstyled"
      />
      <Input
        className="form-control form-control-sm"
        placeholder="Small Input"
        variant="unstyled"
      />
      <Input
        className="form-control is-valid"
        defaultValue="Valid value"
        placeholder="Valid Input"
        style={{ backgroundImage: 'none' }}
        variant="unstyled"
      />
      <Input
        className="form-control is-invalid"
        defaultValue="Invalid value"
        placeholder="Invalid Input"
        style={{ backgroundImage: 'none' }}
        variant="unstyled"
      />
    </div>
  ),
}
