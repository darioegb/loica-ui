'use client'

import type { ForwardedRef } from 'react'
import { createContext, useContext } from 'react'
import type { Size } from '../../../theme'
import type { EditorController, EditorSnapshot } from './richtexteditor-controller'
import type { RichTextEditorContentProps, RichTextEditorLabels } from './richtexteditor-types'

export interface RichTextEditorContextValue {
  controller: EditorController | null
  disabled: boolean
  invalid: boolean
  isStyled: boolean
  labels: RichTextEditorLabels
  linkOpen: boolean
  readOnly: boolean
  required: boolean
  setEditable: (node: HTMLDivElement | null) => void
  setLinkOpen: (open: boolean) => void
  size: Size
  snapshot: EditorSnapshot
}

export const RichTextEditorContext = createContext<RichTextEditorContextValue | undefined>(
  undefined,
)

export function useRichTextEditorContext(part: string): RichTextEditorContextValue {
  const context = useContext(RichTextEditorContext)
  if (!context) throw new Error(`${part} must be used within a <RichTextEditor>`)
  return context
}

export interface RichTextEditorContentDefaults {
  props: RichTextEditorContentProps
  ref: ForwardedRef<HTMLDivElement>
}

export const RichTextEditorContentDefaultsContext = createContext<
  RichTextEditorContentDefaults | undefined
>(undefined)
