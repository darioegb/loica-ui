'use client'

import type { ForwardedRef, ReactNode } from 'react'
import { forwardRef, useMemo } from 'react'
import { useLabels, useResolvedLocale } from '../../../locale/locale-provider'
import { createCountFormatter } from '../../../overlay/format-count'
import { Avatar, type AvatarProps } from './avatar'
import type { AvatarGroupLabels } from './avatar-group'

export type AvatarOverflowProps = Omit<
  AvatarProps,
  'alt' | 'fallback' | 'name' | 'src' | 'status'
> & {
  /** The text of the counter. By default `+` and the count. */
  children?: ReactNode
  /** Number of avatars that are hidden. It fills the counter and its accessible name. */
  count: number
}

const createDefaultLabels = (locale: string): Pick<AvatarGroupLabels, 'overflow'> => {
  const number = createCountFormatter(locale)
  return { overflow: (hidden) => `${number(hidden)} more` }
}

/**
 * The counter of the group. It is what the group renders when `max` hides avatars, and you can
 * place it yourself. Its name comes from the `avatarGroup.overflow` text of the `LocaleProvider`.
 */
export const AvatarOverflow = forwardRef<HTMLSpanElement, AvatarOverflowProps>(
  (
    { children, count, ...rest }: AvatarOverflowProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ): ReactNode => {
    const locale = useResolvedLocale()
    const defaults = useMemo(() => createDefaultLabels(locale), [locale])
    const { overflow } = useLabels('avatarGroup', defaults)

    return (
      <Avatar
        alt={overflow(count)}
        data-overflow=""
        fallback={children ?? `+${count}`}
        ref={ref}
        {...rest}
      />
    )
  },
)

AvatarOverflow.displayName = 'AvatarOverflow'
