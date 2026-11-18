'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef, useMemo } from 'react'
import { useLabels, useResolvedLocale } from '../../../locale/locale-provider'
import { createCountFormatter } from '../../../overlay/format-count'
import { joinClasses } from '../../../overlay/class-names'
import type { Size } from '../../../theme'
import { Modal, ModalBackdrop, ModalContent } from '../modal'
import { CommandPaletteBody } from './commandpalette-body'
import type {
  CommandPaletteFilter,
  CommandPaletteLabels,
  CommandPaletteVariant,
} from './commandpalette-types'
import styles from './commandpalette.module.css'

export type { CommandPaletteFilter, CommandPaletteLabels, CommandPaletteVariant }

export interface CommandPaletteOwnProps {
  /**
   * A class for the layer behind the dialog, which covers the screen and positions the dialog. Use it with
   * `variant="unstyled"` to give it a color and to say where the dialog goes, since the layer only covers the screen
   * and centers the dialog.
   *
   * @since 1.3
   */
  backdropClassName?: string
  /** The `CommandPaletteItem`, alone or inside `CommandPaletteGroup`, that the user can search and pick. */
  children?: ReactNode
  /**
   * Whether <kbd>Esc</kbd> closes the palette.
   *
   * @since 1.3
   * @default true
   */
  closeOnEscape?: boolean
  /**
   * Whether a click outside the palette closes it.
   *
   * @since 1.3
   * @default true
   */
  closeOnOutside?: boolean
  /**
   * Whether the palette closes after the user picks an item.
   *
   * @since 1.3
   * @default true
   */
  closeOnSelect?: boolean
  /**
   * Whether the palette is open at first, for an uncontrolled palette.
   *
   * @since 1.3
   * @default false
   */
  defaultOpen?: boolean
  /**
   * How an item is matched by the search: a function that gets the text of the item, the query and the keywords of the
   * item, and returns whether it is shown. By default every word of the query has to be in the text or in a keyword,
   * ignoring the case and the accents. `false` shows every item, for results that you filter yourself (a request).
   *
   * @since 1.3
   */
  filter?: CommandPaletteFilter | false
  /**
   * Called with the new state when the palette opens or closes.
   *
   * @since 1.3
   */
  onOpenChange?: (open: boolean) => void
  /**
   * Called with the text of the search when the user types.
   *
   * @since 1.3
   */
  onQueryChange?: (query: string) => void
  /**
   * Whether the palette is open, for a controlled palette. Pair it with `onOpenChange`. The library doesn't listen to
   * the shortcut that opens it: bind <kbd>Ctrl</kbd> + <kbd>K</kbd> in your app and set this.
   *
   * @since 1.3
   */
  open?: boolean
  /**
   * The hint of the search box, which also names it. Without it, the `commandPalette.placeholder` text of the
   * `LocaleProvider`.
   *
   * @since 1.3
   */
  placeholder?: string
  /**
   * The text of the search, for a controlled one. Pair it with `onQueryChange`.
   *
   * @since 1.3
   */
  query?: string
  /**
   * Maximum width of the dialog.
   *
   * @since 1.3
   * @default 'md'
   */
  size?: Size
  /**
   * Visual variant. `default` has the backdrop, the surface and the spacing. `unstyled` drops the Loica styles so you
   * can bring your own.
   *
   * @since 1.3
   * @default 'default'
   */
  variant?: CommandPaletteVariant
}

export type CommandPaletteProps = Pick<
  HTMLAttributes<HTMLDialogElement>,
  'aria-describedby' | 'aria-label' | 'aria-labelledby' | 'className' | 'style'
> &
  CommandPaletteOwnProps

const createDefaultLabels = (locale: string): CommandPaletteLabels => {
  const format = createCountFormatter(locale)
  return {
    empty: 'No results',
    label: 'Command palette',
    placeholder: 'Type a command or search',
    results: (count) => (count === 1 ? '1 result' : `${format(count)} results`),
  }
}

/**
 * A dialog to search and run commands, opened with a shortcut such as <kbd>Ctrl</kbd> + <kbd>K</kbd>. It is a
 * `Modal` with a search box and a list: the user types, the items that match are left, the arrow keys move between
 * them and <kbd>Enter</kbd> picks one. Write the `CommandPaletteItem` of each command, with its `onSelect`, alone or
 * in a `CommandPaletteGroup`.
 *
 * @since 1.3
 */
export const CommandPalette = forwardRef<HTMLDialogElement, CommandPaletteProps>(
  (
    {
      backdropClassName,
      children,
      className,
      closeOnEscape = true,
      closeOnOutside = true,
      closeOnSelect = true,
      defaultOpen = false,
      filter,
      onOpenChange,
      onQueryChange,
      open,
      placeholder,
      query,
      size = 'md',
      variant = 'default',
      ...rest
    }: CommandPaletteProps,
    ref: ForwardedRef<HTMLDialogElement>,
  ) => {
    const locale = useResolvedLocale()
    const defaults = useMemo(() => createDefaultLabels(locale), [locale])
    const labels = useLabels('commandPalette', defaults)
    const isStyled = variant !== 'unstyled'

    return (
      <Modal
        closeOnEscape={closeOnEscape}
        closeOnOutside={closeOnOutside}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        open={open}
        size={size}
        variant={variant}
      >
        <ModalBackdrop className={backdropClassName}>
          <ModalContent
            {...rest}
            aria-label={rest['aria-label'] ?? labels.label}
            className={joinClasses(isStyled && styles.palette, className)}
            data-loica-commandpalette=""
            ref={ref}
          >
            <CommandPaletteBody
              closeOnSelect={closeOnSelect}
              filter={filter}
              labels={labels}
              onQueryChange={onQueryChange}
              placeholder={placeholder}
              query={query}
            >
              {children}
            </CommandPaletteBody>
          </ModalContent>
        </ModalBackdrop>
      </Modal>
    )
  },
)

CommandPalette.displayName = 'CommandPalette'
