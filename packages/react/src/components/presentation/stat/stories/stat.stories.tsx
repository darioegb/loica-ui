import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card, CardBody } from '../../card'
import { Stat } from '..'

/**
 * A number with its name, how it changed and a line of help: a metric of a dashboard. It closes on itself, and it
 * is not a card: put it in a `Card`, a grid or anywhere else.
 *
 * The **label** names the number, and the **value** is the number or any text. A number is written with the
 * `locale` of the `LocaleProvider`, and **formatOptions** are the options of `Intl.NumberFormat` (a currency, a
 * compact notation). The **change** is the text to show, with its sign, and the **trend** (`up`, `down` or
 * `neutral`) gives it an arrow and a color. The trend is also said in words to a screen reader, before the change
 * (`Increase: +12 %`), with the texts `stat.up`, `stat.down` and `stat.neutral` of the `LocaleProvider`, so it never
 * depends on the color alone. **helpText** goes under the change.
 *
 * It is a `dl` with a `dt` for the label and a `dd` for each of the other lines. A color that is not the one of the
 * trend, such as `error` for a count of errors that goes up, is a **colorScheme**.
 */
export default {
  title: 'Components/Stat',
  component: Stat,
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
    change: {
      control: 'text',
    },
    className: {
      control: 'text',
    },
    colorScheme: {
      control: 'select',
      options: [undefined, 'primary', 'secondary', 'info', 'success', 'warning', 'error'],
    },
    formatOptions: {
      control: 'object',
    },
    helpText: {
      control: 'text',
    },
    label: {
      control: 'text',
    },
    locale: {
      control: 'text',
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
    },
    style: {
      control: false,
    },
    trend: {
      control: 'radio',
      options: [undefined, 'up', 'down', 'neutral'],
    },
    value: {
      control: 'text',
    },
    variant: {
      control: 'radio',
      options: ['default', 'unstyled'],
    },
  },
  args: {
    change: '+12 %',
    helpText: 'Compared to last month',
    label: 'Active projects',
    size: 'md',
    trend: 'up',
    value: 1284,
  },
} satisfies Meta<typeof Stat>

type Story = StoryObj<typeof Stat>

/**
 * This is the default Stat. Change its props in the Controls panel.
 */
export const Default: Story = {}

/**
 * Use **variant** to pick the look: `default` styles the Stat, and `unstyled` drops the Loica styles, so it is
 * bare markup for you to style.
 */
export const Variants: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-col gap-8">
  <Stat change="+12 %" helpText="Compared to last month" label="Active projects" trend="up" value={24} />
  <Stat change="+12 %" helpText="Compared to last month" label="Active projects" trend="up" value={24} variant="unstyled" />
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-8">
      <Stat change="+12 %" helpText="Compared to last month" label="Active projects" trend="up" value={24} />
      <Stat change="+12 %" helpText="Compared to last month" label="Active projects" trend="up" value={24} variant="unstyled" />
    </div>
  ),
}

/**
 * **size** scales the value: `sm`, `md` or `lg`.
 */
export const Sizes: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-wrap items-start gap-10">
  <Stat label="Active projects" size="sm" value={24} />
  <Stat label="Active projects" size="md" value={24} />
  <Stat label="Active projects" size="lg" value={24} />
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-start gap-10">
      <Stat label="Active projects" size="sm" value={24} />
      <Stat label="Active projects" size="md" value={24} />
      <Stat label="Active projects" size="lg" value={24} />
    </div>
  ),
}

/**
 * **trend** says where the number went. `up` is green with an arrow up, `down` is red with an arrow down and
 * `neutral` is muted with a dash. A screen reader hears the trend in words before the change, so the arrow and the
 * color are not the only signal.
 */
export const Trend: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-wrap items-start gap-10">
  <Stat change="+12 %" label="Revenue" trend="up" value="€48,200" />
  <Stat change="-3 %" label="Refunds" trend="down" value="€1,120" />
  <Stat change="0 %" label="Subscribers" trend="neutral" value="3,410" />
  <Stat change="+4" label="Open bugs" value="17" />
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-start gap-10">
      <Stat change="+12 %" label="Revenue" trend="up" value="€48,200" />
      <Stat change="-3 %" label="Refunds" trend="down" value="€1,120" />
      <Stat change="0 %" label="Subscribers" trend="neutral" value="3,410" />
      <Stat change="+4" label="Open bugs" value="17" />
    </div>
  ),
}

/**
 * Up is not always good news: a rise in errors takes **colorScheme** `error`, and a fall in them `success`, whatever
 * the arrow says.
 */
export const ColorScheme: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-wrap items-start gap-10">
  <Stat change="+4" colorScheme="error" label="Errors" trend="up" value={17} />
  <Stat change="-6" colorScheme="success" label="Errors" trend="down" value={11} />
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-start gap-10">
      <Stat change="+4" colorScheme="error" label="Errors" trend="up" value={17} />
      <Stat change="-6" colorScheme="success" label="Errors" trend="down" value={11} />
    </div>
  ),
}

/**
 * A number **value** is written with the locale, and **formatOptions** are the options of `Intl.NumberFormat`.
 * Here the same number in a currency, as a percentage, in compact notation and in another locale.
 */
export const Formatting: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-wrap items-start gap-10">
  <Stat formatOptions={{ currency: 'EUR', style: 'currency' }} label="Revenue" value={48200.5} />
  <Stat formatOptions={{ style: 'percent' }} label="Conversion" value={0.128} />
  <Stat formatOptions={{ notation: 'compact' }} label="Visits" value={1284000} />
  <Stat label="Visitas" locale="es" value={1284000} />
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-start gap-10">
      <Stat formatOptions={{ currency: 'EUR', style: 'currency' }} label="Revenue" value={48200.5} />
      <Stat formatOptions={{ style: 'percent' }} label="Conversion" value={0.128} />
      <Stat formatOptions={{ notation: 'compact' }} label="Visits" value={1284000} />
      <Stat label="Visitas" locale="es" value={1284000} />
    </div>
  ),
}

/**
 * A Stat is not a card, so a dashboard puts each one in a `Card`.
 */
export const InCards: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
  <Card variant="outline">
    <CardBody>
      <Stat change="+12 %" label="Revenue" trend="up" value={48200} />
    </CardBody>
  </Card>
  <Card variant="outline">
    <CardBody>
      <Stat change="-3 %" label="Refunds" trend="down" value={1120} />
    </CardBody>
  </Card>
  <Card variant="outline">
    <CardBody>
      <Stat helpText="Last 30 days" label="Subscribers" value={3410} />
    </CardBody>
  </Card>
</div>`,
      },
    },
  },
  render: () => (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card variant="outline">
        <CardBody>
          <Stat change="+12 %" label="Revenue" trend="up" value={48200} />
        </CardBody>
      </Card>
      <Card variant="outline">
        <CardBody>
          <Stat change="-3 %" label="Refunds" trend="down" value={1120} />
        </CardBody>
      </Card>
      <Card variant="outline">
        <CardBody>
          <Stat helpText="Last 30 days" label="Subscribers" value={3410} />
        </CardBody>
      </Card>
    </div>
  ),
}

/**
 * The same with Tailwind classes on an `unstyled` Stat. Its parts carry `data-loica-stat-*` attributes, which Tailwind
 * reaches with arbitrary variants.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Stat
  change="+12 %"
  className="m-0 flex flex-col gap-2 [&_dd]:m-0 [&_dt]:text-sm [&_dt]:text-muted [&_dd:nth-of-type(1)]:text-3xl [&_dd:nth-of-type(1)]:font-bold [&_dd:nth-of-type(2)]:text-sm [&_dd:nth-of-type(2)]:text-success-text"
  label="Active projects"
  trend="up"
  value={24}
  variant="unstyled"
/>`,
      },
    },
  },
  render: () => (
    <Stat
      change="+12 %"
      className="m-0 flex flex-col gap-2 [&_dd]:m-0 [&_dt]:text-sm [&_dt]:text-muted [&_dd:nth-of-type(1)]:text-3xl [&_dd:nth-of-type(1)]:font-bold [&_dd:nth-of-type(2)]:text-sm [&_dd:nth-of-type(2)]:text-success-text"
      label="Active projects"
      trend="up"
      value={24}
      variant="unstyled"
    />
  ),
}

/**
 * The same with Bootstrap classes on an `unstyled` Stat.
 */
export const Bootstrap: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Stat
  change="+12 %"
  className="d-flex flex-column gap-2 m-0 text-body"
  label="Active projects"
  trend="up"
  value={24}
  variant="unstyled"
/>`,
      },
    },
  },
  render: () => (
    <Stat
      change="+12 %"
      className="d-flex flex-column gap-2 m-0 text-body"
      label="Active projects"
      trend="up"
      value={24}
      variant="unstyled"
    />
  ),
}
