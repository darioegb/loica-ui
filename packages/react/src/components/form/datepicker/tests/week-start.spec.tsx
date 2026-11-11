import { fireEvent, render } from '@testing-library/react'
import { DatePicker } from '..'
import { LocaleProvider } from '../../../../locale/locale-provider'
import { getDaysOfWeekByLanguage } from '../../../../utils/dates'
import { firstDayOfLocale, firstDayOfRegion, resolveWeekStart } from '../week-start'

const withoutWeekInfo = (run: () => void): void => {
  const prototype = Intl.Locale.prototype
  const saved = ['getWeekInfo', 'weekInfo'].map(
    (key) => [key, Object.getOwnPropertyDescriptor(prototype, key)] as const,
  )
  for (const [key] of saved) {
    Object.defineProperty(prototype, key, { configurable: true, value: undefined })
  }
  try {
    run()
  } finally {
    for (const [key, descriptor] of saved) {
      if (descriptor) Object.defineProperty(prototype, key, descriptor)
      else Reflect.deleteProperty(prototype, key)
    }
  }
}

const value = { endDate: null, startDate: new Date(2024, 0, 17) }

const renderPanel = (props: Partial<Parameters<typeof DatePicker>[0]> = {}) =>
  render(<DatePicker locale="en" onValueChange={vi.fn()} panel value={value} {...props} />)

const headers = (): string =>
  (document.querySelector('[class*="daysOfWeek"]') as HTMLElement).textContent

const firstCell = (): string =>
  (document.querySelector('[data-loica-datepicker-day]') as HTMLElement).dataset.date as string

const day = (dayOfMonth: number): HTMLElement =>
  document.querySelector<HTMLElement>(`[data-date="2024-01-${dayOfMonth}"]`) as HTMLElement

describe('getDaysOfWeekByLanguage', () => {
  it('starts on Monday unless it is told otherwise', () => {
    expect(getDaysOfWeekByLanguage('en').join('')).toBe('MonTueWedThuFriSatSun')
  })

  it.each([
    [0, 'SunMonTueWedThuFriSat'],
    [3, 'WedThuFriSatSunMonTue'],
    [6, 'SatSunMonTueWedThuFri'],
  ] as const)('starts on the day %s', (weekStartsOn, expected) => {
    expect(getDaysOfWeekByLanguage('en', weekStartsOn).join('')).toBe(expected)
  })
})

describe('resolveWeekStart', () => {
  it('is Monday without a value, whatever the locale', () => {
    expect(resolveWeekStart(undefined, 'en')).toBe(1)
    expect(resolveWeekStart(undefined, 'ar-EG')).toBe(1)
  })

  it('gives back a day that is given', () => {
    expect(resolveWeekStart(0, 'es')).toBe(0)
    expect(resolveWeekStart(6, 'en')).toBe(6)
  })

  it.each([
    ['en', 0],
    ['en-US', 0],
    ['pt-BR', 0],
    ['ja', 0],
    ['he', 0],
    ['es', 1],
    ['en-GB', 1],
    ['de', 1],
    ['fr', 1],
    ['ar-EG', 6],
  ])('takes it from the locale %s: %s', (locale, expected) => {
    expect(resolveWeekStart('locale', locale)).toBe(expected)
  })

  it('follows the first day that the tag of the locale asks for', () => {
    expect(resolveWeekStart('locale', 'en-US-u-fw-mon')).toBe(1)
  })
})

describe('the fallback of a browser without week info', () => {
  it.each([
    ['en', 0],
    ['pt-BR', 0],
    ['es', 1],
    ['en-GB', 1],
    ['de', 1],
    ['ar', 6],
    ['ar-EG', 6],
    ['dv-MV', 5],
  ])('gives the first day of %s: %s', (locale, expected) => {
    withoutWeekInfo(() => {
      expect(firstDayOfLocale(locale)).toBe(expected)
    })
  })

  it.each([
    ['US', 0],
    ['CA', 0],
    ['MX', 0],
    ['BR', 0],
    ['JP', 0],
    ['IN', 0],
    ['IL', 0],
    ['KR', 0],
    ['ZA', 0],
    ['EG', 6],
    ['IR', 6],
    ['AF', 6],
    ['MV', 5],
    ['GB', 1],
    ['DE', 1],
    ['ES', 1],
    ['FR', 1],
    ['AR', 1],
    ['AU', 1],
    ['AE', 1],
    [undefined, 1],
  ])('puts the week of the region %s on %s', (region, expected) => {
    expect(firstDayOfRegion(region)).toBe(expected)
  })
})

describe('DatePicker weekStartsOn', () => {
  it('starts the week on Monday by default, even for a locale that starts it on Sunday', () => {
    renderPanel()
    expect(headers()).toBe('MonTueWedThuFriSatSun')
    expect(firstCell()).toBe('2024-01-01')
  })

  it.each([
    [0, 'SunMonTueWedThuFriSat', '2023-12-31'],
    [1, 'MonTueWedThuFriSatSun', '2024-01-01'],
    [6, 'SatSunMonTueWedThuFri', '2023-12-30'],
  ] as const)('starts the week on %s', (weekStartsOn, expectedHeaders, expectedFirstCell) => {
    renderPanel({ weekStartsOn })
    expect(headers()).toBe(expectedHeaders)
    expect(firstCell()).toBe(expectedFirstCell)
  })

  it('takes the first day from the locale with weekStartsOn="locale"', () => {
    renderPanel({ locale: 'en', weekStartsOn: 'locale' })
    expect(headers()).toBe('SunMonTueWedThuFriSat')
    expect(firstCell()).toBe('2023-12-31')
  })

  it('takes the first day from the locale of the LocaleProvider', () => {
    render(
      <LocaleProvider locale="en-GB">
        <DatePicker onValueChange={vi.fn()} panel value={value} weekStartsOn="locale" />
      </LocaleProvider>,
    )
    expect(firstCell()).toBe('2024-01-01')
  })

  it('moves to the start and the end of the week with Home and End', () => {
    renderPanel({ weekStartsOn: 0 })
    fireEvent.keyDown(day(17), { key: 'Home' })
    expect(day(14)).toHaveFocus()
    fireEvent.keyDown(day(14), { key: 'End' })
    expect(day(20)).toHaveFocus()
  })

  it('moves to Monday and Sunday with Home and End by default', () => {
    renderPanel()
    fireEvent.keyDown(day(17), { key: 'Home' })
    expect(day(15)).toHaveFocus()
    fireEvent.keyDown(day(15), { key: 'End' })
    expect(day(21)).toHaveFocus()
  })
})
