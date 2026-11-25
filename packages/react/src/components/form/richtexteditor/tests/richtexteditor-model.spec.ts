import { describe, expect, it } from 'vitest'
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
} from '../richtexteditor-commands'
import { breakRun, emptyHistory, record, redo, undo } from '../richtexteditor-history'
import type { Block, Doc, EditorState, Run } from '../richtexteditor-model'
import {
  BOLD,
  blockText,
  clampPoint,
  collapseAt,
  comparePoints,
  createDoc,
  createState,
  fontOf,
  ITALIC,
  sizeOf,
  withFont,
  withSize,
  normalizeRuns,
  sliceRuns,
  spliceRuns,
  styleAt,
} from '../richtexteditor-model'

const para = (text: string, marks = 0, type: Block['type'] = 'paragraph'): Block => ({
  type,
  runs: text ? [{ text, marks }] : [],
})
const stateOf = (
  blocks: Block[],
  block = 0,
  offset = 0,
  focus = { block, offset },
): EditorState => ({
  doc: { blocks },
  selection: { anchor: { block, offset }, focus },
  pending: null,
})
const texts = (state: EditorState): string[] => state.doc.blocks.map(blockText)
const types = (state: EditorState): string[] => state.doc.blocks.map((block) => block.type)

describe('model helpers', () => {
  it('merges runs that share a style and drops empty ones', () => {
    const runs: Run[] = [
      { text: 'a', marks: 0 },
      { text: '', marks: BOLD },
      { text: 'b', marks: 0 },
      { text: 'c', marks: BOLD },
    ]
    expect(normalizeRuns(runs)).toEqual([
      { text: 'ab', marks: 0 },
      { text: 'c', marks: BOLD },
    ])
  })

  it('slices and splices runs', () => {
    const runs: Run[] = [
      { text: 'abc', marks: 0 },
      { text: 'def', marks: BOLD },
    ]
    expect(sliceRuns(runs, 1, 4)).toEqual([
      { text: 'bc', marks: 0 },
      { text: 'd', marks: BOLD },
    ])
    expect(spliceRuns(runs, 1, 5, [{ text: 'X', marks: 0 }])).toEqual([
      { text: 'aX', marks: 0 },
      { text: 'f', marks: BOLD },
    ])
  })

  it('reads the style a typed character takes', () => {
    const runs: Run[] = [
      { text: 'ab', marks: BOLD, href: '/x' },
      { text: 'cd', marks: 0 },
    ]
    expect(styleAt(runs, 1)).toEqual({ marks: BOLD, href: '/x' })
    expect(styleAt(runs, 2)).toEqual({ marks: BOLD, href: undefined })
    expect(styleAt(runs, 0)).toEqual({ marks: BOLD, href: undefined })
    expect(styleAt([], 0)).toEqual({ marks: 0, href: undefined })
  })

  it('orders and clamps points', () => {
    expect(comparePoints({ block: 0, offset: 5 }, { block: 1, offset: 0 })).toBeLessThan(0)
    const doc: Doc = { blocks: [para('abc')] }
    expect(clampPoint(doc, { block: 9, offset: 9 })).toEqual({
      block: 0,
      offset: 3,
    })
    expect(createState({ blocks: [] }).doc).toEqual(createDoc())
    expect(collapseAt({ block: 1, offset: 2 }).focus).toEqual({
      block: 1,
      offset: 2,
    })
  })
})

describe('commands', () => {
  it('types text with the marks of the previous character', () => {
    const next = insertText(stateOf([para('ab', BOLD)], 0, 2), 'c')
    expect(next.doc.blocks[0].runs).toEqual([{ text: 'abc', marks: BOLD }])
    expect(next.selection.anchor.offset).toBe(3)
  })

  it('types with the pending marks and ignores empty text', () => {
    const base = stateOf([para('ab')], 0, 2)
    const pending = toggleMark(base, ITALIC)
    expect(pending.pending).toBe(ITALIC)
    expect(insertText(pending, 'c').doc.blocks[0].runs).toEqual([
      { text: 'ab', marks: 0 },
      { text: 'c', marks: ITALIC },
    ])
    expect(insertText(base, '')).toBe(base)
  })

  it('keeps a link while typing inside it and never in a code block', () => {
    const linked: Block = {
      type: 'paragraph',
      runs: [{ text: 'abc', marks: 0, href: '/x' }],
    }
    expect(insertText(stateOf([linked], 0, 1), 'Z').doc.blocks[0].runs).toEqual([
      { text: 'aZbc', marks: 0, href: '/x' },
    ])
    const code = para('x', 0, 'code')
    expect(insertText(toggleMark(stateOf([code], 0, 1), BOLD), 'y').doc.blocks[0].runs).toEqual([
      { text: 'xy', marks: 0 },
    ])
  })

  it('replaces a selection that spans blocks', () => {
    const state = stateOf([para('hello'), para('big'), para('world')], 0, 2, {
      block: 2,
      offset: 3,
    })
    expect(texts(insertText(state, '-'))).toEqual(['he-ld'])
    expect(deleteSelection(state).selection.anchor).toEqual({
      block: 0,
      offset: 2,
    })
    const caret = stateOf([para('a')])
    expect(deleteSelection(caret)).toBe(caret)
  })

  it('normalizes the newlines of the text it types', () => {
    expect(texts(insertText(stateOf([para('')]), 'a\r\nb'))).toEqual(['a\nb'])
  })

  it('splits a block and carries the pending marks', () => {
    const next = splitBlock(stateOf([para('abcd', BOLD)], 0, 4))
    expect(texts(next)).toEqual(['abcd', ''])
    expect(next.pending).toBe(BOLD)
    expect(texts(splitBlock(stateOf([para('abcd')], 0, 2)))).toEqual(['ab', 'cd'])
  })

  it('goes back to a paragraph after a heading and out of an empty list', () => {
    expect(types(splitBlock(stateOf([para('Title', 0, 'heading1')], 0, 5)))).toEqual([
      'heading1',
      'paragraph',
    ])
    expect(types(splitBlock(stateOf([para('Title', 0, 'heading1')], 0, 2)))).toEqual([
      'heading1',
      'heading1',
    ])
    expect(types(splitBlock(stateOf([para('', 0, 'bullet')])))).toEqual(['paragraph'])
    expect(types(splitBlock(stateOf([para('q', 0, 'quote')], 0, 1)))).toEqual(['quote', 'quote'])
  })

  it('inserts a newline in a code block', () => {
    expect(texts(splitBlock(stateOf([para('ab', 0, 'code')], 0, 1)))).toEqual(['a\nb'])
  })

  it('deletes backward by character, across blocks and out of a block type', () => {
    expect(texts(deleteBackward(stateOf([para('abc')], 0, 3)))).toEqual(['ab'])
    expect(texts(deleteBackward(stateOf([para('ab'), para('cd')], 1, 0)))).toEqual(['abcd'])
    expect(types(deleteBackward(stateOf([para('x', 0, 'heading2')], 0, 0)))).toEqual(['paragraph'])
    const start = stateOf([para('x')], 0, 0)
    expect(deleteBackward(start)).toBe(start)
    expect(texts(deleteBackward(stateOf([para('abc')], 0, 0, { block: 0, offset: 2 })))).toEqual([
      'c',
    ])
  })

  it('deletes a whole emoji at once', () => {
    expect(texts(deleteBackward(stateOf([para('a👍🏽')], 0, 5)))).toEqual(['a'])
    expect(texts(deleteForward(stateOf([para('👍🏽a')], 0, 0)))).toEqual(['a'])
  })

  it('deletes forward and merges the next block', () => {
    expect(texts(deleteForward(stateOf([para('abc')], 0, 0)))).toEqual(['bc'])
    expect(texts(deleteForward(stateOf([para('ab'), para('cd')], 0, 2)))).toEqual(['abcd'])
    const end = stateOf([para('ab')], 0, 2)
    expect(deleteForward(end)).toBe(end)
    expect(texts(deleteForward(stateOf([para('abc')], 0, 0, { block: 0, offset: 1 })))).toEqual([
      'bc',
    ])
  })

  it('pastes one block inline and several as blocks', () => {
    expect(texts(insertBlocks(stateOf([para('ad')], 0, 1), [para('bc', BOLD)]))).toEqual(['abcd'])
    const many = insertBlocks(stateOf([para('ad')], 0, 1), [
      para('1'),
      para('2', 0, 'bullet'),
      para('3'),
    ])
    expect(texts(many)).toEqual(['a1', '2', '3d'])
    expect(many.selection.anchor).toEqual({ block: 2, offset: 1 })
    expect(types(insertBlocks(stateOf([para('')]), [para('H', 0, 'heading1')]))).toEqual([
      'heading1',
    ])
    expect(
      types(insertBlocks(stateOf([para('')]), [para('a', 0, 'bullet'), para('b', 0, 'bullet')])),
    ).toEqual(['bullet', 'bullet'])
    const state = stateOf([para('x')])
    expect(insertBlocks(state, [])).toBe(state)
    const code = insertBlocks(stateOf([para('', 0, 'code')]), [para('bold', BOLD)])
    expect(code.doc.blocks[0].runs).toEqual([{ text: 'bold', marks: 0 }])
  })

  it('toggles block types', () => {
    const state = stateOf([para('a'), para('b')], 0, 0, {
      block: 1,
      offset: 1,
    })
    const list = setBlockType(state, 'bullet')
    expect(types(list)).toEqual(['bullet', 'bullet'])
    expect(types(setBlockType(list, 'bullet'))).toEqual(['paragraph', 'paragraph'])
    expect(activeBlockType(list)).toBe('bullet')
    const mixed = stateOf([para('a'), para('b', 0, 'quote')], 0, 0, {
      block: 1,
      offset: 0,
    })
    expect(activeBlockType(mixed)).toBeUndefined()
    expect(setBlockType(stateOf([para('a', BOLD)]), 'code').doc.blocks[0].runs).toEqual([
      { text: 'a', marks: 0 },
    ])
  })

  it('toggles marks over a selection and reports the active ones', () => {
    const state = stateOf([para('abcd')], 0, 1, { block: 0, offset: 3 })
    const bold = toggleMark(state, BOLD)
    expect(bold.doc.blocks[0].runs).toEqual([
      { text: 'a', marks: 0 },
      { text: 'bc', marks: BOLD },
      { text: 'd', marks: 0 },
    ])
    expect(activeMarks(bold)).toBe(BOLD)
    expect(toggleMark(bold, BOLD).doc.blocks[0].runs).toEqual([{ text: 'abcd', marks: 0 }])
    const wide = {
      ...bold,
      selection: {
        anchor: { block: 0, offset: 0 },
        focus: { block: 0, offset: 4 },
      },
    }
    expect(activeMarks(wide)).toBe(0)
    expect(toggleMark(wide, BOLD).doc.blocks[0].runs).toEqual([{ text: 'abcd', marks: BOLD }])
  })

  it('skips code blocks when it formats, and reads marks across blocks', () => {
    const state = stateOf([para('ab'), para('cd', 0, 'code'), para('ef')], 0, 0, {
      block: 2,
      offset: 2,
    })
    const next = toggleMark(state, BOLD)
    expect(next.doc.blocks[1].runs).toEqual([{ text: 'cd', marks: 0 }])
    expect(next.doc.blocks[0].runs).toEqual([{ text: 'ab', marks: BOLD }])
    expect(activeMarks(stateOf([para('')]))).toBe(0)
  })

  it('sets, extends and removes a link', () => {
    const state = stateOf([para('go there')], 0, 3, { block: 0, offset: 8 })
    const linked = setLink(state, '/x')
    expect(linked.doc.blocks[0].runs).toEqual([
      { text: 'go ', marks: 0 },
      { text: 'there', marks: 0, href: '/x' },
    ])
    expect(activeLink(linked)).toBe('/x')
    const caret = { ...linked, selection: collapseAt({ block: 0, offset: 5 }) }
    expect(activeLink(caret)).toBe('/x')
    expect(setLink(caret, '/y').doc.blocks[0].runs[1]).toEqual({
      text: 'there',
      marks: 0,
      href: '/y',
    })
    expect(setLink(caret, null).doc.blocks[0].runs).toEqual([{ text: 'go there', marks: 0 }])
    const outside = stateOf([para('plain')], 0, 2)
    expect(setLink(outside, '/z')).toBe(outside)
    const all = {
      ...linked,
      selection: {
        anchor: { block: 0, offset: 0 },
        focus: { block: 0, offset: 8 },
      },
    }
    expect(activeLink(all)).toBeUndefined()
    expect(
      activeLink(stateOf([para('a'), para('b')], 0, 0, { block: 1, offset: 1 })),
    ).toBeUndefined()
    const code = stateOf([para('abc', 0, 'code')], 0, 0, {
      block: 0,
      offset: 3,
    })
    expect(setLink(code, '/x').doc.blocks[0].runs).toEqual([{ text: 'abc', marks: 0 }])
  })

  it('extends a link made of several runs', () => {
    const block: Block = {
      type: 'paragraph',
      runs: [
        { text: 'a', marks: 0, href: '/x' },
        { text: 'b', marks: BOLD, href: '/x' },
        { text: ' c', marks: 0 },
      ],
    }
    expect(setLink(stateOf([block], 0, 1), null).doc.blocks[0].runs).toEqual([
      { text: 'a', marks: 0 },
      { text: 'b', marks: BOLD },
      { text: ' c', marks: 0 },
    ])
  })

  it('turns a markdown prefix into a block type', () => {
    expect(autoformat(stateOf([para('##')], 0, 2))?.doc.blocks[0]).toEqual({
      type: 'heading2',
      runs: [],
    })
    expect(autoformat(stateOf([para('1.')], 0, 2))?.doc.blocks[0].type).toBe('ordered')
    expect(autoformat(stateOf([para('word')], 0, 4))).toBeNull()
    expect(autoformat(stateOf([para('-')], 0, 1, { block: 0, offset: 0 }))).toBeNull()
    expect(autoformat(stateOf([para('-', 0, 'quote')], 0, 1))).toBeNull()
  })
})

describe('font, size and alignment', () => {
  it('packs the font and the size next to the marks', () => {
    const marks = withSize(withFont(BOLD, 'serif'), 'huge')
    expect(marks & BOLD).toBe(BOLD)
    expect(fontOf(marks)).toBe('serif')
    expect(sizeOf(marks)).toBe('huge')
    expect(fontOf(withFont(marks, null))).toBeUndefined()
    expect(sizeOf(withSize(marks, null))).toBeUndefined()
    expect(fontOf(BOLD)).toBeUndefined()
  })

  it('sets the font and the size of a selection', () => {
    const state = stateOf([para('abcd')], 0, 1, { block: 0, offset: 3 })
    const next = setSize(setFont(state, 'mono'), 'small')
    expect(
      next.doc.blocks[0].runs.map((run) => [run.text, fontOf(run.marks), sizeOf(run.marks)]),
    ).toEqual([
      ['a', undefined, undefined],
      ['bc', 'mono', 'small'],
      ['d', undefined, undefined],
    ])
    expect(activeFont(next)).toBe('mono')
    const wide = {
      ...next,
      selection: {
        anchor: { block: 0, offset: 0 },
        focus: { block: 0, offset: 4 },
      },
    }
    expect(activeFont(wide)).toBeUndefined()
    expect(activeSize(wide)).toBeUndefined()
    expect(activeSize({ ...next, selection: collapseAt({ block: 0, offset: 0 }) })).toBeNull()
    const cleared = setFont(next, null)
    expect(fontOf(cleared.doc.blocks[0].runs[1].marks)).toBeUndefined()
    expect(sizeOf(cleared.doc.blocks[0].runs[1].marks)).toBe('small')
  })

  it('types with the font chosen for a collapsed caret, and skips code blocks', () => {
    const base = stateOf([para('ab')], 0, 2)
    const typed = insertText(setFont(base, 'serif'), 'c')
    expect(typed.doc.blocks[0].runs.map((run) => [run.text, fontOf(run.marks)])).toEqual([
      ['ab', undefined],
      ['c', 'serif'],
    ])
    expect(activeFont(setFont(base, 'sans'))).toBe('sans')
    const code = stateOf([para('abc', 0, 'code')], 0, 0, {
      block: 0,
      offset: 3,
    })
    expect(setFont(code, 'serif').doc.blocks[0].runs).toEqual([{ text: 'abc', marks: 0 }])
  })

  it('aligns blocks and keeps the alignment while editing', () => {
    const state = stateOf([para('ab'), para('cd'), para('ef', 0, 'code')], 0, 0, {
      block: 2,
      offset: 1,
    })
    const centered = setAlign(state, 'center')
    expect(centered.doc.blocks.map((b) => b.align)).toEqual(['center', 'center', undefined])
    expect(activeAlign(centered)).toBeUndefined()
    expect(
      activeAlign({
        ...centered,
        selection: collapseAt({ block: 0, offset: 0 }),
      }),
    ).toBe('center')
    expect(activeAlign(stateOf([para('x')]))).toBeNull()
    expect(setAlign(centered, null).doc.blocks[0]).toEqual({
      type: 'paragraph',
      runs: [{ text: 'ab', marks: 0 }],
    })

    const one = { ...centered, selection: collapseAt({ block: 0, offset: 1 }) }
    expect(splitBlock(one).doc.blocks.map((b) => b.align)).toEqual([
      'center',
      'center',
      'center',
      undefined,
    ])
    expect(insertText(one, 'x').doc.blocks[0].align).toBe('center')
    expect(
      toggleMark(
        {
          ...one,
          selection: {
            anchor: { block: 0, offset: 0 },
            focus: { block: 0, offset: 2 },
          },
        },
        BOLD,
      ).doc.blocks[0].align,
    ).toBe('center')
    expect(setBlockType(one, 'quote').doc.blocks[0].align).toBe('center')
    expect(
      deleteBackward({ ...one, selection: collapseAt({ block: 1, offset: 0 }) }).doc.blocks[0]
        .align,
    ).toBe('center')
    expect(insertBlocks(one, [para('a'), para('b')]).doc.blocks[0].align).toBe('center')
    const pasted = insertBlocks(stateOf([para('')]), [{ ...para('x'), align: 'end' }])
    expect(pasted.doc.blocks[0].align).toBe('end')
    const tail = insertBlocks(one, [para('a'), { ...para('b'), align: 'end' }])
    expect(tail.doc.blocks[1].align).toBe('end')
    expect(
      setLink(
        {
          ...one,
          selection: {
            anchor: { block: 0, offset: 0 },
            focus: { block: 0, offset: 2 },
          },
        },
        '/x',
      ).doc.blocks[0].align,
    ).toBe('center')
    expect(
      autoformat({ ...stateOf([{ ...para('#'), align: 'center' }], 0, 1) })?.doc.blocks[0].align,
    ).toBe('center')
  })
})

describe('history', () => {
  const a = stateOf([para('a')])
  const b = stateOf([para('b')])
  const c = stateOf([para('c')])

  it('records, undoes and redoes', () => {
    const history = record(emptyHistory(), a, 'format', 0)
    const undone = undo(history, b)
    expect(undone?.state).toBe(a)
    expect(redo(undone!.history, a)?.state).toBe(b)
    expect(undo(emptyHistory(), a)).toBeNull()
    expect(redo(emptyHistory(), a)).toBeNull()
  })

  it('coalesces typing in a short window and breaks the run', () => {
    let history = record(emptyHistory(), a, 'type', 0)
    history = record(history, b, 'type', 500)
    expect(history.past).toEqual([a])
    history = record(history, c, 'type', 2000)
    expect(history.past).toEqual([a, c])
    const broken = breakRun(history)
    expect(broken.kind).toBeNull()
    expect(breakRun(broken)).toBe(broken)
    expect(record(broken, b, 'type', 2100).past).toHaveLength(3)
  })

  it('clears the redo stack and limits its size', () => {
    let history = record(emptyHistory(), a, 'format', 0)
    history = undo(history, b)!.history
    expect(history.future).toHaveLength(1)
    expect(record(history, c, 'format', 1).future).toHaveLength(0)
    let long = emptyHistory()
    for (let i = 0; i < 250; i++) long = record(long, a, 'format', i)
    expect(long.past).toHaveLength(200)
  })
})
