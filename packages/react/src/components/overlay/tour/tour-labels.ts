import { createCountFormatter } from '../../../overlay/format-count'
import type { TourLabels } from './tour-types'

export const createDefaultLabels = (locale: string): TourLabels => {
  const format = createCountFormatter(locale)
  return {
    done: 'Done',
    next: 'Next',
    previous: 'Previous',
    progress: (current, total) => `Step ${format(current)} of ${format(total)}`,
    skip: 'Skip',
  }
}
