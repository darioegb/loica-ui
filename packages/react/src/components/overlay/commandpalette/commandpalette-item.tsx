'use client'

import type { ComponentPropsWithoutRef, ForwardedRef, KeyboardEvent, ReactNode } from 'react'
import { forwardRef, useId } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { Kbd } from '../../presentation/kbd'
import { nodeText } from './commandpalette-filter'
import { useCommandPaletteContext } from './commandpalette-context'
import styles from './commandpalette.module.css'

export interface CommandPaletteItemOwnProps {
  /**
   * Disables the item: it is shown but it can't be picked, and the arrow keys skip it.
   *
   * @since 1.3
   * @default false
   */
  disabled?: boolean
  /**
   * What the item shows before its text, such as an SVG. It is hidden from assistive technology.
   *
   * @since 1.3
   */
  icon?: ReactNode
  /**
   * Other words that find the item, which are not shown: `['go', 'dashboard']` for "Home".
   *
   * @since 1.3
   */
  keywords?: string[]
  /**
   * Called when the user picks the item, with a click or with <kbd>Enter</kbd>. The palette closes after it, unless
   * it has `closeOnSelect={false}`.
   *
   * @since 1.3
   */
  onSelect?: () => void
  /**
   * The keys that run the same command elsewhere, shown at the end of the item as one `Kbd` each: `'Ctrl K'` or
   * `['Ctrl', 'K']`. The palette only shows them, it doesn't listen to them.
   *
   * @since 1.3
   */
  shortcut?: string | string[]
  /**
   * The text that the search matches, when the `children` are not only text. By default it is the text of the
   * `children`.
   *
   * @since 1.3
   */
  value?: string
}

export type CommandPaletteItemProps = Omit<
  ComponentPropsWithoutRef<'div'>,
  'onSelect' | 'role'
> &
  CommandPaletteItemOwnProps

const keysOf = (shortcut: string | string[]): string[] =>
  Array.isArray(shortcut) ? shortcut : shortcut.split(/\s+/).filter(Boolean)

/**
 * A command of the palette: what the user searches for and picks. Its `children` are its text, and `onSelect` runs
 * when it is picked.
 *
 * @since 1.3
 */
export const CommandPaletteItem = forwardRef<HTMLDivElement, CommandPaletteItemProps>(
  (
    {
      children,
      className,
      disabled = false,
      icon,
      keywords = [],
      onClick,
      onKeyDown,
      onMouseDown,
      onPointerMove,
      onSelect,
      shortcut,
      value,
      ...rest
    }: CommandPaletteItemProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    const { activeId, isStyled, matches, select, setActiveId } =
      useCommandPaletteContext('CommandPaletteItem')
    const id = useId()
    const visible = matches(value ?? nodeText(children), keywords)
    const keys = shortcut ? keysOf(shortcut) : []

    return (
      <div
        aria-disabled={disabled || undefined}
        aria-selected={activeId === id}
        className={joinClasses(isStyled && styles.item, className)}
        data-active={activeId === id ? '' : undefined}
        data-disabled={disabled ? '' : undefined}
        data-loica-commandpalette-item=""
        hidden={!visible}
        id={id}
        onClick={(event) => {
          onClick?.(event)
          if (!disabled && !event.defaultPrevented) select(onSelect)
        }}
        onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
          onKeyDown?.(event)
          if (event.target === event.currentTarget && (event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault()
            event.currentTarget.click()
          }
        }}
        onMouseDown={(event) => {
          onMouseDown?.(event)
          event.preventDefault()
        }}
        onPointerMove={(event) => {
          onPointerMove?.(event)
          if (!disabled && activeId !== id) setActiveId(id)
        }}
        ref={ref}
        role="option"
        tabIndex={-1}
        {...rest}
      >
        {icon ? (
          <span aria-hidden="true" data-loica-commandpalette-icon="">
            {icon}
          </span>
        ) : null}
        <span data-loica-commandpalette-label="">{children}</span>
        {keys.length > 0 ? (
          <span data-loica-commandpalette-shortcut="">
            {keys.map((key) => (
              <Kbd key={key} size="sm">
                {key}
              </Kbd>
            ))}
          </span>
        ) : null}
      </div>
    )
  },
)

CommandPaletteItem.displayName = 'CommandPaletteItem'
