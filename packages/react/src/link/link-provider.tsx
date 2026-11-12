'use client'

import type { AnchorHTMLAttributes, ElementType, ReactNode, RefAttributes } from 'react'
import { createContext, useContext } from 'react'

export type LinkComponentProps = AnchorHTMLAttributes<HTMLAnchorElement> &
  RefAttributes<HTMLAnchorElement> & { href: string }

export type LinkComponent = ElementType<LinkComponentProps>

export interface LinkProviderProps {
  children: ReactNode
  /**
   * The component that renders every link the library draws, in place of the `<a>`: the link of
   * your router. It gets `href` and the rest of the attributes of an anchor, and has to forward the
   * `ref` and the `onClick` to its element. A link that is disabled, or that leaves the app (an
   * absolute URL, `mailto:`, `tel:`, a `//host` URL, or a `target` other than `_self`), stays a
   * plain `<a>`.
   */
  component: LinkComponent
}

const LinkContext = createContext<LinkComponent>('a')

/**
 * Gives the link component of your router to every part of the library that draws a link.
 *
 * @since 1.1
 */
export function LinkProvider({ children, component }: Readonly<LinkProviderProps>): ReactNode {
  return <LinkContext.Provider value={component}>{children}</LinkContext.Provider>
}

export function useLinkComponent(): LinkComponent {
  return useContext(LinkContext)
}
