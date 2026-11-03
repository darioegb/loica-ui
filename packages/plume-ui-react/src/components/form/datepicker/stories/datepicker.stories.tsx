import type { StoryObj, Meta } from '@storybook/react-vite'
import type { CSSProperties, ReactElement } from 'react'
import { useState } from 'react'
import { defaultTheme } from '../../../../theme'
import {
  DatePicker,
  DatePickerApply,
  DatePickerCalendar,
  DatePickerCancel,
  DatePickerDay,
  DatePickerField,
  DatePickerFooter,
  DatePickerGrid,
  DatePickerHeader,
  DatePickerInput,
  DatePickerMonthButton,
  DatePickerMonthOption,
  DatePickerMonths,
  DatePickerNav,
  DatePickerNext,
  DatePickerPage,
  DatePickerPages,
  DatePickerPrevious,
  DatePickerTrigger,
  DatePickerView,
  DatePickerWeekdays,
  DatePickerYearButton,
  DatePickerYearOption,
  DatePickerYears,
} from '..'
import { LocaleProvider } from '../../../../locale'
import type { DatePickerProps, DateRange } from '../datepicker'

const defaultDateRangeValue = { startDate: null, endDate: null }
const colorSchemes = Object.keys(defaultTheme.colors)
const toDate = (value?: Date): Date | undefined => (value === undefined ? undefined : new Date(value))

const ControlledDatePicker = (props: Partial<DatePickerProps>): ReactElement => {
  const [value, setValue] = useState<DateRange>(defaultDateRangeValue)
  return <DatePicker {...props} onValueChange={setValue} value={value} />
}

const StatefulDatePicker = ({ maxDate, minDate, ...args }: DatePickerProps): ReactElement => (
  <ControlledDatePicker
    aria-label='Date'
    {...args}
    maxDate={toDate(maxDate)}
    minDate={toDate(minDate)}
  />
)

/**
 * DatePicker Component allows users to select dates from a calendar interface.
 * It supports single and range selection modes, configurable color schemes, and localization options.
 *
 * On its own it shows an input with a button that opens the calendar. To change what it shows or the order, give
 * it its parts as children: `DatePickerInput` is the field with the button (a `DatePickerField` and a
 * `DatePickerTrigger`, in the order you want), and `DatePickerCalendar` the calendar
 * (a popup under the input, or always visible with `panel`). The `DatePicker` keeps the value and the state
 * and shares them with its parts. All the props of the `DatePicker` keep working when it has no children; with
 * children, the props of the field (`placeholder`, `disabled`, `readOnly`, `onBlur`, `id`, `name`,
 * `required` and `className`) go on the `DatePickerInput`. The look (`variant`, `size` and `shape`) always goes on the
 * `DatePicker`, because it styles the input and the calendar together.
 *
 * Every element is a part with its own `className`, `style` and `ref`, and with `data-plume-datepicker-<part>`
 * attributes (the days also carry `data-selected`, `data-today`, `data-outside`, `data-in-range`, `data-disabled`,
 * and `data-hovered` and `data-preview` while the pointer or the focus is over the calendar). The `ref` of the
 * `DatePicker` and of the `DatePickerInput` goes to the native `<input>`, so a form library can focus it.
 * `DatePickerFormatHint` is the visually hidden text that describes the expected format, and `DatePickerDayNumber`
 * the number inside a `DatePickerDay`. The cells that
 * repeat (weekdays, days, months and years) take a function as children, like
 * `<DatePickerGrid>{(day) => <DatePickerDay day={day} />}</DatePickerGrid>`, to render each one yourself.
 *
 * ### Closing
 *
 * The popup closes with <kbd>Esc</kbd> (the focus goes back to the input), with a press outside of the
 * DatePicker and when the focus leaves it.
 *
 * ### Keyboard
 *
 * Opening the calendar moves focus to the selected day, or to today.
 * <kbd>←</kbd> <kbd>→</kbd> move one day, <kbd>↑</kbd> <kbd>↓</kbd> one week,
 * <kbd>Home</kbd> / <kbd>End</kbd> to the start or end of the week and <kbd>PageUp</kbd> / <kbd>PageDown</kbd> one month.
 * <kbd>Enter</kbd> picks the day and <kbd>Escape</kbd> closes the calendar; both return focus to the input.
 */
export default {
  title: 'Components/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  decorators: [
    (Story, { args }) => (
      <div className={args.panel ? 'w-72 max-w-full' : 'w-72 max-w-full pb-[22rem]'}>{Story()}</div>
    ),
  ],
  parameters: {
    docs: {
      importNames: ['DatePicker', 'DatePickerInput', 'DatePickerCalendar'],
      toc: {
        title: 'On this page',
        disable: false,
      },
    },
    layout: 'centered',
  },
  argTypes: {
    className: { control: 'text' },
    value: { control: false },
    panel: { control: 'boolean' },
    range: { control: 'boolean' },
    colorScheme: { control: 'select', options: colorSchemes },
    disabled: { control: 'boolean' },
    displayFormat: { control: 'text' },
    maxDate: { control: 'date' },
    minDate: { control: 'date' },
    showFooter: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    shape: { control: 'inline-radio', options: ['pill', 'rounded'] },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    variant: { control: 'select', options: ['outline', 'underline', 'filled', 'unstyled'] },
    placeholder: { control: 'text' },
    style: { control: false },
    id: { control: false },
    name: { control: false },
    required: { control: 'boolean' },
  },
  render: (args) => <StatefulDatePicker {...args} />,
  args: {
    disabled: false,
    range: false,
    readOnly: false,
    showFooter: false,
  },
} as Meta<typeof DatePicker>

type Story = StoryObj<typeof DatePicker>

/**
 * This is the default DatePicker.
 */
export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: `const [value, setValue] = useState<DateRange>({ startDate: null, endDate: null })

<DatePicker aria-label="Date" onValueChange={setValue} value={value} />`,
      },
    },
  },
}

/**
 * This is a list of DatePicker with different variants.
 * Just adding the **variant** prop in one of these values **outline**, **underline**, **filled** and **unstyled**.
 * The **variant**, **size** and **shape** go on the `DatePicker` and style the input and the calendar together, so open them to see the calendar of each one.
 */
export const Variants: Story = {
  parameters: {
    docs: {
      source: {
        code: `<DatePicker aria-label="Outline DatePicker" placeholder="Outline DatePicker" variant="outline" value={value} onValueChange={handleValueChange} />
<DatePicker aria-label="Underline DatePicker" placeholder="Underline DatePicker" variant="underline" value={value} onValueChange={handleValueChange} />
<DatePicker aria-label="Filled DatePicker" placeholder="Filled DatePicker" variant="filled" value={value} onValueChange={handleValueChange} />
<DatePicker aria-label="Unstyled DatePicker" placeholder="Unstyled DatePicker" variant="unstyled" value={value} onValueChange={handleValueChange} />
          `,
      },
    },
  },
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks -- Render is valid storybook function
    const [value, setValue] = useState<DateRange>({
      startDate: null,
      endDate: null,
    })

    const handleValueChange = (newValue: DateRange): void => {
      setValue(newValue)
    }
    return (
      <div className='grid w-full gap-4 grid-cols-[repeat(auto-fill,minmax(18rem,1fr))]'>
        <DatePicker
          aria-label='Outline DatePicker'
          onValueChange={handleValueChange}
          placeholder='Outline DatePicker'
          value={value}
          variant='outline'
        />
        <DatePicker
          aria-label='Underline DatePicker'
          onValueChange={handleValueChange}
          placeholder='Underline DatePicker'
          value={value}
          variant='underline'
        />
        <DatePicker
          aria-label='Filled DatePicker'
          onValueChange={handleValueChange}
          placeholder='Filled DatePicker'
          value={value}
          variant='filled'
        />
        <DatePicker
          aria-label='Unstyled DatePicker'
          onValueChange={handleValueChange}
          placeholder='Unstyled DatePicker'
          value={value}
          variant='unstyled'
        />
      </div>
    )
  },
}

/**
 * This is a list of DatePicker with different sizes.
 * Just adding the **size** prop.
 */
export const Sizes: Story = {
  parameters: {
    docs: {
      source: {
        code: `<DatePicker aria-label="Small DatePicker" size="sm" placeholder="Small DatePicker" value={value} onValueChange={handleValueChange} />
<DatePicker aria-label="Medium DatePicker" size="md" placeholder="Medium DatePicker" value={value} onValueChange={handleValueChange} />
<DatePicker aria-label="Large DatePicker" size="lg" placeholder="Large DatePicker" value={value} onValueChange={handleValueChange} />
          `,
      },
    },
  },
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks -- Render is valid storybook function
    const [value, setValue] = useState<DateRange>({
      startDate: null,
      endDate: null,
    })

    const handleValueChange = (newValue: DateRange): void => {
      setValue(newValue)
    }
    return (
      <div className='grid w-full gap-4 grid-cols-[repeat(auto-fill,minmax(18rem,1fr))]'>
        <DatePicker
          aria-label='Small DatePicker'
          onValueChange={handleValueChange}
          placeholder='Small DatePicker'
          size='sm'
          value={value}
        />
        <DatePicker
          aria-label='Medium DatePicker'
          onValueChange={handleValueChange}
          placeholder='Medium DatePicker'
          size='md'
          value={value}
        />
        <DatePicker
          aria-label='Large DatePicker'
          onValueChange={handleValueChange}
          placeholder='Large DatePicker'
          size='lg'
          value={value}
        />
      </div>
    )
  },
}

/**
 * This is a list of DatePicker with different colors.
 * Just adding the **colorScheme** prop. The color marks the selected day, today and the focus; the in-range days and
 * the hover use its tints.
 */
export const Colors: Story = {
  parameters: {
    docs: {
      source: {
        code: `<DatePicker aria-label="Primary DatePicker" colorScheme="primary" onValueChange={handleValueChange} value={value} />
<DatePicker aria-label="Success DatePicker" colorScheme="success" onValueChange={handleValueChange} value={value} />
<DatePicker aria-label="Error DatePicker" colorScheme="error" onValueChange={handleValueChange} value={value} />`,
      },
    },
  },
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks -- Render is valid storybook function
    const [value, setValue] = useState<DateRange>({
      startDate: null,
      endDate: null,
    })

    const handleValueChange = (newValue: DateRange): void => {
      setValue(newValue)
    }
    return (
      <div className='grid w-full gap-4 grid-cols-[repeat(auto-fill,minmax(18rem,1fr))]'>
        {colorSchemes.map((colorScheme) => (
          <DatePicker
            aria-label={`${colorScheme} DatePicker`}
            colorScheme={colorScheme as keyof typeof defaultTheme.colors}
            key={colorScheme}
            onValueChange={handleValueChange}
            placeholder={`${colorScheme} DatePicker`}
            value={value}
          />
        ))}
      </div>
    )
  },
}

/**
 * DatePicker configured for selecting a range of dates.
 */
export const RangeSelection: Story = {
  parameters: {
    docs: {
      source: {
        code: `<DatePicker aria-label="Date" range />`,
      },
    },
  },
  args: {
    range: true,
  },
}

/**
 * DatePicker with minimum and maximum selectable dates.
 */
export const WithMinMaxDates: Story = {
  parameters: {
    docs: {
      source: {
        code: `<DatePicker
  aria-label="Date"
  maxDate={new Date(new Date().getFullYear(), new Date().getMonth() + 1, 15)}
  minDate={new Date()}
/>`,
      },
    },
  },
  args: {
    minDate: new Date(),
    maxDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 15),
  },
}

/**
 * DatePicker with footer actions.
 */
export const WithFooterActions: Story = {
  parameters: {
    docs: {
      source: {
        code: `<DatePicker aria-label="Date" showFooter />`,
      },
    },
  },
  args: {
    showFooter: true,
  },
  decorators: [(Story) => <div className='pb-[10rem]'>{Story()}</div>],
}

/**
 * With **panel** the calendar is shown on its own, always visible and without the input, to put it in the page
 * (a booking form, a side panel). It keeps the value, the range and the footer like the popup does, and picking a
 * day doesn't hide it.
 */
export const Panel: Story = {
  parameters: {
    docs: {
      source: {
        code: `<DatePicker aria-label="Date" onValueChange={handleValueChange} panel value={value} />`,
      },
    },
  },
  args: {
    panel: true,
  },
}

/**
 * DatePicker localized to Spanish through **locale** and the `datePicker` texts of the `LocaleProvider`.
 * Every key is optional: `locale` alone localizes the month and weekday names and the date format,
 * and the messages only need the texts you want to change.
 */
export const Localized: Story = {
  parameters: {
    docs: {
      source: {
        code: `<LocaleProvider
  messages={{
    datePicker: {
      apply: 'Aplicar',
      calendar: 'Calendario',
      cancel: 'Cancelar',
      nextMonth: 'Mes siguiente',
      nextYears: 'Años siguientes',
      openCalendar: 'Abrir calendario',
      previousMonth: 'Mes anterior',
      previousYears: 'Años anteriores',
    },
  }}
>
  <DatePicker aria-label="Fecha" locale="es" onValueChange={handleValueChange} showFooter value={value} />
</LocaleProvider>`,
      },
    },
  },
  args: {
    showFooter: true,
    locale: 'es',
  },
  render: (args) => (
    <LocaleProvider
      messages={{
        datePicker: {
          apply: 'Aplicar',
          calendar: 'Calendario',
          cancel: 'Cancelar',
          nextMonth: 'Mes siguiente',
          nextYears: 'Años siguientes',
          openCalendar: 'Abrir calendario',
          previousMonth: 'Mes anterior',
          previousYears: 'Años anteriores',
        },
      }}
    >
      <StatefulDatePicker {...args} />
    </LocaleProvider>
  ),
}

/**
 * Every element of the calendar is a part, so you can rebuild any piece. Here the header only has the arrows and
 * the month, the weekdays and the days keep their default content, and the footer has its own texts and an order
 * of its own.
 */
export const CustomParts: Story = {
  parameters: {
    docs: {
      source: {
        code: `<DatePicker showFooter onValueChange={onChange}>
  <DatePickerInput aria-label="Date" />
  <DatePickerCalendar>
    <DatePickerPages>
      <DatePickerPage>
        <DatePickerHeader>
          <DatePickerNav>
            <DatePickerPrevious>Back</DatePickerPrevious>
            <DatePickerMonthButton />
            <DatePickerNext>Next</DatePickerNext>
          </DatePickerNav>
        </DatePickerHeader>
        <DatePickerView />
      </DatePickerPage>
    </DatePickerPages>
    <DatePickerFooter>
      <DatePickerApply>Done</DatePickerApply>
      <DatePickerCancel>Not now</DatePickerCancel>
    </DatePickerFooter>
  </DatePickerCalendar>
</DatePicker>`,
      },
    },
  },
  render: () => (
    <ControlledDatePicker locale='en' showFooter>
      <DatePickerInput aria-label='Date' />
      <DatePickerCalendar>
        <DatePickerPages>
          <DatePickerPage>
            <DatePickerHeader>
              <DatePickerNav>
                <DatePickerPrevious>Back</DatePickerPrevious>
                <DatePickerMonthButton />
                <DatePickerNext>Next</DatePickerNext>
              </DatePickerNav>
            </DatePickerHeader>
            <DatePickerView />
          </DatePickerPage>
        </DatePickerPages>
        <DatePickerFooter>
          <DatePickerApply>Done</DatePickerApply>
          <DatePickerCancel>Not now</DatePickerCancel>
        </DatePickerFooter>
      </DatePickerCalendar>
    </ControlledDatePicker>
  ),
}

/**
 * The calendar popup is themed through CSS variables, so you can restyle it
 * independently of the input trigger — even when `variant="unstyled"`. Override any
 * of these on the `style` prop (they default to your `colorScheme`):
 *
 * - `--datepicker-solid`: selected day background.
 * - `--datepicker-scheme`: today's text and focus border.
 * - `--datepicker-contrast`: text color on the selected day.
 * - `--datepicker-hover-color`: day hover background.
 * - `--datepicker-selected-hover-color`: selected day hover background.
 * - `--datepicker-range-item-color`: in-range day background.
 * - `--datepicker-range-item-text`: in-range day text color.
 */
export const CalendarTheming: Story = {
  parameters: {
    docs: {
      source: {
        code: `<DatePicker
  aria-label="Date"
  range
  value={value}
  onValueChange={handleValueChange}
  style={{
    '--datepicker-solid': '#7c3aed',
    '--datepicker-scheme': '#6d28d9',
    '--datepicker-contrast': '#ffffff',
    '--datepicker-hover-color': '#f5f3ff',
    '--datepicker-selected-hover-color': '#6d28d9',
    '--datepicker-range-item-color': '#ede9fe',
    '--datepicker-range-item-text': '#4c1d95',
  }}
/>`,
      },
    },
  },
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks -- Render is valid storybook function
    const [value, setValue] = useState<DateRange>({
      startDate: null,
      endDate: null,
    })

    const handleValueChange = (newValue: DateRange): void => {
      setValue(newValue)
    }
    return (
      <DatePicker
        aria-label='Custom themed calendar'
        range
        onValueChange={handleValueChange}
        placeholder='Custom themed calendar'
        style={
          {
            '--datepicker-solid': '#7c3aed',
            '--datepicker-scheme': '#6d28d9',
            '--datepicker-contrast': '#ffffff',
            '--datepicker-hover-color': '#f5f3ff',
            '--datepicker-selected-hover-color': '#6d28d9',
            '--datepicker-range-item-color': '#ede9fe',
            '--datepicker-range-item-text': '#4c1d95',
          } as CSSProperties
        }
        value={value}
      />
    )
  },
}

/**
 * This is a disabled DatePicker.
 * Just adding the **disabled** prop in true.
 * The disabled state add **.disabled** class,
 */
export const Disabled: Story = {
  parameters: {
    docs: {
      source: {
        code: `<DatePicker aria-label="Date" disabled />`,
      },
    },
  },
  args: {
    disabled: true,
  },
}

/**
 * Use **icon** to change the icon of the button that opens the calendar. The button keeps its name, which comes from
 * the `datePicker.openCalendar` text of the `LocaleProvider`.
 */
export const CustomIcon: Story = {
  parameters: {
    docs: {
      source: {
        code: `<DatePicker aria-label="Date" icon={<MyCalendarIcon />} onValueChange={setDate} />`,
      },
    },
  },
  args: {
    'aria-label': 'Date',
    icon: (
      <svg
        aria-hidden="true"
        fill="none"
        height="18"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="18"
      >
        <path d="M8 2v4M16 2v4M3 10h18M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" />
      </svg>
    ),
  },
}

/**
 * Give the `DatePicker` its parts to choose what it shows and in which order. The props of the field, here its
 * placeholder, go on the `DatePickerInput`, the look (here small and filled) on the `DatePicker`, and the
 * `DatePickerCalendar` opens under it. The state is shared, so picking a day in the calendar updates the field.
 */
export const Compound: Story = {
  parameters: {
    docs: {
      source: {
        code: `<DatePicker locale="en" onValueChange={handleValueChange} size="sm" value={value} variant="filled">
  <DatePickerInput aria-label="Pick a day" placeholder="Pick a day" />
  <DatePickerCalendar />
</DatePicker>`,
      },
    },
  },
  render: () => (
    <ControlledDatePicker locale='en' size='sm' variant='filled'>
      <DatePickerInput aria-label='Pick a day' placeholder='Pick a day' />
      <DatePickerCalendar />
    </ControlledDatePicker>
  ),
}

/**
 * An example of DatePicker with custom classes from Tailwind.
 * Set **variant="unstyled"** so Plume styles don't override the Tailwind classes.
 *
 * `DatePickerInput` is the box that holds the field and the button, so its `className` styles the box and the
 * `className` of the `DatePickerField` the input, and the one of the `DatePickerTrigger` the button. With
 * `variant="unstyled"` the calendar has no look at all, so the example builds it from its parts: the state of a day,
 * a month or a year is in a `data-*` attribute (`data-selected`, `data-today`, `data-outside`), which Tailwind reads
 * with `data-selected:`.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<DatePicker onValueChange={handleValueChange} value={value} variant="unstyled">
  <DatePickerInput aria-label="Pick a date" className="relative" placeholder="Pick a date">
    <DatePickerField className="w-full rounded-lg border border-border bg-surface py-2.5 pr-11 pl-4 text-sm text-foreground outline-none hover:border-border-hover focus:border-blue-500 focus:ring-3 focus:ring-blue-200" />
    <DatePickerTrigger className="absolute inset-y-0 right-0 flex items-center px-3 text-muted hover:text-foreground" />
  </DatePickerInput>
  <DatePickerCalendar className="w-72 rounded-xl border border-border bg-surface p-3 text-sm text-foreground shadow-lg">
    <DatePickerPages>
      <DatePickerPage className="w-full">
        <DatePickerHeader>
          <DatePickerNav className="mb-2 w-full gap-1">
            <DatePickerPrevious className="rounded-md p-1.5 hover:bg-surface-muted" />
            <DatePickerMonthButton className="ml-auto rounded-md px-2 py-1 font-medium hover:bg-surface-muted" />
            <DatePickerYearButton className="mr-auto rounded-md px-2 py-1 font-medium hover:bg-surface-muted" />
            <DatePickerNext className="rounded-md p-1.5 hover:bg-surface-muted" />
          </DatePickerNav>
        </DatePickerHeader>
        <DatePickerView>
          {(view) => {
            if (view === 'month') {
              return (
                <DatePickerMonths className="gap-1">
                  {(month) => (
                    <DatePickerMonthOption
                      className="rounded-md py-2 hover:bg-surface-muted data-selected:bg-primary-solid data-selected:text-primary-on-solid"
                      key={month.index}
                      month={month}
                    />
                  )}
                </DatePickerMonths>
              )
            }
            if (view === 'year') {
              return (
                <DatePickerYears className="gap-1">
                  {(year) => (
                    <DatePickerYearOption
                      className="rounded-md py-2 hover:bg-surface-muted data-selected:bg-primary-solid data-selected:text-primary-on-solid"
                      key={year.value}
                      year={year}
                    />
                  )}
                </DatePickerYears>
              )
            }
            return (
              <>
                <DatePickerWeekdays className="mb-1 text-xs text-muted" />
                <DatePickerGrid className="gap-y-1">
                  {(day) => (
                    <DatePickerDay
                      className="mx-auto size-9 rounded-full hover:bg-surface-muted disabled:cursor-not-allowed data-outside:opacity-30 data-today:font-bold data-selected:bg-primary-solid data-selected:text-primary-on-solid"
                      day={day}
                      key={day.dataDate}
                    />
                  )}
                </DatePickerGrid>
              </>
            )
          }}
        </DatePickerView>
      </DatePickerPage>
    </DatePickerPages>
  </DatePickerCalendar>
</DatePicker>`,
      },
    },
  },
  render: () => (
    <ControlledDatePicker variant='unstyled'>
      <DatePickerInput aria-label='Pick a date' className='relative' placeholder='Pick a date'>
        <DatePickerField className='w-full rounded-lg border border-border bg-surface py-2.5 pr-11 pl-4 text-sm text-foreground outline-none hover:border-border-hover focus:border-blue-500 focus:ring-3 focus:ring-blue-200' />
        <DatePickerTrigger className='absolute inset-y-0 right-0 flex items-center px-3 text-muted hover:text-foreground' />
      </DatePickerInput>
      <DatePickerCalendar className='w-72 rounded-xl border border-border bg-surface p-3 text-sm text-foreground shadow-lg'>
        <DatePickerPages>
          <DatePickerPage className='w-full'>
            <DatePickerHeader>
              <DatePickerNav className='mb-2 w-full gap-1'>
                <DatePickerPrevious className='rounded-md p-1.5 hover:bg-surface-muted' />
                <DatePickerMonthButton className='ml-auto rounded-md px-2 py-1 font-medium hover:bg-surface-muted' />
                <DatePickerYearButton className='mr-auto rounded-md px-2 py-1 font-medium hover:bg-surface-muted' />
                <DatePickerNext className='rounded-md p-1.5 hover:bg-surface-muted' />
              </DatePickerNav>
            </DatePickerHeader>
            <DatePickerView>
              {(view) => {
                if (view === 'month') {
                  return (
                    <DatePickerMonths className='gap-1'>
                      {(month) => (
                        <DatePickerMonthOption
                          className='rounded-md py-2 hover:bg-surface-muted data-selected:bg-primary-solid data-selected:text-primary-on-solid'
                          key={month.index}
                          month={month}
                        />
                      )}
                    </DatePickerMonths>
                  )
                }
                if (view === 'year') {
                  return (
                    <DatePickerYears className='gap-1'>
                      {(year) => (
                        <DatePickerYearOption
                          className='rounded-md py-2 hover:bg-surface-muted data-selected:bg-primary-solid data-selected:text-primary-on-solid'
                          key={year.value}
                          year={year}
                        />
                      )}
                    </DatePickerYears>
                  )
                }
                return (
                  <>
                    <DatePickerWeekdays className='mb-1 text-xs text-muted' />
                    <DatePickerGrid className='gap-y-1'>
                      {(day) => (
                        <DatePickerDay
                          className='mx-auto size-9 rounded-full hover:bg-surface-muted disabled:cursor-not-allowed data-outside:opacity-30 data-today:font-bold data-selected:bg-primary-solid data-selected:text-primary-on-solid'
                          day={day}
                          key={day.dataDate}
                        />
                      )}
                    </DatePickerGrid>
                  </>
                )
              }}
            </DatePickerView>
          </DatePickerPage>
        </DatePickerPages>
      </DatePickerCalendar>
    </ControlledDatePicker>
  ),
}

/**
 * An example of DatePicker with custom classes from Bootstrap.
 * Set **variant="unstyled"** so Plume styles don't override the Bootstrap classes.
 *
 * The `DatePickerField` takes `form-control` and the `DatePickerTrigger` is placed over its end with Bootstrap's
 * position utilities. With `variant="unstyled"` the calendar has no look either, so the example builds it from its
 * parts with `card`, `btn` and the other Bootstrap classes. A day, a month and a year come with their state
 * (`day.isSelected`, `month.selected`), which picks `btn-primary`.
 */
export const Bootstrap: Story = {
  parameters: {
    docs: {
      source: {
        code: `<DatePicker onValueChange={handleValueChange} value={value} variant="unstyled">
  <DatePickerInput aria-label="Pick a date" className="position-relative" placeholder="Pick a date">
    <DatePickerField className="form-control pe-5" />
    <DatePickerTrigger className="btn btn-sm btn-outline-secondary border-0 position-absolute top-50 end-0 translate-middle-y me-1" />
  </DatePickerInput>
  <DatePickerCalendar className="card shadow p-3" style={{ width: '19rem' }}>
    <DatePickerPages>
      <DatePickerPage className="w-100">
        <DatePickerHeader>
          <DatePickerNav className="mb-2 w-100 gap-1">
            <DatePickerPrevious className="btn btn-sm btn-outline-secondary" />
            <DatePickerMonthButton className="btn btn-sm btn-link text-body text-decoration-none fw-semibold ms-auto" />
            <DatePickerYearButton className="btn btn-sm btn-link text-body text-decoration-none fw-semibold me-auto" />
            <DatePickerNext className="btn btn-sm btn-outline-secondary" />
          </DatePickerNav>
        </DatePickerHeader>
        <DatePickerView>
          {(view) => {
            if (view === 'month') {
              return (
                <DatePickerMonths className="gap-1">
                  {(month) => (
                    <DatePickerMonthOption
                      className={\`btn btn-sm \${month.selected ? 'btn-primary' : 'btn-outline-secondary border-0'}\`}
                      key={month.index}
                      month={month}
                    />
                  )}
                </DatePickerMonths>
              )
            }
            if (view === 'year') {
              return (
                <DatePickerYears className="gap-1">
                  {(year) => (
                    <DatePickerYearOption
                      className={\`btn btn-sm \${year.selected ? 'btn-primary' : 'btn-outline-secondary border-0'}\`}
                      key={year.value}
                      year={year}
                    />
                  )}
                </DatePickerYears>
              )
            }
            return (
              <>
                <DatePickerWeekdays className="small text-body-secondary mb-1" />
                <DatePickerGrid className="gap-1">
                  {(day) => (
                    <DatePickerDay
                      className={\`btn btn-sm p-0 mx-auto rounded-circle border-0 d-flex align-items-center justify-content-center \${day.isSelected ? 'btn-primary' : 'btn-outline-secondary'} \${day.isCurrentMonth ? '' : 'opacity-25'} \${day.isToday ? 'fw-bold' : ''}\`}
                      day={day}
                      key={day.dataDate}
                      style={{ height: '2.25rem', width: '2.25rem' }}
                    />
                  )}
                </DatePickerGrid>
              </>
            )
          }}
        </DatePickerView>
      </DatePickerPage>
    </DatePickerPages>
  </DatePickerCalendar>
</DatePicker>`,
      },
    },
  },
  render: () => (
    <ControlledDatePicker variant='unstyled'>
      <DatePickerInput aria-label='Pick a date' className='position-relative' placeholder='Pick a date'>
        <DatePickerField className='form-control pe-5' />
        <DatePickerTrigger className='btn btn-sm btn-outline-secondary border-0 position-absolute top-50 end-0 translate-middle-y me-1' />
      </DatePickerInput>
      <DatePickerCalendar className='card shadow p-3' style={{ width: '19rem' }}>
        <DatePickerPages>
          <DatePickerPage className='w-100'>
            <DatePickerHeader>
              <DatePickerNav className='mb-2 w-100 gap-1'>
                <DatePickerPrevious className='btn btn-sm btn-outline-secondary' />
                <DatePickerMonthButton className='btn btn-sm btn-link text-body text-decoration-none fw-semibold ms-auto' />
                <DatePickerYearButton className='btn btn-sm btn-link text-body text-decoration-none fw-semibold me-auto' />
                <DatePickerNext className='btn btn-sm btn-outline-secondary' />
              </DatePickerNav>
            </DatePickerHeader>
            <DatePickerView>
              {(view) => {
                if (view === 'month') {
                  return (
                    <DatePickerMonths className='gap-1'>
                      {(month) => (
                        <DatePickerMonthOption
                          className={`btn btn-sm ${month.selected ? 'btn-primary' : 'btn-outline-secondary border-0'}`}
                          key={month.index}
                          month={month}
                        />
                      )}
                    </DatePickerMonths>
                  )
                }
                if (view === 'year') {
                  return (
                    <DatePickerYears className='gap-1'>
                      {(year) => (
                        <DatePickerYearOption
                          className={`btn btn-sm ${year.selected ? 'btn-primary' : 'btn-outline-secondary border-0'}`}
                          key={year.value}
                          year={year}
                        />
                      )}
                    </DatePickerYears>
                  )
                }
                return (
                  <>
                    <DatePickerWeekdays className='small text-body-secondary mb-1' />
                    <DatePickerGrid className='gap-1'>
                      {(day) => (
                        <DatePickerDay
                          className={`btn btn-sm p-0 mx-auto rounded-circle border-0 d-flex align-items-center justify-content-center ${day.isSelected ? 'btn-primary' : 'btn-outline-secondary'} ${day.isCurrentMonth ? '' : 'opacity-25'} ${day.isToday ? 'fw-bold' : ''}`}
                          day={day}
                          key={day.dataDate}
                          style={{ height: '2.25rem', width: '2.25rem' }}
                        />
                      )}
                    </DatePickerGrid>
                  </>
                )
              }}
            </DatePickerView>
          </DatePickerPage>
        </DatePickerPages>
      </DatePickerCalendar>
    </ControlledDatePicker>
  ),
}
