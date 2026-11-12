import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar } from '../../avatar'
import { Badge } from '../../badge'
import { DescriptionDetails, DescriptionList, DescriptionTerm } from '..'

/**
 * A list of terms and their details, on the native `dl`: the fields of a record, the facts of a project. Write a
 * `DescriptionTerm` followed by its `DescriptionDetails`, as direct children of the `DescriptionList`.
 *
 * With **layout** `stacked`, the default, each detail goes under its term. With `inline` the terms are in a column
 * as wide as the longest one and the details sit beside them. The terms are in the muted color of the theme, and
 * the details take anything: text, a `Badge`, an `Avatar`.
 *
 * The parts carry `data-loica-description-term` and `data-loica-description-details`, and with
 * `variant="unstyled"` the list drops every Loica style, so you can lay it out yourself.
 */
export default {
  title: 'Components/DescriptionList',
  component: DescriptionList,
  subcomponents: { DescriptionTerm, DescriptionDetails },
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
    layout: {
      control: 'radio',
      options: ['stacked', 'inline'],
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
    },
    style: {
      control: false,
    },
    variant: {
      control: 'radio',
      options: ['default', 'unstyled'],
    },
  },
  args: {
    layout: 'stacked',
    size: 'md',
  },
} satisfies Meta<typeof DescriptionList>

type Story = StoryObj<typeof DescriptionList>

const facts = (
  <>
    <DescriptionTerm>Status</DescriptionTerm>
    <DescriptionDetails>Active</DescriptionDetails>
    <DescriptionTerm>Owner</DescriptionTerm>
    <DescriptionDetails>Ana Torres</DescriptionDetails>
    <DescriptionTerm>Due</DescriptionTerm>
    <DescriptionDetails>15 June 2026</DescriptionDetails>
  </>
)

/**
 * This is the default DescriptionList: each detail under its term. Change its props in the Controls panel.
 */
export const Default: Story = {
  render: (args) => <DescriptionList {...args}>{facts}</DescriptionList>,
}

/**
 * Use **variant** to pick the look: `default` styles the list, and `unstyled` drops the Loica styles, so it is the
 * bare `dl` with the browser's own margins, for you to style.
 */
export const Variants: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-col gap-8">
  <DescriptionList>
    <DescriptionTerm>Status</DescriptionTerm>
    <DescriptionDetails>Active</DescriptionDetails>
    <DescriptionTerm>Owner</DescriptionTerm>
    <DescriptionDetails>Ana Torres</DescriptionDetails>
    <DescriptionTerm>Due</DescriptionTerm>
    <DescriptionDetails>15 June 2026</DescriptionDetails>
  </DescriptionList>
  <DescriptionList variant="unstyled">
    <DescriptionTerm>Status</DescriptionTerm>
    <DescriptionDetails>Active</DescriptionDetails>
    <DescriptionTerm>Owner</DescriptionTerm>
    <DescriptionDetails>Ana Torres</DescriptionDetails>
    <DescriptionTerm>Due</DescriptionTerm>
    <DescriptionDetails>15 June 2026</DescriptionDetails>
  </DescriptionList>
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-8">
      <DescriptionList>{facts}</DescriptionList>
      <DescriptionList variant="unstyled">{facts}</DescriptionList>
    </div>
  ),
}

/**
 * **size** sets the text and the space between the terms: `sm`, `md` or `lg`.
 */
export const Sizes: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-col gap-8">
  <DescriptionList size="sm">
    <DescriptionTerm>Status</DescriptionTerm>
    <DescriptionDetails>Active</DescriptionDetails>
    <DescriptionTerm>Owner</DescriptionTerm>
    <DescriptionDetails>Ana Torres</DescriptionDetails>
    <DescriptionTerm>Due</DescriptionTerm>
    <DescriptionDetails>15 June 2026</DescriptionDetails>
  </DescriptionList>
  <DescriptionList size="md">
    <DescriptionTerm>Status</DescriptionTerm>
    <DescriptionDetails>Active</DescriptionDetails>
    <DescriptionTerm>Owner</DescriptionTerm>
    <DescriptionDetails>Ana Torres</DescriptionDetails>
    <DescriptionTerm>Due</DescriptionTerm>
    <DescriptionDetails>15 June 2026</DescriptionDetails>
  </DescriptionList>
  <DescriptionList size="lg">
    <DescriptionTerm>Status</DescriptionTerm>
    <DescriptionDetails>Active</DescriptionDetails>
    <DescriptionTerm>Owner</DescriptionTerm>
    <DescriptionDetails>Ana Torres</DescriptionDetails>
    <DescriptionTerm>Due</DescriptionTerm>
    <DescriptionDetails>15 June 2026</DescriptionDetails>
  </DescriptionList>
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-8">
      <DescriptionList size="sm">{facts}</DescriptionList>
      <DescriptionList size="md">{facts}</DescriptionList>
      <DescriptionList size="lg">{facts}</DescriptionList>
    </div>
  ),
}

/**
 * **layout** `inline` puts the terms in a column on the left, as wide as the longest one, and the details beside
 * them. A narrow screen keeps both columns, so use `stacked` where the details are long.
 */
export const Inline: Story = {
  parameters: {
    docs: {
      source: {
        code: `<DescriptionList layout="inline">
  <DescriptionTerm>Status</DescriptionTerm>
  <DescriptionDetails>Active</DescriptionDetails>
  <DescriptionTerm>Owner</DescriptionTerm>
  <DescriptionDetails>Ana Torres</DescriptionDetails>
  <DescriptionTerm>Due</DescriptionTerm>
  <DescriptionDetails>15 June 2026</DescriptionDetails>
</DescriptionList>`,
      },
    },
  },
  render: (args) => (
    <DescriptionList {...args} layout="inline">
      {facts}
    </DescriptionList>
  ),
}

/**
 * A detail is any content, so a `Badge` or an `Avatar` fits as well as text. In an `inline` list the terms stay at
 * the top of their row when a detail is taller or wraps.
 */
export const WithComponents: Story = {
  parameters: {
    docs: {
      source: {
        code: `<DescriptionList layout="inline">
  <DescriptionTerm>Status</DescriptionTerm>
  <DescriptionDetails>
    <Badge colorScheme="success" variant="subtle">Active</Badge>
  </DescriptionDetails>
  <DescriptionTerm>Owner</DescriptionTerm>
  <DescriptionDetails>
    <span className="flex items-center gap-2">
      <Avatar name="Ana Torres" size="sm" />
      Ana Torres
    </span>
  </DescriptionDetails>
  <DescriptionTerm>Description</DescriptionTerm>
  <DescriptionDetails>
    A longer text wraps inside its column, and the term keeps to the top of its row.
  </DescriptionDetails>
</DescriptionList>`,
      },
    },
  },
  render: () => (
    <DescriptionList layout="inline">
      <DescriptionTerm>Status</DescriptionTerm>
      <DescriptionDetails>
        <Badge colorScheme="success" variant="subtle">Active</Badge>
      </DescriptionDetails>
      <DescriptionTerm>Owner</DescriptionTerm>
      <DescriptionDetails>
        <span className="flex items-center gap-2">
          <Avatar name="Ana Torres" size="sm" />
          Ana Torres
        </span>
      </DescriptionDetails>
      <DescriptionTerm>Description</DescriptionTerm>
      <DescriptionDetails>
        A longer text wraps inside its column, and the term keeps to the top of its row.
      </DescriptionDetails>
    </DescriptionList>
  ),
}

/**
 * The same with Tailwind classes on an `unstyled` DescriptionList: a two-column grid and the colors of the page.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<DescriptionList className="m-0 grid grid-cols-[max-content_1fr] gap-x-4 gap-y-3 [&_dd]:m-0" variant="unstyled">
  <DescriptionTerm className="text-muted">Status</DescriptionTerm>
  <DescriptionDetails className="font-medium">Active</DescriptionDetails>
  <DescriptionTerm className="text-muted">Owner</DescriptionTerm>
  <DescriptionDetails className="font-medium">Ana Torres</DescriptionDetails>
  <DescriptionTerm className="text-muted">Due</DescriptionTerm>
  <DescriptionDetails className="font-medium">15 June 2026</DescriptionDetails>
</DescriptionList>`,
      },
    },
  },
  render: () => (
    <DescriptionList className="m-0 grid grid-cols-[max-content_1fr] gap-x-4 gap-y-3 [&_dd]:m-0" variant="unstyled">
      <DescriptionTerm className="text-muted">Status</DescriptionTerm>
      <DescriptionDetails className="font-medium">Active</DescriptionDetails>
      <DescriptionTerm className="text-muted">Owner</DescriptionTerm>
      <DescriptionDetails className="font-medium">Ana Torres</DescriptionDetails>
      <DescriptionTerm className="text-muted">Due</DescriptionTerm>
      <DescriptionDetails className="font-medium">15 June 2026</DescriptionDetails>
    </DescriptionList>
  ),
}

/**
 * The same with Bootstrap classes: `row` on the list and `col-sm-3` and `col-sm-9` on the terms and the details.
 */
export const Bootstrap: Story = {
  parameters: {
    docs: {
      source: {
        code: `<DescriptionList className="row" variant="unstyled">
  <DescriptionTerm className="col-sm-3 text-body-secondary">Status</DescriptionTerm>
  <DescriptionDetails className="col-sm-9 fw-medium">Active</DescriptionDetails>
  <DescriptionTerm className="col-sm-3 text-body-secondary">Owner</DescriptionTerm>
  <DescriptionDetails className="col-sm-9 fw-medium">Ana Torres</DescriptionDetails>
  <DescriptionTerm className="col-sm-3 text-body-secondary">Due</DescriptionTerm>
  <DescriptionDetails className="col-sm-9 fw-medium">15 June 2026</DescriptionDetails>
</DescriptionList>`,
      },
    },
  },
  render: () => (
    <DescriptionList className="row" variant="unstyled">
      <DescriptionTerm className="col-sm-3 text-body-secondary">Status</DescriptionTerm>
      <DescriptionDetails className="col-sm-9 fw-medium">Active</DescriptionDetails>
      <DescriptionTerm className="col-sm-3 text-body-secondary">Owner</DescriptionTerm>
      <DescriptionDetails className="col-sm-9 fw-medium">Ana Torres</DescriptionDetails>
      <DescriptionTerm className="col-sm-3 text-body-secondary">Due</DescriptionTerm>
      <DescriptionDetails className="col-sm-9 fw-medium">15 June 2026</DescriptionDetails>
    </DescriptionList>
  ),
}
