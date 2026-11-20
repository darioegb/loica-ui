import type { Meta, StoryObj } from '@storybook/react-vite'
import { useEffect, useState } from 'react'
import {
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
  DropdownSeparator,
  DropdownSub,
  DropdownSubMenu,
  DropdownSubTrigger,
} from '../../dropdown'
import { ContextMenu, ContextMenuTrigger, type ContextMenuProps } from '..'

const area =
  'flex h-32 w-72 items-center justify-center rounded-lg border border-dashed border-border bg-surface p-4 text-center text-sm text-foreground'

function Items(): React.ReactNode {
  return (
    <>
      <DropdownItem>Open</DropdownItem>
      <DropdownItem>Rename</DropdownItem>
      <DropdownSub>
        <DropdownSubTrigger>Share</DropdownSubTrigger>
        <DropdownSubMenu>
          <DropdownItem>Email</DropdownItem>
          <DropdownItem>Copy link</DropdownItem>
        </DropdownSubMenu>
      </DropdownSub>
      <DropdownSeparator />
      <DropdownItem>Delete</DropdownItem>
    </>
  )
}

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

function Example(props: Readonly<Omit<ContextMenuProps, 'children'>>): React.ReactNode {
  return (
    <ContextMenu {...props}>
      <ContextMenuTrigger>
        <button className={area} type="button">
          Right-click here, or focus it and press the menu key
        </button>
      </ContextMenuTrigger>
      <DropdownMenu aria-label="File actions">
        <Items />
      </DropdownMenu>
    </ContextMenu>
  )
}

/**
 * A menu of actions that opens where the user presses the secondary button, on the element that has the focus with the
 * context menu key or <kbd>Shift</kbd> + <kbd>F10</kbd>, or with a long press on a touch screen. Use it for the actions of
 * the thing under the pointer (a row, a file, a card), as a shortcut to commands that are also somewhere else on the
 * screen, because it can't be found without knowing it is there.
 *
 * It is the menu of the `Dropdown`: the `ContextMenuTrigger` marks the area and the menu is a `DropdownMenu` with the
 * items, groups, separators and submenus of the `Dropdown`, so they work the same. Give the `DropdownMenu` an
 * `aria-label`, because there is no button to name it. The menu opens at the pointer and flips or shifts to stay on the
 * screen. The arrows, <kbd>Home</kbd>, <kbd>End</kbd> and typing move between the items, <kbd>Esc</kbd> closes it, and
 * the focus goes back to where it was.
 */
export default {
  title: 'Components/ContextMenu',
  component: ContextMenu,
  tags: ['autodocs'],
  parameters: {
    docs: {
      importNames: [
        'ContextMenu',
        'ContextMenuTrigger',
        'DropdownMenu',
        'DropdownItem',
        'DropdownSeparator',
        'DropdownSub',
        'DropdownSubTrigger',
        'DropdownSubMenu',
      ],
      story: { inline: false, iframeHeight: 360 },
      toc: {
        title: 'On this page',
        disable: false,
      },
    },
    layout: 'centered',
  },
  argTypes: {
    children: { control: false },
    closeOnSelect: { control: 'boolean' },
    flip: { control: 'boolean' },
    onOpenChange: { control: false },
    shift: { control: 'boolean' },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    variant: { control: 'radio', options: ['elevated', 'outline', 'unstyled'] },
  },
  render: (args) => <Example {...args} />,
} satisfies Meta<typeof ContextMenu>

type Story = StoryObj<typeof ContextMenu>

/**
 * This is the default ContextMenu. Press the secondary button on the area, or focus it and press the context menu key.
 */
export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: `<ContextMenu>
  <ContextMenuTrigger>
    <button className="h-32 w-72 rounded-lg border border-dashed" type="button">
      Right-click here
    </button>
  </ContextMenuTrigger>
  <DropdownMenu aria-label="File actions">
    <DropdownItem>Open</DropdownItem>
    <DropdownItem>Rename</DropdownItem>
    <DropdownSub>
      <DropdownSubTrigger>Share</DropdownSubTrigger>
      <DropdownSubMenu>
        <DropdownItem>Email</DropdownItem>
        <DropdownItem>Copy link</DropdownItem>
      </DropdownSubMenu>
    </DropdownSub>
    <DropdownSeparator />
    <DropdownItem>Delete</DropdownItem>
  </DropdownMenu>
</ContextMenu>`,
      },
    },
  },
}

/**
 * Use the **variant** prop to pick how the menu looks: `elevated` floats it with a shadow, `outline` draws its border,
 * and `unstyled` drops the Loica styles so you can style it yourself.
 */
export const Variants: Story = {
  parameters: {
    docs: {
      story: { iframeHeight: 520 },
      source: {
        code: `<ContextMenu variant="elevated">…</ContextMenu>
<ContextMenu variant="outline">…</ContextMenu>
<ContextMenu variant="unstyled">…</ContextMenu>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-3">
      {(['elevated', 'outline', 'unstyled'] as const).map((variant) => (
        <ContextMenu key={variant} variant={variant}>
          <ContextMenuTrigger>
            <button className={`${area} h-20`} type="button">
              {variant}
            </button>
          </ContextMenuTrigger>
          <DropdownMenu aria-label={`${variant} actions`}>
            <Items />
          </DropdownMenu>
        </ContextMenu>
      ))}
    </div>
  ),
}

/**
 * Use the **size** prop to set the size of the text and of the padding of the items.
 */
export const Sizes: Story = {
  parameters: {
    docs: {
      story: { iframeHeight: 520 },
      source: {
        code: `<ContextMenu size="sm">…</ContextMenu>
<ContextMenu size="md">…</ContextMenu>
<ContextMenu size="lg">…</ContextMenu>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-3">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <ContextMenu key={size} size={size}>
          <ContextMenuTrigger>
            <button className={`${area} h-20`} type="button">
              {size}
            </button>
          </ContextMenuTrigger>
          <DropdownMenu aria-label={`${size} actions`}>
            <Items />
          </DropdownMenu>
        </ContextMenu>
      ))}
    </div>
  ),
}

/**
 * Each row of a list can have its own menu, built from what the row is about. The `ContextMenuTrigger` takes the row,
 * so the menu opens where the pointer is on it and, from the keyboard, below the row that has the focus.
 */
export const Rows: Story = {
  parameters: {
    docs: {
      story: { iframeHeight: 380 },
      source: {
        code: `{files.map((file) => (
  <ContextMenu key={file}>
    <ContextMenuTrigger>
      <button className="w-full px-3 py-2 text-start" type="button">{file}</button>
    </ContextMenuTrigger>
    <DropdownMenu aria-label={\`Actions for \${file}\`}>
      <DropdownLabel>{file}</DropdownLabel>
      <DropdownItem>Open</DropdownItem>
      <DropdownItem shortcut="F2">Rename</DropdownItem>
      <DropdownSeparator />
      <DropdownItem>Delete</DropdownItem>
    </DropdownMenu>
  </ContextMenu>
))}`,
      },
    },
  },
  render: () => (
    <ul className="w-72 divide-y divide-border rounded-lg border border-border bg-surface text-sm text-foreground">
      {['Annual report.pdf', 'Budget.xlsx', 'Notes.md'].map((file) => (
        <li key={file}>
          <ContextMenu>
            <ContextMenuTrigger>
              <button className="w-full px-3 py-2 text-start hover:bg-surface-muted" type="button">
                {file}
              </button>
            </ContextMenuTrigger>
            <DropdownMenu aria-label={`Actions for ${file}`}>
              <DropdownLabel>{file}</DropdownLabel>
              <DropdownItem>Open</DropdownItem>
              <DropdownItem shortcut="F2">Rename</DropdownItem>
              <DropdownSeparator />
              <DropdownItem>Delete</DropdownItem>
            </DropdownMenu>
          </ContextMenu>
        </li>
      ))}
    </ul>
  ),
}

function ReportingExample(): React.ReactNode {
  const [events, setEvents] = useState<string[]>([])
  const log = (text: string): void => setEvents((current) => [text, ...current].slice(0, 3))

  return (
    <div className="flex flex-col items-center gap-3">
      <ContextMenu onOpenChange={(open) => log(open ? 'opened' : 'closed')}>
        <ContextMenuTrigger>
          <button className={area} type="button">
            Right-click here
          </button>
        </ContextMenuTrigger>
        <DropdownMenu aria-label="File actions">
          <DropdownItem onSelect={() => log('Open selected')}>Open</DropdownItem>
          <DropdownItem closeOnSelect={false} onSelect={() => log('Pin selected, still open')}>
            Pin
          </DropdownItem>
        </DropdownMenu>
      </ContextMenu>
      <p className="text-sm text-[var(--loica-muted)]">{events.join(' · ') || 'Nothing yet'}</p>
    </div>
  )
}

/**
 * **onOpenChange** gets the new state when the menu opens or closes. An item can set **closeOnSelect** to `false` to keep
 * the menu open, and **disabled** on the `ContextMenuTrigger` leaves the menu of the browser instead.
 */
export const Events: Story = {
  parameters: {
    docs: {
      story: { iframeHeight: 300 },
      source: {
        code: `<ContextMenu onOpenChange={(open) => log(open ? 'opened' : 'closed')}>
  <ContextMenuTrigger>
    <button type="button">Right-click here</button>
  </ContextMenuTrigger>
  <DropdownMenu aria-label="File actions">
    <DropdownItem onSelect={() => log('Open selected')}>Open</DropdownItem>
    <DropdownItem closeOnSelect={false} onSelect={() => log('Pin selected')}>Pin</DropdownItem>
  </DropdownMenu>
</ContextMenu>`,
      },
    },
  },
  render: () => <ReportingExample />,
}

/**
 * With `dir="rtl"` the menu opens at the pointer as in any direction, its items and submenus follow the direction of
 * the text, and <kbd>←</kbd> opens a submenu. Set `dir` on the `<html>`, since the menus open in a portal.
 */
export const RightToLeft: Story = {
  parameters: {
    docs: {
      source: {
        code: `<html dir="rtl">
  <body>
    <ContextMenu>
      <ContextMenuTrigger>
        <button type="button">انقر بزر الفأرة الأيمن</button>
      </ContextMenuTrigger>
      <DropdownMenu aria-label="إجراءات">
        <DropdownItem>فتح</DropdownItem>
        <DropdownSub>
          <DropdownSubTrigger>مشاركة</DropdownSubTrigger>
          <DropdownSubMenu>
            <DropdownItem>البريد</DropdownItem>
          </DropdownSubMenu>
        </DropdownSub>
      </DropdownMenu>
    </ContextMenu>
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
    <ContextMenu>
      <ContextMenuTrigger>
        <button className={area} type="button">
          انقر بزر الفأرة الأيمن
        </button>
      </ContextMenuTrigger>
      <DropdownMenu aria-label="إجراءات">
        <DropdownItem>فتح</DropdownItem>
        <DropdownSub>
          <DropdownSubTrigger>مشاركة</DropdownSubTrigger>
          <DropdownSubMenu>
            <DropdownItem>البريد</DropdownItem>
          </DropdownSubMenu>
        </DropdownSub>
      </DropdownMenu>
    </ContextMenu>
  ),
}

/**
 * The ContextMenu has two parts: the `ContextMenuTrigger`, which takes the area and gives it the handlers (it renders a
 * `<div>` for text and takes `className`, `style` and `ref`), and the menu, which is the `DropdownMenu`, so the
 * `DropdownLabel`, `DropdownGroup` and the `shortcut` of the items of the `Dropdown` are there too.
 */
export const Compound: Story = {
  parameters: {
    docs: {
      source: {
        code: `<ContextMenu>
  <ContextMenuTrigger className="rounded-lg border p-6">
    Right-click this text
  </ContextMenuTrigger>
  <DropdownMenu aria-label="Text actions">
    <DropdownLabel>Selection</DropdownLabel>
    <DropdownItem shortcut="⌘C">Copy</DropdownItem>
    <DropdownItem shortcut="⌘V">Paste</DropdownItem>
  </DropdownMenu>
</ContextMenu>`,
      },
    },
  },
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger className="rounded-lg border border-border bg-surface p-6 text-sm text-foreground">
        Right-click this text
      </ContextMenuTrigger>
      <DropdownMenu aria-label="Text actions">
        <DropdownLabel>Selection</DropdownLabel>
        <DropdownItem shortcut="⌘C">Copy</DropdownItem>
        <DropdownItem shortcut="⌘V">Paste</DropdownItem>
      </DropdownMenu>
    </ContextMenu>
  ),
}

/**
 * Some examples of ContextMenu with Tailwind classes. With `variant="unstyled"` the menu, its items and its separators have
 * only the classes you give them, and the submenu takes the ones of its `DropdownSubMenu`.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<ContextMenu variant="unstyled">
  <ContextMenuTrigger>
    <button
      className="h-32 w-72 rounded-lg border border-dashed border-border text-sm text-foreground"
      type="button"
    >
      Right-click here
    </button>
  </ContextMenuTrigger>
  <DropdownMenu
    aria-label="File actions"
    className="min-w-48 rounded-lg border border-border bg-surface p-1 text-sm text-foreground shadow-lg"
  >
    <DropdownItem className="rounded-sm px-3 py-2 hover:bg-surface-muted focus:bg-surface-muted focus:outline-hidden">
      Open
    </DropdownItem>
    <DropdownSub>
      <DropdownSubTrigger className="rounded-sm px-3 py-2 hover:bg-surface-muted focus:bg-surface-muted focus:outline-hidden">
        Share
      </DropdownSubTrigger>
      <DropdownSubMenu className="min-w-40 rounded-lg border border-border bg-surface p-1 text-sm text-foreground shadow-lg">
        <DropdownItem className="rounded-sm px-3 py-2 hover:bg-surface-muted focus:bg-surface-muted focus:outline-hidden">
          Email
        </DropdownItem>
      </DropdownSubMenu>
    </DropdownSub>
    <DropdownSeparator className="my-1 h-px bg-border" />
    <DropdownItem className="rounded-sm px-3 py-2 text-red-600 hover:bg-red-50 focus:bg-red-50 focus:outline-hidden dark:text-red-400 dark:hover:bg-red-950 dark:focus:bg-red-950">
      Delete
    </DropdownItem>
  </DropdownMenu>
</ContextMenu>`,
      },
    },
  },
  render: () => (
    <ContextMenu variant="unstyled">
      <ContextMenuTrigger>
        <button
          className="h-32 w-72 rounded-lg border border-dashed border-border text-sm text-foreground"
          type="button"
        >
          Right-click here
        </button>
      </ContextMenuTrigger>
      <DropdownMenu
        aria-label="File actions"
        className="min-w-48 rounded-lg border border-border bg-surface p-1 text-sm text-foreground shadow-lg"
      >
        <DropdownItem className="rounded-sm px-3 py-2 hover:bg-surface-muted focus:bg-surface-muted focus:outline-hidden">
          Open
        </DropdownItem>
        <DropdownSub>
          <DropdownSubTrigger className="rounded-sm px-3 py-2 hover:bg-surface-muted focus:bg-surface-muted focus:outline-hidden">
            Share
          </DropdownSubTrigger>
          <DropdownSubMenu className="min-w-40 rounded-lg border border-border bg-surface p-1 text-sm text-foreground shadow-lg">
            <DropdownItem className="rounded-sm px-3 py-2 hover:bg-surface-muted focus:bg-surface-muted focus:outline-hidden">
              Email
            </DropdownItem>
          </DropdownSubMenu>
        </DropdownSub>
        <DropdownSeparator className="my-1 h-px bg-border" />
        <DropdownItem className="rounded-sm px-3 py-2 text-red-600 hover:bg-red-50 focus:bg-red-50 focus:outline-hidden dark:text-red-400 dark:hover:bg-red-950 dark:focus:bg-red-950">
          Delete
        </DropdownItem>
      </DropdownMenu>
    </ContextMenu>
  ),
}

/**
 * Some examples of ContextMenu with Bootstrap classes: `dropdown-menu show` on the menu and the submenu, `dropdown-item` on
 * the items and `dropdown-divider` on the separator.
 */
export const Bootstrap: Story = {
  parameters: {
    docs: {
      source: {
        code: `<ContextMenu variant="unstyled">
  <ContextMenuTrigger>
    <button className="btn btn-secondary" type="button">Right-click here</button>
  </ContextMenuTrigger>
  <DropdownMenu aria-label="File actions" className="dropdown-menu show">
    <DropdownItem className="dropdown-item">Open</DropdownItem>
    <DropdownSub>
      <DropdownSubTrigger className="dropdown-item d-flex align-items-center justify-content-between">Share</DropdownSubTrigger>
      <DropdownSubMenu className="dropdown-menu show">
        <DropdownItem className="dropdown-item">Email</DropdownItem>
      </DropdownSubMenu>
    </DropdownSub>
    <DropdownSeparator className="dropdown-divider" />
    <DropdownItem className="dropdown-item text-danger-emphasis">Delete</DropdownItem>
  </DropdownMenu>
</ContextMenu>`,
      },
    },
  },
  render: () => (
    <ContextMenu variant="unstyled">
      <ContextMenuTrigger>
        <button className="btn btn-secondary" type="button">
          Right-click here
        </button>
      </ContextMenuTrigger>
      <DropdownMenu aria-label="File actions" className="dropdown-menu show">
        <DropdownItem className="dropdown-item">Open</DropdownItem>
        <DropdownSub>
          <DropdownSubTrigger className="dropdown-item d-flex align-items-center justify-content-between">Share</DropdownSubTrigger>
          <DropdownSubMenu className="dropdown-menu show">
            <DropdownItem className="dropdown-item">Email</DropdownItem>
          </DropdownSubMenu>
        </DropdownSub>
        <DropdownSeparator className="dropdown-divider" />
        <DropdownItem className="dropdown-item text-danger-emphasis">Delete</DropdownItem>
      </DropdownMenu>
    </ContextMenu>
  ),
}
