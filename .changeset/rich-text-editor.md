---
'@loica-ui/react': minor
---

Add `RichTextEditor`, a rich text editor with no dependencies: paragraphs, headings, lists, quotes and code blocks, with bold, italic, underline, inline code and links, three font families, three font sizes and four text alignments. It is a form control that reads and reports HTML (`value`, `defaultValue` and `onValueChange`), works inside a `Field`, has the `outline`, `filled`, `underline` and `unstyled` variants and the `sm`, `md` and `lg` sizes, takes its texts from the `LocaleProvider` (`richTextEditor`), and cleans what is pasted from Word and Google Docs. It is a hybrid: without children it renders its toolbar and content, and with `RichTextEditorToolbar`, `RichTextEditorGroup`, `RichTextEditorTool` and `RichTextEditorContent` you choose the tools, move the toolbar or add buttons of your own. `htmlToMarkdown` converts its HTML into Markdown.
