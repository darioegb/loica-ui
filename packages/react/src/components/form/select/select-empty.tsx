'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { useSelectContext } from './select-context'
import { matchesQuery } from './select-match'
import styles from './select.module.css'

type SelectEmptyRootAttributes = Pick<HTMLAttributes<HTMLDivElement>, 'children'>

export type SelectEmptyProps = Omit<ComponentProps, 'index'> & SelectEmptyRootAttributes

/**
 * The message when the search finds nothing, and the select is not `loading`. Its `children` replace the `select.empty` text of the `LocaleProvider`. It is
 * always in the page, as a live region, so a screen reader announces the message when it appears.
 */
export const SelectEmpty = forwardRef<HTMLDivElement, SelectEmptyProps>(
  (
    { children, className, style }: SelectEmptyProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): ReactNode => {
    const { filter, isStyled, labels, loading, locale, options, query } =
      useSelectContext('SelectEmpty')
    const hasMatches = options.some((option) => matchesQuery(option.label, query, locale, filter))
    const isEmpty = Boolean(query) && !hasMatches && !loading

    return (
      <div
        className={joinClasses(isStyled && isEmpty && styles.empty, className)}
        data-loica-select-empty=""
        ref={ref}
        role="status"
        style={style}
      >
        {isEmpty ? (children ?? labels.empty) : null}
      </div>
    )
  },
)

SelectEmpty.displayName = 'SelectEmpty'
