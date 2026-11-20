'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef, useMemo, useState } from 'react'
import { useLabels, useResolvedLocale } from '../../../locale/locale-provider'
import type { Placement } from '../../../overlay'
import { useOpenState } from '../../../overlay/use-open-state'
import type { ColorScheme, Size } from '../../../theme'
import { createDefaultLabels } from './tour-labels'
import { TourContent } from './tour-content'
import { TourNext } from './tour-next'
import { TourPanel } from './tour-panel'
import { TourPrevious } from './tour-previous'
import { TourProgress } from './tour-progress'
import { TourSession } from './tour-session'
import { TourSkip } from './tour-skip'
import { TourSpotlight } from './tour-spotlight'
import { TourTitle } from './tour-title'
import styles from './tour.module.css'
import type { TourCloseReason, TourLabels, TourStep, TourVariant } from './tour-types'

export type { TourCloseReason, TourLabels, TourStep, TourTarget, TourVariant } from './tour-types'

export interface TourOwnProps {
  /**
   * The parts of the tour, to compose it. Without children the tour renders a `TourSpotlight` and a `TourPanel` with the
   * title, the content, the progress and the buttons of the step.
   * @since 1.4
   */
  children?: ReactNode
  /**
   * Color scheme from the theme palette, custom schemes included. It colors the ring around the target and the button
   * that goes on.
   * @default 'primary'
   * @since 1.4
   */
  colorScheme?: ColorScheme
  /**
   * The step that shows first, for an uncontrolled tour. It is the one a closed tour comes back to.
   * @default 0
   * @since 1.4
   */
  defaultStep?: number
  /**
   * Whether the tour is open at first, for an uncontrolled tour.
   * @default false
   * @since 1.4
   */
  defaultOpen?: boolean
  /**
   * Called with the reason when the user closes the tour: `finish` on the last step, `skip` with the skip button and
   * `escape` with <kbd>Esc</kbd>. It is where an app remembers that the user saw the tour.
   * @since 1.4
   */
  onClose?: (reason: TourCloseReason) => void
  /**
   * Called with the new state when the tour opens or closes.
   * @since 1.4
   */
  onOpenChange?: (open: boolean) => void
  /**
   * Called with the index of the step the user goes to.
   * @since 1.4
   */
  onStepChange?: (step: number) => void
  /**
   * Whether the tour is open, for a controlled tour. Pair it with `onOpenChange` or `onClose`.
   * @since 1.4
   */
  open?: boolean
  /**
   * Where the panel opens, relative to the target, for the steps that don't set their own: a side, with an optional
   * alignment (`top-start`, `bottom-end`). It flips to the other side when there is no room.
   * @default 'bottom'
   * @since 1.4
   */
  placement?: Placement
  /**
   * Maximum width of the panel.
   * @default 'md'
   * @since 1.4
   */
  size?: Size
  /**
   * Space in pixels between the target and the edge of its spotlight.
   * @default 6
   * @since 1.4
   */
  spotlightPadding?: number
  /**
   * The index of the step that shows, for a controlled tour. Pair it with `onStepChange`.
   * @since 1.4
   */
  step?: number
  /**
   * The steps, in order. The tour shows nothing without any.
   * @since 1.4
   */
  steps: readonly TourStep[]
  /**
   * Visual variant. `elevated` floats the panel with a shadow and `outline` draws its border. `unstyled` drops the
   * Loica styles so you can bring your own, and the parts carry `data-loica-tour-*` attributes to select them.
   * @default 'elevated'
   * @since 1.4
   */
  variant?: TourVariant
}

export type TourProps = Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'title'> & TourOwnProps

const clamp = (value: number, max: number): number => Math.min(Math.max(value, 0), max)

/**
 * A guided tour: steps that point to an element of the page with a spotlight, a panel with the progress and the
 * buttons to go back, go on and skip. While it is open the rest of the page is blocked, as in a modal, except for the
 * target of a step that sets `interactive`. The focus moves to the panel on each step and goes back to where it was
 * when the tour closes. The tour renders nothing while it is closed, and `className` and `style` go to the element that
 * holds the spotlight and the panel. Its parts (`TourSpotlight`, `TourPanel`, `TourTitle`, `TourContent`,
 * `TourProgress`, `TourPrevious`, `TourNext` and `TourSkip`) can be composed in `children`.
 *
 * @since 1.4
 */
export const Tour = forwardRef<HTMLDivElement, TourProps>(
  (
    {
      children,
      colorScheme = 'primary',
      defaultOpen = false,
      defaultStep = 0,
      onClose,
      onOpenChange,
      onStepChange,
      open: openProp,
      placement = 'bottom',
      size = 'md',
      spotlightPadding = 6,
      step: stepProp,
      steps,
      variant = 'elevated',
      ...rest
    }: TourProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): ReactNode => {
    const locale = useResolvedLocale()
    const defaults = useMemo(() => createDefaultLabels(locale), [locale])
    const labels: TourLabels = useLabels('tour', defaults)
    const [open, setOpen] = useOpenState({ defaultOpen, onOpenChange, open: openProp })
    const [internalStep, setInternalStep] = useState(defaultStep)
    const isStepControlled = stepProp !== undefined
    const last = steps.length - 1
    const index = clamp(isStepControlled ? stepProp : internalStep, last)

    if (!open || steps.length === 0) return null

    const goTo = (next: number): void => {
      if (next === index) return
      if (!isStepControlled) setInternalStep(next)
      onStepChange?.(next)
    }
    const close = (reason: TourCloseReason): void => {
      setOpen(false)
      if (!isStepControlled) setInternalStep(defaultStep)
      onClose?.(reason)
    }

    return (
      <TourSession
        {...rest}
        colorScheme={colorScheme}
        index={index}
        isLast={index === last}
        labels={labels}
        onClose={close}
        onNext={() => (index === last ? close('finish') : goTo(index + 1))}
        onPrevious={() => goTo(index - 1)}
        placement={placement}
        ref={ref}
        size={size}
        spotlightPadding={spotlightPadding}
        steps={steps}
        variant={variant}
      >
        {children ?? (
          <>
            <TourSpotlight />
            <TourPanel>
              <TourTitle />
              <TourContent />
              <div className={variant === 'unstyled' ? undefined : styles.footer}>
                <TourProgress />
                <div className={variant === 'unstyled' ? undefined : styles.actions}>
                  <TourSkip />
                  <TourPrevious />
                  <TourNext />
                </div>
              </div>
            </TourPanel>
          </>
        )}
      </TourSession>
    )
  },
)

Tour.displayName = 'Tour'
