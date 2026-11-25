import type { Align, Block, BlockType, Doc, Run } from './richtexteditor-model'
import {
  BOLD,
  CODE,
  emptyBlock,
  FONT_CSS,
  FONTS,
  ITALIC,
  normalizeRuns,
  SIZE_CSS,
  SIZES,
  UNDERLINE,
  withFont,
  withSize,
} from './richtexteditor-model'
import { safeHref } from './richtexteditor-serialize'

const BLOCKS: Record<string, BlockType> = {
  P: 'paragraph',
  H1: 'heading1',
  H2: 'heading2',
  H3: 'heading3',
  H4: 'heading3',
  H5: 'heading3',
  H6: 'heading3',
  BLOCKQUOTE: 'quote',
  PRE: 'code',
  TD: 'paragraph',
  TH: 'paragraph',
  DT: 'paragraph',
  DD: 'paragraph',
}

const CONTAINERS = new Set([
  'ARTICLE',
  'ASIDE',
  'BODY',
  'CENTER',
  'DIV',
  'FIELDSET',
  'FIGCAPTION',
  'FIGURE',
  'FOOTER',
  'FORM',
  'HEADER',
  'HTML',
  'MAIN',
  'NAV',
  'SECTION',
  'TABLE',
  'TBODY',
  'TFOOT',
  'THEAD',
  'TR',
  'DL',
])

const SKIPPED = new Set([
  'BUTTON',
  'HEAD',
  'IFRAME',
  'IMG',
  'INPUT',
  'LINK',
  'META',
  'NOSCRIPT',
  'O:P',
  'SCRIPT',
  'SELECT',
  'STYLE',
  'SVG',
  'TEMPLATE',
  'TEXTAREA',
  'TITLE',
  'XML',
])

const TEXT = 3
const ELEMENT = 1

const styleOf = (element: Element): string =>
  (element.getAttribute('style') ?? '').toLowerCase().replace(/\s+/g, '')

const isIgnored = (element: Element): boolean =>
  SKIPPED.has(element.tagName.toUpperCase()) || styleOf(element).includes('mso-list:ignore')

const isBlockTag = (tag: string): boolean =>
  tag in BLOCKS || CONTAINERS.has(tag) || tag === 'UL' || tag === 'OL' || tag === 'LI'

const hasBlockChild = (element: Element): boolean =>
  Array.from(element.children).some((child) => isBlockTag(child.tagName.toUpperCase()))

const BLOCK_SELECTOR = 'p,div,ul,ol,li,h1,h2,h3,h4,h5,h6,blockquote,pre,table'

export const isTrailingBreak = (br: Node, block: Node): boolean => {
  let node: Node | null = br
  while (node && node !== block) {
    if (node.nextSibling) return false
    node = node.parentNode
  }
  return true
}

const marksOf = (element: Element, marks: number): number => {
  const tag = element.tagName.toUpperCase()
  const style = styleOf(element)
  let next = marks
  if (tag === 'B' || tag === 'STRONG') next |= BOLD
  if (tag === 'I' || tag === 'EM' || tag === 'CITE' || tag === 'DFN') next |= ITALIC
  if (tag === 'U' || tag === 'INS') next |= UNDERLINE
  if (['CODE', 'KBD', 'SAMP', 'TT'].includes(tag)) next |= CODE
  if (/font-weight:(bold|bolder|[6-9]00)/.test(style)) next |= BOLD
  else if (/font-weight:(normal|lighter|[1-5]00)/.test(style)) next &= ~BOLD
  if (/font-style:italic/.test(style)) next |= ITALIC
  else if (/font-style:normal/.test(style)) next &= ~ITALIC
  if (tag !== 'A' && /text-decoration[^;]*underline/.test(style)) next |= UNDERLINE
  const family = /font-family:([^;]+)/.exec(style)?.[1]
  const font = FONTS.find((key) => FONT_CSS[key].toLowerCase() === family)
  if (font) next = withFont(next, font)
  const fontSize = /font-size:([^;]+)/.exec(style)?.[1]
  const size = SIZES.find((key) => SIZE_CSS[key] === fontSize)
  if (size) next = withSize(next, size)
  return next
}

const alignOf = (element: Element): Align | undefined => {
  const value =
    /text-align:([^;]+)/.exec(styleOf(element))?.[1] ?? element.getAttribute('align')?.toLowerCase()
  if (value === 'right' || value === 'end') return 'end'
  return value === 'center' || value === 'justify' ? value : undefined
}

interface Context {
  blocks: Block[]
  elements: Element[]
  loose: Run[]
  looseSource: Element | null
  preserve: boolean
}

const collapse = (runs: Run[]): Run[] => {
  let previousSpace = true
  const out = runs.map((run) => {
    let text = ''
    for (const char of run.text) {
      if (char === ' ') {
        if (!previousSpace) text += char
        previousSpace = true
      } else {
        text += char
        previousSpace = char === '\n'
      }
    }
    return { ...run, text }
  })
  const tail = out.filter((run) => run.text).pop()
  if (tail?.text.endsWith(' ')) tail.text = tail.text.slice(0, -1)
  return out
}

const inline = (
  node: Node,
  marks: number,
  href: string | undefined,
  runs: Run[],
  block: Element,
  context: Context,
  nested: Element[],
  code: boolean,
): void => {
  if (node.nodeType === TEXT) {
    const raw = (node as Text).data.replace(/[\u200B\uFEFF\r]/g, '').replace(/\u00A0/g, ' ')
    const text = context.preserve || code ? raw : raw.replace(/\s+/g, ' ')
    if (text) runs.push({ text, marks, ...(href ? { href } : {}) })
    return
  }
  if (node.nodeType !== ELEMENT) return
  const element = node as Element
  const tag = element.tagName.toUpperCase()
  if (isIgnored(element)) return
  if (tag === 'UL' || tag === 'OL') {
    nested.push(element)
    return
  }
  if (tag === 'BR') {
    if (!isTrailingBreak(element, block))
      runs.push({ text: '\n', marks, ...(href ? { href } : {}) })
    return
  }
  const nextHref = tag === 'A' ? (safeHref(element.getAttribute('href')) ?? href) : href
  const nextMarks = marksOf(element, marks)
  for (const child of Array.from(element.childNodes)) {
    inline(child, nextMarks, nextHref, runs, block, context, nested, code)
  }
}

const wordListType = (element: Element): BlockType | null => {
  const isWord =
    /^MsoList/i.test(element.getAttribute('class') ?? '') || styleOf(element).includes('mso-list:')
  if (!isWord) return null
  const marker = element.querySelector('[style*="mso-list"]')?.textContent ?? ''
  return /^[\s\u00A0]*([\da-z]{1,3})[.)]/i.test(marker) ? 'ordered' : 'bullet'
}

const flush = (context: Context): void => {
  if (!context.loose.length) return
  const runs = context.preserve ? context.loose : collapse(context.loose)
  context.blocks.push({ type: 'paragraph', runs: normalizeRuns(runs) })
  context.elements.push(context.looseSource as Element)
  context.loose = []
  context.looseSource = null
}

const pushBlock = (
  element: Element,
  type: BlockType,
  context: Context,
  marks: number,
  href: string | undefined,
): void => {
  const runs: Run[] = []
  const nested: Element[] = []
  const code = type === 'code'
  for (const child of Array.from(element.childNodes)) {
    inline(child, marks, href, runs, element, context, nested, code)
  }
  const finished = context.preserve || code ? runs : collapse(runs)
  const align = code ? undefined : alignOf(element)
  context.blocks.push({
    type,
    ...(align ? { align } : {}),
    runs: normalizeRuns(code ? finished.map((run) => ({ text: run.text, marks: 0 })) : finished),
  })
  context.elements.push(element)
  for (const list of nested) {
    walk(list, context, list.tagName.toUpperCase() === 'UL' ? 'bullet' : 'ordered', marks, href)
  }
}

const walk = (parent: Node, context: Context, type: BlockType, marks = 0, href?: string): void => {
  for (const node of Array.from(parent.childNodes)) {
    if (node.nodeType !== ELEMENT) {
      if (node.nodeType === TEXT && ((node as Text).data.trim() || context.loose.length)) {
        context.looseSource ??= parent as Element
        inline(node, marks, href, context.loose, parent as Element, context, [], false)
      }
      continue
    }
    const element = node as Element
    const tag = element.tagName.toUpperCase()
    if (isIgnored(element)) continue
    if (!isBlockTag(tag)) {
      if (element.querySelector(BLOCK_SELECTOR)) {
        flush(context)
        const link = tag === 'A' ? (safeHref(element.getAttribute('href')) ?? href) : href
        walk(element, context, type, marksOf(element, marks), link)
      } else {
        context.looseSource ??= parent as Element
        inline(element, marks, href, context.loose, parent as Element, context, [], false)
      }
      continue
    }
    flush(context)
    if (tag === 'UL' || tag === 'OL') {
      walk(element, context, tag === 'UL' ? 'bullet' : 'ordered', marks, href)
    } else if (tag === 'LI') {
      pushBlock(element, type === 'ordered' ? 'ordered' : 'bullet', context, marks, href)
    } else if ((tag === 'BLOCKQUOTE' || CONTAINERS.has(tag)) && hasBlockChild(element)) {
      walk(element, context, tag === 'BLOCKQUOTE' ? 'quote' : type, marks, href)
    } else if (tag in BLOCKS) {
      const own = BLOCKS[tag]
      const listType = wordListType(element)
      pushBlock(
        element,
        listType ?? (own === 'paragraph' && type === 'quote' ? 'quote' : own),
        context,
        marks,
        href,
      )
    } else {
      pushBlock(element, type === 'quote' ? 'quote' : 'paragraph', context, marks, href)
    }
  }
  flush(context)
}

export interface ParsedDom {
  doc: Doc
  elements: Element[]
}

export const parseDom = (root: Element, preserve: boolean): ParsedDom => {
  const context: Context = {
    blocks: [],
    elements: [],
    loose: [],
    looseSource: null,
    preserve,
  }
  walk(root, context, 'paragraph')
  if (!context.blocks.length) return { doc: { blocks: [emptyBlock()] }, elements: [root] }
  return { doc: { blocks: context.blocks }, elements: context.elements }
}

export const fromHtml = (html: string): Doc =>
  parseDom(new DOMParser().parseFromString(html, 'text/html').body, false).doc

export const fromText = (text: string): Doc => {
  const lines = text.split(/\r\n|\r|\n/).filter((line) => line.trim())
  return {
    blocks: lines.length
      ? lines.map((line): Block => ({
          type: 'paragraph',
          runs: [{ text: line, marks: 0 }],
        }))
      : [emptyBlock()],
  }
}
