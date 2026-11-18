import type { StoryObj, Meta } from '@storybook/react-vite'
import { defaultTheme } from '../../../../theme'
import { Badge } from '../../badge'
import { Icon } from '../../icon'
import { Timeline, TimelineItem } from '..'

const colorSchemes = Object.keys(defaultTheme.colors)

/**
 * A vertical list of events in order, each with a marker joined to the next one by a line: the activity of a
 * project, the steps of an order. Use it for what happened and when; for the steps of a flow the user goes through,
 * use a `Stepper`.
 *
 * It is a native `ol`, so the order is announced. Write a `TimelineItem` for each event with its **title**, its
 * **time** and, as children, whatever else you want to tell about it. The **time** is the text to show, written as you
 * want it read, and **dateTime** is the machine-readable moment that goes in the `<time>` element. The marker is a dot,
 * or the **icon** you give it, and it is hidden from assistive technology, so the title has to say what the icon says.
 * Horizontal layouts and alternating sides are not part of it.
 */
export default {
  title: 'Components/Timeline',
  component: Timeline,
  tags: ['autodocs'],
  parameters: {
    docs: {
      importNames: ['Timeline', 'TimelineItem'],
      toc: {
        title: 'On this page',
        disable: false,
      },
    },
    layout: 'centered',
  },
  argTypes: {
    children: { control: false },
    className: { control: 'text' },
    style: { control: false },
    colorScheme: { control: 'select', options: colorSchemes },
    variant: { control: 'radio', options: ['subtle', 'solid', 'outline', 'unstyled'] },
    'aria-label': { control: 'text' },
  },
  args: {
    'aria-label': 'Activity',
  },
  render: (args) => (
    <Timeline {...args}>
      <TimelineItem dateTime="2026-06-15T09:30" time="15 Jun, 09:30" title="Project created">
        Ana Torres opened the project.
      </TimelineItem>
      <TimelineItem dateTime="2026-06-16T11:00" time="16 Jun, 11:00" title="Budget approved" />
      <TimelineItem dateTime="2026-06-18T16:45" time="18 Jun, 16:45" title="First milestone reached">
        The design was delivered and the build started.
      </TimelineItem>
    </Timeline>
  ),
} satisfies Meta<typeof Timeline>

type Story = StoryObj<typeof Timeline>

/**
 * This is the default Timeline. Change its props in the Controls panel.
 */
export const Default: Story = {}

/**
 * Use **variant** to pick the look of the markers: `subtle` (the default) tints them, `solid` fills them with the
 * color and `outline` draws a ring, and `unstyled` drops the Loica styles, so it is the bare `ol` of items for you to
 * lay out (see the Tailwind and Bootstrap examples).
 */
export const Variants: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-wrap gap-12">
  <Timeline aria-label="Subtle">
    <TimelineItem time="15 Jun" title="Project created">Ana Torres opened it.</TimelineItem>
    <TimelineItem time="16 Jun" title="Budget approved" />
  </Timeline>
  <Timeline aria-label="Solid" variant="solid">
    <TimelineItem time="15 Jun" title="Project created">Ana Torres opened it.</TimelineItem>
    <TimelineItem time="16 Jun" title="Budget approved" />
  </Timeline>
  <Timeline aria-label="Outline" variant="outline">
    <TimelineItem time="15 Jun" title="Project created">Ana Torres opened it.</TimelineItem>
    <TimelineItem time="16 Jun" title="Budget approved" />
  </Timeline>
  <Timeline aria-label="Unstyled" variant="unstyled">
    <TimelineItem time="15 Jun" title="Project created">Ana Torres opened it.</TimelineItem>
    <TimelineItem time="16 Jun" title="Budget approved" />
  </Timeline>
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap gap-12">
      {(['subtle', 'solid', 'outline', 'unstyled'] as const).map((variant) => (
        <Timeline
          aria-label={variant}
          key={variant}
          variant={variant}
        >
          <TimelineItem time="15 Jun" title="Project created">
            Ana Torres opened it.
          </TimelineItem>
          <TimelineItem time="16 Jun" title="Budget approved" />
        </Timeline>
      ))}
    </div>
  ),
}

/**
 * Use **colorScheme** on the `Timeline` to color every marker with a color of the theme, or on a `TimelineItem` to
 * color only that one (in every variant, `subtle` here): `success` for what went well, `error` for what failed. The color is a hint, so say it in the
 * title too.
 */
export const Colors: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Timeline aria-label="Deploys">
  <TimelineItem colorScheme="success" time="09:12" title="Deployed to production" />
  <TimelineItem colorScheme="error" time="09:05" title="Tests failed" />
  <TimelineItem colorScheme="info" time="08:50" title="Build started" />
</Timeline>`,
      },
    },
  },
  render: () => (
    <Timeline aria-label="Deploys">
      <TimelineItem colorScheme="success" time="09:12" title="Deployed to production" />
      <TimelineItem colorScheme="error" time="09:05" title="Tests failed" />
      <TimelineItem colorScheme="warning" time="08:58" title="Retried the build" />
      <TimelineItem colorScheme="info" time="08:50" title="Build started" />
      <TimelineItem colorScheme="primary" time="08:49" title="Pushed to main" />
    </Timeline>
  ),
}

/**
 * Give an item an **icon** to replace the dot of its marker. The icon takes the size of the marker, so an SVG with a
 * `viewBox` is enough, and it is hidden from assistive technology.
 */
export const WithIcons: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Timeline aria-label="Order">
  <TimelineItem colorScheme="success" icon={checkIcon} time="Delivered" title="Order delivered" />
  <TimelineItem colorScheme="info" icon={truckIcon} time="Yesterday" title="Shipped" />
  <TimelineItem icon={cartIcon} time="Monday" title="Order placed" />
</Timeline>`,
      },
    },
  },
  render: () => (
    <Timeline aria-label="Order">
      {[
        ['success', 'Delivered', 'Order delivered', 'M5 13l4 4L19 7'],
        ['info', 'Yesterday', 'Shipped', 'M3 7h11v9H3zM14 10h4l3 3v3h-7z'],
        ['secondary', 'Monday', 'Order placed', 'M6 6h15l-2 9H8zM6 6L5 3H2'],
      ].map(([colorScheme, time, title, path]) => (
        <TimelineItem
          colorScheme={colorScheme as 'success'}
          icon={
            <Icon>
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d={path} />
              </svg>
            </Icon>
          }
          key={title}
          time={time}
          title={title}
        />
      ))}
    </Timeline>
  ),
}

/**
 * The children of an item are free content: text, a link, a quote, a button. The marker and the line follow the
 * height of the item.
 */
export const WithContent: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Timeline aria-label="Comments">
  <TimelineItem time="2 hours ago" title="Ana Torres commented">
    <p>Can we move the review to Thursday? I will be out on Wednesday.</p>
  </TimelineItem>
  <TimelineItem time="Yesterday" title="Luis Perez changed the status">
    <Badge>At risk</Badge>
  </TimelineItem>
</Timeline>`,
      },
    },
  },
  render: () => (
    <Timeline aria-label="Comments">
      <TimelineItem time="2 hours ago" title="Ana Torres commented">
        <p style={{ margin: 0 }}>Can we move the review to Thursday? I will be out on Wednesday.</p>
      </TimelineItem>
      <TimelineItem time="Yesterday" title="Luis Perez changed the status">
        <Badge>At risk</Badge>
      </TimelineItem>
      <TimelineItem time="Monday" title="Created" />
    </Timeline>
  ),
}

/**
 * Some examples of Timeline with Tailwind classes. With `variant="unstyled"` the `Timeline` and each
 * `TimelineItem` take your classes; the parts inside an item are reached through their `data-loica-timeline-*`
 * attributes.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Timeline aria-label="Activity" className="flex flex-col gap-4 border-s-2 border-border ps-4" variant="unstyled">
  <TimelineItem className="[&_[data-loica-timeline-title]]:font-semibold [&_[data-loica-timeline-time]]:text-sm [&_[data-loica-timeline-time]]:text-foreground [&_[data-loica-timeline-marker]]:hidden" time="15 Jun" title="Project created">
    Ana Torres opened it.
  </TimelineItem>
  <TimelineItem className="[&_[data-loica-timeline-title]]:font-semibold [&_[data-loica-timeline-time]]:text-sm [&_[data-loica-timeline-time]]:text-foreground [&_[data-loica-timeline-marker]]:hidden" time="16 Jun" title="Budget approved" />
</Timeline>`,
      },
    },
  },
  render: () => (
    <Timeline
      aria-label="Activity"
      className="flex flex-col gap-4 border-s-2 border-border ps-4"
      variant="unstyled"
    >
      {[
        ['15 Jun', 'Project created', 'Ana Torres opened it.'],
        ['16 Jun', 'Budget approved', undefined],
      ].map(([time, title, body]) => (
        <TimelineItem
          className="[&_[data-loica-timeline-marker]]:hidden [&_[data-loica-timeline-time]]:text-sm [&_[data-loica-timeline-time]]:text-foreground [&_[data-loica-timeline-title]]:font-semibold"
          key={title}
          time={time}
          title={title}
        >
          {body}
        </TimelineItem>
      ))}
    </Timeline>
  ),
}

/**
 * Some examples of Timeline with Bootstrap classes: `list-group` on the `Timeline` and `list-group-item` on each
 * `TimelineItem`, which is how the activity tab of the example apps was built before.
 */
export const Bootstrap: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Timeline aria-label="Activity" className="list-group" variant="unstyled">
  <TimelineItem className="list-group-item" time="15 Jun" title="Project created">Ana Torres opened it.</TimelineItem>
  <TimelineItem className="list-group-item" time="16 Jun" title="Budget approved" />
</Timeline>`,
      },
    },
  },
  render: () => (
    <Timeline aria-label="Activity" className="list-group" variant="unstyled">
      <TimelineItem className="list-group-item" time="15 Jun" title="Project created">
        Ana Torres opened it.
      </TimelineItem>
      <TimelineItem className="list-group-item" time="16 Jun" title="Budget approved" />
    </Timeline>
  ),
}
