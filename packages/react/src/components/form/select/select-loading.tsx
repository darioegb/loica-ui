'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { Loader } from '../../presentation/loader'
import { useSelectContext } from './select-context'
import styles from './select.module.css'

export interface SelectLoadingOwnProps {
  /**
   * The accessible name of the `Loader`. It defaults to the `loader` text of the `LocaleProvider`,
   * or `Loading`.
   * @since 1.4
   */
  label?: string
}

type SelectLoadingRootAttributes = Pick<HTMLAttributes<HTMLDivElement>, 'children'>

export type SelectLoadingProps = Omit<ComponentProps, 'index'> &
  SelectLoadingRootAttributes &
  SelectLoadingOwnProps

/**
 * The `Loader` of the list, only while the `Select` is `loading`. Its `children` replace the loader.
 * @since 1.4
 */
export const SelectLoading = forwardRef<HTMLDivElement, SelectLoadingProps>(
  (
    { children, className, label, style }: SelectLoadingProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): ReactNode => {
    const { isStyled, loading } = useSelectContext('SelectLoading')
    if (!loading) return null

    return (
      <div
        className={joinClasses(isStyled && styles.loading, className)}
        data-loica-select-loading=""
        ref={ref}
        style={style}
      >
        {children ?? (
          <Loader colorScheme="primary" label={label} size="sm" variant={isStyled ? 'spinner' : 'unstyled'} />
        )}
      </div>
    )
  },
)

SelectLoading.displayName = 'SelectLoading'
