'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef, useContext } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { useDropdownContext } from './dropdown-context'
import { DropdownGroupContext } from './dropdown-group-context'
import styles from './dropdown.module.css'

type DropdownLabelRootAttributes = Pick<HTMLAttributes<HTMLDivElement>, 'children' | 'id'>

export type DropdownLabelProps = Omit<ComponentProps, 'index'> & DropdownLabelRootAttributes

/**
 * A heading for the items that follow. It isn't focusable. Inside a `DropdownGroup` it names the
 * group.
 */
export const DropdownLabel = forwardRef<HTMLDivElement, DropdownLabelProps>(
  (
    { children, className, id, style }: DropdownLabelProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): ReactNode => {
    const { isStyled } = useDropdownContext('DropdownLabel')
    const group = useContext(DropdownGroupContext)
    return (
      <div
        className={joinClasses(isStyled && styles.groupLabel, className)}
        data-loica-dropdown-label=""
        id={id ?? group?.labelId}
        ref={ref}
        style={style}
      >
        {children}
      </div>
    )
  },
)

DropdownLabel.displayName = 'DropdownLabel'
