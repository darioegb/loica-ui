export const BOLD = 1
export const ITALIC = 2
export const UNDERLINE = 4
export const CODE = 8

/** Font family and size live in the same number as the marks: two bits each, above the four marks. */
export const FONT_SHIFT = 4
export const SIZE_SHIFT = 6
export const FONT_MASK = 3 << FONT_SHIFT
export const SIZE_MASK = 3 << SIZE_SHIFT

export const FONTS = ['sans', 'serif', 'mono'] as const
export const SIZES = ['small', 'large', 'huge'] as const
export const ALIGNS = ['center', 'end', 'justify'] as const

export type FontKey = (typeof FONTS)[number]
export type SizeKey = (typeof SIZES)[number]
export type Align = (typeof ALIGNS)[number]

export const FONT_CSS: Record<FontKey, string> = {
  sans: 'ui-sans-serif,system-ui,sans-serif',
  serif: 'ui-serif,Georgia,serif',
  mono: 'ui-monospace,SFMono-Regular,Menlo,monospace',
}

export const SIZE_CSS: Record<SizeKey, string> = {
  small: '0.875em',
  large: '1.25em',
  huge: '1.75em',
}

export const fontOf = (marks: number): FontKey | undefined =>
  FONTS[((marks & FONT_MASK) >> FONT_SHIFT) - 1]

export const sizeOf = (marks: number): SizeKey | undefined =>
  SIZES[((marks & SIZE_MASK) >> SIZE_SHIFT) - 1]

export const withFont = (marks: number, font: FontKey | null): number =>
  (marks & ~FONT_MASK) | (font ? (FONTS.indexOf(font) + 1) << FONT_SHIFT : 0)

export const withSize = (marks: number, size: SizeKey | null): number =>
  (marks & ~SIZE_MASK) | (size ? (SIZES.indexOf(size) + 1) << SIZE_SHIFT : 0)

export type BlockType =
  'paragraph' | 'heading1' | 'heading2' | 'heading3' | 'quote' | 'code' | 'bullet' | 'ordered'

export interface Run {
  text: string
  marks: number
  href?: string
}

export interface Block {
  type: BlockType
  align?: Align
  runs: readonly Run[]
}

export interface Doc {
  blocks: readonly Block[]
}

export interface Point {
  block: number
  offset: number
}

export interface Selection {
  anchor: Point
  focus: Point
}

export interface EditorState {
  doc: Doc
  selection: Selection
  /** Marks the next typed character takes when the caret is collapsed; `null` derives them from the text. */
  pending: number | null
}

export const last = <T>(items: readonly T[]): T | undefined => items[items.length - 1]

export const isList = (type: BlockType): boolean => type === 'bullet' || type === 'ordered'

export const emptyBlock = (type: BlockType = 'paragraph'): Block => ({
  type,
  runs: [],
})

export const createDoc = (): Doc => ({ blocks: [emptyBlock()] })

export const blockText = (block: Block): string => block.runs.map((run) => run.text).join('')

export const blockLength = (block: Block): number =>
  block.runs.reduce((total, run) => total + run.text.length, 0)

export const normalizeRuns = (runs: readonly Run[]): Run[] => {
  const out: Run[] = []
  for (const run of runs) {
    if (!run.text) continue
    const previous = last(out)
    if (previous && previous.marks === run.marks && previous.href === run.href) {
      out[out.length - 1] = { ...previous, text: previous.text + run.text }
    } else {
      out.push(run)
    }
  }
  return out
}

export const sliceRuns = (runs: readonly Run[], from: number, to: number): Run[] => {
  const out: Run[] = []
  let position = 0
  for (const run of runs) {
    const end = position + run.text.length
    if (end > from && position < to) {
      out.push({
        ...run,
        text: run.text.slice(Math.max(from - position, 0), to - position),
      })
    }
    position = end
  }
  return out
}

export const spliceRuns = (
  runs: readonly Run[],
  from: number,
  to: number,
  insert: readonly Run[],
): Run[] =>
  normalizeRuns([...sliceRuns(runs, 0, from), ...insert, ...sliceRuns(runs, to, Infinity)])

export const mapRuns = (
  runs: readonly Run[],
  from: number,
  to: number,
  change: (run: Run) => Run,
): Run[] =>
  normalizeRuns([
    ...sliceRuns(runs, 0, from),
    ...sliceRuns(runs, from, to).map(change),
    ...sliceRuns(runs, to, Infinity),
  ])

export const styleAt = (
  runs: readonly Run[],
  offset: number,
): { marks: number; href: string | undefined } => {
  let before: Run | undefined
  let after: Run | undefined
  let position = 0
  for (const run of runs) {
    const end = position + run.text.length
    if (position < offset && offset <= end) before = run
    if (position <= offset && offset < end) after = run
    position = end
  }
  return {
    marks: (before ?? after)?.marks ?? 0,
    href: before && before.href === after?.href ? before.href : undefined,
  }
}

export const comparePoints = (a: Point, b: Point): number =>
  a.block - b.block || a.offset - b.offset

export const orderSelection = (selection: Selection): { start: Point; end: Point } =>
  comparePoints(selection.anchor, selection.focus) <= 0
    ? { start: selection.anchor, end: selection.focus }
    : { start: selection.focus, end: selection.anchor }

export const isCollapsed = (selection: Selection): boolean =>
  comparePoints(selection.anchor, selection.focus) === 0

export const collapseAt = (point: Point): Selection => ({
  anchor: point,
  focus: point,
})

export const clampPoint = (doc: Doc, point: Point): Point => {
  const block = Math.min(Math.max(point.block, 0), doc.blocks.length - 1)
  return {
    block,
    offset: Math.min(Math.max(point.offset, 0), blockLength(doc.blocks[block])),
  }
}

export const clampSelection = (doc: Doc, selection: Selection): Selection => ({
  anchor: clampPoint(doc, selection.anchor),
  focus: clampPoint(doc, selection.focus),
})

export const createState = (doc: Doc): EditorState => ({
  doc: doc.blocks.length ? doc : createDoc(),
  selection: collapseAt({ block: 0, offset: 0 }),
  pending: null,
})
