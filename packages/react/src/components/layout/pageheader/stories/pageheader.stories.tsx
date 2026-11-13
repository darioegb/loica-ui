import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../../../interaction/button'
import { PageHeader } from '..'

/**
 * The top of a page: its title, a description and the actions that belong to it. It reuses `Heading` and `Text`, so
 * it follows the text styles of the theme.
 *
 * The **title** is an `h1` by default, and **titleAs** picks another level when the header opens a section: it
 * changes the outline of the page, not how the title looks. **description** goes under the title, and **actions**
 * (usually `Button`s) sit at the end of the row and go below the title when the screen is too narrow for both.
 *
 * It renders a `header`, which is the banner of the page unless it is inside a `main`, a `section` or an `article`,
 * so put it there.
 */
export default {
  title: 'Components/PageHeader',
  component: PageHeader,
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
    actions: {
      control: false,
    },
    className: {
      control: 'text',
    },
    description: {
      control: 'text',
    },
    style: {
      control: false,
    },
    title: {
      control: 'text',
    },
    titleAs: {
      control: 'radio',
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    },
    variant: {
      control: 'radio',
      options: ['default', 'unstyled'],
    },
  },
  args: {
    description: 'Everything your team is working on, in one place.',
    title: 'Projects',
    titleAs: 'h1',
  },
} satisfies Meta<typeof PageHeader>

type Story = StoryObj<typeof PageHeader>

/**
 * This is the default PageHeader: a title and a description. Change them in the Controls panel.
 */
export const Default: Story = {}

/**
 * Use **variant** to pick the look: `default` styles the title, the description and the row of actions, and
 * `unstyled` drops the Loica styles, so the header is bare markup that you style with your own classes.
 */
export const Variants: Story = {
  parameters: {
    docs: {
      source: {
        code: `<main className="flex flex-col gap-8">
  <PageHeader
    actions={<Button label="New project" />}
    description="Everything your team is working on, in one place."
    title="Projects"
  />
  <PageHeader
    actions={<Button label="New project" />}
    description="Everything your team is working on, in one place."
    title="Projects"
    variant="unstyled"
  />
</main>`,
      },
    },
  },
  render: () => (
    <main className="flex flex-col gap-8">
      <PageHeader
        actions={<Button label="New project" />}
        description="Everything your team is working on, in one place."
        title="Projects"
      />
      <PageHeader
        actions={<Button label="New project" />}
        description="Everything your team is working on, in one place."
        title="Projects"
        variant="unstyled"
      />
    </main>
  ),
}

/**
 * **actions** takes any node, so a row of buttons works as well as one. They are laid out in a row, and when the
 * title and the actions don't fit side by side, the actions go below the title.
 */
export const Actions: Story = {
  parameters: {
    docs: {
      source: {
        code: `<PageHeader
  actions={
    <>
      <Button label="Export" variant="outline" />
      <Button label="New project" />
    </>
  }
  description="Everything your team is working on, in one place."
  title="Projects"
/>`,
      },
    },
  },
  render: (args) => (
    <PageHeader
      {...args}
      actions={
        <>
          <Button label="Export" variant="outline" />
          <Button label="New project" />
        </>
      }
    />
  ),
}

/**
 * Only the **title** is required. Without a **description** or **actions** the header is just the heading.
 */
export const TitleOnly: Story = {
  args: {
    description: undefined,
  },
}

/**
 * **titleAs** sets the level of the heading, from `h1` to `h6`. Use the next level of the section the header opens,
 * so the outline of the page stays in order; the title looks the same at every level.
 */
export const TitleLevel: Story = {
  parameters: {
    docs: {
      source: {
        code: `<PageHeader description="Who can see and change this project." title="Members" titleAs="h2" />`,
      },
    },
  },
  args: {
    description: 'Who can see and change this project.',
    title: 'Members',
    titleAs: 'h2',
  },
}

/**
 * The same with Tailwind classes on an `unstyled` PageHeader. The title and the description are bare too, so the
 * classes of the page go on its parts with `data-loica-pageheader-*`, or on the header with a `className`.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<PageHeader
  actions={<Button label="New project" />}
  className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-4 [&_h1]:text-2xl [&_h1]:font-semibold [&_p]:text-muted"
  description="Everything your team is working on, in one place."
  title="Projects"
  variant="unstyled"
/>`,
      },
    },
  },
  render: () => (
    <PageHeader
      actions={<Button label="New project" />}
      className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-4 [&_h1]:text-2xl [&_h1]:font-semibold [&_p]:text-muted"
      description="Everything your team is working on, in one place."
      title="Projects"
      variant="unstyled"
    />
  ),
}

/**
 * The same with Bootstrap classes: `d-flex`, `justify-content-between` and `border-bottom` on an `unstyled`
 * PageHeader.
 */
export const Bootstrap: Story = {
  parameters: {
    docs: {
      source: {
        code: `<PageHeader
  actions={<Button label="New project" />}
  className="d-flex flex-wrap align-items-start justify-content-between gap-3 border-bottom pb-3"
  description="Everything your team is working on, in one place."
  title="Projects"
  variant="unstyled"
/>`,
      },
    },
  },
  render: () => (
    <PageHeader
      actions={<Button label="New project" />}
      className="d-flex flex-wrap align-items-start justify-content-between gap-3 border-bottom pb-3"
      description="Everything your team is working on, in one place."
      title="Projects"
      variant="unstyled"
    />
  ),
}
