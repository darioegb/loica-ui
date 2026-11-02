'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { Loader } from '../../presentation/loader'
import styles from './table.module.css'
import { useTableContext } from './table-context'

export interface TableLoadingOwnProps {
  /**
   * The accessible name of the `Loader`. It defaults to the `loader` text of the `LocaleProvider`,
   * or `Loading`.
   */
  label?: string
}

type TableLoadingRootAttributes = Pick<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'hidden' | 'id' | 'title'
>

export type TableLoadingProps = Omit<ComponentProps, 'index'> &
  TableLoadingRootAttributes &
  TableLoadingOwnProps

/**
 * The veil with the `Loader`, only while the `Table` is `loading`. `children` replace the
 * loader.
 */
export const TableLoading = forwardRef<HTMLDivElement, TableLoadingProps>(
  (
    { children, className, label, style, ...rest }: TableLoadingProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): ReactNode => {
    const { isStyled, loading } = useTableContext('TableLoading')

    if (!loading) return null

    return (
      <div
        className={joinClasses(isStyled && styles.loading, className)}
        data-plume-table-loading=""
        ref={ref}
        style={style}
        {...rest}
      >
        {children ?? (
          <Loader
            colorScheme="primary"
            label={label}
            variant={isStyled ? 'spinner' : 'unstyled'}
          />
        )}
      </div>
    )
  },
)

TableLoading.displayName = 'TableLoading'
