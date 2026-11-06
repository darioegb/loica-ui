import type { AvatarGroupLabels, AvatarLabels } from '../components/presentation/avatar'
import type { BreadcrumbLabels } from '../components/navigation/breadcrumb'
import type { CarouselLabels } from '../components/utility/carousel'
import type { ChipLabels } from '../components/presentation/chip'
import type { DatePickerLabels } from '../components/form/datepicker'
import type { FileUploadLabels } from '../components/utility/fileupload'
import type { InputLabels } from '../components/form/input'
import type { NumberInputLabels } from '../components/form/numberinput'
import type { PaginatorLabels } from '../components/interaction/paginator'
import type { PinInputLabels } from '../components/form/pininput'
import type { RatingLabels } from '../components/form/rating'
import type { SelectLabels } from '../components/form/select'
import type { SliderLabels } from '../components/form/slider'
import type { StepperLabels } from '../components/navigation/stepper'
import type { TextareaLabels } from '../components/form/textarea'
import type { TimePickerLabels } from '../components/form/timepicker'
import type { ToastLabels } from '../components/overlay/toast'

export interface SingleLabel {
  label: string
}

export interface MessageMap {
  avatar: AvatarLabels
  avatarGroup: Pick<AvatarGroupLabels, 'overflow'>
  breadcrumb: BreadcrumbLabels
  carousel: CarouselLabels
  chip: ChipLabels
  close: SingleLabel
  datePicker: DatePickerLabels
  fileUpload: FileUploadLabels
  input: InputLabels
  loader: SingleLabel
  navbarToggle: SingleLabel
  numberInput: NumberInputLabels
  paginator: PaginatorLabels
  pinInput: PinInputLabels
  rating: RatingLabels
  select: SelectLabels
  sidebarToggle: SingleLabel
  slider: SliderLabels
  stepper: StepperLabels
  textarea: TextareaLabels
  timePicker: TimePickerLabels
  toast: ToastLabels
}

export type LoicaMessages = { [K in keyof MessageMap]?: Partial<MessageMap[K]> }
