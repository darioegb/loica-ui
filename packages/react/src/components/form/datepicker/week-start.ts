import type { WeekDay } from '../../../utils/dates'
import type { WeekStartsOn } from './datepicker-types'

const DEFAULT_WEEK_START: WeekDay = 1

const SUNDAY_REGIONS = new Set(
  'AG AS BD BR BS BT BW BZ CA CO DM DO ET GT GU HK HN ID IL IN IS JM JP KE KH KR LA MH MM MO MT MX MZ NI NP PA PE PH PK PR PT PY SA SG SV TH TT TW UM US VE VI WS YE ZA ZW'.split(
    ' ',
  ),
)
const SATURDAY_REGIONS = new Set('AF BH DJ DZ EG IQ IR JO KW LY OM QA SD SY'.split(' '))

interface WeekInfo {
  firstDay: number
}

type LocaleWithWeekInfo = Intl.Locale & { getWeekInfo?: () => WeekInfo; weekInfo?: WeekInfo }

export function firstDayOfRegion(region: string | undefined): WeekDay {
  if (region === 'MV') return 5
  if (region && SATURDAY_REGIONS.has(region)) return 6
  if (region && SUNDAY_REGIONS.has(region)) return 0
  return DEFAULT_WEEK_START
}

export function firstDayOfLocale(language: string): WeekDay {
  const locale = new Intl.Locale(language) as LocaleWithWeekInfo
  const info = locale.getWeekInfo?.() ?? locale.weekInfo
  if (info) return (info.firstDay % 7) as WeekDay
  return firstDayOfRegion(locale.maximize().region)
}

export function resolveWeekStart(weekStartsOn: WeekStartsOn | undefined, language: string): WeekDay {
  if (weekStartsOn === undefined) return DEFAULT_WEEK_START
  return weekStartsOn === 'locale' ? firstDayOfLocale(language) : weekStartsOn
}
