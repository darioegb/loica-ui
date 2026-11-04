import type { StoryObj, Meta } from '@storybook/react-vite'
import { Button } from '../../../interaction/button'
import { LocaleProvider } from '../../../../locale'
import { Icon } from '../../../presentation/icon'
import {
  Toast,
  ToastActionButton,
  ToastBody,
  ToastDescription,
  ToastDismiss,
  ToastIcon,
  ToastProvider,
  ToastTitle,
  useToast,
  type ToastApi,
  type ToastData,
  type ToastPosition,
  type ToastProviderProps,
} from '..'

const positions: ToastPosition[] = [
  'top-start',
  'top',
  'top-end',
  'center-start',
  'center',
  'center-end',
  'bottom-start',
  'bottom',
  'bottom-end',
]

function Fire({
  className,
  label,
  make,
  variant = 'solid',
}: Readonly<{
  className?: string
  label: string
  make: (api: ToastApi) => void
  variant?: 'ghost' | 'outline' | 'solid' | 'unstyled'
}>): React.ReactNode {
  const api = useToast()
  return <Button className={className} onClick={() => make(api)} variant={variant}>{label}</Button>
}

function Demo({
  children,
  ...props
}: Readonly<Partial<ToastProviderProps> & { children?: React.ReactNode }>): React.ReactNode {
  return (
    <ToastProvider {...props}>
      {children ?? (
        <Fire
          label="Show a toast"
          make={(api) => api.toast({ description: 'Your changes were saved.', title: 'Saved' })}
        />
      )}
    </ToastProvider>
  )
}

/**
 * A short message that appears over the page to say that something happened, and goes away by itself. Wrap the
 * app in a `ToastProvider` and call `useToast()` from any component below it to show one.
 *
 * Screen readers announce each toast without moving the focus: `success`, `info`, `warning` and neutral toasts are
 * polite, and `error` is assertive (`role="alert"`). The timer stops while the pointer is over a toast or the
 * focus is inside it, so it can be read and reached with the keyboard, and <kbd>Esc</kbd> dismisses the toast
 * that has the focus. Something the user has to read or act on shouldn't disappear: set `duration` to `0`.
 *
 * ### useToast
 *
 * `useToast()` returns `toast`, `success`, `info`, `warning` and `error`, which take a string, a node or an
 * options object and return the id of the toast, plus `dismiss(id)` and `dismissAll()`.
 *
 * | Option | Description |
 * | --- | --- |
 * | `title`, `description` | The text of the toast. |
 * | `status` | `neutral`, `info`, `success`, `warning` or `error`. The `success`, `info`, `warning` and `error` methods set it. |
 * | `icon` | A node that replaces the icon of the status, or `false` for a toast with no icon. |
 * | `duration` | Milliseconds before it goes away. `0` keeps it until it is dismissed. Defaults to the one of the provider. |
 * | `action` | `{ label, onClick }`: a button that runs `onClick` and dismisses the toast. |
 * | `dismissible` | Whether it has a dismiss button, and <kbd>Esc</kbd> dismisses it. `true` by default. |
 * | `id` | Shows the toast with a known id. Calling again with the same id updates it and restarts its timer. |
 * | `onDismiss` | Called when the toast goes away, for any reason. |
 *
 * ### Parts
 *
 * A toast is made of parts. Without anything else the provider renders `Toast` with the default composition, and
 * `render` lets you write it yourself for every toast: `render={(toast) => <Toast toast={toast}>...</Toast>}`.
 * Each part takes `className`, `style` and `ref`, and the ones that hold content read it from the toast, so they
 * work with no children and accept `children` to replace it. A part that has nothing to show renders nothing.
 *
 * Every part carries `data-plume-toast-<part>`, and the toast `data-status`.
 */
export default {
  title: 'Components/Toast',
  component: ToastProvider,
  tags: ['autodocs'],
  parameters: {
    docs: {
      story: { inline: false, iframeHeight: 420 },
      importNames: ['ToastProvider', 'useToast'],
      toc: {
        title: 'On this page',
        disable: false,
      },
    },
    layout: 'centered',
  },
  argTypes: {
    children: { control: false },
    position: { control: 'select', options: positions },
    duration: { control: 'number' },
    icons: { control: false },
    max: { control: 'number' },
    variant: { control: 'radio', options: ['solid', 'subtle', 'outline', 'unstyled'] },
    className: { control: 'text' },
    render: { control: false },
  },
  render: (args) => <Demo {...args} />,
} satisfies Meta<typeof ToastProvider>

type Story = StoryObj<typeof ToastProvider>

/**
 * This is the default ToastProvider. The button calls `toast()` with a title and a description.
 */
export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: `function Example() {
  const toast = useToast()

  return (
    <Button
      onClick={() => toast.toast({ description: 'Your changes were saved.', title: 'Saved' })}
    >
      Show a toast
    </Button>
  )
}

<ToastProvider>
  <Example />
</ToastProvider>`,
      },
    },
  },
}

/**
 * Use the **variant** prop of the provider to pick how the toasts look: `solid` fills them with the color of
 * their status, `subtle` tints them, `outline` draws their border with an accent, and `unstyled` drops the
 * Plume styles so you can style them yourself. Each button below has its own provider and position, and its own
 * `toast.region` text of the `LocaleProvider`: with several providers on a page, each region needs a name of its own.
 */
export const Variants: Story = {
  parameters: {
    docs: {
      source: {
        code: `function Example({ variant }: { variant: 'solid' | 'subtle' | 'outline' }) {
  const toast = useToast()

  return (
    <Button
      onClick={() => toast.success({ description: \`A \${variant} toast.\`, title: 'Saved' })}
      variant="outline"
    >
      {variant[0].toUpperCase() + variant.slice(1)}
    </Button>
  )
}

function UnstyledExample() {
  const toast = useToast()

  return (
    <Button
      onClick={() => toast.toast({ title: 'An unstyled toast' })}
      variant="outline"
    >
      Unstyled
    </Button>
  )
}

<div className="flex flex-wrap justify-center gap-4">
  <LocaleProvider messages={{ toast: { region: 'solid notifications' } }}>
    <ToastProvider position="top-start" variant="solid">
      <Example variant="solid" />
    </ToastProvider>
  </LocaleProvider>
  <LocaleProvider messages={{ toast: { region: 'subtle notifications' } }}>
    <ToastProvider position="top-end" variant="subtle">
      <Example variant="subtle" />
    </ToastProvider>
  </LocaleProvider>
  <LocaleProvider messages={{ toast: { region: 'outline notifications' } }}>
    <ToastProvider position="bottom-start" variant="outline">
      <Example variant="outline" />
    </ToastProvider>
  </LocaleProvider>
  <LocaleProvider messages={{ toast: { region: 'unstyled notifications' } }}>
    <ToastProvider
      render={(toast) => (
        <Toast
          toast={toast}
        />
      )}
      variant="unstyled"
    >
      <UnstyledExample />
    </ToastProvider>
  </LocaleProvider>
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap justify-center gap-4">
      {(
        [
          ['solid', 'top-start'],
          ['subtle', 'top-end'],
          ['outline', 'bottom-start'],
        ] as const
      ).map(([variant, position]) => (
        <LocaleProvider key={variant} messages={{ toast: { region: `${variant} notifications` } }}>
          <ToastProvider position={position} variant={variant}>
            <Fire
              label={variant[0].toUpperCase() + variant.slice(1)}
              make={(api) =>
                api.success({
                  description: `A ${variant} toast.`,
                  title: 'Saved',
                })
              }
              variant="outline"
            />
          </ToastProvider>
        </LocaleProvider>
      ))}
      <LocaleProvider messages={{ toast: { region: 'unstyled notifications' } }}>
        <ToastProvider render={(toast) => <Toast toast={toast} />} variant="unstyled">
          <Fire
            label="Unstyled"
            make={(api) => api.toast({ title: 'An unstyled toast' })}
            variant="outline"
          />
        </ToastProvider>
      </LocaleProvider>
    </div>
  ),
}

/**
 * The **success**, **info**, **warning** and **error** methods set the status. An `error` toast is announced
 * at once (`role="alert"`) and the others politely.
 */
export const Statuses: Story = {
  parameters: {
    docs: {
      source: {
        code: `function Example() {
  const toast = useToast()

  return (
    <div className="flex flex-wrap justify-center gap-2">
      <Button
        onClick={() => toast.toast({ title: 'Something happened' })}
        variant="outline"
      >
        Neutral
      </Button>
      <Button
        onClick={() => toast.info({ title: 'A new version is out' })}
        variant="outline"
      >
        Info
      </Button>
      <Button
        onClick={() =>
          toast.success({ description: 'Your changes were saved.', title: 'Saved' })
        }
        variant="outline"
      >
        Success
      </Button>
      <Button
        onClick={() =>
          toast.warning({ description: 'You are close to the limit.', title: 'Almost full' })
        }
        variant="outline"
      >
        Warning
      </Button>
      <Button
        onClick={() =>
          toast.error({
            description: 'Check your connection and try again.',
            title: 'Could not save',
          })
        }
        variant="outline"
      >
        Error
      </Button>
    </div>
  )
}

<ToastProvider>
  <Example />
</ToastProvider>`,
      },
    },
  },
  render: () => (
    <Demo>
      <div className="flex flex-wrap justify-center gap-2">
        <Fire
          label="Neutral"
          make={(api) => api.toast({ title: 'Something happened' })}
          variant="outline"
        />
        <Fire
          label="Info"
          make={(api) => api.info({ title: 'A new version is out' })}
          variant="outline"
        />
        <Fire
          label="Success"
          make={(api) => api.success({ description: 'Your changes were saved.', title: 'Saved' })}
          variant="outline"
        />
        <Fire
          label="Warning"
          make={(api) =>
            api.warning({ description: 'You are close to the limit.', title: 'Almost full' })
          }
          variant="outline"
        />
        <Fire
          label="Error"
          make={(api) =>
            api.error({
              description: 'Check your connection and try again.',
              title: 'Could not save',
            })
          }
          variant="outline"
        />
      </div>
    </Demo>
  ),
}

const bell = (
  <Icon>
    <svg
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0" />
    </svg>
  </Icon>
)

/**
 * The status icons are optional and can be replaced. Set **icons** on the provider to `false` for no icons, or to
 * an object with a node for each status, which can also give an icon to `neutral`. A single toast can set its own
 * with the **icon** option, or hide it with `icon: false`. Icons are decorative, so they are hidden from screen
 * readers: the status is announced by the role of the toast.
 */
export const Icons: Story = {
  parameters: {
    docs: {
      source: {
        code: `function SavedExample() {
  const toast = useToast()

  return (
    <Button
      onClick={() => toast.success({ description: 'Your changes were saved.', title: 'Saved' })}
      variant="outline"
    >
      No icons
    </Button>
  )
}

function CustomIconsExample() {
  const toast = useToast()

  return (
    <Button
      onClick={() => {
        toast.toast({ title: 'A neutral toast with an icon' })
        toast.success({ title: 'Saved' })
      }}
      variant="outline"
    >
      Custom icons
    </Button>
  )
}

function OneToastExample() {
  const toast = useToast()

  return (
    <Button
      onClick={() => toast.info({ icon: <BellIcon />, title: 'This toast has its own icon' })}
      variant="outline"
    >
      One toast
    </Button>
  )
}

<div className="flex flex-wrap justify-center gap-4">
  <LocaleProvider messages={{ toast: { region: 'no icons notifications' } }}>
    <ToastProvider icons={false} position="top-start">
      <SavedExample />
    </ToastProvider>
  </LocaleProvider>
  <LocaleProvider messages={{ toast: { region: 'custom icons notifications' } }}>
    <ToastProvider icons={{ neutral: <BellIcon />, success: <span>🎉</span> }} position="bottom">
      <CustomIconsExample />
    </ToastProvider>
  </LocaleProvider>
  <LocaleProvider messages={{ toast: { region: 'one icon notifications' } }}>
    <ToastProvider position="top-end">
      <OneToastExample />
    </ToastProvider>
  </LocaleProvider>
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap justify-center gap-4">
      <LocaleProvider messages={{ toast: { region: 'no icons notifications' } }}>
        <ToastProvider icons={false} position="top-start">
          <Fire
            label="No icons"
            make={(api) => api.success({ description: 'Your changes were saved.', title: 'Saved' })}
            variant="outline"
          />
        </ToastProvider>
      </LocaleProvider>
      <LocaleProvider messages={{ toast: { region: 'custom icons notifications' } }}>
        <ToastProvider icons={{ neutral: bell, success: <span>🎉</span> }} position="bottom">
          <Fire
            label="Custom icons"
            make={(api) => {
              api.toast({ title: 'A neutral toast with an icon' })
              api.success({ title: 'Saved' })
            }}
            variant="outline"
          />
        </ToastProvider>
      </LocaleProvider>
      <LocaleProvider messages={{ toast: { region: 'one icon notifications' } }}>
        <Demo position="top-end">
          <Fire
            label="One toast"
            make={(api) => api.info({ icon: bell, title: 'This toast has its own icon' })}
            variant="outline"
          />
        </Demo>
      </LocaleProvider>
    </div>
  ),
}

/**
 * Use the **position** prop of the provider to choose the corner, the edge or the center of the screen where the toasts stack. The newest
 * one is the closest to the edge of the screen.
 */
export const Positions: Story = {
  parameters: {
    docs: {
      source: {
        code: `function Example({ position }: { position: ToastPosition }) {
  const toast = useToast()

  return (
    <Button
      className="w-full whitespace-nowrap"
      onClick={() => toast.info({ title: position })}
      variant="outline"
    >
      {position}
    </Button>
  )
}

<div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
  <LocaleProvider messages={{ toast: { region: 'top-start notifications' } }}>
    <ToastProvider position="top-start">
      <Example position="top-start" />
    </ToastProvider>
  </LocaleProvider>
  <LocaleProvider messages={{ toast: { region: 'center notifications' } }}>
    <ToastProvider position="center">
      <Example position="center" />
    </ToastProvider>
  </LocaleProvider>
  <LocaleProvider messages={{ toast: { region: 'bottom-end notifications' } }}>
    <ToastProvider position="bottom-end">
      <Example position="bottom-end" />
    </ToastProvider>
  </LocaleProvider>
</div>`,
      },
    },
  },
  render: () => (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {positions.map((position) => (
        <LocaleProvider key={position} messages={{ toast: { region: `${position} notifications` } }}>
          <ToastProvider position={position}>
            <Fire
              className="w-full whitespace-nowrap"
              label={position}
              make={(api) => api.info({ title: position })}
              variant="outline"
            />
          </ToastProvider>
        </LocaleProvider>
      ))}
    </div>
  ),
}

/**
 * An **action** adds a button to the toast, which runs its `onClick` and dismisses the toast. Give a toast with
 * an action a long **duration**, or none, so the user has time to use it.
 */
export const WithAction: Story = {
  parameters: {
    docs: {
      source: {
        code: `function Example() {
  const toast = useToast()

  return (
    <Button
      onClick={() =>
        toast.toast({
          action: { label: 'Undo', onClick: () => toast.success('The file is back') },
          description: 'Annual report.pdf was moved to the trash.',
          duration: 10000,
          title: 'File deleted',
        })
      }
    >
      Delete the file
    </Button>
  )
}

<ToastProvider>
  <Example />
</ToastProvider>`,
      },
    },
  },
  render: () => (
    <Demo>
      <Fire
        label="Delete the file"
        make={(api) =>
          api.toast({
            action: { label: 'Undo', onClick: () => api.success('The file is back') },
            description: 'Annual report.pdf was moved to the trash.',
            duration: 10000,
            title: 'File deleted',
          })
        }
      />
    </Demo>
  ),
}

/**
 * Set **duration** to `0` for a toast that stays until the user dismisses it. Use it for what has to be read or
 * acted on, such as an error.
 */
export const Persistent: Story = {
  parameters: {
    docs: {
      source: {
        code: `function Example() {
  const toast = useToast()

  return (
    <Button
      onClick={() =>
        toast.error({
          description: 'The connection was lost. We will keep trying.',
          duration: 0,
          title: 'You are offline',
        })
      }
    >
      Show a persistent toast
    </Button>
  )
}

<ToastProvider>
  <Example />
</ToastProvider>`,
      },
    },
  },
  render: () => (
    <Demo>
      <Fire
        label="Show a persistent toast"
        make={(api) =>
          api.error({
            description: 'The connection was lost. We will keep trying.',
            duration: 0,
            title: 'You are offline',
          })
        }
      />
    </Demo>
  ),
}

/**
 * Calling with the same **id** updates the toast that is on the screen, and restarts its timer, instead of
 * stacking another one. It fits a task that goes from running to done.
 */
export const UpdatingAToast: Story = {
  parameters: {
    docs: {
      source: {
        code: `function Example() {
  const toast = useToast()

  return (
    <Button
      onClick={() => {
        toast.info({ duration: 0, id: 'upload', title: 'Uploading…' })
        window.setTimeout(() => toast.success({ id: 'upload', title: 'Upload complete' }), 1500)
      }}
    >
      Start the upload
    </Button>
  )
}

<ToastProvider>
  <Example />
</ToastProvider>`,
      },
    },
  },
  render: () => (
    <Demo>
      <Fire
        label="Start the upload"
        make={(api) => {
          api.info({ duration: 0, id: 'upload', title: 'Uploading…' })
          window.setTimeout(() => api.success({ id: 'upload', title: 'Upload complete' }), 1500)
        }}
      />
    </Demo>
  ),
}

/**
 * **dismiss(id)** removes a toast and **dismissAll()** removes every one. A toast can also be made not
 * dismissible with **dismissible: false**, which takes away its dismiss button.
 */
export const Dismissing: Story = {
  parameters: {
    docs: {
      source: {
        code: `function Example() {
  const toast = useToast()

  return (
    <div className="flex flex-wrap justify-center gap-2">
      <Button
        onClick={() => toast.info({ duration: 0, title: 'A toast that stays' })}
        variant="outline"
      >
        Add a toast
      </Button>
      <Button onClick={() => toast.dismissAll()} variant="ghost">Dismiss all</Button>
    </div>
  )
}

<ToastProvider>
  <Example />
</ToastProvider>`,
      },
    },
  },
  render: () => (
    <Demo>
      <div className="flex flex-wrap justify-center gap-2">
        <Fire
          label="Add a toast"
          make={(api) => api.info({ duration: 0, title: 'A toast that stays' })}
          variant="outline"
        />
        <Fire label="Dismiss all" make={(api) => api.dismissAll()} variant="ghost" />
      </div>
    </Demo>
  ),
}

/**
 * **max** limits how many toasts are on the screen at a time. The oldest one goes first.
 */
export const Limit: Story = {
  parameters: {
    docs: {
      source: {
        code: `function Example() {
  const toast = useToast()

  return (
    <Button
      onClick={() => toast.info({ title: \`Toast at \${new Date().toLocaleTimeString()}\` })}
    >
      Add a toast
    </Button>
  )
}

<ToastProvider duration={0} max={3}>
  <Example />
</ToastProvider>`,
      },
    },
  },
  render: () => (
    <Demo duration={0} max={3}>
      <Fire
        label="Add a toast"
        make={(api) => api.info({ title: `Toast at ${new Date().toLocaleTimeString()}` })}
      />
    </Demo>
  ),
}

/**
 * `render` writes every toast with the parts, so you can reorder them, leave one out or replace its content. A part
 * with nothing to show renders nothing, and the dismiss button and the action keep their behavior.
 */
export const Compound: Story = {
  parameters: {
    docs: {
      source: {
        code: `function Example() {
  const toast = useToast()

  return (
    <Button
      onClick={() =>
        toast.success({
          action: { label: 'Undo' },
          description: 'The action sits before the icon, and there is no dismiss button.',
          title: 'Saved',
        })
      }
      variant="outline"
    >
      Show a toast
    </Button>
  )
}

<ToastProvider
  render={(toast) => (
    <Toast toast={toast}>
      <ToastBody>
        <ToastTitle />
        <ToastDescription />
      </ToastBody>
      <ToastActionButton>Undo</ToastActionButton>
      <ToastIcon />
    </Toast>
  )}
>
  <Example />
</ToastProvider>`,
      },
    },
  },
  render: () => (
    <ToastProvider
      render={(toast: ToastData) => (
        <Toast toast={toast}>
          <ToastBody>
            <ToastTitle />
            <ToastDescription />
          </ToastBody>
          <ToastActionButton>Undo</ToastActionButton>
          <ToastIcon />
        </Toast>
      )}
    >
      <Fire
        label="Show a toast"
        make={(api) =>
          api.success({
            action: { label: 'Undo' },
            description: 'The action sits before the icon, and there is no dismiss button.',
            title: 'Saved',
          })
        }
        variant="outline"
      />
    </ToastProvider>
  ),
}

/**
 * Some examples of Toast with Tailwind classes. With `variant="unstyled"` the region is yours to place (`className`), and `render` writes every toast with the parts and the classes you want.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<ToastProvider
  className="fixed bottom-4 right-4 z-10 flex flex-col gap-2"
  render={(toast) => (
    <Toast
      className="flex w-80 max-w-full items-start gap-3 rounded-lg border border-border bg-surface p-4 text-sm text-foreground shadow-lg"
      toast={toast}
    >
      <ToastIcon className="mt-0.5 text-emerald-600" />
      <ToastBody className="flex-1">
        <ToastTitle className="block font-semibold" />
        <ToastDescription className="block text-[var(--plume-muted)]" />
        <ToastActionButton className="mt-2 rounded-sm border border-border px-2 py-1 text-xs font-semibold hover:bg-surface-muted" />
      </ToastBody>
      <ToastDismiss className="rounded-sm p-1 text-[var(--plume-muted)] hover:bg-surface-muted" />
    </Toast>
  )}

  variant="unstyled"
>
  <App />
</ToastProvider>`,
      },
    },
  },
  render: () => (
    <LocaleProvider messages={{ toast: { region: 'Tailwind notifications' } }}>
      <ToastProvider
        className="fixed bottom-4 right-4 z-10 flex flex-col gap-2"
        render={(toast) => (
          <Toast
            className="flex w-80 max-w-full items-start gap-3 rounded-lg border border-border bg-surface p-4 text-sm text-foreground shadow-lg"
            toast={toast}
          >
            <ToastIcon className="mt-0.5 text-emerald-600" />
            <ToastBody className="flex-1">
              <ToastTitle className="block font-semibold" />
              <ToastDescription className="block text-[var(--plume-muted)]" />
              <ToastActionButton className="mt-2 rounded-sm border border-border px-2 py-1 text-xs font-semibold hover:bg-surface-muted" />
            </ToastBody>
            <ToastDismiss className="rounded-sm p-1 text-[var(--plume-muted)] hover:bg-surface-muted" />
          </Toast>
        )}

        variant="unstyled"
      >
        <Fire
          label="Show a toast"
          make={(api) =>
            api.success({
              action: { label: 'Undo' },
              description: 'Your changes were saved.',
              title: 'Saved',
            })
          }
          variant="outline"
        />
      </ToastProvider>
    </LocaleProvider>
  ),
}

/**
 * Some examples of Toast with Bootstrap classes: `toast-container` on the region, `toast show` on every toast (`Toast`) and `toast-body` on its content (`ToastBody`).
 */
export const Bootstrap: Story = {
  parameters: {
    docs: {
      source: {
        code: `<ToastProvider
  className="toast-container position-fixed bottom-0 end-0 p-3"
  render={(toast) => (
    <Toast className="toast show d-flex align-items-start" toast={toast}>
      <ToastIcon className="ms-3 mt-3 text-success" />
      <ToastBody className="toast-body flex-grow-1">
        <ToastTitle className="d-block fw-semibold" />
        <ToastDescription className="d-block text-body-secondary" />
        <ToastActionButton className="btn btn-sm btn-primary mt-2" />
      </ToastBody>
      <ToastDismiss className="btn btn-sm btn-light border-0 m-2 align-self-start" />
    </Toast>
  )}

  variant="unstyled"
>
  <App />
</ToastProvider>`,
      },
    },
  },
  render: () => (
    <LocaleProvider messages={{ toast: { region: 'Bootstrap notifications' } }}>
      <ToastProvider
        className="toast-container position-fixed bottom-0 end-0 p-3"
        render={(toast) => (
          <Toast className="toast show d-flex align-items-start" toast={toast}>
            <ToastIcon className="ms-3 mt-3 text-success" />
            <ToastBody className="toast-body flex-grow-1">
              <ToastTitle className="d-block fw-semibold" />
              <ToastDescription className="d-block text-body-secondary" />
              <ToastActionButton className="btn btn-sm btn-primary mt-2" />
            </ToastBody>
            <ToastDismiss className="btn btn-sm btn-light border-0 m-2 align-self-start" />
          </Toast>
        )}

        variant="unstyled"
      >
        <Fire
          label="Show a toast"
          make={(api) =>
            api.success({
              action: { label: 'Undo' },
              description: 'Your changes were saved.',
              title: 'Saved',
            })
          }
          className="btn btn-secondary"
          variant="unstyled"
        />
      </ToastProvider>
    </LocaleProvider>
  ),
}
