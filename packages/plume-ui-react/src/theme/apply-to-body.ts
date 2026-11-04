'use client'

import { useEffect, useRef } from 'react'
import type { ColorMode } from './theme-context'

interface PageTheme {
  background: string
  color: string
  mode: ColorMode
}

interface PageBaseline {
  background: string
  color: string
  mode: string | undefined
  scheme: string
}

// The providers that theme the page are kept in a list, and the last one that mounted wins. A provider that
// saved what it found and put it back on unmount would, with two of them, restore what the other one had set.
const providers: PageTheme[] = []
let baseline: PageBaseline | null = null

function render(): void {
  const { documentElement: html, body } = document
  const current = providers[providers.length - 1]

  if (current) {
    baseline ??= {
      background: body.style.backgroundColor,
      color: body.style.color,
      mode: html.dataset.plumeColorMode,
      scheme: html.style.colorScheme,
    }
    html.dataset.plumeColorMode = current.mode
    html.style.colorScheme = current.mode
    body.style.backgroundColor = current.background
    body.style.color = current.color
    return
  }

  if (!baseline) return
  if (baseline.mode === undefined) delete html.dataset.plumeColorMode
  else html.dataset.plumeColorMode = baseline.mode
  html.style.colorScheme = baseline.scheme
  body.style.backgroundColor = baseline.background
  body.style.color = baseline.color
  baseline = null
}

/** Sets the color mode, the background and the text color of the page for as long as the provider is mounted. */
export function useApplyToBody(
  enabled: boolean,
  mode: ColorMode,
  background: string,
  color: string,
): void {
  const entry = useRef<PageTheme>({ background, color, mode })

  useEffect(() => {
    if (!enabled || typeof document === 'undefined') return
    const registered = entry.current
    providers.push(registered)
    render()
    return () => {
      providers.splice(providers.indexOf(registered), 1)
      render()
    }
  }, [enabled])

  useEffect(() => {
    Object.assign(entry.current, { background, color, mode })
    if (enabled && providers.includes(entry.current)) render()
  }, [enabled, mode, background, color])
}
