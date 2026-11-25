'use client'

import type { ForwardedRef, ReactNode } from 'react'
import { forwardRef, useEffect } from 'react'
import { SelectEmpty, type SelectEmptyProps } from '../select/select-empty'
import { useAutocompleteContext } from './autocomplete-context'

export type AutocompleteEmptyProps = SelectEmptyProps

/**
 * The message when no option matches the text, and the `Autocomplete` is not `loading`. Its `children`
 * replace the `select.empty` text of the `LocaleProvider`. The panel stays closed when nothing
 * matches unless this part is in it, so write it for a search on a server, where "no results" is an answer.
 * It is the `SelectEmpty`, so it carries its `data-loica-select-empty` attribute.
 * @since 1.5
 */
export const AutocompleteEmpty = forwardRef<HTMLDivElement, AutocompleteEmptyProps>(
  (props: AutocompleteEmptyProps, ref: ForwardedRef<HTMLDivElement>): ReactNode => {
    const { setEmptyShown } = useAutocompleteContext('AutocompleteEmpty')

    useEffect(() => {
      setEmptyShown(true)
      return () => setEmptyShown(false)
    }, [setEmptyShown])

    return <SelectEmpty {...props} ref={ref} />
  },
)

AutocompleteEmpty.displayName = 'AutocompleteEmpty'
