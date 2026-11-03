'use client'

import type { ForwardedRef, ReactNode } from 'react'
import { Children, forwardRef, isValidElement, useId, useMemo } from 'react'
import type { ComponentProps } from '../../../theme'
import { useDropdownContext } from './dropdown-context'
import { DropdownGroupContext } from './dropdown-group-context'
import { DropdownLabel, type DropdownLabelProps } from './dropdown-label'

export interface DropdownGroupOwnProps {
  /** The items of the group, and optionally a `DropdownLabel` that names it. */
  children?: ReactNode
  /** The title of the group, rendered as a `DropdownLabel` before the items. */
  label?: ReactNode
}

export type DropdownGroupProps = Omit<ComponentProps, 'index'> & DropdownGroupOwnProps

const findLabel = (children: ReactNode): DropdownLabelProps | undefined => {
  const label = Children.toArray(children).find(
    (child) => isValidElement(child) && child.type === DropdownLabel,
  )
  return isValidElement<DropdownLabelProps>(label) ? label.props : undefined
}

/**
 * A set of related items with `role="group"`, named by its `DropdownLabel` or its **label**, so a
 * screen reader announces the title when the focus enters the group.
 */
export const DropdownGroup = forwardRef<HTMLDivElement, DropdownGroupProps>(
  (
    { children, className, label, style }: DropdownGroupProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): ReactNode => {
    useDropdownContext('DropdownGroup')
    const labelId = useId()
    const groupContext = useMemo(() => ({ labelId }), [labelId])
    const ownLabel = findLabel(children)
    const hasLabel = ownLabel !== undefined || label !== undefined

    return (
      <DropdownGroupContext.Provider value={groupContext}>
        <div
          aria-labelledby={hasLabel ? (ownLabel?.id ?? labelId) : undefined}
          className={className}
          data-plume-dropdown-group=""
          ref={ref}
          role="group"
          style={style}
        >
          {ownLabel === undefined && label !== undefined && <DropdownLabel>{label}</DropdownLabel>}
          {children}
        </div>
      </DropdownGroupContext.Provider>
    )
  },
)

DropdownGroup.displayName = 'DropdownGroup'
