import type { InputHTMLAttributes } from 'react'
import type { WeekDay } from '../../../utils/dates'

export interface DateRange {
  endDate: Date | null
  startDate: Date | null
}

/**
 * Every text the component shows or announces: the buttons of the footer (`apply`, `cancel`), the name of the calendar
 * (`calendar`) and of the button that opens it (`openCalendar`), and the navigation buttons (`previousMonth`,
 * `nextMonth`, `previousYears`, `nextYears`).
 */
export interface DatePickerLabels {
  apply: string
  calendar: string
  cancel: string
  format: (format: string) => string
  nextMonth: string
  nextYears: string
  openCalendar: string
  previousMonth: string
  previousYears: string
}

/**
 * The first day of the week of the calendar: a `WeekDay` (`0` is Sunday, `1` Monday, up to `6` Saturday), or
 * `'locale'` to take it from the `locale`.
 *
 * @since 1.1
 */
export type WeekStartsOn = WeekDay | 'locale'

export type DatePickerVariant = 'outline' | 'filled' | 'underline' | 'unstyled'

export type DatePickerRootAttributes = Pick<
  InputHTMLAttributes<HTMLInputElement>,
  | 'aria-describedby'
  | 'aria-invalid'
  | 'aria-label'
  | 'aria-labelledby'
  | 'disabled'
  | 'readOnly'
  | 'id'
  | 'name'
  | 'required'
  | 'placeholder'
>
