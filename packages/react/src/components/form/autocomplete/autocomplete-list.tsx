'use client'

import type { ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import { SelectList, type SelectListProps } from '../select/select-list'
import { useAutocompleteContext } from './autocomplete-context'

export type AutocompleteListProps = SelectListProps

/**
 * The listbox that holds the options. It is the `SelectList`, so it carries its `data-loica-select-list`
 * attribute.
 * @since 1.5
 */
export const AutocompleteList = forwardRef<HTMLDivElement, AutocompleteListProps>(
  (props: AutocompleteListProps, ref: ForwardedRef<HTMLDivElement>): ReactNode => {
    useAutocompleteContext('AutocompleteList')
    return <SelectList {...props} ref={ref} />
  },
)

AutocompleteList.displayName = 'AutocompleteList'
