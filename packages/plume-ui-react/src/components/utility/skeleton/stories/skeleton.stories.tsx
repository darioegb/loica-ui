import type { StoryObj, Meta } from '@storybook/react-vite'
import { Skeleton } from '..'

/**
 * A placeholder for content that is still loading, so the page keeps its shape and does not jump when the content
 * arrives. Use it for what will be text, an image or an avatar.
 *
 * A Skeleton carries no information, so it is hidden from screen readers (`aria-hidden`). Tell them the area is
 * loading on the container that holds the skeletons, with `aria-busy="true"` and, if it helps, a visually hidden
 * message or a live region. It has no size or color scheme on purpose: its size comes from `width` and `height`
 * (or from its `shape`), and its color from the surface of the theme, so it follows the color mode. The pulse and
 * the wave stop with `prefers-reduced-motion`.
 *
 * For a paragraph, **lines** renders several lines, each a `<span data-plume-skeleton-line>`. The Skeleton has no
 * state to share, so it is a plain component that a Server Component can render.
 */
export default {
  title: 'Components/Skeleton',
  component: Skeleton,
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
    className: { control: 'text' },
    style: { control: false },
    shape: { control: 'radio', options: ['text', 'rect', 'circle'] },
    width: { control: 'text' },
    height: { control: 'text' },
    lines: { control: 'number' },
    variant: { control: 'radio', options: ['pulse', 'wave', 'unstyled'] },
    id: { control: false },
    hidden: { control: false },
  },
  args: {
    style: { width: '16rem' },
  },
} satisfies Meta<typeof Skeleton>

type Story = StoryObj<typeof Skeleton>

/**
 * This is the default Skeleton: a pulsing line of text.
 */
export const Default: Story = {}

/**
 * Use the **variant** prop to pick the animation: `pulse` fades it in and out and `wave` sweeps a light across it.
 * `unstyled` drops the Plume styles, the animation too, so you can style it yourself.
 */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-4" style={{ width: '16rem' }}>
      <Skeleton variant="pulse" />
      <Skeleton variant="wave" />
      <Skeleton height={16} variant="unstyled" />
    </div>
  ),
}

/**
 * Use the **shape** prop to match what is loading: `text`, `rect` or `circle`. A Skeleton has no `size` prop; give
 * it a `width` and a `height` to fit the content.
 */
export const Shapes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Skeleton shape="circle" />
      <div className="flex flex-col gap-2">
        <Skeleton height={14} shape="text" width={160} />
        <Skeleton height={14} shape="text" width={110} />
      </div>
      <Skeleton height={64} shape="rect" width={96} />
    </div>
  ),
}

/**
 * Use **lines** for a paragraph. The last line is shorter, like the end of a real one, and the lines are spaced by
 * the Skeleton itself.
 */
export const Lines: Story = {
  args: { lines: 4 },
}

/**
 * Put the skeletons where the content will be, mark the container with `aria-busy` and swap them for the real
 * content when it is ready. The skeleton is hidden from screen readers, so `aria-busy` is what tells them the area
 * is loading.
 */
export const Loading: Story = {
  render: () => (
    <div aria-busy="true" className="flex w-72 gap-3 rounded-lg border border-gray-300 p-4">
      <Skeleton shape="circle" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton height={16} width="60%" />
        <Skeleton lines={3} />
      </div>
    </div>
  ),
}

/**
 * Some examples of Skeleton with Tailwind classes. With `variant="unstyled"` the Skeleton keeps its width and height
 * and has no color or animation of its own: `className` brings them, and the lines of a group are styled from the parent.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div aria-busy="true" className="flex w-72 gap-3 rounded-lg border border-border bg-surface p-4">
  <Skeleton className="animate-pulse rounded-full bg-surface-muted" height={48} variant="unstyled" width={48} />
  <div className="flex flex-1 flex-col gap-2">
    <Skeleton className="animate-pulse rounded-sm bg-surface-muted" height={16} variant="unstyled" width="60%" />
    <Skeleton
      className="flex flex-col gap-2 [&>span]:h-3 [&>span]:animate-pulse [&>span]:rounded-sm [&>span]:bg-surface-muted [&>span:last-child]:w-3/5"
      lines={3}
      variant="unstyled"
    />
  </div>
</div>`,
      },
    },
  },
  render: () => (
    <div
      aria-busy="true"
      className="flex w-72 gap-3 rounded-lg border border-border bg-surface p-4"
    >
      <Skeleton
        className="animate-pulse rounded-full bg-surface-muted"
        height={48}
        variant="unstyled"
        width={48}
      />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton
          className="animate-pulse rounded-sm bg-surface-muted"
          height={16}
          variant="unstyled"
          width="60%"
        />
        <Skeleton
          className="flex flex-col gap-2 [&>span]:h-3 [&>span]:animate-pulse [&>span]:rounded-sm [&>span]:bg-surface-muted [&>span:last-child]:w-3/5"
          lines={3}
          variant="unstyled"
        />
      </div>
    </div>
  ),
}

/**
 * Some examples of Skeleton with Bootstrap classes: `placeholder-glow` on the container and `placeholder` on the
 * Skeleton, with the `col-*` widths. Bootstrap's `placeholder` is `display: inline-block`, so `d-block` keeps the
 * Skeleton on its own line.
 */
export const Bootstrap: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div aria-busy="true" className="card placeholder-glow" style={{ width: "18rem" }}>
  <div className="card-body">
    <Skeleton className="placeholder d-block col-6 mb-3" height={20} variant="unstyled" />
    <Skeleton className="placeholder d-block col-12 mb-2" variant="unstyled" />
    <Skeleton className="placeholder d-block col-12 mb-2" variant="unstyled" />
    <Skeleton className="placeholder d-block col-8" variant="unstyled" />
  </div>
</div>`,
      },
    },
  },
  render: () => (
    <div aria-busy="true" className="card placeholder-glow" style={{ width: '18rem' }}>
      <div className="card-body">
        <Skeleton className="placeholder d-block col-6 mb-3" height={20} variant="unstyled" />
        <Skeleton className="placeholder d-block col-12 mb-2" variant="unstyled" />
        <Skeleton className="placeholder d-block col-12 mb-2" variant="unstyled" />
        <Skeleton className="placeholder d-block col-8" variant="unstyled" />
      </div>
    </div>
  ),
}
