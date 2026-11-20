import type { Meta, StoryObj } from '@storybook/react-vite'
import { useEffect, useState } from 'react'
import { defaultTheme } from '../../../../theme'
import { Splitter, SplitterHandle, SplitterPanel } from '..'

const colorSchemes = Object.keys(defaultTheme.colors)

const frame = 'h-48 w-[34rem] max-w-full overflow-hidden rounded-lg border border-border bg-surface text-foreground'
const pane = 'flex h-full items-center justify-center p-3 text-sm'

function RightToLeftPage({ children }: Readonly<{ children: React.ReactNode }>): React.ReactNode {
  useEffect(() => {
    const previous = document.documentElement.dir
    document.documentElement.dir = 'rtl'
    return () => {
      document.documentElement.dir = previous
    }
  }, [])

  return <>{children}</>
}

/**
 * Resizable panels: a sidebar and its content, or a list and its detail, with a handle between them that the user drags.
 * Use it when the user knows best how much room each part needs, and not for a layout that should keep its proportions.
 *
 * It follows the window splitter pattern of WAI-ARIA. The handle is a `separator` that takes the focus and reports the
 * size of the panel before it: <kbd>←</kbd> and <kbd>→</kbd> move it (<kbd>↑</kbd> and <kbd>↓</kbd> when the panels are
 * one under the other), <kbd>Home</kbd> and <kbd>End</kbd> go to the limits of the panels, and <kbd>Enter</kbd>
 * collapses a collapsible panel. It works with the pointer and with touch, and follows the direction of the text.
 *
 * Sizes are in **percent**, of the space the panels share (the handles take theirs on top). A percent follows the window
 * when it resizes, which is what a layout needs; a minimum in pixels is a different question, and a panel that must not
 * shrink under a width can say it with a `min-width` in its `style`.
 *
 * ### Parts
 *
 * The Splitter is made of `Splitter`, `SplitterPanel` and `SplitterHandle`. Panels and handles are direct children of
 * the Splitter, and a pair of panels with no handle between them gets one.
 */
export default {
  title: 'Components/Splitter',
  component: Splitter,
  tags: ['autodocs'],
  parameters: {
    docs: {
      importNames: ['Splitter', 'SplitterPanel', 'SplitterHandle'],
      toc: {
        title: 'On this page',
        disable: false,
      },
    },
    layout: 'padded',
  },
  argTypes: {
    children: { control: false },
    colorScheme: { control: 'select', options: colorSchemes },
    defaultSizes: { control: false },
    onResizeEnd: { control: false },
    onSizesChange: { control: false },
    orientation: { control: 'radio', options: ['horizontal', 'vertical'] },
    sizes: { control: false },
    step: { control: 'number' },
    variant: { control: 'radio', options: ['line', 'bar', 'unstyled'] },
  },
  args: {
    'aria-label': 'Files and editor',
    className: frame,
    defaultSizes: [30, 70],
  },
  render: (args) => (
    <Splitter {...args}>
      <SplitterPanel className={pane}>Files</SplitterPanel>
      <SplitterPanel className={pane}>Editor</SplitterPanel>
    </Splitter>
  ),
} satisfies Meta<typeof Splitter>

type Story = StoryObj<typeof Splitter>

/**
 * This is the default Splitter. Drag the handle, or focus it and use the arrow keys.
 */
export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Splitter aria-label="Files and editor" className="h-48" defaultSizes={[30, 70]}>
  <SplitterPanel>Files</SplitterPanel>
  <SplitterPanel>Editor</SplitterPanel>
</Splitter>`,
      },
    },
  },
}

/**
 * Use the **variant** prop to pick how the handles look: `line` is a thin divider that takes the color of the scheme when
 * it is hovered, focused or dragged, and `bar` is a wider handle with a grip. `unstyled` drops the Loica styles, so the
 * handle has no size until you give it one.
 */
export const Variants: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Splitter variant="line">…</Splitter>
<Splitter variant="bar">…</Splitter>
<Splitter variant="unstyled">…</Splitter>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      {(['line', 'bar', 'unstyled'] as const).map((variant) => (
        <Splitter
          aria-label={variant}
          className="h-20 w-[28rem] max-w-full overflow-hidden rounded-lg border border-border bg-surface text-foreground"
          defaultSizes={[40, 60]}
          key={variant}
          variant={variant}
        >
          <SplitterPanel className={pane}>{variant}</SplitterPanel>
          <SplitterPanel className={pane}>Panel</SplitterPanel>
        </Splitter>
      ))}
    </div>
  ),
}

/**
 * Every color of the theme in the `line` variant, the first and default one. The color shows on the handle while it is
 * hovered, focused or dragged, and the `bar` variant uses it for its grip in the same cases.
 */
export const Colors: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Splitter colorScheme="primary">…</Splitter>
<Splitter colorScheme="success">…</Splitter>
<Splitter colorScheme="error">…</Splitter>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-3">
      {colorSchemes.map((colorScheme) => (
        <Splitter
          aria-label={colorScheme}
          className="h-12 w-[28rem] max-w-full overflow-hidden rounded-lg border border-border bg-surface text-foreground"
          colorScheme={colorScheme as keyof typeof defaultTheme.colors}
          defaultSizes={[40, 60]}
          key={colorScheme}
        >
          <SplitterPanel className={pane}>{colorScheme}</SplitterPanel>
          <SplitterPanel className={pane}>Panel</SplitterPanel>
        </Splitter>
      ))}
    </div>
  ),
}

/**
 * With **orientation** `vertical` the panels go one under the other and the handle moves up and down. The Splitter needs
 * a height of its own, which the panels share.
 */
export const Vertical: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Splitter className="h-64" defaultSizes={[60, 40]} orientation="vertical">
  <SplitterPanel>Preview</SplitterPanel>
  <SplitterPanel>Console</SplitterPanel>
</Splitter>`,
      },
    },
  },
  render: () => (
    <Splitter
      aria-label="Preview and console"
      className="h-64 w-[28rem] max-w-full overflow-hidden rounded-lg border border-border bg-surface text-foreground"
      defaultSizes={[60, 40]}
      orientation="vertical"
    >
      <SplitterPanel className={pane}>Preview</SplitterPanel>
      <SplitterPanel className={pane}>Console</SplitterPanel>
    </Splitter>
  ),
}

/**
 * **minSize** and **maxSize** on a panel are percents, and the handle stops there. They also set the range the handle
 * reports (`aria-valuemin` and `aria-valuemax`). Here the sidebar has between 20 % and 50 %.
 */
export const Limits: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Splitter className="h-48" defaultSizes={[30, 70]}>
  <SplitterPanel maxSize={50} minSize={20}>Sidebar</SplitterPanel>
  <SplitterPanel minSize={30}>Content</SplitterPanel>
</Splitter>`,
      },
    },
  },
  render: () => (
    <Splitter aria-label="Sidebar and content" className={frame} defaultSizes={[30, 70]}>
      <SplitterPanel className={pane} maxSize={50} minSize={20}>
        Sidebar, 20 % to 50 %
      </SplitterPanel>
      <SplitterPanel className={pane} minSize={30}>
        Content, at least 30 %
      </SplitterPanel>
    </Splitter>
  ),
}

/**
 * A **collapsible** panel closes with <kbd>Enter</kbd> on its handle, a double click on it, or by dragging it past half of
 * its `minSize`, and opens the same way at the size it had. At **collapsedSize** `0` its content is hidden; with more, a
 * narrow rail stays, as in the second Splitter.
 */
export const Collapsible: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Splitter className="h-48" defaultSizes={[30, 70]}>
  <SplitterPanel collapsible minSize={15}>Sidebar</SplitterPanel>
  <SplitterPanel>Content</SplitterPanel>
</Splitter>

<Splitter className="h-48" defaultSizes={[30, 70]}>
  <SplitterPanel collapsedSize={6} collapsible minSize={15}>Menu</SplitterPanel>
  <SplitterPanel>Content</SplitterPanel>
</Splitter>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <Splitter aria-label="Collapsing sidebar" className="h-32 w-[34rem] max-w-full overflow-hidden rounded-lg border border-border bg-surface text-foreground" defaultSizes={[30, 70]}>
        <SplitterPanel className={pane} collapsible minSize={15}>
          Sidebar
        </SplitterPanel>
        <SplitterPanel className={pane}>Content</SplitterPanel>
      </Splitter>
      <Splitter aria-label="Collapsing to a rail" className="h-32 w-[34rem] max-w-full overflow-hidden rounded-lg border border-border bg-surface text-foreground" defaultSizes={[30, 70]}>
        <SplitterPanel className={pane} collapsedSize={6} collapsible minSize={15}>
          Menu
        </SplitterPanel>
        <SplitterPanel className={pane}>Content</SplitterPanel>
      </Splitter>
    </div>
  ),
}

function SavedExample(): React.ReactNode {
  const [sizes, setSizes] = useState([30, 70])
  const [saved, setSaved] = useState<number[] | null>(null)

  return (
    <div className="flex flex-col gap-3">
      <Splitter
        aria-label="Sidebar and content"
        className={frame}
        onResizeEnd={setSaved}
        onSizesChange={setSizes}
        sizes={sizes}
      >
        <SplitterPanel className={pane}>{Math.round(sizes[0])} %</SplitterPanel>
        <SplitterPanel className={pane}>{Math.round(sizes[1])} %</SplitterPanel>
      </Splitter>
      <p className="text-sm text-[var(--loica-muted)]">
        {saved ? `Saved ${saved.map((size) => `${Math.round(size)} %`).join(' / ')}` : 'Nothing saved yet'}
      </p>
    </div>
  )
}

/**
 * **sizes** controls the panels and **onSizesChange** gets the sizes on every change, so they can follow the pointer.
 * **onResizeEnd** gets them once, when a drag ends or a key moves the handle, which is when an app saves them (to
 * `localStorage`, or to the settings of the user). **defaultSizes** is the same for an uncontrolled Splitter.
 */
export const Controlled: Story = {
  parameters: {
    docs: {
      source: {
        code: `const [sizes, setSizes] = useState([30, 70])

<Splitter
  className="h-48"
  onResizeEnd={(sizes) => localStorage.setItem('layout', JSON.stringify(sizes))}
  onSizesChange={setSizes}
  sizes={sizes}
>
  <SplitterPanel>{Math.round(sizes[0])} %</SplitterPanel>
  <SplitterPanel>{Math.round(sizes[1])} %</SplitterPanel>
</Splitter>`,
      },
    },
  },
  render: () => <SavedExample />,
}

/**
 * A Splitter can have more than two panels, with a handle between each pair that moves only the two panels next to it.
 * One can also hold another Splitter, as in the layout of an editor.
 */
export const Nested: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Splitter className="h-64" defaultSizes={[25, 75]}>
  <SplitterPanel minSize={15}>Files</SplitterPanel>
  <SplitterPanel>
    <Splitter className="h-full" defaultSizes={[65, 35]} orientation="vertical">
      <SplitterPanel>Editor</SplitterPanel>
      <SplitterPanel>Terminal</SplitterPanel>
    </Splitter>
  </SplitterPanel>
</Splitter>`,
      },
    },
  },
  render: () => (
    <Splitter
      aria-label="Files and workspace"
      className="h-64 w-[34rem] max-w-full overflow-hidden rounded-lg border border-border bg-surface text-foreground"
      defaultSizes={[25, 75]}
    >
      <SplitterPanel className={pane} minSize={15}>
        Files
      </SplitterPanel>
      <SplitterPanel>
        <Splitter aria-label="Editor and terminal" className="h-full" defaultSizes={[65, 35]} orientation="vertical">
          <SplitterPanel className={pane}>Editor</SplitterPanel>
          <SplitterPanel className={pane}>Terminal</SplitterPanel>
        </Splitter>
      </SplitterPanel>
    </Splitter>
  ),
}

/**
 * With `dir="rtl"` the first panel is on the right, dragging and the arrow keys follow what the user sees, and
 * <kbd>←</kbd> grows the first panel. Set `dir` on the `<html>`.
 */
export const RightToLeft: Story = {
  parameters: {
    docs: {
      source: {
        code: `<html dir="rtl">
  <body>
    <Splitter className="h-48" defaultSizes={[30, 70]}>
      <SplitterPanel>الملفات</SplitterPanel>
      <SplitterPanel>المحرر</SplitterPanel>
    </Splitter>
  </body>
</html>`,
      },
    },
  },
  decorators: [
    (Story) => (
      <RightToLeftPage>
        <Story />
      </RightToLeftPage>
    ),
  ],
  render: () => (
    <Splitter aria-label="الملفات والمحرر" className={frame} defaultSizes={[30, 70]}>
      <SplitterPanel className={pane}>الملفات</SplitterPanel>
      <SplitterPanel className={pane}>المحرر</SplitterPanel>
    </Splitter>
  ),
}

/**
 * The Splitter is a `Splitter` with its `SplitterPanel` parts and a `SplitterHandle` between each pair. Write the handle
 * to give it a class, a `disabled`, a name of its own or content, such as a grip.
 */
export const Compound: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Splitter aria-label="Layout" className="h-48" defaultSizes={[25, 50, 25]}>
  <SplitterPanel>Menu</SplitterPanel>
  <SplitterHandle aria-label="Resize the menu" />
  <SplitterPanel>Content</SplitterPanel>
  <SplitterHandle aria-label="Resize the details" disabled />
  <SplitterPanel>Details</SplitterPanel>
</Splitter>`,
      },
    },
  },
  render: () => (
    <Splitter aria-label="Layout" className={frame} defaultSizes={[25, 50, 25]}>
      <SplitterPanel className={pane}>Menu</SplitterPanel>
      <SplitterHandle aria-label="Resize the menu" />
      <SplitterPanel className={pane}>Content</SplitterPanel>
      <SplitterHandle aria-label="Resize the details" disabled />
      <SplitterPanel className={pane}>Details, locked</SplitterPanel>
    </Splitter>
  ),
}

/**
 * Some examples of Splitter with Tailwind classes. With `variant="unstyled"` the handle has only the classes you give it,
 * so it needs a size. The handle has `data-dragging` while it is dragged and `data-disabled` when it is disabled, and
 * every part carries a `data-loica-splitter-*` attribute (`data-loica-splitter`, `-panel` and `-handle`).
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Splitter aria-label="Files and editor" className="h-48 rounded-lg border border-border" defaultSizes={[30, 70]} variant="unstyled">
  <SplitterPanel className="p-4">Files</SplitterPanel>
  <SplitterHandle className="w-1.5 bg-border hover:bg-primary-solid focus-visible:bg-primary-solid focus-visible:outline-hidden data-[dragging]:bg-primary-solid" />
  <SplitterPanel className="p-4">Editor</SplitterPanel>
</Splitter>`,
      },
    },
  },
  render: () => (
    <Splitter
      aria-label="Files and editor"
      className={frame}
      defaultSizes={[30, 70]}
      variant="unstyled"
    >
      <SplitterPanel className={pane}>Files</SplitterPanel>
      <SplitterHandle className="w-1.5 bg-border hover:bg-primary-solid focus-visible:bg-primary-solid focus-visible:outline-hidden data-[dragging]:bg-primary-solid" />
      <SplitterPanel className={pane}>Editor</SplitterPanel>
    </Splitter>
  ),
}

/**
 * Some examples of Splitter with Bootstrap classes: `border rounded` on the root, `bg-secondary-subtle` on the handle and
 * `d-flex align-items-center justify-content-center` on the panels. Bootstrap has no class for the size of the handle, nor
 * for its hover, so the story gives it a width and a rule of its own.
 */
export const Bootstrap: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Splitter aria-label="Files and editor" className="border rounded overflow-hidden" defaultSizes={[30, 70]} style={{ height: '12rem' }} variant="unstyled">
  <SplitterPanel className="d-flex align-items-center justify-content-center">Files</SplitterPanel>
  <SplitterHandle className="bg-secondary-subtle" style={{ width: '0.375rem' }} />
  <SplitterPanel className="d-flex align-items-center justify-content-center">Editor</SplitterPanel>
</Splitter>`,
      },
    },
  },
  render: () => (
    <>
      <style>{`.bs-splitter [data-loica-splitter-handle]:hover,.bs-splitter [data-loica-splitter-handle][data-dragging],.bs-splitter [data-loica-splitter-handle]:focus-visible{background-color:var(--bs-primary)!important;outline:0}`}</style>
      <Splitter
        aria-label="Files and editor"
        className="bs-splitter border rounded overflow-hidden text-body bg-body"
        defaultSizes={[30, 70]}
        style={{ height: '12rem', maxWidth: '34rem' }}
        variant="unstyled"
      >
        <SplitterPanel className="d-flex align-items-center justify-content-center">
          Files
        </SplitterPanel>
        <SplitterHandle className="bg-secondary-subtle" style={{ width: '0.375rem' }} />
        <SplitterPanel className="d-flex align-items-center justify-content-center">
          Editor
        </SplitterPanel>
      </Splitter>
    </>
  ),
}
