import { act, fireEvent, render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Field } from '../../field'
import { LocaleProvider } from '../../../../locale'
import { RichTextEditor, htmlToMarkdown } from '..'

const editor = (): HTMLElement => screen.getByRole('textbox')
const html = (): string => editor().innerHTML

const select = (node: Node, offset: number, focusNode: Node = node, focusOffset = offset): void => {
  document.getSelection()?.setBaseAndExtent(node, offset, focusNode, focusOffset)
}

const textOf = (selector: string, index = 0): Text =>
  editor().querySelectorAll(selector)[index].firstChild as Text

const before = (inputType: string, init: InputEventInit & { ranges?: StaticRange[] } = {}) => {
  const { ranges, dataTransfer, ...rest } = init
  const event = new InputEvent('beforeinput', {
    inputType,
    bubbles: true,
    cancelable: true,
    ...rest,
  })
  if (ranges) Object.defineProperty(event, 'getTargetRanges', { value: () => ranges })
  if (dataTransfer) Object.defineProperty(event, 'dataTransfer', { value: dataTransfer })
  act(() => {
    editor().dispatchEvent(event)
  })
  return event
}

const span = (node: Node, start: number, end: number): StaticRange =>
  ({
    startContainer: node,
    startOffset: start,
    endContainer: node,
    endOffset: end,
  }) as unknown as StaticRange

const key = (name: string, init: KeyboardEventInit = {}): void => {
  fireEvent.keyDown(editor(), { key: name, ...init })
}

const paste = (data: Record<string, string>): Event => {
  const event = new Event('paste', { bubbles: true, cancelable: true })
  Object.defineProperty(event, 'clipboardData', {
    value: { getData: (type: string) => data[type] ?? '' },
  })
  act(() => {
    editor().dispatchEvent(event)
  })
  return event
}

const setup = (props: Parameters<typeof RichTextEditor>[0] = {}) => {
  const onValueChange = vi.fn<(value: string) => void>()
  const view = render(<RichTextEditor onValueChange={onValueChange} {...props} />)
  editor().focus()
  return { onValueChange, ...view }
}

const last = (fn: ReturnType<typeof vi.fn<(value: string) => void>>): string =>
  fn.mock.calls[fn.mock.calls.length - 1][0]

afterEach(() => {
  document.getSelection()?.removeAllRanges()
})

describe('RichTextEditor', () => {
  it('renders the initial HTML as a textbox', () => {
    setup({
      defaultValue: '<h1>Hi</h1><p>a <b>b</b></p>',
      'aria-label': 'Notes',
    })
    expect(screen.getByRole('textbox', { name: 'Notes' })).toHaveAttribute('aria-multiline', 'true')
    expect(html()).toBe('<h1>Hi</h1><p>a <strong>b</strong></p>')
    expect(screen.getByRole('toolbar', { name: 'Formatting' })).toBeInTheDocument()
  })

  it('names itself by default and forwards the ref to the editable element', () => {
    const ref = createRef<HTMLDivElement>()
    render(<RichTextEditor ref={ref} defaultValue="<p>x</p>" />)
    expect(ref.current).toBe(editor())
    expect(editor()).toHaveAccessibleName('Rich text editor')
    expect(html()).toBe('<p>x</p>')
  })

  it('shows a placeholder while it is empty', () => {
    setup({ placeholder: 'Write here' })
    expect(editor()).toHaveAttribute('data-empty', 'true')
    expect(editor()).toHaveAttribute('data-placeholder', 'Write here')
    expect(html()).toBe('<p><br></p>')
    before('insertText', { data: 'a' })
    expect(editor()).toHaveAttribute('data-empty', 'false')
  })

  it('types text through beforeinput and reports the document', () => {
    const { onValueChange } = setup({ defaultValue: '<p>ab</p>' })
    select(textOf('p'), 2)
    const event = before('insertText', { data: 'c' })
    expect(event.defaultPrevented).toBe(true)
    expect(html()).toBe('<p>abc</p>')
    expect(last(onValueChange)).toBe('<p>abc</p>')
    expect(document.getSelection()?.anchorOffset).toBe(3)
  })

  it('splits with Enter and merges with Backspace', () => {
    setup({ defaultValue: '<p>abcd</p>' })
    select(textOf('p'), 2)
    before('insertParagraph')
    expect(html()).toBe('<p>ab</p><p>cd</p>')
    before('deleteContentBackward')
    expect(html()).toBe('<p>abcd</p>')
    select(textOf('p'), 1)
    before('deleteContentForward')
    expect(html()).toBe('<p>acd</p>')
    before('insertLineBreak')
    expect(html()).toBe('<p>a<br>cd</p>')
    key('Enter', { shiftKey: true })
    before('insertParagraph')
    expect(html()).toBe('<p>a<br><br>cd</p>')
    key('Enter')
    before('insertParagraph')
    expect(html()).toBe('<p>a<br><br><br></p><p>cd</p>')
  })

  it('deletes a range from the target ranges of a word deletion', () => {
    setup({ defaultValue: '<p>hello big world</p>' })
    const text = textOf('p')
    select(text, 9)
    const range = span(text, 5, 9)
    before('deleteWordBackward', { ranges: [range] })
    expect(html()).toBe('<p>hello world</p>')
    select(textOf('p'), 5)
    before('deleteWordBackward')
    expect(html()).toBe('<p>hell world</p>')
  })

  it('replaces the text a spellchecker corrects', () => {
    setup({ defaultValue: '<p>helo</p>' })
    const text = textOf('p')
    select(text, 4)
    const range = span(text, 0, 4)
    before('insertReplacementText', { data: 'hello', ranges: [range] })
    expect(html()).toBe('<p>hello</p>')
  })

  it('formats with the toolbar and the keyboard, and reports the state', () => {
    const { onValueChange } = setup({ defaultValue: '<p>make bold</p>' })
    select(textOf('p'), 5, textOf('p'), 9)
    const bold = screen.getByRole('button', { name: 'Bold' })
    fireEvent.mouseDown(bold)
    fireEvent.click(bold)
    expect(html()).toBe('<p>make <strong>bold</strong></p>')
    expect(bold).toHaveAttribute('aria-pressed', 'true')
    key('b', { ctrlKey: true })
    expect(html()).toBe('<p>make bold</p>')
    key('i', { metaKey: true })
    expect(html()).toBe('<p>make <em>bold</em></p>')
    key('u', { ctrlKey: true })
    expect(html()).toBe('<p>make <em><u>bold</u></em></p>')
    expect(last(onValueChange)).toBe('<p>make <em><u>bold</u></em></p>')
    fireEvent.click(screen.getByRole('button', { name: 'Inline code' }))
    expect(html()).toContain('<code>')
  })

  it('types with a pending mark when the caret is collapsed', () => {
    setup({ defaultValue: '<p>ab</p>' })
    select(textOf('p'), 2)
    fireEvent.click(screen.getByRole('button', { name: 'Bold' }))
    expect(screen.getByRole('button', { name: 'Bold' })).toHaveAttribute('aria-pressed', 'true')
    before('insertText', { data: 'c' })
    expect(html()).toBe('<p>ab<strong>c</strong></p>')
  })

  it('changes the block type from the toolbar and with markdown shortcuts', () => {
    setup({ defaultValue: '<p>item</p>' })
    select(textOf('p'), 2)
    fireEvent.click(screen.getByRole('button', { name: 'Bulleted list' }))
    expect(html()).toBe('<ul><li>item</li></ul>')
    expect(screen.getByRole('button', { name: 'Bulleted list' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    fireEvent.click(screen.getByRole('button', { name: 'Heading 2' }))
    expect(html()).toBe('<h2>item</h2>')
    fireEvent.click(screen.getByRole('button', { name: 'Paragraph' }))
    expect(html()).toBe('<p>item</p>')
    select(textOf('p'), 0)
    before('insertText', { data: '#' })
    before('insertText', { data: ' ' })
    expect(html()).toBe('<h1>item</h1>')
  })

  it('aligns the selected blocks from the toolbar', () => {
    const { onValueChange } = setup({ defaultValue: '<p>a</p><p>b</p>' })
    select(textOf('p', 0), 0, textOf('p', 1), 1)
    fireEvent.click(screen.getByRole('button', { name: 'Center' }))
    expect(html()).toBe('<p style="text-align: center;">a</p><p style="text-align: center;">b</p>')
    expect(screen.getByRole('button', { name: 'Center' })).toHaveAttribute('aria-pressed', 'true')
    fireEvent.click(screen.getByRole('button', { name: 'Align right' }))
    expect(last(onValueChange)).toBe(
      '<p style="text-align:end">a</p><p style="text-align:end">b</p>',
    )
    fireEvent.click(screen.getByRole('button', { name: 'Align left' }))
    expect(html()).toBe('<p>a</p><p>b</p>')
    expect(screen.getByRole('button', { name: 'Align left' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

  it('changes the font and the size from the toolbar', () => {
    const { onValueChange } = setup({ defaultValue: '<p>some text</p>' })
    select(textOf('p'), 5, textOf('p'), 9)
    fireEvent.click(screen.getByRole('button', { name: /^Font:/ }))
    fireEvent.click(screen.getByRole('menuitem', { name: 'Serif' }))
    expect(last(onValueChange)).toContain(
      '<span style="font-family:ui-serif,Georgia,serif">text</span>',
    )
    fireEvent.click(screen.getByRole('button', { name: /^Font size:/ }))
    fireEvent.click(screen.getByRole('menuitem', { name: 'Large' }))
    expect(last(onValueChange)).toContain('font-family:ui-serif,Georgia,serif;font-size:1.25em')
    act(() => editor().focus())
    const paragraph = editor().querySelector('p') as Node
    select(paragraph, 0, paragraph, paragraph.childNodes.length)
    fireEvent(document, new Event('selectionchange'))
    expect(screen.getByRole('button', { name: 'Font: Font' })).toHaveTextContent('Font')
    fireEvent.click(screen.getByRole('button', { name: 'Font: Font' }))
    fireEvent.click(screen.getByRole('menuitem', { name: 'Default font' }))
    expect(last(onValueChange)).not.toContain('font-family')
  })

  it('shows the current font and marks it in the menu', () => {
    setup({
      defaultValue: '<p><span style="font-family:ui-serif,Georgia,serif">text</span></p>',
    })
    select(textOf('span'), 1)
    fireEvent(document, new Event('selectionchange'))
    const trigger = screen.getByRole('button', { name: 'Font: Serif' })
    expect(trigger).toHaveTextContent('Serif')
    fireEvent.click(trigger)
    expect(screen.getByRole('menuitem', { name: 'Serif' })).toHaveAttribute('aria-current', 'true')
    expect(screen.getByRole('menuitem', { name: 'Monospace' })).not.toHaveAttribute('aria-current')
  })

  it('undoes and redoes with the keyboard, the toolbar and input events', () => {
    setup({ defaultValue: '<p>a</p>' })
    select(textOf('p'), 1)
    before('insertText', { data: 'b' })
    before('insertText', { data: 'c' })
    expect(html()).toBe('<p>abc</p>')
    key('z', { ctrlKey: true })
    expect(html()).toBe('<p>a</p>')
    key('z', { ctrlKey: true, shiftKey: true })
    expect(html()).toBe('<p>abc</p>')
    fireEvent.click(screen.getByRole('button', { name: 'Undo' }))
    expect(html()).toBe('<p>a</p>')
    fireEvent.click(screen.getByRole('button', { name: 'Redo' }))
    before('historyUndo')
    expect(html()).toBe('<p>a</p>')
    before('historyRedo')
    key('y', { ctrlKey: true })
    key('z', { ctrlKey: true })
    expect(html()).toBe('<p>a</p>')
    expect(screen.getByRole('button', { name: 'Undo' })).toBeDisabled()
  })

  it('cuts and pastes', () => {
    setup({ defaultValue: '<p>one two</p>' })
    const text = textOf('p')
    select(text, 0, text, 4)
    before('deleteByCut', {
      ranges: [span(text, 0, 4)],
    })
    expect(html()).toBe('<p>two</p>')
    select(textOf('p'), 3)
    const event = paste({ 'text/plain': 'x\ny' })
    expect(event.defaultPrevented).toBe(true)
    expect(html()).toBe('<p>twox</p><p>y</p>')
  })

  it('pastes rich text without the markup of the source', () => {
    setup({ defaultValue: '<p></p>' })
    select(editor().querySelector('p') as Node, 0)
    paste({
      'text/html':
        '<b style="font-weight:normal"><p style="margin:0"><span style="font-weight:700">Hi</span> there</p></b>',
      'text/plain': 'Hi there',
    })
    expect(html()).toBe('<p><strong>Hi</strong> there</p>')
    paste({ 'text/html': '<style>p{}</style>', 'text/plain': ' more' })
    expect(html()).toContain('more')
  })

  it('handles a drop and ignores what it does not know', () => {
    setup({ defaultValue: '<p>ab</p>' })
    select(textOf('p'), 1)
    before('insertFromDrop', {
      dataTransfer: {
        getData: (type: string) => (type === 'text/plain' ? 'X' : ''),
      } as DataTransfer,
    })
    expect(html()).toBe('<p>aXb</p>')
    const event = before('formatBackColor')
    expect(event.defaultPrevented).toBe(true)
    expect(html()).toBe('<p>aXb</p>')
    before('formatBold')
  })

  it('adds, edits and removes a link', () => {
    const { onValueChange } = setup({ defaultValue: '<p>go there</p>' })
    select(textOf('p'), 3, textOf('p'), 8)
    fireEvent.click(screen.getByRole('button', { name: 'Link' }))
    const field = screen.getByRole('textbox', { name: 'Link address' })
    fireEvent.change(field, { target: { value: 'example.com' } })
    fireEvent.keyDown(field, { key: 'Enter' })
    expect(html()).toBe('<p>go <a href="https://example.com">there</a></p>')
    expect(screen.queryByRole('textbox', { name: 'Link address' })).toBeNull()
    expect(last(onValueChange)).toContain('https://example.com')

    select(textOf('a'), 2)
    key('k', { ctrlKey: true })
    const edit = screen.getByRole('textbox', { name: 'Link address' })
    expect(edit).toHaveValue('https://example.com')
    fireEvent.change(edit, { target: { value: 'me@example.com' } })
    fireEvent.click(screen.getByRole('button', { name: 'Apply' }))
    expect(html()).toContain('href="mailto:me@example.com"')

    select(textOf('a'), 2)
    fireEvent.click(screen.getByRole('button', { name: 'Link' }))
    fireEvent.click(screen.getByRole('button', { name: 'Remove link' }))
    expect(html()).toBe('<p>go there</p>')
  })

  it('closes the link field with Escape and keeps a relative address', () => {
    setup({ defaultValue: '<p>go</p>' })
    select(textOf('p'), 0, textOf('p'), 2)
    fireEvent.click(screen.getByRole('button', { name: 'Link' }))
    fireEvent.keyDown(screen.getByRole('textbox', { name: 'Link address' }), {
      key: 'Escape',
    })
    expect(screen.queryByRole('textbox', { name: 'Link address' })).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Link' }))
    fireEvent.click(screen.getByRole('button', { name: 'Link' }))
    fireEvent.click(screen.getByRole('button', { name: 'Link' }))
    fireEvent.change(screen.getByRole('textbox', { name: 'Link address' }), {
      target: { value: '/docs' },
    })
    fireEvent.keyDown(screen.getByRole('textbox', { name: 'Link address' }), {
      key: 'a',
    })
    fireEvent.click(screen.getByRole('button', { name: 'Apply' }))
    expect(html()).toBe('<p><a href="/docs">go</a></p>')
  })

  it('moves along the toolbar with the arrow keys', () => {
    setup()
    const toolbar = screen.getByRole('toolbar')
    const buttons = Array.from(
      toolbar.querySelectorAll<HTMLElement>('[data-loica-richtexteditor-tool]'),
    )
    expect(buttons[0]).toBeDisabled()
    expect(buttons[2]).toHaveAttribute('tabindex', '0')
    act(() => buttons[2].focus())
    fireEvent.keyDown(toolbar, { key: 'ArrowRight' })
    expect(document.activeElement).toBe(buttons[3])
    fireEvent.keyDown(toolbar, { key: 'ArrowLeft' })
    fireEvent.keyDown(toolbar, { key: 'ArrowLeft' })
    expect(document.activeElement).toBe(buttons[buttons.length - 1])
    fireEvent.keyDown(toolbar, { key: 'Home' })
    expect(document.activeElement).toBe(buttons[2])
    fireEvent.keyDown(toolbar, { key: 'End' })
    expect(document.activeElement).toBe(buttons[buttons.length - 1])
    fireEvent.keyDown(toolbar, { key: 'a' })
    expect(document.activeElement).toBe(buttons[buttons.length - 1])
  })

  it('leaves the DOM alone during a composition and reads it when it ends', () => {
    const { onValueChange } = setup({ defaultValue: '<p>ab</p>' })
    const paragraph = editor().querySelector('p') as HTMLElement
    select(textOf('p'), 2)
    fireEvent.compositionStart(editor())
    const composing = before('insertCompositionText', {
      data: 'に',
      isComposing: true,
    })
    expect(composing.defaultPrevented).toBe(false)
    textOf('p').data = 'abに'
    select(textOf('p'), 3)
    fireEvent.input(editor())
    expect(editor().querySelector('p')).toBe(paragraph)
    expect(last(onValueChange)).toBe('<p>abに</p>')
    fireEvent.compositionEnd(editor())
    expect(html()).toBe('<p>abに</p>')
    expect(document.getSelection()?.anchorOffset).toBe(3)
  })

  it('reads the DOM back when the browser changes it and the event cannot be cancelled', () => {
    const { onValueChange } = setup({ defaultValue: '<p>ab</p>' })
    select(textOf('p'), 2)
    const event = before('insertText', { data: 'c', cancelable: false })
    expect(event.defaultPrevented).toBe(false)
    textOf('p').data = 'abc'
    editor().innerHTML = '<div>abc</div><div>def</div>'
    select(editor().lastChild?.firstChild as Node, 3)
    fireEvent.input(editor())
    expect(html()).toBe('<p>abc</p><p>def</p>')
    expect(last(onValueChange)).toBe('<p>abc</p><p>def</p>')
    expect(document.getSelection()?.anchorOffset).toBe(3)
    fireEvent.input(editor())
    expect(html()).toBe('<p>abc</p><p>def</p>')
  })

  it('follows the selection and ignores one outside the editor', () => {
    setup({ defaultValue: '<p>abc</p><p>def</p>' })
    select(textOf('p', 1), 2)
    fireEvent(document, new Event('selectionchange'))
    before('insertText', { data: 'X' })
    expect(html()).toBe('<p>abc</p><p>deXf</p>')
    const outside = document.createElement('p')
    outside.textContent = 'out'
    document.body.append(outside)
    select(outside.firstChild as Node, 1)
    fireEvent(document, new Event('selectionchange'))
    outside.remove()
    fireEvent(document, new Event('selectionchange'))
    select(editor(), 0, editor(), 2)
    before('deleteContentBackward')
    expect(html()).toBe('<p><br></p>')
  })

  it('is read only', () => {
    const { onValueChange } = setup({
      defaultValue: '<p>ab</p>',
      readOnly: true,
    })
    expect(screen.queryByRole('toolbar')).toBeNull()
    expect(editor()).toHaveAttribute('aria-readonly', 'true')
    select(textOf('p'), 1)
    expect(before('insertText', { data: 'x' }).defaultPrevented).toBe(true)
    expect(paste({ 'text/plain': 'x' }).defaultPrevented).toBe(true)
    key('b', { ctrlKey: true })
    key('z', { ctrlKey: true })
    key('k', { ctrlKey: true })
    expect(html()).toBe('<p>ab</p>')
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it('has no toolbar when asked, translates its texts and takes the aria props', () => {
    const { rerender } = render(<RichTextEditor aria-labelledby="title" toolbar={false} />)
    expect(screen.queryByRole('toolbar')).toBeNull()
    expect(editor()).not.toHaveAttribute('aria-label')
    rerender(
      <LocaleProvider
        messages={{
          richTextEditor: {
            bold: 'Negrita',
            editor: 'Editor',
            toolbar: 'Formato',
          },
        }}
      >
        <RichTextEditor />
      </LocaleProvider>,
    )
    expect(screen.getByRole('button', { name: 'Negrita' })).toBeInTheDocument()
    expect(screen.getByRole('toolbar', { name: 'Formato' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Italic' })).toBeInTheDocument()
    expect(editor()).toHaveAccessibleName('Editor')
  })

  it('stops listening when it unmounts', () => {
    const { unmount, onValueChange } = setup({ defaultValue: '<p>a</p>' })
    const element = editor()
    unmount()
    element.dispatchEvent(
      new InputEvent('beforeinput', {
        inputType: 'insertText',
        data: 'x',
        cancelable: true,
      }),
    )
    expect(onValueChange).not.toHaveBeenCalled()
  })
})

describe('RichTextEditor as a form control', () => {
  it('follows a controlled value and reports the HTML of every change', () => {
    const onValueChange = vi.fn<(value: string) => void>()
    const { rerender } = render(<RichTextEditor onValueChange={onValueChange} value="<p>ab</p>" />)
    expect(html()).toBe('<p>ab</p>')
    editor().focus()
    select(textOf('p'), 2)
    before('insertText', { data: 'c' })
    expect(onValueChange).toHaveBeenLastCalledWith('<p>abc</p>')
    rerender(<RichTextEditor onValueChange={onValueChange} value="<p>abc</p>" />)
    expect(html()).toBe('<p>abc</p>')
    rerender(<RichTextEditor onValueChange={onValueChange} value="<h1>New</h1>" />)
    expect(html()).toBe('<h1>New</h1>')
    expect(onValueChange).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('button', { name: 'Undo' })).toBeDisabled()
  })

  it('keeps what the user typed when it is not controlled', () => {
    const { rerender } = setup({ defaultValue: '<p>a</p>' })
    select(textOf('p'), 1)
    before('insertText', { data: 'b' })
    rerender(<RichTextEditor defaultValue="<p>other</p>" />)
    expect(html()).toBe('<p>ab</p>')
  })

  it('is disabled: it cannot be focused or changed, and neither can its toolbar', () => {
    const { onValueChange } = setup({
      defaultValue: '<p>ab</p>',
      disabled: true,
    })
    expect(editor()).toHaveAttribute('aria-disabled', 'true')
    expect(editor()).toHaveAttribute('contenteditable', 'false')
    expect(editor()).not.toHaveAttribute('tabindex')
    expect(screen.getByRole('button', { name: 'Bold' })).toBeDisabled()
    expect(screen.getByRole('button', { name: /^Font:/ })).toBeDisabled()
    select(textOf('p'), 1)
    expect(before('insertText', { data: 'x' }).defaultPrevented).toBe(true)
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it('marks itself invalid and required', () => {
    const { container } = render(<RichTextEditor aria-invalid required />)
    expect(editor()).toHaveAttribute('aria-invalid', 'true')
    expect(editor()).toHaveAttribute('aria-required', 'true')
    expect(container.firstElementChild).toHaveAttribute('data-invalid')
  })

  it('works inside a Field', () => {
    render(
      <Field helperText="Say something" label="Notes">
        <RichTextEditor />
      </Field>,
    )
    expect(screen.getByRole('textbox', { name: 'Notes' })).toBeInTheDocument()
    expect(editor()).toHaveAccessibleDescription('Say something')
  })

  it('puts className and style on the wrapper and the rest on the editable element', () => {
    const { container } = render(
      <RichTextEditor className="mine" data-testid="field" id="notes" style={{ color: 'red' }} />,
    )
    const wrapper = container.firstElementChild as HTMLElement
    expect(wrapper).toHaveClass('mine')
    expect(wrapper.style.color).toBe('red')
    expect(wrapper).toHaveAttribute('data-loica-richtexteditor')
    expect(editor()).toHaveAttribute('id', 'notes')
    expect(editor()).toHaveAttribute('data-testid', 'field')
    expect(editor()).toHaveAttribute('data-loica-richtexteditor-field')
  })

  it('drops its classes with the unstyled variant', () => {
    const { container } = render(<RichTextEditor className="mine" variant="unstyled" />)
    expect((container.firstElementChild as HTMLElement).className).toBe('mine')
    expect(editor().getAttribute('class')).toBeNull()
    expect(screen.getByRole('toolbar').getAttribute('class')).toBeNull()
  })

  it.each(['outline', 'filled', 'underline'] as const)('styles the %s variant', (variant) => {
    const { container } = render(<RichTextEditor variant={variant} />)
    expect((container.firstElementChild as HTMLElement).className).not.toBe('')
  })

  it('follows the direction of the page with the arrow keys of the toolbar', () => {
    document.documentElement.dir = 'rtl'
    try {
      render(<RichTextEditor />)
      const bold = screen.getByRole('button', { name: 'Bold' })
      bold.focus()
      fireEvent.keyDown(bold, { key: 'ArrowLeft' })
      expect(screen.getByRole('button', { name: 'Italic' })).toHaveFocus()
    } finally {
      document.documentElement.dir = ''
    }
  })
})

describe('htmlToMarkdown', () => {
  it('writes the HTML as Markdown', () => {
    expect(
      htmlToMarkdown(
        '<h1>Hi</h1><p>a <strong>b</strong> <a href="https://x.dev">c</a></p><ul><li>d</li></ul>',
      ),
    ).toBe('# Hi\n\na **b** [c](https://x.dev)\n\n- d')
  })
})
