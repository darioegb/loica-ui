'use client'

import type { CSSProperties, ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef, useEffect } from 'react'
import { useFocusTrap } from '../../../overlay'
import { joinClasses } from '../../../overlay/class-names'
import { mergeRefs } from '../../../overlay/trigger'
import { useFloatingPanel } from '../../../overlay/use-floating-panel'
import { useTourContext } from './tour-context'
import styles from './tour.module.css'

const centeredStyle: CSSProperties = {
  height: 'fit-content',
  inset: 0,
  margin: 'auto',
  position: 'fixed',
  width: 'fit-content',
}

export type TourPanelProps = Omit<HTMLAttributes<HTMLDialogElement>, 'title'>

/**
 * The panel of the step, a `dialog` named by the `TourTitle`. It sits next to the target and flips or shifts to stay
 * inside the screen, and a step with no target shows it centered. The focus moves to it on every step, and <kbd>Esc</kbd>
 * closes the tour. The focus stays inside, except on a step that is `interactive`.
 * @since 1.4
 */
export const TourPanel = forwardRef<HTMLDialogElement, TourPanelProps>(
  (
    { children, className, style, ...rest }: TourPanelProps,
    ref: ForwardedRef<HTMLDialogElement>,
  ): ReactNode => {
    const {
      baseId,
      index,
      interactive,
      isStyled,
      onClose,
      placement,
      size,
      spotlightPadding,
      step,
      target,
      variant,
    } = useTourContext('TourPanel')
    const { isTopmost, panel, position, setPanel } = useFloatingPanel({
      anchor: target,
      enabled: true,
      offset: spotlightPadding + 8,
      onDismiss: (reason) => {
        if (reason === 'escape') onClose('escape')
      },
      placement: step.placement ?? placement,
    })
    const centered = target === null

    useFocusTrap(panel, {
      active: true,
      initialFocus: panel,
      isTopmost,
      restoreFocus: false,
      trap: !interactive,
    })

    useEffect(() => {
      panel?.focus({ preventScroll: true })
    }, [index, panel])

    return (
      <dialog
        aria-describedby={step.content ? `${baseId}-content` : undefined}
        aria-labelledby={`${baseId}-title`}
        aria-modal={interactive ? undefined : true}
        {...rest}
        className={joinClasses(
          isStyled && styles.panel,
          isStyled && styles[size],
          isStyled && styles[variant],
          className,
        )}
        data-centered={centered ? '' : undefined}
        data-loica-dialog=""
        data-loica-tour-panel=""
        data-placement={centered ? undefined : position.placement}
        open
        ref={mergeRefs<HTMLDialogElement>(setPanel, ref)}
        style={{
          ...(centered ? centeredStyle : position.style),
          opacity: centered || position.isPositioned ? undefined : 0,
          ...style,
        }}
        tabIndex={-1}
      >
        {children}
      </dialog>
    )
  },
)

TourPanel.displayName = 'TourPanel'
