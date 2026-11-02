/**
 * Every text the picker shows or announces: the names of the popup (`timePicker`), of its lists (`hours`, `minutes`,
 * `period`) and of the button that opens it (`openTimePicker`), and the `am` and `pm` texts.
 */
export interface TimePickerLabels {
  am: string
  format: (format: string) => string
  hours: string
  minutes: string
  openTimePicker: string
  period: string
  placeholder: (period?: string) => string
  pm: string
  timePicker: string
}

export type TimePickerVariant = 'outline' | 'filled' | 'underline' | 'unstyled'
