import { fromHtml } from './richtexteditor-parse'
import { toMarkdown } from './richtexteditor-serialize'

/**
 * Converts the HTML that `RichTextEditor` reports into Markdown: headings, bold, italic, inline code, links, lists,
 * quotes and code blocks. Underline, font, size and alignment have no Markdown form, so they are dropped. It reads the
 * HTML with the `DOMParser` of the browser, so call it in an event handler or an effect, not while rendering on the
 * server.
 *
 * @since 1.5
 */
export const htmlToMarkdown = (html: string): string => toMarkdown(fromHtml(html))
