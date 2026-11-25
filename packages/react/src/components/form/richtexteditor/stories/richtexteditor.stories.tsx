import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { LocaleProvider } from '../../../../locale'
import { defaultTheme } from '../../../../theme'
import { Field } from '../../field'
import {
  RichTextEditor,
  RichTextEditorContent,
  RichTextEditorGroup,
  RichTextEditorTool,
  RichTextEditorToolbar,
  htmlToMarkdown,
} from '..'

const colorSchemes = Object.keys(defaultTheme.colors)

const SHORT =
  '<h2>Release notes</h2><p>The editor keeps <strong>bold</strong>, <em>italic</em> and <a href="https://loica-ui.dev">links</a>.</p>'

const SAMPLE = `<h1>Rich text without dependencies</h1>
<p>A document model of its own, rendered over <code>contenteditable</code> and driven by <code>beforeinput</code>. It supports <strong>bold</strong>, <em>italic</em>, <u>underline</u>, <code>code</code> and <a href="https://github.com/darioegb/loica-ui">links</a>.</p>
<p style="text-align:center"><span style="font-family:ui-serif,Georgia,serif;font-size:1.25em">Font family, font size and alignment too.</span></p>
<h2>Blocks</h2>
<ul><li>Bulleted lists</li><li>Quotes and code blocks</li></ul>
<ol><li>Type <code># </code>, <code>- </code>, <code>1. </code> or <code>&gt; </code> to start a block</li><li>Undo and redo with <code>Ctrl+Z</code></li></ol>
<blockquote>Pasting from Word or Google Docs keeps only what the editor understands.</blockquote>
<pre>const answer = 42</pre>`

/**
 * A rich text editor for notes, comments and articles, with no dependencies. The content is a document of
 * paragraphs, headings, lists, quotes and code blocks, with bold, italic, underline, inline code and links, three font
 * families, three font sizes and four text alignments. It reads and reports **HTML**, and `htmlToMarkdown` turns that
 * HTML into Markdown.
 *
 * It is built over `contenteditable` but takes its input from the `beforeinput` event instead of `execCommand`, so
 * the same code runs in every browser. Undo and redo have a history of their own, and a paste is cleaned of the
 * markup of Word and Google Docs: only what the editor understands is kept. The typing shortcuts are `#`, `##`,
 * `###`, `-`, `1.` and `>` followed by a space to start a block, and <kbd>Ctrl</kbd> + <kbd>B</kbd>, <kbd>I</kbd>,
 * <kbd>U</kbd>, <kbd>K</kbd>, <kbd>Z</kbd> and <kbd>Y</kbd> (<kbd>Cmd</kbd> on a Mac).
 *
 * The editor is a form control: the `ref` points to the editable element, `className` and `style` go to the wrapper
 * of the toolbar and the content, and the rest of the props (`id`, `aria-*`, `data-*`, the handlers) go to the
 * editable element, which carries `data-loica-richtexteditor-field`. The content renders in the browser: on the server
 * the editable area is empty until the page hydrates.
 *
 * ### Composing
 *
 * Without children the editor renders a `RichTextEditorToolbar` and a `RichTextEditorContent`. Write them yourself to
 * choose the tools (`RichTextEditorTool` with a `name`, in `RichTextEditorGroup`s), put the toolbar after the content
 * or add buttons of your own (a `RichTextEditorTool` with no `name`). The `ref`, the `placeholder` and the native
 * attributes of the editor, such as the `id` a `Field` gives it, still reach the `RichTextEditorContent`.
 *
 * ### Customizing
 *
 * The minimum height of the content is the `--richtexteditor-min-height` variable of the wrapper (`8em` by default).
 * The toolbar uses `Button` and `Dropdown`, so `variant="unstyled"` removes the Loica look from the editor and its
 * toolbar container but the buttons keep theirs. The state is on the wrapper as `data-disabled`, `data-readonly` and
 * `data-invalid`.
 *
 * ### Limits
 *
 * Nested lists are flattened, tables and images are not supported, and the Markdown output drops underline, font,
 * size and alignment because Markdown has no way to write them. Font families and sizes are fixed presets.
 */
const meta = {
  title: 'Components/RichTextEditor',
  component: RichTextEditor,
  tags: ['autodocs'],
  parameters: {
    docs: {
      toc: {
        title: 'On this page',
        disable: false,
      },
    },
    layout: 'padded',
  },
  argTypes: {
    className: { control: 'text' },
    style: { control: false },
    colorScheme: { control: 'select', options: colorSchemes },
    variant: {
      control: 'radio',
      options: ['outline', 'filled', 'underline', 'unstyled'],
    },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    placeholder: { control: 'text' },
    toolbar: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    required: { control: 'boolean' },
    value: { control: false },
    defaultValue: { control: 'text' },
    onValueChange: { control: false },
    id: { control: false },
    'aria-label': { control: 'text' },
    'aria-labelledby': { control: false },
    'aria-describedby': { control: false },
    'aria-invalid': { control: 'boolean' },
  },
  args: {
    'aria-label': 'Notes',
    placeholder: 'Write something...',
    defaultValue: SHORT,
    disabled: false,
    readOnly: false,
  },
} satisfies Meta<typeof RichTextEditor>

export default meta
type Story = StoryObj<typeof RichTextEditor>

/**
 * This is the default RichTextEditor.
 */
export const Default: Story = {}

/**
 * Use the **variant** prop to pick how the editor looks: `outline` draws a border, `filled` gives it a muted
 * background and `underline` only a line under it. `unstyled` drops the Loica styles so you can bring your own.
 */
export const Variants: Story = {
  parameters: {
    docs: {
      source: {
        code: `<RichTextEditor aria-label="Outline" placeholder="Outline" variant="outline" />
<RichTextEditor aria-label="Filled" placeholder="Filled" variant="filled" />
<RichTextEditor aria-label="Underline" placeholder="Underline" variant="underline" />
<RichTextEditor aria-label="Unstyled" placeholder="Unstyled" variant="unstyled" />`,
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <RichTextEditor aria-label="Outline" placeholder="Outline" variant="outline" />
      <RichTextEditor aria-label="Filled" placeholder="Filled" variant="filled" />
      <RichTextEditor aria-label="Underline" placeholder="Underline" variant="underline" />
      <RichTextEditor aria-label="Unstyled" placeholder="Unstyled" variant="unstyled" />
    </div>
  ),
}

/**
 * Use the **size** prop to change the size of the toolbar, of the text and of the padding.
 */
export const Sizes: Story = {
  parameters: {
    docs: {
      source: {
        code: `<RichTextEditor aria-label="Small" placeholder="Small" size="sm" />
<RichTextEditor aria-label="Medium" placeholder="Medium" size="md" />
<RichTextEditor aria-label="Large" placeholder="Large" size="lg" />`,
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <RichTextEditor aria-label="Small" placeholder="Small" size="sm" />
      <RichTextEditor aria-label="Medium" placeholder="Medium" size="md" />
      <RichTextEditor aria-label="Large" placeholder="Large" size="lg" />
    </div>
  ),
}

/**
 * Every color of the theme in the default `outline` variant. The **colorScheme** sets the color of the focus border
 * and ring and of the pressed buttons of the toolbar, in every variant.
 */
export const Colors: Story = {
  parameters: {
    docs: {
      source: {
        code: `<RichTextEditor aria-label="primary" colorScheme="primary" placeholder="Focus me: primary" />
<RichTextEditor aria-label="success" colorScheme="success" placeholder="Focus me: success" />
<RichTextEditor aria-label="warning" colorScheme="warning" placeholder="Focus me: warning" />`,
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      {colorSchemes.map((scheme) => (
        <RichTextEditor
          aria-label={scheme}
          colorScheme={scheme as keyof typeof defaultTheme.colors}
          key={scheme}
          placeholder={`Focus me: ${scheme}`}
          style={{ '--richtexteditor-min-height': '3em' } as React.CSSProperties}
        />
      ))}
    </div>
  ),
}

/**
 * Everything the editor writes, in one document: headings, bold, italic, underline, code, links, lists, quotes, code
 * blocks, fonts, sizes and alignment.
 */
export const WithContent: Story = {
  args: { 'aria-label': 'Document', defaultValue: SAMPLE },
}

function OutputExample(): React.ReactElement {
  const [html, setHtml] = useState(SHORT)
  return (
    <div className="flex flex-col gap-4">
      <RichTextEditor aria-label="Document" onValueChange={setHtml} value={html} />
      <pre aria-label="HTML" className="m-0 overflow-auto whitespace-pre-wrap">
        {html}
      </pre>
      <pre aria-label="Markdown" className="m-0 overflow-auto whitespace-pre-wrap">
        {htmlToMarkdown(html)}
      </pre>
    </div>
  )
}

/**
 * Give it a **value** and an **onValueChange** to control it. The editor reports the HTML of the document after every
 * change, and a **value** that differs from the last one it reported replaces the content and clears the undo
 * history. `htmlToMarkdown` converts the same HTML into Markdown; underline, font, size and alignment have no Markdown
 * form and are dropped.
 */
export const Controlled: Story = {
  parameters: {
    docs: {
      source: {
        code: `const [html, setHtml] = useState('<p>Edit me</p>')

<RichTextEditor aria-label="Document" onValueChange={setHtml} value={html} />
<pre>{html}</pre>
<pre>{htmlToMarkdown(html)}</pre>`,
      },
    },
  },
  render: () => <OutputExample />,
}

/**
 * With **toolbar** set to `false` there are no buttons, only the keyboard shortcuts and the typing shortcuts.
 */
export const WithoutToolbar: Story = {
  args: { toolbar: false },
}

/**
 * Every text of the editor comes from the `LocaleProvider`, under the `richTextEditor` key: the toolbar, each button
 * and the options of the font, size and alignment menus.
 */
export const Translated: Story = {
  parameters: {
    docs: {
      source: {
        code: `<LocaleProvider
  messages={{
    richTextEditor: {
      editor: 'Editor de texto',
      toolbar: 'Formato',
      bold: 'Negrita',
      italic: 'Cursiva',
      underline: 'Subrayado',
    },
  }}
>
  <RichTextEditor />
</LocaleProvider>`,
      },
    },
  },
  render: () => (
    <LocaleProvider
      messages={{
        richTextEditor: {
          editor: 'Editor de texto',
          toolbar: 'Formato',
          bold: 'Negrita',
          italic: 'Cursiva',
          underline: 'Subrayado',
          undo: 'Deshacer',
          redo: 'Rehacer',
          font: 'Fuente',
          fontDefault: 'Fuente predeterminada',
          size: 'Tamaño',
          sizeDefault: 'Normal',
        },
      }}
    >
      <RichTextEditor defaultValue="<p>Texto con <strong>negrita</strong></p>" />
    </LocaleProvider>
  ),
}

/**
 * A **readOnly** editor can be focused and selected but not changed, and it has no toolbar. A **disabled** one can't be
 * focused and its toolbar is disabled too.
 */
export const DisabledAndReadOnly: Story = {
  parameters: {
    docs: {
      source: {
        code: `<RichTextEditor aria-label="Read only" defaultValue="<p>Read only</p>" readOnly />
<RichTextEditor aria-label="Disabled" defaultValue="<p>Disabled</p>" disabled />`,
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <RichTextEditor aria-label="Read only" defaultValue="<p>Read only</p>" readOnly />
      <RichTextEditor aria-label="Disabled" defaultValue="<p>Disabled</p>" disabled />
    </div>
  ),
}

/**
 * Set `aria-invalid` to show the error color. Inside a `Field` it comes from the `errorText`.
 */
export const Invalid: Story = {
  args: { 'aria-invalid': true, defaultValue: '<p>Too short</p>' },
}

function BioExample(): React.ReactElement {
  const [html, setHtml] = useState('<p>Too short</p>')
  const tooShort = html.replace(/<[^>]*>/g, '').trim().length < 10
  return (
    <Field
      errorText="Write at least 10 characters"
      helperText="Tell us about yourself"
      invalid={tooShort}
      label="Bio"
      required
    >
      <RichTextEditor onValueChange={setHtml} value={html} />
    </Field>
  )
}

/**
 * Wrap it in a **Field** to add a label, a helper and an error text. The Field wires the accessibility attributes, and
 * the label names the editor. The Field does not validate: it shows the error text while **invalid** is on, so you
 * work the validity out from the value, as here, where it clears at 10 characters.
 */
export const WithField: Story = {
  parameters: {
    docs: {
      source: {
        code: `const [html, setHtml] = useState('<p>Too short</p>')
const tooShort = html.replace(/<[^>]*>/g, '').trim().length < 10

<Field errorText="Write at least 10 characters" helperText="Tell us about yourself" invalid={tooShort} label="Bio" required>
  <RichTextEditor onValueChange={setHtml} value={html} />
</Field>`,
      },
    },
  },
  render: () => <BioExample />,
}

/**
 * Inside `dir="rtl"` the toolbar runs from right to left, the arrow keys follow what the user sees, and the alignment
 * buttons mean the start and the end of the line.
 */
export const RightToLeft: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div dir="rtl">
  <RichTextEditor aria-label="Notes" defaultValue="<p>مرحبا بالعالم</p>" />
</div>`,
      },
    },
  },
  decorators: [
    (Story) => (
      <div dir="rtl">
        <Story />
      </div>
    ),
  ],
  args: { defaultValue: '<p>مرحبا بالعالم</p>' },
}

const CompoundExample = () => {
  const [html, setHtml] = useState('<p>A short comment with <strong>two tools</strong>.</p>')
  return (
    <RichTextEditor aria-label="Comment" onValueChange={setHtml} size="sm" value={html}>
      <RichTextEditorContent placeholder="Write a comment" />
      <RichTextEditorToolbar>
        <RichTextEditorGroup>
          <RichTextEditorTool name="bold" />
          <RichTextEditorTool name="italic" />
          <RichTextEditorTool name="link" />
        </RichTextEditorGroup>
        <RichTextEditorTool aria-label="Clear" onClick={() => setHtml('')}>
          Clear
        </RichTextEditorTool>
      </RichTextEditorToolbar>
    </RichTextEditor>
  )
}

/**
 * The editor built from its parts: a toolbar with only **bold**, **italic** and **link**, placed under the content, and
 * a button of your own that clears it. A `RichTextEditorTool` with a **name** is one of the tools of the editor (`undo`,
 * `redo`, `font`, `size`, `bold`, `italic`, `underline`, `code`, `link`, the four alignments and the block types);
 * without one it is a plain button, with `children` and `onClick`, that joins the arrow-key navigation of the toolbar.
 */
export const Compound: Story = {
  parameters: {
    docs: {
      source: {
        code: `const [html, setHtml] = useState('<p>A short comment with <strong>two tools</strong>.</p>')

<RichTextEditor aria-label="Comment" onValueChange={setHtml} size="sm" value={html}>
  <RichTextEditorContent placeholder="Write a comment" />
  <RichTextEditorToolbar>
    <RichTextEditorGroup>
      <RichTextEditorTool name="bold" />
      <RichTextEditorTool name="italic" />
      <RichTextEditorTool name="link" />
    </RichTextEditorGroup>
    <RichTextEditorTool aria-label="Clear" onClick={() => setHtml('')}>
      Clear
    </RichTextEditorTool>
  </RichTextEditorToolbar>
</RichTextEditor>`,
      },
    },
  },
  render: () => <CompoundExample />,
}

const TAILWIND = {
  root: 'rounded-xl border border-gray-300 bg-white text-gray-900 shadow-xs focus-within:border-blue-500 focus-within:ring-3 focus-within:ring-blue-200 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100',
  toolbar: 'flex flex-wrap items-center gap-2 border-b border-gray-200 p-1 dark:border-gray-700',
  group: 'gap-1 border-e border-gray-200 pe-2 last:border-0 dark:border-gray-700',
  content: 'px-4 py-3 text-sm',
}

/**
 * Some examples of RichTextEditor with Tailwind classes. With `variant="unstyled"` the editor and its parts have no
 * Loica styles, so the wrapper, the `RichTextEditorToolbar`, each `RichTextEditorGroup` and the `RichTextEditorContent`
 * take the classes you give them. The buttons of the toolbar are `Button`s and keep their look.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<RichTextEditor
  className="${TAILWIND.root}"
  defaultValue="<p>Styled with <strong>Tailwind</strong></p>"
  variant="unstyled"
>
  <RichTextEditorToolbar className="${TAILWIND.toolbar}">
    <RichTextEditorGroup className="${TAILWIND.group}">
      <RichTextEditorTool name="undo" />
      <RichTextEditorTool name="redo" />
    </RichTextEditorGroup>
    <RichTextEditorGroup className="${TAILWIND.group}">
      <RichTextEditorTool name="bold" />
      <RichTextEditorTool name="italic" />
      <RichTextEditorTool name="link" />
    </RichTextEditorGroup>
    <RichTextEditorGroup className="${TAILWIND.group}">
      <RichTextEditorTool name="bullet" />
      <RichTextEditorTool name="ordered" />
    </RichTextEditorGroup>
  </RichTextEditorToolbar>
  <RichTextEditorContent aria-label="Notes" className="${TAILWIND.content}" />
</RichTextEditor>`,
      },
    },
  },
  render: () => (
    <RichTextEditor
      className={TAILWIND.root}
      defaultValue="<p>Styled with <strong>Tailwind</strong></p>"
      variant="unstyled"
    >
      <RichTextEditorToolbar className={TAILWIND.toolbar}>
        <RichTextEditorGroup className={TAILWIND.group}>
          <RichTextEditorTool name="undo" />
          <RichTextEditorTool name="redo" />
        </RichTextEditorGroup>
        <RichTextEditorGroup className={TAILWIND.group}>
          <RichTextEditorTool name="bold" />
          <RichTextEditorTool name="italic" />
          <RichTextEditorTool name="link" />
        </RichTextEditorGroup>
        <RichTextEditorGroup className={TAILWIND.group}>
          <RichTextEditorTool name="bullet" />
          <RichTextEditorTool name="ordered" />
        </RichTextEditorGroup>
      </RichTextEditorToolbar>
      <RichTextEditorContent aria-label="Notes" className={TAILWIND.content} />
    </RichTextEditor>
  ),
}

/**
 * Some examples of RichTextEditor with Bootstrap classes: the wrapper takes `border`, `rounded` and `bg-body`, and the
 * toolbar, its groups and the content take the spacing and flex utilities, each on its own part.
 */
export const Bootstrap: Story = {
  parameters: {
    docs: {
      source: {
        code: `<RichTextEditor
  className="border rounded bg-body text-body"
  defaultValue="<p>Styled with <strong>Bootstrap</strong></p>"
  variant="unstyled"
>
  <RichTextEditorToolbar className="d-flex flex-wrap align-items-center gap-3 border-bottom p-1">
    <RichTextEditorGroup className="gap-1">
      <RichTextEditorTool name="undo" />
      <RichTextEditorTool name="redo" />
    </RichTextEditorGroup>
    <RichTextEditorGroup className="gap-1">
      <RichTextEditorTool name="bold" />
      <RichTextEditorTool name="italic" />
      <RichTextEditorTool name="link" />
    </RichTextEditorGroup>
    <RichTextEditorGroup className="gap-1">
      <RichTextEditorTool name="bullet" />
      <RichTextEditorTool name="ordered" />
    </RichTextEditorGroup>
  </RichTextEditorToolbar>
  <RichTextEditorContent aria-label="Notes" className="px-3 py-2" />
</RichTextEditor>`,
      },
    },
  },
  render: () => (
    <RichTextEditor
      className="border rounded bg-body text-body"
      defaultValue="<p>Styled with <strong>Bootstrap</strong></p>"
      variant="unstyled"
    >
      <RichTextEditorToolbar className="d-flex flex-wrap align-items-center gap-3 border-bottom p-1">
        <RichTextEditorGroup className="gap-1">
          <RichTextEditorTool name="undo" />
          <RichTextEditorTool name="redo" />
        </RichTextEditorGroup>
        <RichTextEditorGroup className="gap-1">
          <RichTextEditorTool name="bold" />
          <RichTextEditorTool name="italic" />
          <RichTextEditorTool name="link" />
        </RichTextEditorGroup>
        <RichTextEditorGroup className="gap-1">
          <RichTextEditorTool name="bullet" />
          <RichTextEditorTool name="ordered" />
        </RichTextEditorGroup>
      </RichTextEditorToolbar>
      <RichTextEditorContent aria-label="Notes" className="px-3 py-2" />
    </RichTextEditor>
  ),
}
