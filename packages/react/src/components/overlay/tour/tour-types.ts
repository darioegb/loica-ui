import type { ReactNode, RefObject } from 'react'
import type { Placement } from '../../../overlay'

export type TourVariant = 'elevated' | 'outline' | 'unstyled'

export type TourTarget = string | HTMLElement | RefObject<HTMLElement | null>

export type TourCloseReason = 'escape' | 'finish' | 'skip'

/**
 * One step of the tour: the element it points to and what it says.
 *
 * @since 1.4
 */
export interface TourStep {
  /** The text of the step, under its title. */
  content?: ReactNode
  /**
   * Lets the user press, type in and tab to the element the step points to, instead of blocking it with the rest of
   * the page. It does not apply to a step with no target.
   * @default false
   */
  interactive?: boolean
  /** Where the step opens, relative to its target. It takes the `placement` of the `Tour` when it is not set. */
  placement?: Placement
  /**
   * The element the step points to: a CSS selector, an element or a ref. A step with no target, or whose selector
   * matches nothing, shows centered with no spotlight. The element has to be in the page when the step shows.
   */
  target?: TourTarget | null
  /** The name of the step, which names the dialog. */
  title: ReactNode
}

/**
 * Every text the component shows: the buttons, and the progress (`progress`), which gets the number of the step and the
 * total.
 *
 * @since 1.4
 */
export interface TourLabels {
  done: string
  next: string
  previous: string
  progress: (current: number, total: number) => string
  skip: string
}
