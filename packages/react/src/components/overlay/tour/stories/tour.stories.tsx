import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { LocaleProvider } from '../../../../locale/locale-provider'
import { defaultTheme } from '../../../../theme'
import { Button } from '../../../interaction/button'
import { Input } from '../../../form/input'
import { Avatar } from '../../../presentation/avatar'
import {
  Tour,
  TourContent,
  TourNext,
  TourPanel,
  TourPrevious,
  TourProgress,
  TourSkip,
  TourSpotlight,
  TourTitle,
  type TourProps,
  type TourStep,
} from '..'

const colorSchemes = Object.keys(defaultTheme.colors)

const steps: TourStep[] = [
  {
    content: 'Find any project by its name, or by the name of the person who owns it.',
    target: '#tour-search',
    title: 'Search',
  },
  {
    content: 'Start a project from scratch or from a template.',
    target: '#tour-new',
    title: 'Create a project',
  },
  {
    content: 'Your account, your notifications and the way the app looks.',
    placement: 'bottom-end',
    target: '#tour-profile',
    title: 'Your profile',
  },
]

interface DemoProps {
  children: (page: { open: boolean; setOpen: (open: boolean) => void }) => React.ReactNode
}

function Demo({ children }: Readonly<DemoProps>): React.ReactNode {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex w-full max-w-xl flex-col gap-4">
      <header className="flex items-center gap-3">
        <Input aria-label="Search" id="tour-search" placeholder="Search projects" />
        <Button className="shrink-0" id="tour-new">New project</Button>
        <Avatar id="tour-profile" name="Ada Lovelace" />
      </header>
      <p>Welcome back. You have three projects and nothing due this week.</p>
      <div>
        <Button onClick={() => setOpen(true)} variant="outline">
          Start tour
        </Button>
      </div>
      {children({ open, setOpen })}
    </div>
  )
}

function Example(props: Readonly<Partial<TourProps>>): React.ReactNode {
  return (
    <Demo>
      {({ open, setOpen }) => <Tour {...props} onOpenChange={setOpen} open={open} steps={steps} />}
    </Demo>
  )
}

/**
 * A guided tour: a list of steps, each pointing to an element of the page with a spotlight, and a panel with the
 * progress and the buttons to go back, go on and skip. Use it to introduce a new feature or to guide a first run.
 *
 * A step points to its **target**, a CSS selector, an element or a ref, and the panel opens next to it, flips to the
 * other side when there is no room and follows it when the page scrolls or resizes. The target scrolls into view. A step
 * with no target, or whose selector matches nothing, shows centered with the page dimmed, which is right for a welcome.
 *
 * While the tour is open the rest of the page is blocked, as in a modal: the focus stays in the panel, the page
 * does not scroll and a click outside does nothing. A step that sets **interactive** lets the user use its target
 * instead. <kbd>Esc</kbd> closes the tour, and the focus goes back to where it was.
 *
 * `open` and `step` work controlled or not. The tour does not remember that a user saw it: use **onClose**, which
 * gets `finish`, `skip` or `escape`, to save it where the app keeps what the user did.
 */
export default {
  title: 'Components/Tour',
  component: Tour,
  tags: ['autodocs'],
  parameters: {
    docs: {
      story: { inline: false, iframeHeight: 420 },
      importNames: [
        'Tour',
        'TourSpotlight',
        'TourPanel',
        'TourTitle',
        'TourContent',
        'TourProgress',
        'TourSkip',
        'TourPrevious',
        'TourNext',
      ],
      toc: {
        title: 'On this page',
        disable: false,
      },
    },
    layout: 'padded',
  },
  argTypes: {
    children: { control: false },
    className: { control: 'text' },
    colorScheme: { control: 'select', options: colorSchemes },
    defaultOpen: { control: false },
    defaultStep: { control: false },
    onClose: { control: false },
    onOpenChange: { control: false },
    onStepChange: { control: false },
    open: { control: false },
    placement: {
      control: 'select',
      options: [
        'top',
        'top-start',
        'top-end',
        'bottom',
        'bottom-start',
        'bottom-end',
        'left',
        'left-start',
        'left-end',
        'right',
        'right-start',
        'right-end',
      ],
    },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    spotlightPadding: { control: 'number' },
    step: { control: false },
    steps: { control: false },
    variant: { control: 'radio', options: ['elevated', 'outline', 'unstyled'] },
  },
  render: (args) => <Example {...args} />,
} satisfies Meta<typeof Tour>

type Story = StoryObj<typeof Tour>

/**
 * This is the default Tour. Press the button to start it: each step points to an element, and the buttons or the
 * keyboard go through them.
 */
export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: `function Example() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <header className="flex items-center gap-3">
        <Input aria-label="Search" id="tour-search" placeholder="Search projects" />
        <Button className="shrink-0" id="tour-new">New project</Button>
        <Avatar id="tour-profile" name="Ada Lovelace" />
      </header>
      <Button onClick={() => setOpen(true)} variant="outline">Start tour</Button>
      <Tour
        onOpenChange={setOpen}
        open={open}
        steps={[
          {
            content: 'Find any project by its name, or by the name of the person who owns it.',
            target: '#tour-search',
            title: 'Search',
          },
          {
            content: 'Start a project from scratch or from a template.',
            target: '#tour-new',
            title: 'Create a project',
          },
          {
            content: 'Your account, your notifications and the way the app looks.',
            placement: 'bottom-end',
            target: '#tour-profile',
            title: 'Your profile',
          },
        ]}
      />
    </>
  )
}`,
      },
    },
  },
}

/**
 * Use the **variant** prop to pick how the panel looks: `elevated` floats it with a shadow, `outline` draws its border,
 * and `unstyled` drops the Loica styles so you can style every part yourself.
 */
export const Variants: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Tour steps={steps} variant="elevated" />
<Tour steps={steps} variant="outline" />
<Tour steps={steps} variant="unstyled" />`,
      },
    },
  },
  render: () => <VariantsExample />,
}

function VariantsExample(): React.ReactNode {
  const [variant, setVariant] = useState<'elevated' | 'outline' | 'unstyled' | null>(null)

  return (
    <div className="flex w-full max-w-xl flex-col gap-4">
      <Input aria-label="Search" id="tour-search" placeholder="Search projects" />
      <Button className="shrink-0" id="tour-new">New project</Button>
      <Avatar id="tour-profile" name="Ada Lovelace" />
      <div className="flex flex-wrap gap-2">
        {(['elevated', 'outline', 'unstyled'] as const).map((name) => (
          <Button key={name} onClick={() => setVariant(name)} variant="outline">
            {name}
          </Button>
        ))}
      </div>
      <Tour
        onOpenChange={(open) => !open && setVariant(null)}
        open={variant !== null}
        steps={steps}
        variant={variant ?? 'elevated'}
      />
    </div>
  )
}

/**
 * Use the **size** prop to set the maximum width of the panel.
 */
export const Sizes: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Tour size="sm" steps={steps} />
<Tour size="md" steps={steps} />
<Tour size="lg" steps={steps} />`,
      },
    },
  },
  render: () => <SizesExample />,
}

function SizesExample(): React.ReactNode {
  const [size, setSize] = useState<'sm' | 'md' | 'lg' | null>(null)

  return (
    <div className="flex w-full max-w-xl flex-col gap-4">
      <Input aria-label="Search" id="tour-search" placeholder="Search projects" />
      <Button className="shrink-0" id="tour-new">New project</Button>
      <Avatar id="tour-profile" name="Ada Lovelace" />
      <div className="flex flex-wrap gap-2">
        {(['sm', 'md', 'lg'] as const).map((name) => (
          <Button key={name} onClick={() => setSize(name)} variant="outline">
            {name}
          </Button>
        ))}
      </div>
      <Tour
        onOpenChange={(open) => !open && setSize(null)}
        open={size !== null}
        size={size ?? 'md'}
        steps={steps}
      />
    </div>
  )
}

/**
 * Use the **colorScheme** prop to color the ring around the target and the button that goes on. It takes any scheme of
 * the theme palette, custom ones included.
 */
export const Colors: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Tour colorScheme="primary" steps={steps} />
<Tour colorScheme="success" steps={steps} />
<Tour colorScheme="error" steps={steps} />`,
      },
    },
  },
  render: () => <ColorsExample />,
}

function ColorsExample(): React.ReactNode {
  const [scheme, setScheme] = useState<string | null>(null)

  return (
    <div className="flex w-full max-w-xl flex-col gap-4">
      <Input aria-label="Search" id="tour-search" placeholder="Search projects" />
      <Button className="shrink-0" id="tour-new">New project</Button>
      <Avatar id="tour-profile" name="Ada Lovelace" />
      <div className="flex flex-wrap gap-2">
        {colorSchemes.map((name) => (
          <Button key={name} onClick={() => setScheme(name)} variant="outline">
            {name}
          </Button>
        ))}
      </div>
      <Tour
        colorScheme={(scheme ?? 'primary') as TourProps['colorScheme']}
        onOpenChange={(open) => !open && setScheme(null)}
        open={scheme !== null}
        steps={steps}
      />
    </div>
  )
}

/**
 * A step with no **target** shows centered, with the page dimmed: use it for a welcome or a goodbye. A step whose
 * selector matches nothing in the page does the same.
 */
export const WithoutTarget: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Tour
  steps={[
    {
      content: 'Let us show you around. It takes a minute.',
      title: 'Welcome to Loica',
    },
    {
      content: 'Search finds a project by its name.',
      target: '#tour-search',
      title: 'Search',
    },
  ]}
/>`,
      },
    },
  },
  render: () => (
    <Demo>
      {({ open, setOpen }) => (
        <Tour
          onOpenChange={setOpen}
          open={open}
          steps={[
            {
              content: 'Let us show you around. It takes a minute.',
              title: 'Welcome to Loica',
            },
            steps[0],
          ]}
        />
      )}
    </Demo>
  ),
}

/**
 * A step with **interactive** lets the user use its target: press it, type in it and tab to it, while the rest of the
 * page stays blocked. The tour goes on with its own buttons, so the app decides what the user has to do.
 */
export const Interactive: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Tour
  steps={[
    {
      content: 'Type a name and press Tab, then go on.',
      interactive: true,
      target: '#tour-search',
      title: 'Try the search',
    },
  ]}
/>`,
      },
    },
  },
  render: () => (
    <Demo>
      {({ open, setOpen }) => (
        <Tour
          onOpenChange={setOpen}
          open={open}
          steps={[
            {
              content: 'Type a name and press Tab, then go on.',
              interactive: true,
              target: '#tour-search',
              title: 'Try the search',
            },
            steps[1],
          ]}
        />
      )}
    </Demo>
  ),
}

/**
 * Pass **open** and **step** to control the tour from the app, and use **onClose** to know how it ended. Here the
 * count of the page follows the step, and the tour closes with the reason that the user gave.
 */
export const Controlled: Story = {
  parameters: {
    docs: {
      source: {
        code: `function Example() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0)
  const [reason, setReason] = useState<string | null>(null)

  return (
    <>
      <Button onClick={() => { setStep(0); setOpen(true) }}>Start tour</Button>
      <p>Step {step + 1}{reason ? \`, ended with \${reason}\` : ''}</p>
      <Tour
        onClose={setReason}
        onOpenChange={setOpen}
        onStepChange={setStep}
        open={open}
        step={step}
        steps={steps}
      />
    </>
  )
}`,
      },
    },
  },
  render: () => <ControlledExample />,
}

function ControlledExample(): React.ReactNode {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0)
  const [reason, setReason] = useState<string | null>(null)

  return (
    <div className="flex w-full max-w-xl flex-col gap-4">
      <header className="flex items-center gap-3">
        <Input aria-label="Search" id="tour-search" placeholder="Search projects" />
        <Button className="shrink-0" id="tour-new">New project</Button>
        <Avatar id="tour-profile" name="Ada Lovelace" />
      </header>
      <div className="flex items-center gap-3">
        <Button
          onClick={() => {
            setStep(0)
            setReason(null)
            setOpen(true)
          }}
          variant="outline"
        >
          Start tour
        </Button>
        <Button onClick={() => setStep(2)} variant="outline">
          Go to the last step
        </Button>
      </div>
      <p>
        Step {step + 1} of {steps.length}
        {reason ? `, ended with ${reason}` : ''}
      </p>
      <Tour
        onClose={setReason}
        onOpenChange={setOpen}
        onStepChange={setStep}
        open={open}
        step={step}
        steps={steps}
      />
    </div>
  )
}

/**
 * Every text comes from the `LocaleProvider`: the buttons and the progress, which gets the number of the step and the
 * total. The texts of the steps are yours.
 */
export const Translated: Story = {
  parameters: {
    docs: {
      source: {
        code: `<LocaleProvider
  locale="es"
  messages={{
    tour: {
      done: 'Listo',
      next: 'Siguiente',
      previous: 'Anterior',
      progress: (current, total) => \`Paso \${current} de \${total}\`,
      skip: 'Omitir',
    },
  }}
>
  <Tour open steps={steps} />
</LocaleProvider>`,
      },
    },
  },
  render: () => (
    <LocaleProvider
      locale="es"
      messages={{
        tour: {
          done: 'Listo',
          next: 'Siguiente',
          previous: 'Anterior',
          progress: (current, total) => `Paso ${current} de ${total}`,
          skip: 'Omitir',
        },
      }}
    >
      <Example />
    </LocaleProvider>
  ),
}

/**
 * Inside `dir="rtl"` the panel and its buttons follow the direction of the text, and the spotlight stays on its target.
 */
export const RightToLeft: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div dir="rtl">
  <Tour open steps={steps} />
</div>`,
      },
    },
  },
  decorators: [
    (Story) => (
      <div dir="rtl">
        <Story />
      </div>
    ),
  ],
}

/**
 * The Tour is its parts: the root keeps the steps and the state, and renders by default a `TourSpotlight` and a
 * `TourPanel` with a `TourTitle`, a `TourContent`, a `TourProgress` and the three buttons. Put your own composition in
 * its children to move them, drop one or add your own markup. The parts take `className`, `style` and `ref`, and read the
 * step that shows from the root.
 */
export const Compound: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Tour onOpenChange={setIsOpen} open={isOpen} steps={steps}>
  <TourSpotlight />
  <TourPanel className="flex flex-col gap-3">
    <div className="flex items-center justify-between">
      <TourTitle />
      <TourProgress />
    </div>
    <TourContent />
    <div className="flex justify-end gap-2">
      <TourSkip />
      <TourPrevious />
      <TourNext />
    </div>
  </TourPanel>
</Tour>`,
      },
    },
  },
  render: () => (
    <Demo>
      {({ open, setOpen }) => (
        <Tour onOpenChange={setOpen} open={open} steps={steps}>
          <TourSpotlight />
          <TourPanel className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-4">
              <TourTitle />
              <TourProgress />
            </div>
            <TourContent />
            <div className="flex justify-end gap-2">
              <TourSkip />
              <TourPrevious />
              <TourNext />
            </div>
          </TourPanel>
        </Tour>
      )}
    </Demo>
  ),
}

/**
 * Some examples of Tour with Tailwind classes. With `variant="unstyled"` the parts are the only thing with classes: the
 * ones you give them. The ring of the spotlight dims the page with a shadow that is as wide as the screen.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Tour onOpenChange={setIsOpen} open={isOpen} steps={steps} variant="unstyled">
  <TourSpotlight className="rounded-lg shadow-[0_0_0_2px_#1d4ed8,0_0_0_100vmax_rgb(0_0_0/0.6)]" />
  <TourPanel className="w-72 rounded-lg border border-border bg-surface p-4 text-sm text-foreground shadow-lg">
    <TourTitle className="font-semibold" />
    <TourContent className="mt-1 text-[var(--loica-muted)]" />
    <div className="mt-4 flex items-center justify-between">
      <TourProgress className="text-xs text-[var(--loica-muted)]" />
      <div className="flex gap-2">
        <TourSkip className="px-2 py-1.5 text-sm text-[var(--loica-muted)] hover:underline" />
        <TourPrevious className="rounded-sm border border-border px-3 py-1.5 text-sm" />
        <TourNext className="rounded-sm bg-blue-700 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-800" />
      </div>
    </div>
  </TourPanel>
</Tour>`,
      },
    },
  },
  render: () => (
    <Demo>
      {({ open, setOpen }) => (
        <Tour onOpenChange={setOpen} open={open} steps={steps} variant="unstyled">
          <TourSpotlight className="rounded-lg shadow-[0_0_0_2px_#1d4ed8,0_0_0_100vmax_rgb(0_0_0/0.6)]" />
          <TourPanel className="w-72 rounded-lg border border-border bg-surface p-4 text-sm text-foreground shadow-lg">
            <TourTitle className="font-semibold" />
            <TourContent className="mt-1 text-[var(--loica-muted)]" />
            <div className="mt-4 flex items-center justify-between">
              <TourProgress className="text-xs text-[var(--loica-muted)]" />
              <div className="flex gap-2">
                <TourSkip className="px-2 py-1.5 text-sm text-[var(--loica-muted)] hover:underline" />
                <TourPrevious className="rounded-sm border border-border px-3 py-1.5 text-sm" />
                <TourNext className="rounded-sm bg-blue-700 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-800" />
              </div>
            </div>
          </TourPanel>
        </Tour>
      )}
    </Demo>
  ),
}

/**
 * Some examples of Tour with Bootstrap classes: the `popover` classes on the panel and its title and content, and the
 * `btn` classes on the buttons. Bootstrap positions its popovers with JavaScript, here the Tour does it.
 */
export const Bootstrap: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Tour onOpenChange={setIsOpen} open={isOpen} steps={steps} variant="unstyled">
  <TourSpotlight
    className="rounded"
    style={{ boxShadow: '0 0 0 100vmax rgb(0 0 0 / 0.5)' }}
  />
  <TourPanel className="popover">
    <TourTitle className="popover-header" />
    <TourContent className="popover-body" />
    <div className="popover-body d-flex align-items-center justify-content-between pt-0">
      <TourProgress className="small" />
      <div className="d-flex gap-2">
        <TourSkip className="btn btn-sm btn-secondary" />
        <TourPrevious className="btn btn-sm btn-secondary" />
        <TourNext className="btn btn-sm btn-primary" />
      </div>
    </div>
  </TourPanel>
</Tour>`,
      },
    },
  },
  render: () => (
    <Demo>
      {({ open, setOpen }) => (
        <Tour onOpenChange={setOpen} open={open} steps={steps} variant="unstyled">
          <TourSpotlight className="rounded" style={{ boxShadow: '0 0 0 100vmax rgb(0 0 0 / 0.5)' }} />
          <TourPanel className="popover">
            <TourTitle className="popover-header" />
            <TourContent className="popover-body" />
            <div className="popover-body d-flex align-items-center justify-content-between pt-0">
              <TourProgress className="small" />
              <div className="d-flex gap-2">
                <TourSkip className="btn btn-sm btn-secondary" />
                <TourPrevious className="btn btn-sm btn-secondary" />
                <TourNext className="btn btn-sm btn-primary" />
              </div>
            </div>
          </TourPanel>
        </Tour>
      )}
    </Demo>
  ),
}
