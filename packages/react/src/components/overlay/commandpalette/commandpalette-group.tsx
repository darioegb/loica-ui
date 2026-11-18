'use client'

import type { ComponentPropsWithoutRef, ForwardedRef, ReactNode } from 'react'
import { forwardRef, useId } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { useCommandPaletteContext } from './commandpalette-context'
import styles from './commandpalette.module.css'

export interface CommandPaletteGroupOwnProps {
  /**
   * The name of the group, shown above its items and read by assistive technology. The group is hidden while none
   * of its items matches the search.
   *
   * @since 1.3
   */
  heading?: ReactNode
}

export type CommandPaletteGroupProps = Omit<ComponentPropsWithoutRef<'div'>, 'role'> &
  CommandPaletteGroupOwnProps

/**
 * A set of related items under a `heading`: "Navigation", "Actions". Write the `CommandPaletteItem` of each one as
 * children.
 *
 * @since 1.3
 */
export const CommandPaletteGroup = forwardRef<HTMLDivElement, CommandPaletteGroupProps>(
  (
    { children, className, heading, ...rest }: CommandPaletteGroupProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    const { isStyled } = useCommandPaletteContext('CommandPaletteGroup')
    const headingId = useId()
    return (
      <div
        aria-labelledby={heading ? headingId : undefined}
        className={joinClasses(isStyled && styles.group, className)}
        data-loica-commandpalette-group=""
        ref={ref}
        role="group"
        {...rest}
      >
        {heading ? (
          <div data-loica-commandpalette-heading="" id={headingId}>
            {heading}
          </div>
        ) : null}
        {children}
      </div>
    )
  },
)

CommandPaletteGroup.displayName = 'CommandPaletteGroup'
