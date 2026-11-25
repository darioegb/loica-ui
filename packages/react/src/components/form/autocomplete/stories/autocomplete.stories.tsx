import type { StoryObj, Meta } from '@storybook/react-vite'
import { useEffect, useState } from 'react'
import { useDebounce } from '../../../../hooks'
import { defaultTheme, type ColorScheme } from '../../../../theme'
import { Button } from '../../../interaction/button'
import { Field } from '../../field'
import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteList,
  AutocompleteLoading,
  AutocompleteOption,
  type AutocompleteProps,
} from '..'

const colorSchemes = Object.keys(defaultTheme.colors)

const cities = [
  'Barcelona',
  'Bilbao',
  'Madrid',
  'Málaga',
  'Sevilla',
  'Valencia',
  'Valladolid',
  'Zaragoza',
].map((label) => ({ label }))

const countries = [
  { description: 'Europe', label: 'Spain', value: 'ES' },
  { description: 'Europe', label: 'Portugal', value: 'PT' },
  { description: 'South America', label: 'Argentina', value: 'AR' },
  { description: 'South America', label: 'Chile', value: 'CL' },
  { description: 'North America', label: 'Mexico', value: 'MX' },
]

const SearchIcon = (): React.ReactNode => (
  <svg aria-hidden="true" fill="none" height="16" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="16">
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
)

function Example({
  label = 'City',
  placeholder = 'Type a city',
  ...props
}: Readonly<Partial<AutocompleteProps> & { label?: string }>): React.ReactNode {
  return <Autocomplete aria-label={label} options={cities} placeholder={placeholder} {...props} />
}

/**
 * A text field that suggests options as the user types, and accepts a text that is not in the list, such as a city, a tag or an email address. Use it when the value is the text the user writes and the options only help, and a `Select` when the value has to be one of the options.
 *
 * Pass the suggestions as data with **options** for an Autocomplete that closes on itself, or compose its parts (an `AutocompleteInput` and an `AutocompleteContent` with an `AutocompleteOption` for each one) to change what it shows. Its value is the text: **value**, **defaultValue** and **onValueChange**. Choosing an option puts its text in the field and gives the option to **onOptionSelect**.
 *
 * It is the WAI-ARIA editable combobox with a list: the focus stays on the field and the list is followed with `aria-activedescendant`. Typing opens the list and filters it, ignoring case and accents. <kbd>↓</kbd> and <kbd>↑</kbd> open it and move through the options (a disabled one is skipped), <kbd>PageUp</kbd> and <kbd>PageDown</kbd> jump ten, <kbd>Enter</kbd> chooses the active option, and when none is active it keeps the text, <kbd>Esc</kbd> and <kbd>Tab</kbd> close it. No option is active while the user types, so a text that is not in the list is never replaced by a suggestion.
 *
 * The list shows while there is something in it: an option that matches the text, the `AutocompleteLoading` of a search in progress, or an `AutocompleteEmpty` you write. It reuses the parts of the `Select`, so they carry its `data-loica-select-*` attributes, and with `variant="unstyled"` they have no Loica class.
 */
export default {
  title: 'Components/Autocomplete',
  component: Autocomplete,
  tags: ['autodocs'],
  parameters: {
    docs: {
      story: { inline: false, iframeHeight: 380 },
      importNames: [
        'Autocomplete',
        'AutocompleteInput',
        'AutocompleteContent',
        'AutocompleteList',
        'AutocompleteOption',
        'AutocompleteLoading',
        'AutocompleteEmpty',
      ],
      toc: {
        title: 'On this page',
        disable: false,
      },
    },
    layout: 'centered',
  },
  argTypes: {
    children: { control: false },
    options: { control: false },
    value: { control: false },
    defaultValue: { control: 'text' },
    onValueChange: { control: false },
    onOptionSelect: { control: false },
    onSearchChange: { control: false },
    filter: { control: 'boolean' },
    loading: { control: 'boolean' },
    variant: {
      control: 'radio',
      options: ['outline', 'filled', 'underline', 'unstyled'],
    },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    shape: { control: 'radio', options: ['rounded', 'pill'] },
    colorScheme: { control: 'select', options: colorSchemes },
    placement: {
      control: 'select',
      options: ['bottom-start', 'bottom', 'bottom-end', 'top-start', 'top', 'top-end'],
    },
    offset: { control: 'number' },
    flip: { control: 'boolean' },
    shift: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    required: { control: 'boolean' },
    id: { control: false },
    'aria-describedby': { control: false },
    'aria-invalid': { control: 'boolean' },
    open: { control: 'boolean' },
    defaultOpen: { control: 'boolean' },
    onOpenChange: { control: false },
  },
  render: (args) => <Example {...args} />,
} satisfies Meta<typeof Autocomplete>

type Story = StoryObj<typeof Autocomplete>

/**
 * This is the default Autocomplete. Type to see the suggestions, or press <kbd>↓</kbd>. A text that is not in the list stays in the field.
 */
export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Autocomplete
  aria-label="City"
  options={[{ label: 'Barcelona' }, { label: 'Madrid' }, { label: 'Valencia' }]}
  placeholder="Type a city"
/>`,
      },
    },
  },
}

/**
 * Use the **variant** prop to pick how the field looks: `outline`, `filled` or `underline`, as in the `Input`.
 * `unstyled` drops the Loica styles so you can style it yourself.
 */
export const Variants: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-col gap-4">
  <Autocomplete aria-label="Outline" options={cities} placeholder="Outline" variant="outline" />
  <Autocomplete aria-label="Filled" options={cities} placeholder="Filled" variant="filled" />
  <Autocomplete aria-label="Underline" options={cities} placeholder="Underline" variant="underline" />
  <Autocomplete aria-label="Unstyled" options={cities} placeholder="Unstyled" variant="unstyled" />
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <Example label="Outline" placeholder="Outline" variant="outline" />
      <Example label="Filled" placeholder="Filled" variant="filled" />
      <Example label="Underline" placeholder="Underline" variant="underline" />
      <Example label="Unstyled" placeholder="Unstyled" variant="unstyled" />
    </div>
  ),
}

/**
 * Use the **size** prop to change the height and the text of the field.
 */
export const Sizes: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-col gap-4">
  <Autocomplete aria-label="Small" options={cities} placeholder="Small" size="sm" />
  <Autocomplete aria-label="Medium" options={cities} placeholder="Medium" size="md" />
  <Autocomplete aria-label="Large" options={cities} placeholder="Large" size="lg" />
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <Example label="Small" placeholder="Small" size="sm" />
      <Example label="Medium" placeholder="Medium" size="md" />
      <Example label="Large" placeholder="Large" size="lg" />
    </div>
  ),
}

/**
 * Use the **colorScheme** prop to change the color of the focus ring, with any color of the theme. The other variants use it the same way.
 */
export const Colors: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-col gap-4">
  <Autocomplete aria-label="primary" colorScheme="primary" options={cities} placeholder="primary" />
  <Autocomplete aria-label="success" colorScheme="success" options={cities} placeholder="success" />
  <Autocomplete aria-label="error" colorScheme="error" options={cities} placeholder="error" />
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      {colorSchemes.map((colorScheme) => (
        <Example
          colorScheme={colorScheme as ColorScheme}
          key={colorScheme}
          label={colorScheme}
          placeholder={colorScheme}
        />
      ))}
    </div>
  ),
}

/**
 * An option takes a `label`, a `value` and optionally a `description`, an `icon` and `disabled`. The field takes the label of the option that is chosen, and **onOptionSelect** gets the option, with its `value`, so the app can keep a code next to the text. Put an icon in the field with **elementBefore**, as in the `Input`.
 */
export const WithOptionData: Story = {
  parameters: {
    docs: {
      story: { inline: false, iframeHeight: 420 },
      source: {
        code: `function Example() {
  const [code, setCode] = useState('none')

  return (
    <div className="flex flex-col gap-3">
      <Autocomplete
        aria-label="Country"
        elementBefore={<SearchIcon />}
        onOptionSelect={(option) => setCode(option.value)}
        options={[
          { description: 'Europe', label: 'Spain', value: 'ES' },
          { description: 'Europe', label: 'Portugal', value: 'PT' },
          { description: 'South America', label: 'Argentina', value: 'AR' },
        ]}
        placeholder="Search a country"
      />
      <small>Code chosen: {code}</small>
    </div>
  )
}`,
      },
    },
  },
  render: () => <OptionDataExample />,
}

function OptionDataExample(): React.ReactNode {
  const [code, setCode] = useState('none')

  return (
    <div className="flex flex-col gap-3">
      <Autocomplete
        aria-label="Country"
        elementBefore={<SearchIcon />}
        onOptionSelect={(option) => setCode(option.value)}
        options={countries}
        placeholder="Search a country"
      />
      <small>Code chosen: {code}</small>
    </div>
  )
}

const directory = [
  'Ada Lovelace',
  'Alan Turing',
  'Grace Hopper',
  'Linus Torvalds',
  'Margaret Hamilton',
  'Tim Berners-Lee',
]

function RemoteExample(): React.ReactNode {
  const [text, setText] = useState('')
  const [results, setResults] = useState<{ label: string }[]>([])
  const [loading, setLoading] = useState(false)
  const search = useDebounce({ value: text, delay: 300 })

  useEffect(() => {
    if (!search) {
      setResults([])
      setLoading(false)
      return undefined
    }
    setLoading(true)
    const timer = setTimeout(() => {
      setResults(
        directory
          .filter((name) => name.toLowerCase().includes(search.toLowerCase()))
          .map((label) => ({ label })),
      )
      setLoading(false)
    }, 600)
    return () => clearTimeout(timer)
  }, [search])

  return (
    <Autocomplete aria-label="Person" filter={false} loading={loading} onSearchChange={setText}>
      <AutocompleteInput placeholder="Search a person" />
      <AutocompleteContent>
        <AutocompleteLoading />
        <AutocompleteList>
          {results.map(({ label }) => (
            <AutocompleteOption key={label} label={label} />
          ))}
        </AutocompleteList>
        <AutocompleteEmpty />
      </AutocompleteContent>
    </Autocomplete>
  )
}

/**
 * Search on a server: turn off **filter**, so the list shows the options you pass, and use **onSearchChange**, which is called with the text each time the user types, and **not** when they choose an option, so choosing one does not start another search. Pass **loading** while the results arrive: the list shows a `Loader` and marks itself busy, and the options you already have stay. Wait for the user to stop typing with `useDebounce`. An `AutocompleteEmpty` says "no results", which the list otherwise leaves out, because a text that is not in the list is a valid value.
 */
export const Remote: Story = {
  parameters: {
    docs: {
      story: { inline: false, iframeHeight: 420 },
      source: {
        code: `function Example() {
  const [text, setText] = useState('')
  const [results, setResults] = useState<{ label: string }[]>([])
  const [loading, setLoading] = useState(false)
  const search = useDebounce({ value: text, delay: 300 })

  useEffect(() => {
    if (!search) {
      setResults([])
      setLoading(false)
      return undefined
    }
    let current = true
    setLoading(true)
    fetchPeople(search).then((found) => {
      if (!current) return
      setResults(found)
      setLoading(false)
    })
    return () => {
      current = false
    }
  }, [search])

  return (
    <Autocomplete
      aria-label="Person"
      filter={false}
      loading={loading}
      onSearchChange={setText}
    >
      <AutocompleteInput placeholder="Search a person" />
      <AutocompleteContent>
        <AutocompleteLoading />
        <AutocompleteList>
          {results.map((person) => (
            <AutocompleteOption key={person.label} label={person.label} />
          ))}
        </AutocompleteList>
        <AutocompleteEmpty />
      </AutocompleteContent>
    </Autocomplete>
  )
}`,
      },
    },
  },
  render: () => <RemoteExample />,
}

function ControlledExample(): React.ReactNode {
  const [value, setValue] = useState('Mad')

  return (
    <div className="flex flex-col gap-3">
      <Autocomplete aria-label="City" onValueChange={setValue} options={cities} placeholder="Type a city" value={value} />
      <small>Text: {value || '(empty)'}</small>
      <Button onClick={() => setValue('')} size="sm" variant="outline">
        Clear
      </Button>
    </div>
  )
}

/**
 * Control the text with **value** and **onValueChange**, which is called when the user types and when they choose an option. The list is controlled with **open** and **onOpenChange**.
 */
export const Controlled: Story = {
  parameters: {
    docs: {
      source: {
        code: `function Example() {
  const [value, setValue] = useState('Mad')

  return (
    <div className="flex flex-col gap-3">
      <Autocomplete aria-label="City" onValueChange={setValue} options={cities} value={value} />
      <small>Text: {value || '(empty)'}</small>
      <Button onClick={() => setValue('')} size="sm" variant="outline">
        Clear
      </Button>
    </div>
  )
}`,
      },
    },
  },
  render: () => <ControlledExample />,
}

/**
 * The field can be **disabled**, **readOnly**, **required** or invalid (**aria-invalid**), as an `Input` can. A read-only field shows its text and takes the focus, but does not open the list.
 */
export const States: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-col gap-4">
  <Autocomplete aria-label="Disabled" defaultValue="Madrid" disabled options={cities} />
  <Autocomplete aria-label="Read only" defaultValue="Madrid" options={cities} readOnly />
  <Autocomplete aria-invalid aria-label="Invalid" defaultValue="Madrid" options={cities} />
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <Example defaultValue="Madrid" disabled label="Disabled" />
      <Example defaultValue="Madrid" label="Read only" readOnly />
      <Example aria-invalid defaultValue="Madrid" label="Invalid" />
    </div>
  ),
}

function FormExample(): React.ReactNode {
  const [data, setData] = useState('Submit the form to see what it sends.')

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(event) => {
        event.preventDefault()
        setData(JSON.stringify({ city: new FormData(event.currentTarget).get('city') }))
      }}
    >
      <Autocomplete aria-label="City" defaultValue="Madrid" name="city" options={cities} />
      <Button type="submit">Submit</Button>
      <small>{data}</small>
    </form>
  )
}

/**
 * It is a native `<input>` with a `name`, so a form sends its text, and a `reset` puts back its **defaultValue**.
 */
export const InAForm: Story = {
  parameters: {
    docs: {
      source: {
        code: `function Example() {
  const [data, setData] = useState('Submit the form to see what it sends.')

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(event) => {
        event.preventDefault()
        setData(JSON.stringify({ city: new FormData(event.currentTarget).get('city') }))
      }}
    >
      <Autocomplete aria-label="City" defaultValue="Madrid" name="city" options={cities} />
      <Button type="submit">Submit</Button>
      <small>{data}</small>
    </form>
  )
}`,
      },
    },
  },
  render: () => <FormExample />,
}

function RequiredExample(): React.ReactNode {
  const [home, setHome] = useState('')

  return (
    <Field errorText="Tell us where you live" invalid={home.trim() === ''} label="Home" required>
      <Autocomplete onValueChange={setHome} options={cities} placeholder="Type a city" value={home} />
    </Field>
  )
}

/**
 * Wrap it in a `Field` to give it a label, a helper text and an error message. The Field names the autocomplete and its list, links its helper text and sets `disabled`, `readOnly`, `required` and `aria-invalid`. It does not validate: it shows the error text while **invalid** is on, so tie it to your state and it clears when the user types or chooses something. Do not also set `aria-invalid` on the autocomplete: a control that is invalid on its own stays invalid whatever the Field says.
 */
export const WithField: Story = {
  parameters: {
    docs: {
      story: { inline: false, iframeHeight: 420 },
      source: {
        code: `function Example() {
  const [home, setHome] = useState('')

  return (
    <div className="flex w-72 max-w-full flex-col gap-4">
      <Field helperText="Type it, or pick one of the suggestions." label="City">
        <Autocomplete options={cities} placeholder="Type a city" />
      </Field>
      <Field errorText="Tell us where you live" invalid={home.trim() === ''} label="Home" required>
        <Autocomplete onValueChange={setHome} options={cities} placeholder="Type a city" value={home} />
      </Field>
    </div>
  )
}`,
      },
    },
  },
  render: () => (
    <div className="flex w-72 max-w-full flex-col gap-4">
      <Field helperText="Type it, or pick one of the suggestions." label="City">
        <Autocomplete options={cities} placeholder="Type a city" />
      </Field>
      <RequiredExample />
    </div>
  ),
}

/**
 * The Autocomplete built from its parts: the `AutocompleteInput` takes the addons and elements of the `Input`, and the `AutocompleteContent` holds an `AutocompleteLoading`, an `AutocompleteList` with an `AutocompleteOption` for each option and an `AutocompleteEmpty`. Each one is optional: the Autocomplete draws the input, or the content with the **options**, when you leave it out. An option can hold anything, with a `label` for the text the field takes.
 */
export const Compound: Story = {
  parameters: {
    docs: {
      story: { inline: false, iframeHeight: 420 },
      source: {
        code: `<Autocomplete aria-label="Country">
  <AutocompleteInput elementBefore={<SearchIcon />} placeholder="Search a country" />
  <AutocompleteContent>
    <AutocompleteList>
      <AutocompleteOption description="Europe" label="Spain" value="ES" />
      <AutocompleteOption description="Europe" label="Portugal" value="PT" />
      <AutocompleteOption label="Argentina" value="AR">
        <strong>Argentina</strong> (South America)
      </AutocompleteOption>
    </AutocompleteList>
    <AutocompleteEmpty>No country with that name</AutocompleteEmpty>
  </AutocompleteContent>
</Autocomplete>`,
      },
    },
  },
  render: () => (
    <Autocomplete aria-label="Country">
      <AutocompleteInput elementBefore={<SearchIcon />} placeholder="Search a country" />
      <AutocompleteContent>
        <AutocompleteList>
          <AutocompleteOption description="Europe" label="Spain" value="ES" />
          <AutocompleteOption description="Europe" label="Portugal" value="PT" />
          <AutocompleteOption label="Argentina" value="AR">
            <strong>Argentina</strong> (South America)
          </AutocompleteOption>
        </AutocompleteList>
        <AutocompleteEmpty>No country with that name</AutocompleteEmpty>
      </AutocompleteContent>
    </Autocomplete>
  ),
}

/**
 * Some examples of Autocomplete with Tailwind classes. With `variant="unstyled"` it has none of the Loica classes: `className` styles the field, each part takes its own `className`, and the option the arrows are on has `data-active`, so `data-[active]:` styles it, as `aria-selected:` and `aria-disabled:` do for the one whose text is in the field and the disabled ones.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex w-72 max-w-full flex-col gap-4">
  <Autocomplete aria-label="City" variant="unstyled">
    <AutocompleteInput
      className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-blue-500 focus:outline-none focus:ring-3 focus:ring-blue-200"
      placeholder="Type a city"
    />
    <AutocompleteContent className="rounded-lg border border-border bg-surface p-1 shadow-lg">
      <AutocompleteList>
        {cities.map(({ label }) => (
          <AutocompleteOption
            className="cursor-pointer rounded-sm px-3 py-1.5 text-sm text-foreground data-[active]:bg-surface-muted aria-selected:font-semibold"
            key={label}
            label={label}
          />
        ))}
      </AutocompleteList>
    </AutocompleteContent>
  </Autocomplete>
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex w-72 max-w-full flex-col gap-4">
      <Autocomplete aria-label="City" variant="unstyled">
        <AutocompleteInput
          className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-blue-500 focus:outline-none focus:ring-3 focus:ring-blue-200"
          placeholder="Type a city"
        />
        <AutocompleteContent className="rounded-lg border border-border bg-surface p-1 shadow-lg">
          <AutocompleteList>
            {cities.map(({ label }) => (
              <AutocompleteOption
                className="cursor-pointer rounded-sm px-3 py-1.5 text-sm text-foreground data-[active]:bg-surface-muted aria-selected:font-semibold"
                key={label}
                label={label}
              />
            ))}
          </AutocompleteList>
        </AutocompleteContent>
      </Autocomplete>
    </div>
  ),
}

/**
 * Some examples of Autocomplete with Bootstrap classes: `form-control` on the field, and `dropdown-menu show` and `dropdown-item` on the panel and its options. The option the arrows are on has `data-active`, which Bootstrap does not know, so a rule styles it.
 */
export const Bootstrap: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="d-flex flex-column gap-3" style={{ width: '18rem', maxWidth: '100%' }}>
  <style>{".bs-autocomplete .dropdown-item[data-active] { background-color: var(--bs-tertiary-bg); }"}</style>
  <Autocomplete aria-label="City" variant="unstyled">
    <AutocompleteInput className="form-control" placeholder="Type a city" />
    <AutocompleteContent className="bs-autocomplete dropdown-menu show p-1">
      <AutocompleteList>
        {cities.map(({ label }) => (
          <AutocompleteOption className="dropdown-item rounded" key={label} label={label} />
        ))}
      </AutocompleteList>
    </AutocompleteContent>
  </Autocomplete>
</div>`,
      },
    },
  },
  render: () => (
    <div className="d-flex flex-column gap-3" style={{ width: '18rem', maxWidth: '100%' }}>
      <style>{'.bs-autocomplete .dropdown-item[data-active] { background-color: var(--bs-tertiary-bg); }'}</style>
      <Autocomplete aria-label="City" variant="unstyled">
        <AutocompleteInput className="form-control" placeholder="Type a city" />
        <AutocompleteContent className="bs-autocomplete dropdown-menu show p-1">
          <AutocompleteList>
            {cities.map(({ label }) => (
              <AutocompleteOption className="dropdown-item rounded" key={label} label={label} />
            ))}
          </AutocompleteList>
        </AutocompleteContent>
      </Autocomplete>
    </div>
  ),
}
