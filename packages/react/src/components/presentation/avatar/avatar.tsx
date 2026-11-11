'use client'

import type { ComponentPropsWithoutRef, ForwardedRef, ReactNode } from 'react'
import { forwardRef, useState } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { UserIcon } from '../../../overlay/icons'
import { useLabels, useResolvedLocale } from '../../../locale/locale-provider'
import type { ColorScheme, Shape, Size } from '../../../theme'
import { tagColorVars } from '../shared/tag-vars'
import tag from '../shared/tag.module.css'
import { useAvatarGroup } from './avatar-context'
import { getInitials } from './avatar-initials'
import styles from './avatar.module.css'

export type AvatarStatus = 'away' | 'busy' | 'offline' | 'online'

export type AvatarVariant = 'outline' | 'solid' | 'subtle' | 'unstyled'

/** The texts of the status for assistive technology, to translate them: `online`, `busy`, `away` and `offline`. */
export interface AvatarLabels {
  away: string
  busy: string
  offline: string
  online: string
}

export interface AvatarOwnProps {
  /** Accessible name of the image, when the name is not enough. It replaces the name. */
  alt?: string
  /**
   * Color scheme of the fallback, from the theme palette, including custom schemes added to it.
   *
   * @default 'secondary'
   */
  colorScheme?: ColorScheme
  /**
   * What to show when there is no image: a text, an icon... By default, the initials of the name,
   * or an icon of a person.
   */
  fallback?: ReactNode
  /**
   * Name of the person. Its initials are the fallback, and it names the avatar for assistive
   * technology.
   */
  name?: string
  /**
   * Corners of the Avatar: `pill` is a circle and `rounded` a rounded square.
   *
   * @default 'pill'
   */
  shape?: Shape
  /**
   * Size of the Avatar.
   *
   * @default 'md'
   */
  size?: Size
  /** URL of the image. If it fails to load, the fallback is shown. */
  src?: string
  /** Adds a dot with the presence of the person. */
  status?: AvatarStatus
  /**
   * Visual variant of the fallback. `subtle` tints it, `solid` fills it and `outline` draws its
   * border. `unstyled` drops the Loica styles so you can bring your own.
   *
   * @default 'subtle'
   */
  variant?: AvatarVariant
}

export type AvatarProps = Omit<ComponentPropsWithoutRef<'span'>, 'children'> & AvatarOwnProps

const DEFAULT_LABELS: AvatarLabels = {
  away: 'Away',
  busy: 'Busy',
  offline: 'Offline',
  online: 'Online',
}

export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(
  (
    {
      alt,
      className,
      colorScheme,
      fallback,
      name,
      shape,
      size,
      src,
      status,
      style,
      variant,
      ...rest
    }: AvatarProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ) => {
    const group = useAvatarGroup()
    const resolvedSize = size ?? group?.size ?? 'md'
    const resolvedShape = shape ?? group?.shape ?? 'pill'
    const resolvedScheme = colorScheme ?? group?.colorScheme ?? 'secondary'
    const resolvedVariant = variant ?? group?.variant ?? 'subtle'
    const isStyled = resolvedVariant !== 'unstyled'
    const [failedSrc, setFailedSrc] = useState<string>()
    const showImage = Boolean(src) && failedSrc !== src
    const text = useLabels('avatar', DEFAULT_LABELS)
    const locale = useResolvedLocale()
    const statusText = status ? text[status] : undefined
    const label = [alt ?? name, statusText].filter(Boolean).join(', ')
    const isNamed = Boolean(rest['aria-label'] ?? rest['aria-labelledby'] ?? label)
    const role = isNamed ? 'img' : undefined

    return (
      <span
        aria-hidden={isNamed ? undefined : true}
        aria-label={label || undefined}
        className={joinClasses(
          isStyled && styles.avatar,
          isStyled && styles[resolvedSize],
          isStyled && tag[resolvedShape],
          className,
        )}
        data-loica-avatar=""
        data-status={status}
        ref={ref}
        role={role}
        style={tagColorVars('avatar', resolvedScheme, style)}
        {...rest}
      >
        {showImage ? (
          <img
            alt=""
            className={isStyled ? styles.image : undefined}
            data-loica-avatar-image=""
            onError={() => {
              setFailedSrc(src)
            }}
            src={src}
          />
        ) : (
          <span
            aria-hidden="true"
            className={joinClasses(isStyled && styles.fallback, isStyled && tag[resolvedVariant])}
            data-loica-avatar-fallback=""
          >
            {fallback ?? (getInitials(name, locale) || <UserIcon />)}
          </span>
        )}
        {status ? (
          <span
            aria-hidden="true"
            className={isStyled ? styles.status : undefined}
            data-loica-avatar-status-dot=""
            data-status={status}
          />
        ) : null}
      </span>
    )
  },
)

Avatar.displayName = 'Avatar'
