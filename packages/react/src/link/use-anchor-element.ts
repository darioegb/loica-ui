'use client'

import type { ElementType } from 'react'
import { useLinkComponent } from './link-provider'

const LEAVES_THE_APP = /^(?:[a-z][a-z\d+.-]*:|\/\/)/i

export interface AnchorElementOptions {
  disabled?: boolean
  href?: string
  target?: string
}

export function useAnchorElement({
  disabled = false,
  href,
  target,
}: AnchorElementOptions): ElementType {
  const Link = useLinkComponent()
  const opensElsewhere = target !== undefined && target !== '_self'
  const leavesTheApp = href !== undefined && LEAVES_THE_APP.test(href)
  return disabled || opensElsewhere || leavesTheApp ? 'a' : Link
}
