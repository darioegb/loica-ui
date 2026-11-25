import type { ReactNode } from 'react'
import type { RichTextEditorContextValue } from './richtexteditor-context'
import { ICONS } from './richtexteditor-icons'
import type { Align, BlockType, FontKey, SizeKey } from './richtexteditor-model'
import { BOLD, CODE, ITALIC, UNDERLINE } from './richtexteditor-model'
import type { RichTextEditorLabels, RichTextEditorToolName } from './richtexteditor-types'

export interface MenuItem {
  key: string
  label: string
  active: boolean
  run: () => void
}

export interface ResolvedTool {
  label: string
  icon?: ReactNode
  menu?: { current: string; items: MenuItem[] }
  pressed?: boolean
  disabled?: boolean
  run?: () => void
}

export const DEFAULT_TOOL_GROUPS: RichTextEditorToolName[][] = [
  ['undo', 'redo'],
  ['font', 'size'],
  ['bold', 'italic', 'underline', 'code', 'link'],
  ['alignStart', 'alignCenter', 'alignEnd', 'alignJustify'],
  ['paragraph', 'heading1', 'heading2', 'heading3', 'quote', 'codeBlock', 'bullet', 'ordered'],
]

const MARKS: Partial<Record<RichTextEditorToolName, [number, ReactNode]>> = {
  bold: [BOLD, ICONS.bold],
  italic: [ITALIC, ICONS.italic],
  underline: [UNDERLINE, ICONS.underline],
  code: [CODE, ICONS.code],
}

const ALIGNS: Partial<Record<RichTextEditorToolName, [Align | null, ReactNode]>> = {
  alignStart: [null, ICONS.alignStart],
  alignCenter: ['center', ICONS.alignCenter],
  alignEnd: ['end', ICONS.alignEnd],
  alignJustify: ['justify', ICONS.alignJustify],
}

const BLOCKS: Partial<Record<RichTextEditorToolName, [BlockType, ReactNode]>> = {
  paragraph: ['paragraph', ICONS.paragraph],
  heading1: ['heading1', ICONS.h1],
  heading2: ['heading2', ICONS.h2],
  heading3: ['heading3', ICONS.h3],
  quote: ['quote', ICONS.quote],
  codeBlock: ['code', ICONS.codeBlock],
  bullet: ['bullet', ICONS.bullet],
  ordered: ['ordered', ICONS.ordered],
}

const FONT_ITEMS: [FontKey | null, keyof RichTextEditorLabels][] = [
  [null, 'fontDefault'],
  ['sans', 'fontSans'],
  ['serif', 'fontSerif'],
  ['mono', 'fontMono'],
]

const SIZE_ITEMS: [SizeKey | null, keyof RichTextEditorLabels][] = [
  [null, 'sizeDefault'],
  ['small', 'sizeSmall'],
  ['large', 'sizeLarge'],
  ['huge', 'sizeHuge'],
]

export function resolveTool(
  name: RichTextEditorToolName,
  context: RichTextEditorContextValue,
): ResolvedTool {
  const { controller, labels, linkOpen, setLinkOpen, snapshot } = context
  const label = labels[name]
  const choose = (apply: () => void): void => {
    apply()
    setTimeout(() => controller?.focus(), 0)
  }

  if (name === 'undo')
    return {
      label,
      icon: ICONS.undo,
      disabled: !snapshot.canUndo,
      run: () => controller?.undo(),
    }
  if (name === 'redo')
    return {
      label,
      icon: ICONS.redo,
      disabled: !snapshot.canRedo,
      run: () => controller?.redo(),
    }
  if (name === 'font') {
    return {
      label,
      menu: {
        current:
          snapshot.font === undefined
            ? labels.font
            : labels[FONT_ITEMS.find(([key]) => key === snapshot.font)![1]],
        items: FONT_ITEMS.map(([value, key]) => ({
          key,
          label: labels[key],
          active: snapshot.font === value,
          run: () => choose(() => controller?.setFont(value)),
        })),
      },
    }
  }
  if (name === 'size') {
    return {
      label,
      menu: {
        current:
          snapshot.size === undefined
            ? labels.size
            : labels[SIZE_ITEMS.find(([key]) => key === snapshot.size)![1]],
        items: SIZE_ITEMS.map(([value, key]) => ({
          key,
          label: labels[key],
          active: snapshot.size === value,
          run: () => choose(() => controller?.setSize(value)),
        })),
      },
    }
  }
  if (name === 'link') {
    return {
      label,
      icon: ICONS.link,
      pressed: !!snapshot.link || linkOpen,
      run: () => {
        controller?.captureSelection()
        setLinkOpen(!linkOpen)
      },
    }
  }
  const mark = MARKS[name]
  if (mark) {
    return {
      label,
      icon: mark[1],
      pressed: !!(snapshot.marks & mark[0]),
      run: () => controller?.toggleMark(mark[0]),
    }
  }
  const align = ALIGNS[name]
  if (align) {
    return {
      label,
      icon: align[1],
      pressed: snapshot.align === align[0],
      run: () => controller?.setAlign(align[0]),
    }
  }
  const [type, icon] = BLOCKS[name]!
  return {
    label,
    icon,
    pressed: snapshot.blockType === type,
    run: () => controller?.setBlockType(type),
  }
}
