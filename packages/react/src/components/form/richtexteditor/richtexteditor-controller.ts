import {
  activeAlign,
  activeBlockType,
  activeFont,
  activeSize,
  activeLink,
  activeMarks,
  autoformat,
  deleteBackward,
  deleteForward,
  deleteSelection,
  insertBlocks,
  insertText,
  setAlign,
  setBlockType,
  setFont,
  setLink,
  setSize,
  splitBlock,
  toggleMark,
} from './richtexteditor-commands'
import type { RenderCache } from './richtexteditor-dom'
import {
  applyDomSelection,
  createRenderCache,
  renderDoc,
  selectionFromDom,
} from './richtexteditor-dom'
import type { History } from './richtexteditor-history'
import { breakRun, emptyHistory, record, redo, undo } from './richtexteditor-history'
import type {
  Align,
  BlockType,
  Doc,
  EditorState,
  FontKey,
  Point,
  Selection,
  SizeKey,
} from './richtexteditor-model'
import {
  BOLD,
  blockLength,
  clampSelection,
  comparePoints,
  createState,
  isCollapsed,
  ITALIC,
  mapRuns,
  UNDERLINE,
} from './richtexteditor-model'
import { fromHtml, fromText, parseDom } from './richtexteditor-parse'

export interface EditorSnapshot {
  marks: number
  blockType: BlockType | undefined
  link: string | undefined
  font: FontKey | null | undefined
  size: SizeKey | null | undefined
  align: Align | null | undefined
  canUndo: boolean
  canRedo: boolean
  empty: boolean
}

export interface ControllerOptions {
  onChange: (doc: Doc) => void
  onSnapshot: (snapshot: EditorSnapshot) => void
  onLinkShortcut?: () => void
}

const DELETE_RANGES = new Set([
  'deleteWordBackward',
  'deleteWordForward',
  'deleteSoftLineBackward',
  'deleteSoftLineForward',
  'deleteHardLineBackward',
  'deleteHardLineForward',
  'deleteEntireSoftLine',
  'deleteByCut',
  'deleteByDrag',
  'deleteContent',
])

const INSERT_DATA = new Set([
  'insertFromPaste',
  'insertFromPasteAsQuotation',
  'insertFromDrop',
  'insertFromYank',
])

const MARK_FORMATS: Record<string, number> = {
  formatBold: BOLD,
  formatItalic: ITALIC,
  formatUnderline: UNDERLINE,
}

const KEY_MARKS: Record<string, number> = { b: BOLD, i: ITALIC, u: UNDERLINE }

export class EditorController {
  state: EditorState
  history: History = emptyHistory()
  elements: Element[] = []
  readOnly = false
  private cache: RenderCache = createRenderCache()
  private composing = false
  private composedMarks: { at: Point; marks: number } | null = null
  private composeBase: EditorState | null = null
  private dirty = false
  private softBreak = false

  constructor(
    private readonly root: HTMLElement,
    private readonly options: ControllerOptions,
    doc: Doc,
  ) {
    this.state = createState(doc)
  }

  attach(): () => void {
    const owner = this.root.ownerDocument
    const listeners: [EventTarget, string, EventListener][] = [
      [this.root, 'beforeinput', this.onBeforeInput as EventListener],
      [this.root, 'input', this.onInput],
      [this.root, 'compositionstart', this.onCompositionStart],
      [this.root, 'compositionend', this.onCompositionEnd],
      [this.root, 'keydown', this.onKeyDown as EventListener],
      [this.root, 'paste', this.onPaste as EventListener],
      [owner, 'selectionchange', this.onSelectionChange],
    ]
    for (const [target, type, listener] of listeners) target.addEventListener(type, listener)
    this.render()
    this.emit(false)
    return () => {
      for (const [target, type, listener] of listeners) target.removeEventListener(type, listener)
    }
  }

  load(doc: Doc): void {
    this.state = createState(doc)
    this.history = emptyHistory()
    this.render()
    this.emit(false)
  }

  focus(): void {
    this.root.focus({ preventScroll: true })
    applyDomSelection(this.elements, this.state.selection)
  }

  run(command: (state: EditorState) => EditorState, kind = 'format'): void {
    this.syncSelection()
    this.apply(command(this.state), kind)
  }

  captureSelection(): string | undefined {
    this.syncSelection()
    this.emit(false)
    return activeLink(this.state)
  }

  toggleMark(mark: number): void {
    this.run((state) => toggleMark(state, mark))
  }

  setBlockType(type: BlockType): void {
    this.run((state) => setBlockType(state, type))
  }

  setFont(font: FontKey | null): void {
    this.run((state) => setFont(state, font))
  }

  setSize(size: SizeKey | null): void {
    this.run((state) => setSize(state, size))
  }

  setAlign(align: Align | null): void {
    this.run((state) => setAlign(state, align))
  }

  setLink(href: string | null): void {
    this.run((state) => setLink(state, href))
  }

  undo(): void {
    this.travel(undo)
  }

  redo(): void {
    this.travel(redo)
  }

  private travel(step: typeof undo): void {
    const result = step(this.history, this.state)
    if (!result) return
    this.history = result.history
    this.state = { ...result.state, pending: null }
    this.render()
    this.emit(true)
  }

  private apply(next: EditorState, kind: string): void {
    if (next === this.state) return
    if (next.doc === this.state.doc) {
      this.state = next
      this.emit(false)
      return
    }
    this.history = record(this.history, this.state, kind, Date.now())
    this.state = next
    this.render()
    this.emit(true)
  }

  private render(): void {
    this.elements = renderDoc(this.root, this.state.doc, this.cache)
    this.root.dataset.empty = String(this.isEmpty())
    if (this.root.ownerDocument.activeElement !== this.root) return
    applyDomSelection(this.elements, this.state.selection)
    const focus = this.root.ownerDocument.getSelection()?.focusNode
    const target =
      focus?.nodeType === 3 ? focus.parentElement : (focus as Element | null | undefined)
    target?.scrollIntoView?.({ block: 'nearest' })
  }

  private isEmpty(): boolean {
    const [first] = this.state.doc.blocks
    return (
      this.state.doc.blocks.length === 1 && first.type === 'paragraph' && blockLength(first) === 0
    )
  }

  private emit(changed: boolean): void {
    if (changed) this.options.onChange(this.state.doc)
    const { state, history } = this
    this.options.onSnapshot({
      marks: activeMarks(state),
      blockType: activeBlockType(state),
      link: activeLink(state),
      font: activeFont(state),
      size: activeSize(state),
      align: activeAlign(state),
      canUndo: history.past.length > 0,
      canRedo: history.future.length > 0,
      empty: this.isEmpty(),
    })
  }

  private readSelection(): Selection | null {
    const selection = this.root.ownerDocument.getSelection()
    if (!selection?.rangeCount) return null
    const found = selectionFromDom(
      this.elements,
      this.root,
      [selection.anchorNode, selection.anchorOffset],
      [selection.focusNode, selection.focusOffset],
    )
    return found && clampSelection(this.state.doc, found)
  }

  private syncSelection(): boolean {
    if (this.root.ownerDocument.activeElement !== this.root) return false
    const selection = this.readSelection()
    if (!selection) return false
    const moved =
      comparePoints(selection.anchor, this.state.selection.anchor) !== 0 ||
      comparePoints(selection.focus, this.state.selection.focus) !== 0
    if (moved) {
      this.state = { ...this.state, selection, pending: null }
      this.history = breakRun(this.history)
    }
    return moved
  }

  private targetSelection(event: InputEvent): Selection | null {
    const range = event.getTargetRanges?.()[0]
    if (!range) return null
    const found = selectionFromDom(
      this.elements,
      this.root,
      [range.startContainer, range.startOffset],
      [range.endContainer, range.endOffset],
    )
    return found && clampSelection(this.state.doc, found)
  }

  private onSelectionChange = (): void => {
    if (this.composing || !this.syncSelection()) return
    this.emit(false)
  }

  private onCompositionStart = (): void => {
    this.syncSelection()
    const { pending, selection } = this.state
    this.composeBase = this.state
    this.composedMarks =
      pending !== null && isCollapsed(selection) ? { at: selection.anchor, marks: pending } : null
    this.composing = true
  }

  private onCompositionEnd = (): void => {
    this.composing = false
    this.reconcile()
  }

  private onInput = (): void => {
    if (this.dirty || this.composing) this.reconcile()
  }

  private reconcile(): void {
    const { doc, elements } = parseDom(this.root, true)
    const domSelection = this.root.ownerDocument.getSelection()
    const found = domSelection
      ? selectionFromDom(
          elements,
          this.root,
          [domSelection.anchorNode, domSelection.anchorOffset],
          [domSelection.focusNode, domSelection.focusOffset],
        )
      : null
    if (!this.composing) {
      const base = this.composeBase
      this.composeBase = null
      if (!base) this.history = record(this.history, this.state, 'type', Date.now())
      else if (JSON.stringify(base.doc) !== JSON.stringify(doc)) {
        this.history = record(this.history, base, 'compose', Date.now())
      }
    }
    for (const block of this.state.doc.blocks) this.cache.elements.delete(block)
    this.state = this.withComposedMarks({
      doc,
      selection: clampSelection(doc, found ?? this.state.selection),
      pending: null,
    })
    this.elements = elements
    this.dirty = false
    if (!this.composing) this.render()
    this.emit(true)
  }

  private withComposedMarks(state: EditorState): EditorState {
    const composed = this.composedMarks
    if (this.composing || !composed) return state
    this.composedMarks = null
    const { block: index, offset } = state.selection.focus
    const block = state.doc.blocks[index]
    if (composed.at.block !== index || offset <= composed.at.offset || block.type === 'code') {
      return state
    }
    const runs = mapRuns(block.runs, composed.at.offset, offset, (run) => ({
      ...run,
      marks: composed.marks,
    }))
    const blocks = state.doc.blocks.map((item, i) => (i === index ? { ...item, runs } : item))
    return { ...state, doc: { blocks } }
  }

  private onBeforeInput = (event: InputEvent): void => {
    if (this.readOnly) {
      event.preventDefault()
      return
    }
    if (this.composing || event.isComposing || !event.cancelable) {
      this.dirty = true
      return
    }
    event.preventDefault()
    this.syncSelection()
    const type = event.inputType
    const range = this.targetSelection(event)
    const data = event.data ?? event.dataTransfer?.getData('text/plain') ?? ''
    const { state } = this
    if (type === 'historyUndo') this.undo()
    else if (type === 'historyRedo') this.redo()
    else if (type in MARK_FORMATS) this.apply(toggleMark(state, MARK_FORMATS[type]), 'format')
    else if (type === 'insertText') this.typeText(data)
    else if (type === 'insertReplacementText') {
      this.apply(insertText({ ...state, selection: range ?? state.selection }, data), 'replace')
    } else if (type === 'insertParagraph' && !this.softBreak) this.apply(splitBlock(state), 'split')
    else if (type === 'insertParagraph' || type === 'insertLineBreak') {
      this.apply(insertText(state, '\n'), 'split')
    } else if (type === 'deleteContentBackward') this.apply(deleteBackward(state), 'delete')
    else if (type === 'deleteContentForward') this.apply(deleteForward(state), 'delete')
    else if (DELETE_RANGES.has(type)) {
      const selection = range && !isCollapsed(range) ? range : state.selection
      const next = isCollapsed(selection)
        ? deleteBackward(state)
        : deleteSelection({ ...state, selection })
      this.apply(next, 'cut')
    } else if (INSERT_DATA.has(type) && event.dataTransfer) {
      this.paste(event.dataTransfer, range ?? undefined)
    }
  }

  private typeText(text: string): void {
    const formatted = text === ' ' ? autoformat(this.state) : null
    if (formatted) this.apply(formatted, 'format')
    else this.apply(insertText(this.state, text), 'type')
  }

  private paste(data: DataTransfer, selection?: Selection): void {
    const html = data.getData('text/html')
    const parsed = html ? fromHtml(html).blocks : []
    const hasContent = parsed.some((block) => blockLength(block) > 0)
    const blocks = hasContent ? parsed : fromText(data.getData('text/plain')).blocks
    const state = selection ? { ...this.state, selection } : this.state
    this.apply(insertBlocks(state, blocks), 'paste')
  }

  private onPaste = (event: ClipboardEvent): void => {
    event.preventDefault()
    if (this.readOnly || !event.clipboardData) return
    this.syncSelection()
    this.paste(event.clipboardData)
  }

  private onKeyDown = (event: KeyboardEvent): void => {
    this.softBreak = event.key === 'Enter' && event.shiftKey
    if (!(event.metaKey || event.ctrlKey) || event.altKey || this.composing) return
    const key = event.key.toLowerCase()
    if (key in KEY_MARKS && !this.readOnly) {
      event.preventDefault()
      this.toggleMark(KEY_MARKS[key])
    } else if (key === 'z' || key === 'y') {
      event.preventDefault()
      if (this.readOnly) return
      if (key === 'y' || event.shiftKey) this.redo()
      else this.undo()
    } else if (key === 'k' && !this.readOnly) {
      event.preventDefault()
      this.syncSelection()
      this.options.onLinkShortcut?.()
    }
  }
}
