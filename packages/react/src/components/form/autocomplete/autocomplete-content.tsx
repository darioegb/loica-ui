'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef, useEffect, useMemo, useState } from 'react'
import { Portal } from '../../../overlay'
import { joinClasses } from '../../../overlay/class-names'
import { hasPart } from '../../../overlay/has-part'
import { useFloatingPanel } from '../../../overlay/use-floating-panel'
import { mergeRefs } from '../../../overlay/trigger'
import type { ComponentProps } from '../../../theme'
import { SelectContentContext } from '../select/select-content-context'
import selectStyles from '../select/select.module.css'
import { useAutocompleteContext } from './autocomplete-context'
import { AutocompleteEmpty } from './autocomplete-empty'
import { AutocompleteList } from './autocomplete-list'
import { AutocompleteLoading } from './autocomplete-loading'

const CONTENT_PARTS = [AutocompleteEmpty, AutocompleteList, AutocompleteLoading]

type AutocompleteContentRootAttributes = Pick<
  HTMLAttributes<HTMLDivElement>,
  'aria-label' | 'children'
>

export type AutocompleteContentProps = Omit<ComponentProps, 'index'> &
  AutocompleteContentRootAttributes

/**
 * The panel with the suggestions. It is as wide as the field, scrolls when it is long and shows only
 * while there is something in it: an option that matches the text, the `AutocompleteLoading` of a
 * search in progress, or an `AutocompleteEmpty` you write. Given `children` that are not parts, they
 * are the options of an `AutocompleteList`; given `AutocompleteList`, `AutocompleteLoading` or
 * `AutocompleteEmpty` it renders them as written.
 * @since 1.5
 */
export const AutocompleteContent = forwardRef<HTMLDivElement, AutocompleteContentProps>(
  (
    { 'aria-label': ariaLabel, children, className, style }: AutocompleteContentProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): ReactNode => {
    const context = useAutocompleteContext('AutocompleteContent')
    const { anchor, close, flip, isStyled, offset, open, placement, shift } = context
    const { position, setPanel } = useFloatingPanel({
      anchor,
      enabled: open,
      flip,
      offset,
      onDismiss: (reason) => close(reason === 'escape'),
      ownsFocus: false,
      placement,
      shift,
    })
    const contentContext = useMemo(
      () => ({ ariaLabel, searchPlaceholder: undefined, setSearch: () => undefined }),
      [ariaLabel],
    )
    const [width, setWidth] = useState<number | undefined>(undefined)

    useEffect(() => {
      if (open && anchor) setWidth(anchor.getBoundingClientRect().width)
    }, [anchor, open])

    return (
      <Portal>
        <SelectContentContext.Provider value={contentContext}>
          <div
            className={joinClasses(isStyled && selectStyles.panel, className)}
            data-loica-autocomplete-content=""
            data-placement={position.placement}
            hidden={!open}
            ref={mergeRefs<HTMLDivElement>(setPanel, ref)}
            style={{
              ...position.style,
              minWidth: width,
              opacity: position.isPositioned ? undefined : 0,
              ...style,
            }}
          >
            {hasPart(children, CONTENT_PARTS) ? (
              children
            ) : (
              <>
                <AutocompleteLoading />
                <AutocompleteList>{children}</AutocompleteList>
              </>
            )}
          </div>
        </SelectContentContext.Provider>
      </Portal>
    )
  },
)

AutocompleteContent.displayName = 'AutocompleteContent'
