'use client'

import type { CSSProperties, ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef, useEffect, useState } from 'react'
import { useFocusTrap } from '../../../overlay'
import { joinClasses } from '../../../overlay/class-names'
import { mergeRefs } from '../../../overlay/trigger'
import { useFloatingPanel } from '../../../overlay/use-floating-panel'
import { useIsomorphicLayoutEffect } from '../../../overlay/use-isomorphic-layout-effect'
import { useTourContext } from './tour-context'
import styles from './tour.module.css'

const centeredStyle: CSSProperties = {
  height: 'fit-content',
  inset: 0,
  margin: 'auto',
  position: 'fixed',
  width: 'fit-content',
}

const dockedStyle: CSSProperties = {
  bottom: 'calc(var(--loica-space-2) + env(safe-area-inset-bottom, 0px))',
  left: 0,
  margin: '0 auto',
  position: 'fixed',
  right: 0,
  top: 'auto',
}

export type TourPanelProps = Omit<HTMLAttributes<HTMLDialogElement>, 'title'>

/**
 * The panel of the step, a `dialog` named by the `TourTitle`. It sits next to the target and flips or shifts to stay
 * inside the screen, and a step with no target shows it centered. When the target is so large that the panel would leave
 * the screen or cover it, as on a phone, the panel docks at the bottom of the screen. The focus moves to it on every step, and <kbd>Esc</kbd>
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
      rect,
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
    const [docked, setDocked] = useState(false)

    useIsomorphicLayoutEffect(() => {
      if (!panel || !rect || !position.isPositioned) {
        setDocked(false)
        return
      }
      const { clientHeight, clientWidth } = document.documentElement
      const top = Number(position.style.top)
      const left = Number(position.style.left)
      const right = left + panel.offsetWidth
      const bottom = top + panel.scrollHeight
      const inside =
        top >= 0 &&
        left >= 0 &&
        bottom <= (clientHeight || window.innerHeight) &&
        right <= (clientWidth || window.innerWidth)
      const covers =
        left < rect.left + rect.width - 1 &&
        right > rect.left + 1 &&
        top < rect.top + rect.height - 1 &&
        bottom > rect.top + 1
      setDocked(!inside || covers)
    }, [panel, position.isPositioned, position.style.left, position.style.top, rect])

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

    let layout = position.style
    if (docked) layout = dockedStyle
    if (centered) layout = centeredStyle

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
        data-docked={docked ? '' : undefined}
        data-loica-dialog=""
        data-loica-tour-panel=""
        data-placement={centered || docked ? undefined : position.placement}
        open
        ref={mergeRefs<HTMLDialogElement>(setPanel, ref)}
        style={{
          ...layout,
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
