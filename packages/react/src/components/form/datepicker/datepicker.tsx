'use client'

import type { CSSProperties, ForwardedRef, ReactNode } from 'react'
import { forwardRef, useMemo, useState } from 'react'
import type { ColorScheme, ComponentProps, Shape, Size } from '../../../theme'
import { schemeVar } from '../../../theme'
import { customProperties } from '../shared/picker-panel'
import { DatePickerCalendar } from './datepicker-calendar'
import { DatePickerInput, type DatePickerInputProps } from './datepicker-input'
import type { DatePickerVariant, DateRange } from './datepicker-types'
import { DatePickerContext } from './datepicker-context'
import { useDatePickerController } from './use-datepicker-controller'

export type {
  DatePickerLabels,
  DatePickerRootAttributes,
  DatePickerVariant,
  DateRange,
} from './datepicker-types'

export interface DatePickerOwnProps {
  /**
   * The parts of the DatePicker, to change what it shows or their order: a `DatePickerInput` and a `DatePickerCalendar`. Without them it renders both.
   */
  children?: ReactNode
  /**
   * Color scheme from the theme palette, including custom schemes added to it.
   *
   * @default 'secondary'
   */
  colorScheme?: ColorScheme
  /**
   * Format of the typed and displayed date, built from the `dd`, `mm` and `yyyy` tokens in any order and case (e.g. `dd/mm/yyyy`, `YYYY-MM-DD`). Defaults to the format of `locale`.
   */
  displayFormat?: string
  /**
   * BCP 47 tag (`es`, `es-AR`, `en-US`) that sets the month and weekday names, the default `displayFormat` and the day labels read by screen readers. Falls back to the `locale` of the `LocaleProvider`, then to `en`.
   */
  locale?: string
  /**
   * Renders only the calendar, always visible, without the input.
   *
   * @default false
   */
  panel?: boolean
  /**
   * Selects a start and an end date, showing two consecutive months.
   *
   * @default false
   */
  range?: boolean
  /**
   * The icon of the button that opens the calendar. By default it is a calendar. The button is
   * named by the `datePicker.openCalendar` text of the `LocaleProvider`.
   */
  icon?: ReactNode
  /** Last selectable date. Later days are disabled. */
  maxDate?: Date
  /** First selectable date. Earlier days are disabled. */
  minDate?: Date
  /**
   * Called with the new `{ startDate, endDate }` when a date is picked or typed, when a range is complete, or on Apply when `showFooter` is set.
   */
  onValueChange: (value: DateRange) => void
  /**
   * Shape style of the DatePicker. `pill` rounds the `outline` input and the corners of the calendar.
   */
  shape?: Shape
  /**
   * Shows Cancel and Apply buttons, so the selection is only applied (and `onValueChange` called) on Apply.
   *
   * @default false
   */
  showFooter?: boolean
  /** Size of the input and of the calendar days. */
  size?: Size
  /** Selected date or range as `{ startDate, endDate }`. In single mode `endDate` is `null`. */
  value?: DateRange
  /**
   * Visual style variant of the input and of the calendar. `outline` has a bordered calendar, `filled` a tinted one with an accent line, `underline` a square one with an accent line and `unstyled` none of them.
   *
   * @default 'outline'
   */
  variant?: DatePickerVariant
}

export type DatePickerProps = Omit<ComponentProps, 'index'> &
  Omit<DatePickerInputProps, 'children' | 'style'> &
  DatePickerOwnProps

const datePickerColorVars = (colorScheme: ColorScheme, style?: CSSProperties): CSSProperties =>
  ({
    '--datepicker-scheme': schemeVar(colorScheme, 'text'),
    '--picker-scheme': 'var(--datepicker-scheme)',
    '--datepicker-solid': schemeVar(colorScheme, 'solid'),
    '--datepicker-contrast': schemeVar(colorScheme, 'solid-contrast'),
    '--datepicker-range-item-color': schemeVar(colorScheme, 'tint-strong'),
    '--datepicker-range-item-text': schemeVar(colorScheme, 'tint-text'),
    '--datepicker-hover-color': schemeVar(colorScheme, 'tint'),
    '--datepicker-selected-hover-color': schemeVar(colorScheme, 'solid-hover'),
    ...style,
  }) as CSSProperties

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  (
    {
      children,
      className,
      colorScheme = 'secondary',
      locale,
      displayFormat,
      icon,
      panel: isPanel = false,
      range: isRange = false,
      maxDate,
      minDate,
      onValueChange: onChange,
      shape,
      showFooter = false,
      size,
      style,
      value,
      variant = 'outline',
      ...inputProps
    }: DatePickerProps,
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    const [root, setRoot] = useState<HTMLDivElement | null>(null)
    const colorVars = useMemo(
      () => datePickerColorVars(colorScheme, customProperties(style)),
      [colorScheme, style],
    )
    const { context, handleBlur } = useDatePickerController({
      colorScheme,
      locale,
      displayFormat,
      icon,
      inputRef: ref,
      isPanel,
      isRange,
      maxDate,
      minDate,
      onChange,
      panelVars: colorVars,
      root,
      shape: shape ?? (variant === 'unstyled' ? undefined : 'rounded'),
      showFooter,
      size: size ?? (variant === 'unstyled' ? undefined : 'md'),
      value,
      variant,
    })

    return (
      <DatePickerContext.Provider value={context}>
        <div
          className={className}
          data-open={context.state.modalOpen ? '' : undefined}
          data-loica-datepicker=""
          onBlur={handleBlur}
          ref={setRoot}
          style={{ ...colorVars, ...style }}
        >
          {children ?? (
            <>
              <DatePickerInput {...inputProps} />
              <DatePickerCalendar />
            </>
          )}
        </div>
      </DatePickerContext.Provider>
    )
  },
)

DatePicker.displayName = 'DatePicker'
