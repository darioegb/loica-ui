import type { StoryObj, Meta } from '@storybook/react-vite'
import type { ColorScheme } from '../../../../theme'
import { defaultTheme } from '../../../../theme'
import { Loader } from '..'

const colors = defaultTheme.colors

/**
 * An animated indicator that data is loading or an action is in progress.
 * It is a `status`, named `Loading` by default, so a screen reader announces it. For content whose
 * shape you know, a `Skeleton` keeps the layout; for a measurable task, a `ProgressBar`.
 *
 * Without `colorScheme` it takes the color of the text around it, so it fits inside a `Button` or a
 * line of text. Its name comes from `label`, or from the `loader` text of the `LocaleProvider`.
 */
export default {
  title: 'Components/Loader',
  component: Loader,
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
    colorScheme: { control: 'select', options: Object.keys(colors) },
    className: { control: 'text' },
    label: { control: 'text' },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    style: { control: false },
    variant: { control: 'select', options: ['spinner', 'dots', 'bars', 'unstyled'] },
  },
} satisfies Meta<typeof Loader>

type Story = StoryObj<typeof Loader>

export const Default: Story = {}

/**
 * Use the **variant** prop to pick how the Loader moves: `spinner`, `dots` or `bars`. With
 * `unstyled` it renders an empty `<output>` that you style yourself. With reduced motion every
 * variant pulses instead of moving.
 */
export const Variants: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Loader colorScheme="primary" variant="spinner" />
<Loader colorScheme="primary" variant="dots" />
<Loader colorScheme="primary" variant="bars" />
<Loader
  variant="unstyled"
/>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap justify-center items-center gap-6">
      <Loader colorScheme="primary" variant="spinner" />
      <Loader colorScheme="primary" variant="dots" />
      <Loader colorScheme="primary" variant="bars" />
      <Loader variant="unstyled" />
    </div>
  ),
}

/**
 * Use the **size** prop: `sm`, `md` or `lg`.
 */
export const Sizes: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Loader colorScheme="primary" size="sm" />
<Loader colorScheme="primary" />
<Loader colorScheme="primary" size="lg" />`,
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap justify-center items-center gap-6">
      <Loader colorScheme="primary" size="sm" />
      <Loader colorScheme="primary" />
      <Loader colorScheme="primary" size="lg" />
    </div>
  ),
}

/**
 * Use the **colorScheme** prop to color the Loader with any color scheme of the theme. Every variant
 * takes the color the same way.
 */
export const Colors: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Loader colorScheme="primary" />
<Loader colorScheme="secondary" />
<Loader colorScheme="success" />`,
      },
    },
  },
  render: () => (
    <div className="grid gap-4 grid-cols-3">
      {Object.keys(colors).map((colorScheme) => (
        <Loader colorScheme={colorScheme as ColorScheme} key={colorScheme} />
      ))}
    </div>
  ),
}

/**
 * An unstyled Loader with the classes of Tailwind.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Loader
  className="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-gray-800 rounded-full dark:text-white"
  variant="unstyled"
/>
<Loader
  className="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-blue-600 rounded-full"
  variant="unstyled"
/>
<Loader
  className="animate-pulse inline-block w-6 h-6 bg-blue-600 rounded-full"
  variant="unstyled"
/>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap justify-center items-center gap-4">
      <Loader
        className="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-gray-800 rounded-full dark:text-white"
        variant="unstyled"
      />
      <Loader
        className="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-blue-600 rounded-full"
        variant="unstyled"
      />
      <Loader
        className="animate-pulse inline-block w-6 h-6 bg-blue-600 rounded-full"
        variant="unstyled"
      />
    </div>
  ),
}

/**
 * An unstyled Loader with the classes of Bootstrap.
 */
export const Bootstrap: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Loader className="spinner-border" variant="unstyled" />
<Loader className="spinner-border text-primary" variant="unstyled" />
<Loader className="spinner-grow" variant="unstyled" />
<Loader className="spinner-border spinner-border-sm" variant="unstyled" />`,
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap justify-center items-center gap-4">
      <Loader className="spinner-border" variant="unstyled" />
      <Loader className="spinner-border text-primary" variant="unstyled" />
      <Loader className="spinner-grow" variant="unstyled" />
      <Loader className="spinner-border spinner-border-sm" variant="unstyled" />
    </div>
  ),
}
