'use client'

import type { CSSProperties, ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef, useEffect, useId, useMemo, useState } from 'react'
import { Portal, useScrollLock } from '../../../overlay'
import { joinClasses } from '../../../overlay/class-names'
import { useIsomorphicLayoutEffect } from '../../../overlay/use-isomorphic-layout-effect'
import { schemeVar } from '../../../theme'
import { TourContext, type TourContextProps } from './tour-context'
import type { TourTarget } from './tour-types'
import styles from './tour.module.css'
import { useTargetRect } from './use-target-rect'

const resolveTarget = (target: TourTarget | null | undefined): HTMLElement | null => {
  if (!target) return null
  if (typeof target === 'string') {
    try {
      return document.querySelector<HTMLElement>(target)
    } catch {
      return null
    }
  }
  return 'current' in target ? target.current : target
}

type TourSessionContext = Omit<TourContextProps, 'baseId' | 'interactive' | 'isStyled' | 'rect' | 'step' | 'target'>

export interface TourSessionProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>, TourSessionContext {}

export const TourSession = forwardRef<HTMLDivElement, TourSessionProps>(
  (
    {
      children,
      className,
      colorScheme,
      index,
      isLast,
      labels,
      onClose,
      onNext,
      onPrevious,
      placement,
      size,
      spotlightPadding,
      steps,
      style,
      variant,
      ...rest
    }: TourSessionProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): ReactNode => {
    const step = steps[index]
    const baseId = useId()
    const isStyled = variant !== 'unstyled'
    const [target, setTarget] = useState<HTMLElement | null>(null)
    const interactive = step.interactive === true && target !== null
    const rect = useTargetRect(target, spotlightPadding)

    useIsomorphicLayoutEffect(() => {
      setTarget(resolveTarget(step.target))
    }, [step.target])

    useEffect(() => {
      const opener = document.activeElement as HTMLElement | null
      return () => {
        if (opener?.isConnected) opener.focus()
      }
    }, [])

    useEffect(() => {
      if (!target || typeof target.scrollIntoView !== 'function') return
      const reduced =
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const taller = target.getBoundingClientRect().height > window.innerHeight
      target.scrollIntoView({
        behavior: reduced ? 'auto' : 'smooth',
        block: taller ? 'start' : 'center',
        inline: 'nearest',
      })
    }, [target])

    useScrollLock(!interactive)

    const context = useMemo<TourContextProps>(
      () => ({
        baseId,
        colorScheme,
        index,
        interactive,
        isLast,
        isStyled,
        labels,
        onClose,
        onNext,
        onPrevious,
        placement,
        rect,
        size,
        spotlightPadding,
        step,
        steps,
        target,
        variant,
      }),
      [
        baseId,
        colorScheme,
        index,
        interactive,
        isLast,
        isStyled,
        labels,
        onClose,
        onNext,
        onPrevious,
        placement,
        rect,
        size,
        spotlightPadding,
        step,
        steps,
        target,
        variant,
      ],
    )

    return (
      <Portal>
        <TourContext.Provider value={context}>
          <div
            {...rest}
            className={joinClasses(isStyled && styles.tour, className)}
            data-loica-tour=""
            ref={ref}
            style={{ '--tour-solid': schemeVar(colorScheme, 'solid'), ...style } as CSSProperties}
          >
            {children}
          </div>
        </TourContext.Provider>
      </Portal>
    )
  },
)

TourSession.displayName = 'TourSession'
