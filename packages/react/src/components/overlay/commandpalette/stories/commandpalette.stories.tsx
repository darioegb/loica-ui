import type { StoryObj, Meta } from '@storybook/react-vite'
import { useEffect, useState, type ReactNode } from 'react'
import { LocaleProvider } from '../../../../locale'
import { Button } from '../../../interaction/button'
import { Icon } from '../../../presentation/icon'
import {
  CommandPalette,
  CommandPaletteGroup,
  CommandPaletteItem,
  type CommandPaletteProps,
} from '..'

const icon = (path: string): ReactNode => (
  <Icon>
    <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d={path} />
    </svg>
  </Icon>
)

/**
 * A dialog to search and run commands, the one that opens with <kbd>Ctrl</kbd> + <kbd>K</kbd>. It is a `Modal` with a
 * search box and a list: the user types, the items that match are left, the arrow keys move between them and
 * <kbd>Enter</kbd> picks one. Use it for the actions and the places of an app that are too many for a menu; for a
 * short list of options to choose from, use a `Select`.
 *
 * Write a `CommandPaletteItem` for each command, with its text as `children` and what it does in **onSelect**, alone or
 * inside a `CommandPaletteGroup` with a **heading**. The palette closes after an item is picked, and it opens and
 * closes with **open** and **onOpenChange** (or **defaultOpen**). The search ignores the case and the accents, needs
 * every word of the query, and also looks at the **keywords** of an item, so "go home" finds "Dashboard".
 *
 * The library doesn't listen to the shortcut that opens it: an app decides which keys it uses and where, and the
 * browser, the platform and the other shortcuts of the page change that, so the page binds it itself (see the
 * example, which is six lines). An item can show the keys of its own **shortcut**, but it only shows them.
 *
 * ### Results that you filter
 *
 * With **filter** set to `false` every item is shown, and with **query** and **onQueryChange** you get the text
 * as it is typed and render the items that match, such as the results of a request. A **filter** function replaces
 * how an item is matched.
 *
 * ### Keyboard
 *
 * The focus stays in the search box, and the active item is announced as the selected option of the list. <kbd>↓</kbd>
 * and <kbd>↑</kbd> move to the next and the previous one, wrapping at the ends, <kbd>PageDown</kbd> and
 * <kbd>PageUp</kbd> ten at a time, <kbd>Enter</kbd> picks the active item and <kbd>Esc</kbd> closes. A disabled item is
 * skipped. The count of results is announced as the user types.
 */
export default {
  title: 'Components/CommandPalette',
  component: CommandPalette,
  tags: ['autodocs'],
  parameters: {
    docs: {
      story: { inline: false, iframeHeight: 520 },
      importNames: ['CommandPalette', 'CommandPaletteGroup', 'CommandPaletteItem'],
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
    closeOnEscape: { control: 'boolean' },
    closeOnOutside: { control: 'boolean' },
    closeOnSelect: { control: 'boolean' },
    defaultOpen: { control: 'boolean' },
    filter: { control: false },
    onOpenChange: { control: false },
    onQueryChange: { control: false },
    open: { control: false },
    placeholder: { control: 'text' },
    query: { control: false },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    variant: { control: 'radio', options: ['default', 'unstyled'] },
  },
  render: (args) => <Example {...args} />,
} satisfies Meta<typeof CommandPalette>

type Story = StoryObj<typeof CommandPalette>

function Example(props: Readonly<CommandPaletteProps>): ReactNode {
  const [open, setOpen] = useState(false)
  const [last, setLast] = useState('Nothing yet')

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen((current) => !current)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  const run = (name: string) => () => setLast(name)

  return (
    <div className="flex flex-col items-center gap-3">
      <Button onClick={() => setOpen(true)}>Open the palette</Button>
      <p>Last command: {last}</p>
      <CommandPalette {...props} onOpenChange={setOpen} open={open}>
        <CommandPaletteGroup heading="Navigation">
          <CommandPaletteItem
            icon={icon('M3 11l9-8 9 8M5 10v10h14V10')}
            keywords={['home', 'start']}
            onSelect={run('Dashboard')}
            shortcut="G D"
          >
            Dashboard
          </CommandPaletteItem>
          <CommandPaletteItem
            icon={icon('M3 7h18v13H3zM8 7V4h8v3')}
            onSelect={run('Projects')}
            shortcut="G P"
          >
            Projects
          </CommandPaletteItem>
          <CommandPaletteItem icon={icon('M12 12a4 4 0 100-8 4 4 0 000 8zM4 21a8 8 0 0116 0')} onSelect={run('Team')}>
            Team
          </CommandPaletteItem>
        </CommandPaletteGroup>
        <CommandPaletteGroup heading="Actions">
          <CommandPaletteItem
            icon={icon('M12 5v14M5 12h14')}
            onSelect={run('New project')}
            shortcut="N"
          >
            New project
          </CommandPaletteItem>
          <CommandPaletteItem
            icon={icon('M12 3a9 9 0 109 9 7 7 0 01-9-9z')}
            keywords={['theme', 'dark', 'light']}
            onSelect={run('Switch the color mode')}
          >
            Switch the color mode
          </CommandPaletteItem>
          <CommandPaletteItem disabled icon={icon('M6 6l12 12M18 6L6 18')}>
            Delete everything
          </CommandPaletteItem>
        </CommandPaletteGroup>
      </CommandPalette>
    </div>
  )
}

/**
 * This is the default CommandPalette. The button opens it, and so does <kbd>Ctrl</kbd> + <kbd>K</kbd> (or
 * <kbd>⌘</kbd> + <kbd>K</kbd>), which this example binds with a `keydown` listener; <kbd>Esc</kbd> or a click outside
 * closes it.
 */
export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: `function Example() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen((current) => !current)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open the palette</Button>
      <CommandPalette onOpenChange={setOpen} open={open}>
        <CommandPaletteGroup heading="Navigation">
          <CommandPaletteItem keywords={['home']} onSelect={() => navigate('/')} shortcut="G D">Dashboard</CommandPaletteItem>
          <CommandPaletteItem onSelect={() => navigate('/projects')} shortcut="G P">Projects</CommandPaletteItem>
        </CommandPaletteGroup>
        <CommandPaletteGroup heading="Actions">
          <CommandPaletteItem onSelect={createProject} shortcut="N">New project</CommandPaletteItem>
          <CommandPaletteItem disabled>Delete everything</CommandPaletteItem>
        </CommandPaletteGroup>
      </CommandPalette>
    </>
  )
}`,
      },
    },
  },
}

function VariantsExample(): ReactNode {
  const [isOpen, setIsOpen] = useState<'default' | 'unstyled' | null>(null)
  return (
    <div className="flex gap-3">
      <Button onClick={() => setIsOpen('default')}>Default</Button>
      <Button onClick={() => setIsOpen('unstyled')} variant="outline">
        Unstyled
      </Button>
      {(['default', 'unstyled'] as const).map((variant) => (
        <CommandPalette
          aria-label={variant}
          key={variant}
          onOpenChange={(next) => setIsOpen(next ? variant : null)}
          open={isOpen === variant}
          variant={variant}
        >
          <CommandPaletteItem>Dashboard</CommandPaletteItem>
          <CommandPaletteItem>Projects</CommandPaletteItem>
        </CommandPalette>
      ))}
    </div>
  )
}

/**
 * Use **variant** to pick the look: `default` has the backdrop, the surface and the spacing, and `unstyled` drops the
 * Loica styles but keeps what makes it work (the list, the hidden items and the layout of an item), so it is a bare
 * dialog for you to style (see the Tailwind and Bootstrap examples).
 */
export const Variants: Story = {
  parameters: {
    docs: {
      source: {
        code: `<>
  <CommandPalette aria-label="Default" onOpenChange={setIsOpen} open={isOpen}>
    <CommandPaletteItem>Dashboard</CommandPaletteItem>
    <CommandPaletteItem>Projects</CommandPaletteItem>
  </CommandPalette>
  <CommandPalette aria-label="Unstyled" onOpenChange={setIsOpen} open={isOpen} variant="unstyled">
    <CommandPaletteItem>Dashboard</CommandPaletteItem>
    <CommandPaletteItem>Projects</CommandPaletteItem>
  </CommandPalette>
</>`,
      },
    },
  },
  render: () => <VariantsExample />,
}

/**
 * Use **size** to pick the width of the dialog, the same as a `Modal`: `sm`, `md` (the default) and `lg`.
 */
export const Sizes: Story = {
  args: { size: 'lg' },
  parameters: {
    docs: {
      source: {
        code: `<CommandPalette onOpenChange={setIsOpen} open={isOpen} size="lg">
  <CommandPaletteItem>Dashboard</CommandPaletteItem>
  <CommandPaletteItem>Projects</CommandPaletteItem>
</CommandPalette>`,
      },
    },
  },
}

function RemoteExample(): ReactNode {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const people = ['Ana Torres', 'Luis Pérez', 'Marta Gómez', 'Pedro Ruiz', 'Lucía Díaz']
  const results = query.trim()
    ? people.filter((person) => person.toLowerCase().includes(query.trim().toLowerCase()))
    : people.slice(0, 3)

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Find a person</Button>
      <CommandPalette
        filter={false}
        onOpenChange={setIsOpen}
        onQueryChange={setQuery}
        open={isOpen}
        placeholder="Search people"
        query={query}
      >
        <CommandPaletteGroup heading={query.trim() ? 'Results' : 'Recent'}>
          {results.map((person) => (
            <CommandPaletteItem key={person}>{person}</CommandPaletteItem>
          ))}
        </CommandPaletteGroup>
      </CommandPalette>
    </>
  )
}

/**
 * With **filter** set to `false` the palette doesn't hide anything, and **query** and **onQueryChange** give you the
 * text as it is typed, so you render the items that match: the results of a request, or a list that is "recent" until
 * the user types. A function in **filter** keeps the search of the palette but changes how an item is matched.
 */
export const YourOwnResults: Story = {
  parameters: {
    docs: {
      source: {
        code: `function Example() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const results = useSearch(query)

  return (
    <CommandPalette filter={false} onOpenChange={setIsOpen} onQueryChange={setQuery} open={isOpen} query={query}>
      <CommandPaletteGroup heading="Results">
        {results.map((person) => (
          <CommandPaletteItem key={person.id} onSelect={() => show(person)}>{person.name}</CommandPaletteItem>
        ))}
      </CommandPaletteGroup>
    </CommandPalette>
  )
}`,
      },
    },
  },
  render: () => <RemoteExample />,
}

function TextsExample(): ReactNode {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <LocaleProvider
      locale="es"
      messages={{
        commandPalette: {
          empty: 'Sin resultados',
          label: 'Paleta de comandos',
          placeholder: 'Escribe un comando o busca',
          results: (count) => (count === 1 ? '1 resultado' : `${count} resultados`),
        },
      }}
    >
      <Button onClick={() => setIsOpen(true)}>Abrir la paleta</Button>
      <CommandPalette onOpenChange={setIsOpen} open={isOpen}>
        <CommandPaletteItem keywords={['inicio']}>Panel</CommandPaletteItem>
        <CommandPaletteItem>Proyectos</CommandPaletteItem>
        <CommandPaletteItem>Equipo</CommandPaletteItem>
      </CommandPalette>
    </LocaleProvider>
  )
}

/**
 * Every text comes from the `commandPalette` key of the `LocaleProvider`: `label` (the name of the dialog),
 * `placeholder` (the hint of the search box), `empty` (when nothing matches) and `results(count)` (announced as the
 * user types). The **placeholder** and the `aria-label` of the palette change one of them for one palette.
 */
export const Texts: Story = {
  parameters: {
    docs: {
      source: {
        code: `<LocaleProvider
  locale="es"
  messages={{
    commandPalette: {
      empty: 'Sin resultados',
      label: 'Paleta de comandos',
      placeholder: 'Escribe un comando o busca',
      results: (count) => (count === 1 ? '1 resultado' : \`\${count} resultados\`),
    },
  }}
>
  <CommandPalette onOpenChange={setIsOpen} open={isOpen}>
    <CommandPaletteItem keywords={['inicio']}>Panel</CommandPaletteItem>
    <CommandPaletteItem>Proyectos</CommandPaletteItem>
  </CommandPalette>
</LocaleProvider>`,
      },
    },
  },
  render: () => <TextsExample />,
}

const tailwindPalette =
  'w-full max-w-md overflow-hidden rounded-xl border border-border bg-surface text-foreground shadow-xl [&_[data-loica-commandpalette-input]]:w-full [&_[data-loica-commandpalette-input]]:border-b [&_[data-loica-commandpalette-input]]:border-border [&_[data-loica-commandpalette-input]]:bg-transparent [&_[data-loica-commandpalette-input]]:px-4 [&_[data-loica-commandpalette-input]]:py-3 [&_[data-loica-commandpalette-input]]:outline-none [&_[data-loica-commandpalette-list]]:p-2'
const tailwindItem =
  'rounded-md px-3 py-2 data-[active]:bg-primary-solid data-[active]:text-white'
const bootstrapStyle =
  '.bs-palette [data-loica-commandpalette-input] { padding: .75rem 1rem; outline: 0; color: var(--bs-body-color); border-bottom: 1px solid var(--bs-border-color); } .bs-palette [data-active] { background-color: var(--bs-secondary-bg); }'

function StyledExample({ styled }: Readonly<{ styled: 'tailwind' | 'bootstrap' }>): ReactNode {
  const [isOpen, setIsOpen] = useState(false)
  const tailwind = styled === 'tailwind'
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open</Button>
      {tailwind ? null : <style>{bootstrapStyle}</style>}
      <CommandPalette
        aria-label="Commands"
        backdropClassName={
          tailwind ? 'items-start bg-black/50 p-4 pt-[15vh]' : 'align-items-start bg-dark bg-opacity-50 p-3 pt-5'
        }
        className={tailwind ? tailwindPalette : 'bs-palette card w-100 shadow'}
        onOpenChange={setIsOpen}
        open={isOpen}
        style={tailwind ? undefined : { maxWidth: '28rem' }}
        variant="unstyled"
      >
        <CommandPaletteGroup className={tailwind ? undefined : 'list-group list-group-flush'}>
          {['Dashboard', 'Projects', 'Team'].map((name) => (
            <CommandPaletteItem
              className={tailwind ? tailwindItem : 'list-group-item list-group-item-action'}
              key={name}
            >
              {name}
            </CommandPaletteItem>
          ))}
        </CommandPaletteGroup>
      </CommandPalette>
    </>
  )
}

/**
 * Some examples of CommandPalette with Tailwind classes. With `variant="unstyled"` the dialog, **backdropClassName**
 * (the layer behind it, which gives it a color and says where the dialog goes), each `CommandPaletteGroup` and each
 * `CommandPaletteItem` take your classes; the active item has `data-active`. The search box and the list have no part of
 * their own, so they are reached from the class of the dialog through their `data-loica-commandpalette-input` and
 * `data-loica-commandpalette-list` attributes.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<CommandPalette
  aria-label="Commands"
  backdropClassName="items-start bg-black/50 p-4 pt-[15vh]"
  className="w-full max-w-md overflow-hidden rounded-xl border border-border bg-surface text-foreground shadow-xl [&_[data-loica-commandpalette-input]]:w-full [&_[data-loica-commandpalette-input]]:border-b [&_[data-loica-commandpalette-input]]:border-border [&_[data-loica-commandpalette-input]]:bg-transparent [&_[data-loica-commandpalette-input]]:px-4 [&_[data-loica-commandpalette-input]]:py-3 [&_[data-loica-commandpalette-input]]:outline-none [&_[data-loica-commandpalette-list]]:p-2"
  onOpenChange={setIsOpen}
  open={isOpen}
  variant="unstyled"
>
  <CommandPaletteGroup>
    <CommandPaletteItem className="rounded-md px-3 py-2 data-[active]:bg-primary-solid data-[active]:text-white">Dashboard</CommandPaletteItem>
    <CommandPaletteItem className="rounded-md px-3 py-2 data-[active]:bg-primary-solid data-[active]:text-white">Projects</CommandPaletteItem>
  </CommandPaletteGroup>
</CommandPalette>`,
      },
    },
  },
  render: () => <StyledExample styled="tailwind" />,
}

/**
 * Some examples of CommandPalette with Bootstrap classes: `card` on the dialog, `bg-dark bg-opacity-50` on the layer
 * behind it, `list-group` on the group and `list-group-item list-group-item-action` on each item. The search box and the
 * active item are reached through their `data-*` attributes with a small rule under a class of the dialog.
 */
export const Bootstrap: Story = {
  parameters: {
    docs: {
      source: {
        code: `<>
  <style>{".bs-palette [data-loica-commandpalette-input] { padding: .75rem 1rem; outline: 0; color: var(--bs-body-color); border-bottom: 1px solid var(--bs-border-color); } .bs-palette [data-active] { background-color: var(--bs-secondary-bg); }"}</style>
  <CommandPalette
    aria-label="Commands"
    backdropClassName="align-items-start bg-dark bg-opacity-50 p-3 pt-5"
    className="bs-palette card w-100 shadow"
    onOpenChange={setIsOpen}
    open={isOpen}
    style={{ maxWidth: '28rem' }}
    variant="unstyled"
  >
    <CommandPaletteGroup className="list-group list-group-flush">
      <CommandPaletteItem className="list-group-item list-group-item-action">Dashboard</CommandPaletteItem>
      <CommandPaletteItem className="list-group-item list-group-item-action">Projects</CommandPaletteItem>
    </CommandPaletteGroup>
  </CommandPalette>
</>`,
      },
    },
  },
  render: () => <StyledExample styled="bootstrap" />,
}
