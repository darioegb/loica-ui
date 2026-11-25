import type {
  Align,
  Block,
  BlockType,
  EditorState,
  FontKey,
  Run,
  SizeKey,
} from './richtexteditor-model'
import {
  blockLength,
  FONT_MASK,
  fontOf,
  SIZE_MASK,
  sizeOf,
  withFont,
  withSize,
  last as lastOf,
  blockText,
  collapseAt,
  comparePoints,
  isCollapsed,
  mapRuns,
  normalizeRuns,
  orderSelection,
  sliceRuns,
  spliceRuns,
  styleAt,
} from './richtexteditor-model'

const aligned = (block: Block, align: Align | undefined): Block =>
  align ? { ...block, align } : block

const replaceBlocks = (
  state: EditorState,
  from: number,
  count: number,
  blocks: readonly Block[],
): EditorState['doc'] => ({
  blocks: [...state.doc.blocks.slice(0, from), ...blocks, ...state.doc.blocks.slice(from + count)],
})

const plain = (runs: readonly Run[]): Run[] =>
  normalizeRuns(runs.map((run) => ({ text: run.text, marks: 0 })))

const fit = (type: BlockType, runs: readonly Run[]): Run[] =>
  type === 'code' ? plain(runs) : normalizeRuns(runs)

export const deleteSelection = (state: EditorState): EditorState => {
  if (isCollapsed(state.selection)) return state
  const { start, end } = orderSelection(state.selection)
  const first = state.doc.blocks[start.block]
  const last = state.doc.blocks[end.block]
  const merged: Block = {
    ...first,
    runs: fit(first.type, [
      ...sliceRuns(first.runs, 0, start.offset),
      ...sliceRuns(last.runs, end.offset, Infinity),
    ]),
  }
  return {
    doc: replaceBlocks(state, start.block, end.block - start.block + 1, [merged]),
    selection: collapseAt(start),
    pending: null,
  }
}

export const insertText = (state: EditorState, text: string): EditorState => {
  if (!text) return state
  const cleared = deleteSelection(state)
  const { block: index, offset } = cleared.selection.anchor
  const block = cleared.doc.blocks[index]
  const style = styleAt(block.runs, offset)
  const isCode = block.type === 'code'
  const run: Run = {
    text: text.replace(/\r\n?/g, '\n'),
    marks: isCode ? 0 : (cleared.pending ?? style.marks),
    ...(style.href && !isCode ? { href: style.href } : {}),
  }
  return {
    doc: replaceBlocks(cleared, index, 1, [
      { ...block, runs: spliceRuns(block.runs, offset, offset, [run]) },
    ]),
    selection: collapseAt({ block: index, offset: offset + run.text.length }),
    pending: null,
  }
}

export const splitBlock = (state: EditorState): EditorState => {
  const cleared = deleteSelection(state)
  const { block: index, offset } = cleared.selection.anchor
  const block = cleared.doc.blocks[index]
  if (block.type === 'code') return insertText(cleared, '\n')
  const length = blockLength(block)
  if (length === 0 && block.type !== 'paragraph' && !block.type.startsWith('heading')) {
    return setBlockType(cleared, 'paragraph', true)
  }
  const atEnd = offset === length
  const nextType: BlockType = atEnd && block.type.startsWith('heading') ? 'paragraph' : block.type
  const style = styleAt(block.runs, offset)
  return {
    doc: replaceBlocks(cleared, index, 1, [
      { ...block, runs: sliceRuns(block.runs, 0, offset) },
      {
        ...block,
        type: nextType,
        runs: sliceRuns(block.runs, offset, Infinity),
      },
    ]),
    selection: collapseAt({ block: index + 1, offset: 0 }),
    pending: atEnd && style.marks ? style.marks : null,
  }
}

interface Segmenter {
  segment: (text: string) => Iterable<{ segment: string }>
}

const segmenter: Segmenter | null =
  typeof Intl !== 'undefined' && 'Segmenter' in Intl
    ? new (Intl as unknown as { Segmenter: new () => Segmenter }).Segmenter()
    : null

const graphemeBefore = (text: string, offset: number): number => {
  const head = text.slice(Math.max(0, offset - 32), offset)
  if (segmenter) return lastOf([...segmenter.segment(head)])?.segment.length ?? 1
  return /[\uDC00-\uDFFF]/.test(head.charAt(head.length - 1)) &&
    /[\uD800-\uDBFF]/.test(head.charAt(head.length - 2))
    ? 2
    : 1
}

const graphemeAfter = (text: string, offset: number): number => {
  const tail = text.slice(offset, offset + 32)
  if (segmenter) return [...segmenter.segment(tail)][0]?.segment.length ?? 1
  return /[\uD800-\uDBFF]/.test(tail[0] ?? '') && /[\uDC00-\uDFFF]/.test(tail[1] ?? '') ? 2 : 1
}

export const deleteBackward = (state: EditorState): EditorState => {
  if (!isCollapsed(state.selection)) return deleteSelection(state)
  const { block: index, offset } = state.selection.anchor
  const block = state.doc.blocks[index]
  if (offset > 0) {
    const size = graphemeBefore(blockText(block), offset)
    return deleteSelection({
      ...state,
      selection: {
        anchor: { block: index, offset: offset - size },
        focus: state.selection.focus,
      },
    })
  }
  if (block.type !== 'paragraph') return setBlockType(state, 'paragraph', true)
  if (index === 0) return state
  const previous = state.doc.blocks[index - 1]
  return deleteSelection({
    ...state,
    selection: {
      anchor: { block: index - 1, offset: blockLength(previous) },
      focus: { block: index, offset: 0 },
    },
  })
}

export const deleteForward = (state: EditorState): EditorState => {
  if (!isCollapsed(state.selection)) return deleteSelection(state)
  const { block: index, offset } = state.selection.anchor
  const block = state.doc.blocks[index]
  const length = blockLength(block)
  if (offset < length) {
    const size = graphemeAfter(blockText(block), offset)
    return deleteSelection({
      ...state,
      selection: {
        anchor: state.selection.anchor,
        focus: { block: index, offset: offset + size },
      },
    })
  }
  if (index === state.doc.blocks.length - 1) return state
  return deleteSelection({
    ...state,
    selection: {
      anchor: state.selection.anchor,
      focus: { block: index + 1, offset: 0 },
    },
  })
}

export const insertBlocks = (state: EditorState, fragment: readonly Block[]): EditorState => {
  if (!fragment.length) return state
  const cleared = deleteSelection(state)
  const { block: index, offset } = cleared.selection.anchor
  const current = cleared.doc.blocks[index]
  const head = sliceRuns(current.runs, 0, offset)
  const tail = sliceRuns(current.runs, offset, Infinity)
  const replaceType = blockLength(current) === 0 && current.type === 'paragraph'
  const first = fragment[0]
  if (fragment.length === 1) {
    const type = replaceType ? first.type : current.type
    const runs = fit(type, [...head, ...first.runs, ...tail])
    return {
      doc: replaceBlocks(cleared, index, 1, [
        aligned({ type, runs }, replaceType ? (first.align ?? current.align) : current.align),
      ]),
      selection: collapseAt({
        block: index,
        offset: offset + blockLength(first),
      }),
      pending: null,
    }
  }
  const last = fragment[fragment.length - 1]
  const headType = replaceType ? first.type : current.type
  const blocks: Block[] = [
    aligned(
      { type: headType, runs: fit(headType, [...head, ...first.runs]) },
      replaceType ? (first.align ?? current.align) : current.align,
    ),
    ...fragment.slice(1, -1),
    aligned(
      { type: last.type, runs: fit(last.type, [...last.runs, ...tail]) },
      last.align ?? current.align,
    ),
  ]
  return {
    doc: replaceBlocks(cleared, index, 1, blocks),
    selection: collapseAt({
      block: index + fragment.length - 1,
      offset: blockLength(last),
    }),
    pending: null,
  }
}

export const setBlockType = (state: EditorState, type: BlockType, force = false): EditorState => {
  const { start, end } = orderSelection(state.selection)
  const range = state.doc.blocks.slice(start.block, end.block + 1)
  const target = !force && range.every((block) => block.type === type) ? 'paragraph' : type
  const blocks = range.map((block) => ({
    ...block,
    type: target,
    runs: fit(target, block.runs),
  }))
  return {
    ...state,
    doc: replaceBlocks(state, start.block, blocks.length, blocks),
  }
}

export const toggleMark = (state: EditorState, mark: number): EditorState => {
  if (isCollapsed(state.selection)) {
    const { block, offset } = state.selection.anchor
    const marks = state.pending ?? styleAt(state.doc.blocks[block].runs, offset).marks
    return { ...state, pending: marks ^ mark }
  }
  const adding = !(activeMarks(state) & mark)
  const { start, end } = orderSelection(state.selection)
  const blocks = state.doc.blocks.slice(start.block, end.block + 1).map((block, i, all) => {
    if (block.type === 'code') return block
    const from = i === 0 ? start.offset : 0
    const to = i === all.length - 1 ? end.offset : blockLength(block)
    const change = (run: Run): Run => ({
      ...run,
      marks: adding ? run.marks | mark : run.marks & ~mark,
    })
    return { ...block, runs: mapRuns(block.runs, from, to, change) }
  })
  return {
    ...state,
    doc: replaceBlocks(state, start.block, blocks.length, blocks),
  }
}

const linkBounds = (runs: readonly Run[], offset: number): [number, number] | null => {
  const { href } = styleAt(runs, offset)
  if (!href) return null
  const spans: { href: string; from: number; to: number }[] = []
  let position = 0
  for (const run of runs) {
    const end = position + run.text.length
    const last = lastOf(spans)
    if (run.href && last?.href === run.href && last.to === position) last.to = end
    else if (run.href) spans.push({ href: run.href, from: position, to: end })
    position = end
  }
  const span = spans.find((s) => s.href === href && s.from <= offset && offset <= s.to)
  return span ? [span.from, span.to] : null
}

export const setLink = (state: EditorState, href: string | null): EditorState => {
  let { start, end } = orderSelection(state.selection)
  if (isCollapsed(state.selection)) {
    const bounds = linkBounds(state.doc.blocks[start.block].runs, start.offset)
    if (!bounds) return state
    start = { block: start.block, offset: bounds[0] }
    end = { block: start.block, offset: bounds[1] }
  }
  const blocks = state.doc.blocks.slice(start.block, end.block + 1).map((block, i, all) => {
    if (block.type === 'code') return block
    const from = i === 0 ? start.offset : 0
    const to = i === all.length - 1 ? end.offset : blockLength(block)
    const change = (run: Run): Run =>
      href ? { ...run, href } : { text: run.text, marks: run.marks }
    return { ...block, runs: mapRuns(block.runs, from, to, change) }
  })
  return {
    ...state,
    doc: replaceBlocks(state, start.block, blocks.length, blocks),
  }
}

const AUTOFORMAT: Record<string, BlockType> = {
  '#': 'heading1',
  '##': 'heading2',
  '###': 'heading3',
  '-': 'bullet',
  '*': 'bullet',
  '1.': 'ordered',
  '>': 'quote',
}

export const autoformat = (state: EditorState): EditorState | null => {
  if (!isCollapsed(state.selection)) return null
  const { block: index, offset } = state.selection.anchor
  const block = state.doc.blocks[index]
  const type =
    block.type === 'paragraph' ? AUTOFORMAT[blockText(block).slice(0, offset)] : undefined
  if (!type) return null
  return {
    doc: replaceBlocks(state, index, 1, [
      { ...block, type, runs: sliceRuns(block.runs, offset, Infinity) },
    ]),
    selection: collapseAt({ block: index, offset: 0 }),
    pending: null,
  }
}

export const activeMarks = (state: EditorState): number => {
  const { start, end } = orderSelection(state.selection)
  if (comparePoints(start, end) === 0) {
    return state.pending ?? styleAt(state.doc.blocks[start.block].runs, start.offset).marks
  }
  let marks = -1
  state.doc.blocks.slice(start.block, end.block + 1).forEach((block, i, all) => {
    const from = i === 0 ? start.offset : 0
    const to = i === all.length - 1 ? end.offset : blockLength(block)
    for (const run of sliceRuns(block.runs, from, to)) marks &= run.marks
  })
  return marks === -1 ? 0 : marks
}

export const activeLink = (state: EditorState): string | undefined => {
  const { start, end } = orderSelection(state.selection)
  const runs = state.doc.blocks[start.block].runs
  if (comparePoints(start, end) === 0) return styleAt(runs, start.offset).href
  if (start.block !== end.block) return undefined
  const slice = sliceRuns(runs, start.offset, end.offset)
  const href = slice[0]?.href
  return slice.every((run) => run.href === href) ? href : undefined
}

export const activeBlockType = (state: EditorState): BlockType | undefined => {
  const { start, end } = orderSelection(state.selection)
  const range = state.doc.blocks.slice(start.block, end.block + 1)
  return range.every((block) => block.type === range[0].type) ? range[0].type : undefined
}

const formatRange = (state: EditorState, change: (marks: number) => number): EditorState => {
  if (isCollapsed(state.selection)) {
    const { block, offset } = state.selection.anchor
    const marks = state.pending ?? styleAt(state.doc.blocks[block].runs, offset).marks
    return { ...state, pending: change(marks) }
  }
  const { start, end } = orderSelection(state.selection)
  const blocks = state.doc.blocks.slice(start.block, end.block + 1).map((block, i, all) => {
    if (block.type === 'code') return block
    const from = i === 0 ? start.offset : 0
    const to = i === all.length - 1 ? end.offset : blockLength(block)
    const runs = mapRuns(block.runs, from, to, (run) => ({
      ...run,
      marks: change(run.marks),
    }))
    return { ...block, runs }
  })
  return {
    ...state,
    doc: replaceBlocks(state, start.block, blocks.length, blocks),
  }
}

export const setFont = (state: EditorState, font: FontKey | null): EditorState =>
  formatRange(state, (marks) => withFont(marks, font))

export const setSize = (state: EditorState, size: SizeKey | null): EditorState =>
  formatRange(state, (marks) => withSize(marks, size))

export const setAlign = (state: EditorState, align: Align | null): EditorState => {
  const { start, end } = orderSelection(state.selection)
  const blocks = state.doc.blocks.slice(start.block, end.block + 1).map((block) => {
    if (block.type === 'code') return block
    return align ? { ...block, align } : { type: block.type, runs: block.runs }
  })
  return {
    ...state,
    doc: replaceBlocks(state, start.block, blocks.length, blocks),
  }
}

const commonMarks = (state: EditorState, mask: number): number => {
  const { start, end } = orderSelection(state.selection)
  if (comparePoints(start, end) === 0) {
    return (state.pending ?? styleAt(state.doc.blocks[start.block].runs, start.offset).marks) & mask
  }
  const values = new Set<number>()
  state.doc.blocks.slice(start.block, end.block + 1).forEach((block, i, all) => {
    const from = i === 0 ? start.offset : 0
    const to = i === all.length - 1 ? end.offset : blockLength(block)
    for (const run of sliceRuns(block.runs, from, to)) values.add(run.marks & mask)
  })
  return values.size > 1 ? -1 : ([...values][0] ?? 0)
}

export const activeFont = (state: EditorState): FontKey | null | undefined => {
  const marks = commonMarks(state, FONT_MASK)
  return marks < 0 ? undefined : (fontOf(marks) ?? null)
}

export const activeSize = (state: EditorState): SizeKey | null | undefined => {
  const marks = commonMarks(state, SIZE_MASK)
  return marks < 0 ? undefined : (sizeOf(marks) ?? null)
}

export const activeAlign = (state: EditorState): Align | null | undefined => {
  const { start, end } = orderSelection(state.selection)
  const range = state.doc.blocks.slice(start.block, end.block + 1)
  return range.every((block) => block.align === range[0].align)
    ? (range[0].align ?? null)
    : undefined
}
