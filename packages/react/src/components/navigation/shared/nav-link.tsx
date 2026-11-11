'use client'

import type { CSSProperties, ElementType, ForwardedRef, MouseEventHandler, ReactNode } from 'react'
import { forwardRef } from 'react'
import { useLinkComponent } from '../../../link/link-provider'

export interface NavLinkProps {
  active: boolean
  children?: ReactNode
  className?: string
  dataAttribute: string
  disabled: boolean
  href?: string
  id?: string
  onClick?: MouseEventHandler<HTMLElement>
  rel?: string
  style?: CSSProperties
  target?: string
  title?: string
  hidden?: boolean
}

export const NavLink = forwardRef<HTMLElement, NavLinkProps>(
  (
    {
      active,
      children,
      dataAttribute,
      disabled,
      href,
      onClick,
      rel,
      target,
      ...rest
    }: NavLinkProps,
    ref: ForwardedRef<HTMLElement>,
  ): ReactNode => {
    const Link = useLinkComponent()
    const common = {
      'aria-current': active ? ('page' as const) : undefined,
      'data-active': active ? '' : undefined,
      'data-disabled': disabled ? '' : undefined,
      [dataAttribute]: '',
      ...rest,
    }

    if (href === undefined) {
      return (
        <button
          {...common}
          disabled={disabled}
          onClick={onClick}
          ref={ref as ForwardedRef<HTMLButtonElement>}
          type="button"
        >
          {children}
        </button>
      )
    }

    const Element: ElementType = disabled ? 'a' : Link

    return (
      <Element
        {...common}
        aria-disabled={disabled || undefined}
        href={disabled ? undefined : href}
        onClick={onClick}
        ref={ref as ForwardedRef<HTMLAnchorElement>}
        rel={rel}
        role={disabled ? 'link' : undefined}
        tabIndex={disabled ? -1 : undefined}
        target={target}
      >
        {children}
      </Element>
    )
  },
)

NavLink.displayName = 'NavLink'
