'use client'

import type {
  FocusEvent as ReactFocusEvent,
  ForwardedRef,
  KeyboardEvent as ReactKeyboardEvent,
  ReactNode,
} from 'react'
import { forwardRef, useCallback, useEffect, useRef, useState } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { logicalKey } from '../../../overlay/direction'
import { useIsomorphicLayoutEffect } from '../../../overlay/use-isomorphic-layout-effect'
import type { Size } from '../../../theme'
import { Button } from '../../interaction/button'
import { Input } from '../input'
import { activeLink } from './richtexteditor-commands'
import { useRichTextEditorContext } from './richtexteditor-context'
import { RichTextEditorGroup } from './richtexteditor-group'
import { RichTextEditorTool } from './richtexteditor-tool'
import { DEFAULT_TOOL_GROUPS } from './richtexteditor-tools'
import type { RichTextEditorLabels, RichTextEditorToolbarProps } from './richtexteditor-types'
import styles from './richtexteditor.module.css'

const TOOL = '[data-loica-richtexteditor-tool]'

const normalizeUrl = (value: string): string => {
  const url = value.trim()
  if (/^[a-z][a-z\d+.-]*:/i.test(url) || /^[/#?.]/.test(url)) return url
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(url)) return `mailto:${url}`
  return `https://${url}`
}

/**
 * The formatting toolbar, with the arrow keys moving between its tools and the field of the link below it. Without
 * children it holds every tool in groups; with children, only the groups and tools you write. It renders nothing
 * while the editor is read-only.
 * @since 1.5
 */
export const RichTextEditorToolbar = forwardRef<HTMLDivElement, RichTextEditorToolbarProps>(
  (
    { children, className, onFocus, onKeyDown, ...rest }: RichTextEditorToolbarProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): ReactNode => {
    const { controller, isStyled, labels, linkOpen, readOnly, setLinkOpen, size } =
      useRichTextEditorContext('RichTextEditorToolbar')
    const toolbar = useRef<HTMLDivElement | null>(null)
    const active = useRef<HTMLElement | null>(null)

    const setRefs = useCallback(
      (node: HTMLDivElement | null) => {
        toolbar.current = node
        if (typeof ref === 'function') ref(node)
        else if (ref) ref.current = node
      },
      [ref],
    )

    const enabledTools = (): HTMLElement[] =>
      Array.from(toolbar.current?.querySelectorAll<HTMLElement>(`${TOOL}:not(:disabled)`) ?? [])

    const sync = (): void => {
      const enabled = enabledTools()
      const target =
        active.current && enabled.includes(active.current) ? active.current : enabled[0]
      toolbar.current?.querySelectorAll<HTMLElement>(TOOL).forEach((tool) => {
        tool.tabIndex = tool === target ? 0 : -1
      })
    }
    useIsomorphicLayoutEffect(sync)

    if (readOnly) return null

    const closeLink = (): void => {
      setLinkOpen(false)
      controller?.focus()
    }

    const applyLink = (href: string | null): void => {
      controller?.setLink(href && href.trim() ? normalizeUrl(href) : null)
      closeLink()
    }

    const handleFocus = (event: ReactFocusEvent<HTMLDivElement>): void => {
      onFocus?.(event)
      const tool = (event.target as HTMLElement).closest<HTMLElement>(TOOL)
      if (tool) {
        active.current = tool
        sync()
      }
    }

    const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>): void => {
      onKeyDown?.(event)
      if (event.defaultPrevented) return
      const key = logicalKey(event.key, event.currentTarget)
      const enabled = enabledTools()
      const current = enabled.indexOf(document.activeElement as HTMLElement)
      const next =
        key === 'ArrowRight'
          ? (current + 1) % enabled.length
          : key === 'ArrowLeft'
            ? (current - 1 + enabled.length) % enabled.length
            : key === 'Home'
              ? 0
              : key === 'End'
                ? enabled.length - 1
                : null
      if (next === null) return
      event.preventDefault()
      enabled[next]?.focus()
    }

    return (
      <>
        <div
          ref={setRefs}
          aria-label={labels.toolbar}
          className={joinClasses(isStyled && styles.toolbar, className)}
          data-loica-richtexteditor-toolbar=""
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          role="toolbar"
          {...rest}
        >
          {children ??
            DEFAULT_TOOL_GROUPS.map((group) => (
              <RichTextEditorGroup key={group[0]}>
                {group.map((name) => (
                  <RichTextEditorTool key={name} name={name} />
                ))}
              </RichTextEditorGroup>
            ))}
        </div>
        {linkOpen ? (
          <LinkField
            initial={controller ? (activeLink(controller.state) ?? '') : ''}
            labels={labels}
            onApply={applyLink}
            onClose={closeLink}
            size={size}
            styled={isStyled}
          />
        ) : null}
      </>
    )
  },
)

RichTextEditorToolbar.displayName = 'RichTextEditorToolbar'

interface LinkFieldProps {
  initial: string
  labels: RichTextEditorLabels
  onApply: (href: string | null) => void
  onClose: () => void
  size: Size
  styled: boolean
}

function LinkField({
  initial,
  labels,
  onApply,
  onClose,
  size,
  styled,
}: Readonly<LinkFieldProps>): ReactNode {
  const [address, setAddress] = useState(initial)
  const field = useRef<HTMLInputElement>(null)
  useEffect(() => {
    field.current?.focus()
  }, [])
  const escape = (event: ReactKeyboardEvent): void => {
    if (event.key === 'Escape') {
      event.stopPropagation()
      onClose()
    }
  }
  return (
    <div
      aria-label={labels.link}
      className={styled ? styles.link : undefined}
      data-loica-richtexteditor-link=""
      role="group"
    >
      <Input
        ref={field}
        aria-label={labels.linkAddress}
        inputMode="url"
        onChange={(event) => setAddress(event.target.value)}
        onKeyDown={(event) => {
          escape(event)
          if (event.key === 'Enter') {
            event.preventDefault()
            onApply(address)
          }
        }}
        size={size}
        type="text"
        value={address}
      />
      <Button
        label={labels.applyLink}
        onClick={() => onApply(address)}
        onKeyDown={escape}
        size={size}
        variant="solid"
      />
      <Button
        label={labels.removeLink}
        onClick={() => onApply(null)}
        onKeyDown={escape}
        size={size}
        variant="outline"
      />
    </div>
  )
}
