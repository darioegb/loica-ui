'use client'

import type { CSSProperties, ForwardedRef } from 'react'
import { forwardRef, useEffect, useMemo, useRef, useState } from 'react'
import { useLabels } from '../../../locale/locale-provider'
import { joinClasses } from '../../../overlay/class-names'
import { useControllableState } from '../../../overlay/use-controllable-state'
import { useIsomorphicLayoutEffect } from '../../../overlay/use-isomorphic-layout-effect'
import { schemeVar } from '../../../theme'
import type { EditorSnapshot } from './richtexteditor-controller'
import { EditorController } from './richtexteditor-controller'
import { DEFAULT_LABELS } from './richtexteditor-labels'
import { fromHtml } from './richtexteditor-parse'
import { toHtml } from './richtexteditor-serialize'
import { RichTextEditorContent } from './richtexteditor-content'
import {
  RichTextEditorContentDefaultsContext,
  RichTextEditorContext,
} from './richtexteditor-context'
import { RichTextEditorToolbar } from './richtexteditor-toolbar'
import type { RichTextEditorProps } from './richtexteditor-types'
import styles from './richtexteditor.module.css'

export type {
  RichTextEditorContentOwnProps,
  RichTextEditorContentProps,
  RichTextEditorGroupProps,
  RichTextEditorLabels,
  RichTextEditorOwnProps,
  RichTextEditorProps,
  RichTextEditorToolbarProps,
  RichTextEditorToolName,
  RichTextEditorToolOwnProps,
  RichTextEditorToolProps,
  RichTextEditorVariant,
} from './richtexteditor-types'

const INITIAL: EditorSnapshot = {
  marks: 0,
  blockType: 'paragraph',
  link: undefined,
  font: null,
  size: null,
  align: null,
  canUndo: false,
  canRedo: false,
  empty: true,
}

const sameSnapshot = (a: EditorSnapshot, b: EditorSnapshot): boolean =>
  a.marks === b.marks &&
  a.blockType === b.blockType &&
  a.link === b.link &&
  a.font === b.font &&
  a.size === b.size &&
  a.align === b.align &&
  a.canUndo === b.canUndo &&
  a.canRedo === b.canRedo &&
  a.empty === b.empty

/**
 * An editor for formatted text, with a toolbar. Without children it renders a `RichTextEditorToolbar` and a
 * `RichTextEditorContent`; with children it renders the parts you write, so you can choose the tools, move the toolbar
 * or add buttons of your own. Its `ref` goes to the editable element, which a `Field` labels, and its `className` and
 * `style` to the wrapper around the toolbar and the content.
 * @since 1.5
 */
export const RichTextEditor = forwardRef<HTMLDivElement, RichTextEditorProps>(
  (
    {
      children,
      className,
      colorScheme = 'secondary',
      defaultValue = '',
      disabled = false,
      onValueChange,
      placeholder,
      readOnly = false,
      required = false,
      size = 'md',
      style,
      toolbar = true,
      value,
      variant = 'outline',
      ...rest
    }: RichTextEditorProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    const labels = useLabels('richTextEditor', DEFAULT_LABELS)
    const [editable, setEditable] = useState<HTMLDivElement | null>(null)
    const [controller, setController] = useState<EditorController | null>(null)
    const [snapshot, setSnapshot] = useState(INITIAL)
    const [linkOpen, setLinkOpen] = useState(false)
    const [html, setHtml] = useControllableState({
      defaultValue,
      onChange: onValueChange,
      value,
    })
    const current = useRef(html)
    const setHtmlRef = useRef(setHtml)
    setHtmlRef.current = setHtml

    useIsomorphicLayoutEffect(() => {
      if (!editable) return undefined
      const instance = new EditorController(
        editable,
        {
          onChange: (doc) => {
            current.current = toHtml(doc)
            setHtmlRef.current(current.current)
          },
          onSnapshot: (next) =>
            setSnapshot((previous) => (sameSnapshot(previous, next) ? previous : next)),
          onLinkShortcut: () => setLinkOpen(true),
        },
        fromHtml(current.current),
      )
      const detach = instance.attach()
      setController(instance)
      return () => {
        detach()
        setController(null)
      }
    }, [editable])

    useEffect(() => {
      if (!controller || html === current.current) return
      current.current = html
      controller.load(fromHtml(html))
    }, [controller, html])

    const locked = readOnly || disabled
    useEffect(() => {
      if (controller) controller.readOnly = locked
    }, [controller, locked])

    const invalid = rest['aria-invalid'] === true || rest['aria-invalid'] === 'true'
    const isStyled = variant !== 'unstyled'
    const context = useMemo(
      () => ({
        controller,
        disabled,
        invalid,
        isStyled,
        labels,
        linkOpen,
        readOnly,
        required,
        setEditable,
        setLinkOpen,
        size,
        snapshot,
      }),
      [
        controller,
        disabled,
        invalid,
        isStyled,
        labels,
        linkOpen,
        readOnly,
        required,
        size,
        snapshot,
      ],
    )
    const vars = {
      '--richtexteditor-color': schemeVar(invalid ? 'error' : colorScheme, 'text'),
      '--richtexteditor-active-bg': schemeVar(colorScheme, 'tint'),
      '--richtexteditor-active-color': schemeVar(colorScheme, 'tint-text'),
      '--richtexteditor-link': schemeVar('primary', 'text'),
      ...style,
    } as CSSProperties

    return (
      <RichTextEditorContext.Provider value={context}>
        <RichTextEditorContentDefaultsContext.Provider
          value={{ props: { ...rest, placeholder }, ref }}
        >
          <div
            className={joinClasses(
              isStyled && styles.base,
              isStyled && styles[variant],
              isStyled && styles[size],
              isStyled && invalid && styles.invalid,
              isStyled && disabled && styles.disabled,
              className,
            )}
            data-disabled={disabled ? '' : undefined}
            data-invalid={invalid ? '' : undefined}
            data-loica-richtexteditor=""
            data-readonly={readOnly ? '' : undefined}
            style={vars}
          >
            {children ?? (
              <>
                {toolbar ? <RichTextEditorToolbar /> : null}
                <RichTextEditorContent />
              </>
            )}
          </div>
        </RichTextEditorContentDefaultsContext.Provider>
      </RichTextEditorContext.Provider>
    )
  },
)

RichTextEditor.displayName = 'RichTextEditor'
