'use client'

import type { CSSProperties, ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { useTourContext } from './tour-context'
import styles from './tour.module.css'
import type { TargetRect } from './use-target-rect'

export type TourSpotlightProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'>

const holeOf = ({ height, left, top, width }: TargetRect): string => {
  const right = left + width
  const bottom = top + height
  return `polygon(0 0, 0 100%, ${left}px 100%, ${left}px ${top}px, ${right}px ${top}px, ${right}px ${bottom}px, ${left}px ${bottom}px, ${left}px 100%, 100% 100%, 100% 0)`
}

/**
 * The layer over the page. It blocks it, dims it and cuts a hole around the target, which gets a ring; a step with
 * no target dims all the page. It is the element with `data-loica-tour-spotlight`, and `className` and `style` go to
 * the ring, and the layer that blocks is `data-loica-tour-blocker`.
 * @since 1.4
 */
export const TourSpotlight = forwardRef<HTMLDivElement, TourSpotlightProps>(
  (
    { className, style, ...rest }: TourSpotlightProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): ReactNode => {
    const { interactive, isStyled, rect } = useTourContext('TourSpotlight')
    const blockerStyle: CSSProperties | undefined =
      rect && interactive ? { clipPath: holeOf(rect) } : undefined

    return (
      <>
        <div
          className={joinClasses(isStyled && styles.blocker, isStyled && !rect && styles.dim)}
          data-loica-tour-blocker=""
          style={blockerStyle}
        />
        {rect ? (
          <div
            {...rest}
            className={joinClasses(isStyled && styles.spotlight, className)}
            data-loica-tour-spotlight=""
            ref={ref}
            style={{
              height: rect.height,
              left: rect.left,
              top: rect.top,
              width: rect.width,
              ...style,
            }}
          />
        ) : null}
      </>
    )
  },
)

TourSpotlight.displayName = 'TourSpotlight'
