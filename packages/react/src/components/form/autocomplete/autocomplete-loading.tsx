'use client'

import type { ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import { SelectLoading, type SelectLoadingProps } from '../select/select-loading'
import { useAutocompleteContext } from './autocomplete-context'

export type AutocompleteLoadingProps = SelectLoadingProps

/**
 * The `Loader` of the list, only while the `Autocomplete` is `loading`. Its `children` replace the
 * loader. It is the `SelectLoading`, so it carries its `data-loica-select-loading` attribute.
 * @since 1.5
 */
export const AutocompleteLoading = forwardRef<HTMLDivElement, AutocompleteLoadingProps>(
  (props: AutocompleteLoadingProps, ref: ForwardedRef<HTMLDivElement>): ReactNode => {
    useAutocompleteContext('AutocompleteLoading')
    return <SelectLoading {...props} ref={ref} />
  },
)

AutocompleteLoading.displayName = 'AutocompleteLoading'
