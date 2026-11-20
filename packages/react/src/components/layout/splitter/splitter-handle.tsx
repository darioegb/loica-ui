'use client'

import type {
  ComponentPropsWithoutRef,
  ForwardedRef,
  KeyboardEvent,
  MouseEvent,
  PointerEvent,
} from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { logicalKey } from '../../../overlay/direction'
import { useSplitterContext, useSplitterIndex } from './splitter-context'
import styles from './splitter.module.css'

export interface SplitterHandleOwnProps {
  /**
   * Stops the handle from resizing, with the pointer and with the keyboard.
   *
   * @default false
   * @since 1.4
   */
  disabled?: boolean
}

export type SplitterHandleProps = Omit<ComponentPropsWithoutRef<'div'>, keyof SplitterHandleOwnProps> &
  SplitterHandleOwnProps

/**
 * The handle between two panels, a window splitter of WAI-ARIA: a `separator` that can take the focus and reports the
 * size of the panel before it. Drag it, or use the arrow keys, <kbd>Home</kbd>, <kbd>End</kbd> and <kbd>Enter</kbd>.
 * Write one between two panels to change it; where there is none, the `Splitter` adds one.
 * @since 1.4
 */
export const SplitterHandle = forwardRef<HTMLDivElement, SplitterHandleProps>(
  (
    {
      className,
      disabled = false,
      onDoubleClick,
      onKeyDown,
      onLostPointerCapture,
      onPointerCancel,
      onPointerDown,
      onPointerMove,
      onPointerUp,
      ...rest
    }: SplitterHandleProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    const context = useSplitterContext('SplitterHandle')
    const index = useSplitterIndex('SplitterHandle')
    const { count, dragging, orientation, variant } = context
    const horizontal = orientation === 'horizontal'
    const bounds = context.bounds(index)
    const active = dragging === index

    const handlePointerDown = (event: PointerEvent<HTMLDivElement>): void => {
      onPointerDown?.(event)
      if (event.defaultPrevented || disabled || event.button !== 0) return
      event.currentTarget.setPointerCapture?.(event.pointerId)
      context.pointerStart(index, horizontal ? event.clientX : event.clientY)
    }

    const handlePointerMove = (event: PointerEvent<HTMLDivElement>): void => {
      onPointerMove?.(event)
      if (active) context.pointerMove(horizontal ? event.clientX : event.clientY)
    }

    const release = (event: PointerEvent<HTMLDivElement>): void => {
      if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId)
      }
      context.pointerEnd()
    }

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
      onKeyDown?.(event)
      if (event.defaultPrevented || disabled) return
      const key = logicalKey(event.key, event.currentTarget)
      const forward = horizontal ? 'ArrowRight' : 'ArrowDown'
      const backward = horizontal ? 'ArrowLeft' : 'ArrowUp'
      if (key === forward) context.moveBy(index, context.step)
      else if (key === backward) context.moveBy(index, -context.step)
      else if (event.key === 'Home') context.jump(index, 'start')
      else if (event.key === 'End') context.jump(index, 'end')
      else if (event.key === 'Enter') context.toggle(index)
      else return
      event.preventDefault()
    }

    const handleDoubleClick = (event: MouseEvent<HTMLDivElement>): void => {
      onDoubleClick?.(event)
      if (!event.defaultPrevented && !disabled) context.toggle(index)
    }

    return (
      // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- a separator that takes the focus is the window splitter of WAI-ARIA, and it is the interactive one
      <div
        aria-controls={context.panelIds[index]}
        aria-disabled={disabled || undefined}
        aria-label={context.labels.resize(index + 1, count - 1)}
        aria-orientation={horizontal ? 'vertical' : 'horizontal'}
        aria-valuemax={Math.round(bounds.highest)}
        aria-valuemin={Math.round(bounds.lowest)}
        aria-valuenow={Math.round(context.sizes[index])}
        role="separator"
        tabIndex={disabled ? undefined : 0}
        {...rest}
        className={joinClasses(
          context.isStyled && styles.handle,
          context.isStyled && styles[variant],
          className,
        )}
        data-disabled={disabled ? '' : undefined}
        data-dragging={active ? '' : undefined}
        data-loica-splitter-handle=""
        data-orientation={orientation}
        onDoubleClick={handleDoubleClick}
        onKeyDown={handleKeyDown}
        onLostPointerCapture={(event) => {
          onLostPointerCapture?.(event)
          context.pointerEnd()
        }}
        onPointerCancel={(event) => {
          onPointerCancel?.(event)
          release(event)
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={(event) => {
          onPointerUp?.(event)
          release(event)
        }}
        ref={ref}
      />
    )
  },
)

SplitterHandle.displayName = 'SplitterHandle'
