import type { Block, BlockType, Doc, Run } from './richtexteditor-model'
import {
  BOLD,
  blockLength,
  blockText,
  CODE,
  FONT_CSS,
  fontOf,
  ITALIC,
  SIZE_CSS,
  sizeOf,
  UNDERLINE,
} from './richtexteditor-model'

const SAFE_SCHEMES = new Set(['http', 'https', 'mailto', 'tel'])

export const safeHref = (url: string | null | undefined): string | undefined => {
  const value = url?.trim()
  if (!value) return undefined
  const compact = [...value].filter((char) => char.charCodeAt(0) > 32).join('')
  const scheme = /^([a-z][a-z\d+.-]*):/i.exec(compact)
  return !scheme || SAFE_SCHEMES.has(scheme[1].toLowerCase()) ? value : undefined
}

export const TAGS: Record<BlockType, string> = {
  paragraph: 'p',
  heading1: 'h1',
  heading2: 'h2',
  heading3: 'h3',
  quote: 'blockquote',
  code: 'pre',
  bullet: 'li',
  ordered: 'li',
}

const escapeHtml = (text: string): string =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const escapeAttribute = (text: string): string => escapeHtml(text).replace(/"/g, '&quot;')

const runHtml = (run: Run): string => {
  let html = escapeHtml(run.text).replace(/\n/g, '<br>')
  if (run.marks & CODE) html = `<code>${html}</code>`
  if (run.marks & UNDERLINE) html = `<u>${html}</u>`
  if (run.marks & ITALIC) html = `<em>${html}</em>`
  if (run.marks & BOLD) html = `<strong>${html}</strong>`
  const font = fontOf(run.marks)
  const size = sizeOf(run.marks)
  if (font || size) {
    const css = [font && `font-family:${FONT_CSS[font]}`, size && `font-size:${SIZE_CSS[size]}`]
    html = `<span style="${css.filter(Boolean).join(';')}">${html}</span>`
  }
  const href = safeHref(run.href)
  return href ? `<a href="${escapeAttribute(href)}">${html}</a>` : html
}

export const alignStyle = (block: Block): string =>
  block.align ? ` style="text-align:${block.align}"` : ''

export const inlineHtml = (block: Block): string => {
  if (block.type === 'code') return escapeHtml(blockText(block))
  const html = block.runs.map(runHtml).join('')
  return blockLength(block) === 0 || blockText(block).endsWith('\n') ? `${html}<br>` : html
}

export const toHtml = (doc: Doc): string => {
  const out: string[] = []
  let list: BlockType | null = null
  const close = (): void => {
    if (list) out.push(list === 'bullet' ? '</ul>' : '</ol>')
    list = null
  }
  for (const block of doc.blocks) {
    if (block.type === 'bullet' || block.type === 'ordered') {
      if (list !== block.type) {
        close()
        out.push(block.type === 'bullet' ? '<ul>' : '<ol>')
        list = block.type
      }
      out.push(`<li${alignStyle(block)}>${inlineHtml(block)}</li>`)
      continue
    }
    close()
    const tag = TAGS[block.type]
    const body = block.type === 'code' ? `<code>${inlineHtml(block)}</code>` : inlineHtml(block)
    out.push(`<${tag}${alignStyle(block)}>${body}</${tag}>`)
  }
  close()
  return out.join('')
}

const MARKDOWN_SPECIAL = /([\\`*_[\]<>])/g

const escapeMarkdown = (text: string): string => text.replace(MARKDOWN_SPECIAL, '\\$1')

const wrapDelimiter = (text: string, delimiter: string): string => {
  const [, lead, body, trail] = /^(\s*)([\s\S]*?)(\s*)$/.exec(text) as RegExpExecArray
  return body ? `${lead}${delimiter}${body}${delimiter}${trail}` : text
}

const runMarkdown = (run: Run): string => {
  const { text } = run
  let out: string
  if (run.marks & CODE) {
    const longest = Math.max(0, ...(text.match(/`+/g) ?? []).map((ticks) => ticks.length))
    const fence = '`'.repeat(longest + 1)
    out = `${fence}${text.startsWith('`') || text.endsWith('`') ? ` ${text} ` : text}${fence}`
  } else {
    out = escapeMarkdown(text)
  }
  if (run.marks & UNDERLINE) out = `<u>${out}</u>`
  if (run.marks & ITALIC) out = wrapDelimiter(out, '*')
  if (run.marks & BOLD) out = wrapDelimiter(out, '**')
  const href = safeHref(run.href)
  return href ? `[${out}](${href.replace(/ /g, '%20').replace(/\)/g, '%29')})` : out
}

const blockMarkdown = (block: Block): string => {
  if (block.type === 'code') {
    const text = blockText(block)
    const fence = '`'.repeat(Math.max(3, ...(text.match(/`+/g) ?? []).map((t) => t.length + 1)))
    return `${fence}\n${text}\n${fence}`
  }
  return block.runs
    .map(runMarkdown)
    .join('')
    .split('\n')
    .map((line, i) => (i ? `  \n${line}` : line))
    .join('')
}

export const toMarkdown = (doc: Doc): string => {
  const out: string[] = []
  let number = 0
  doc.blocks.forEach((block, i) => {
    const previous = doc.blocks[i - 1]
    number = block.type === 'ordered' ? (previous?.type === 'ordered' ? number + 1 : 1) : 0
    let text = blockMarkdown(block)
    if (block.type === 'paragraph')
      text = text.replace(/^(\d+)\./, '$1\\.').replace(/^([#>+-])/, '\\$1')
    else if (block.type === 'quote') text = text.replace(/\n/g, '\n> ').replace(/^/, '> ')
    else if (block.type.startsWith('heading'))
      text = `${'#'.repeat(Number(block.type.slice(-1)))} ${text}`
    else if (block.type === 'bullet') text = `- ${text.replace(/\n/g, '\n  ')}`
    else if (block.type === 'ordered')
      text = `${number}. ${text.replace(/\n/g, `\n${' '.repeat(String(number).length + 2)}`)}`
    const sameList =
      previous &&
      previous.type === block.type &&
      (block.type === 'bullet' || block.type === 'ordered')
    out.push(out.length ? (sameList ? '\n' : '\n\n') + text : text)
  })
  return out.join('')
}
