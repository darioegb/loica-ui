import { act, fireEvent, render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { Field } from '../../field'
import {
  RichTextEditor,
  RichTextEditorContent,
  RichTextEditorGroup,
  RichTextEditorTool,
  RichTextEditorToolbar,
} from '..'

const editor = (): HTMLElement => screen.getByRole('textbox')

describe('RichTextEditor parts', () => {
  it('renders only the tools you write, in the toolbar you place', () => {
    render(
      <RichTextEditor defaultValue="<p>Hello</p>">
        <RichTextEditorContent />
        <RichTextEditorToolbar>
          <RichTextEditorGroup>
            <RichTextEditorTool name="bold" />
            <RichTextEditorTool name="link" />
          </RichTextEditorGroup>
        </RichTextEditorToolbar>
      </RichTextEditor>,
    )
    const buttons = screen.getAllByRole('button')
    expect(buttons.map((button) => button.getAttribute('aria-label'))).toEqual(['Bold', 'Link'])
    expect(editor().innerHTML).toBe('<p>Hello</p>')
    expect(editor().compareDocumentPosition(screen.getByRole('toolbar'))).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    )
  })

  it('renders every tool in a toolbar with no children', () => {
    render(
      <RichTextEditor>
        <RichTextEditorToolbar />
        <RichTextEditorContent />
      </RichTextEditor>,
    )
    expect(screen.getByRole('button', { name: 'Bold' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Font: Default font' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Numbered list' })).toBeInTheDocument()
  })

  it('formats through a named tool and reports the HTML', () => {
    const onValueChange = vi.fn()
    render(
      <RichTextEditor defaultValue="<p>Hello</p>" onValueChange={onValueChange}>
        <RichTextEditorToolbar>
          <RichTextEditorTool name="bold" />
        </RichTextEditorToolbar>
        <RichTextEditorContent />
      </RichTextEditor>,
    )
    editor().focus()
    document
      .getSelection()
      ?.setBaseAndExtent(editor().firstChild!.firstChild!, 0, editor().firstChild!.firstChild!, 5)
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Bold' }))
    })
    expect(onValueChange).toHaveBeenLastCalledWith('<p><strong>Hello</strong></p>')
    expect(screen.getByRole('button', { name: 'Bold' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('runs the onClick of a named tool after the tool', () => {
    const onClick = vi.fn()
    render(
      <RichTextEditor>
        <RichTextEditorToolbar>
          <RichTextEditorTool name="italic" onClick={onClick} />
        </RichTextEditorToolbar>
        <RichTextEditorContent />
      </RichTextEditor>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Italic' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('makes a button of your own that joins the arrow-key navigation', () => {
    const onClick = vi.fn()
    render(
      <RichTextEditor>
        <RichTextEditorToolbar>
          <RichTextEditorTool name="bold" />
          <RichTextEditorTool aria-label="Rewrite" onClick={onClick}>
            AI
          </RichTextEditorTool>
        </RichTextEditorToolbar>
        <RichTextEditorContent />
      </RichTextEditor>,
    )
    const bold = screen.getByRole('button', { name: 'Bold' })
    const custom = screen.getByRole('button', { name: 'Rewrite' })
    expect(bold).toHaveAttribute('tabindex', '0')
    expect(custom).toHaveAttribute('tabindex', '-1')
    bold.focus()
    fireEvent.keyDown(bold, { key: 'ArrowRight' })
    expect(custom).toHaveFocus()
    expect(custom).toHaveAttribute('tabindex', '0')
    expect(bold).toHaveAttribute('tabindex', '-1')
    fireEvent.click(custom)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('gives the font menu a trigger that names its current value', () => {
    render(
      <RichTextEditor>
        <RichTextEditorToolbar>
          <RichTextEditorTool name="font" />
        </RichTextEditorToolbar>
        <RichTextEditorContent />
      </RichTextEditor>,
    )
    expect(screen.getByRole('button', { name: 'Font: Default font' })).toHaveAttribute(
      'aria-haspopup',
      'menu',
    )
  })

  it('takes the native attributes, the placeholder and the ref on the content', () => {
    const ref = createRef<HTMLDivElement>()
    render(
      <RichTextEditor>
        <RichTextEditorContent
          ref={ref}
          aria-label="Notes"
          className="mine"
          id="notes"
          placeholder="Write here"
        />
      </RichTextEditor>,
    )
    expect(ref.current).toBe(editor())
    expect(editor()).toHaveAttribute('aria-label', 'Notes')
    expect(editor()).toHaveAttribute('aria-placeholder', 'Write here')
    expect(editor()).toHaveClass('mine')
    expect(editor()).toHaveAttribute('id', 'notes')
  })

  it('shares the state of the root with its parts', () => {
    render(
      <RichTextEditor aria-invalid="true" disabled required>
        <RichTextEditorToolbar>
          <RichTextEditorTool name="bold" />
        </RichTextEditorToolbar>
        <RichTextEditorContent />
      </RichTextEditor>,
    )
    expect(screen.getByRole('button', { name: 'Bold' })).toBeDisabled()
    expect(editor()).toHaveAttribute('aria-disabled', 'true')
    expect(editor()).toHaveAttribute('aria-invalid', 'true')
    expect(editor()).toHaveAttribute('aria-required', 'true')
    expect(editor()).toHaveAttribute('contenteditable', 'false')
  })

  it('hides the toolbar part while the editor is read-only', () => {
    render(
      <RichTextEditor readOnly>
        <RichTextEditorToolbar />
        <RichTextEditorContent />
      </RichTextEditor>,
    )
    expect(screen.queryByRole('toolbar')).toBeNull()
  })

  it('drops the Loica classes of every part with the unstyled variant', () => {
    render(
      <RichTextEditor variant="unstyled">
        <RichTextEditorToolbar className="bar">
          <RichTextEditorGroup className="set">
            <RichTextEditorTool name="bold" />
          </RichTextEditorGroup>
        </RichTextEditorToolbar>
        <RichTextEditorContent />
      </RichTextEditor>,
    )
    expect(screen.getByRole('toolbar').className).toBe('bar')
    expect(screen.getByRole('toolbar').firstElementChild?.className).toBe('set')
    expect(editor().getAttribute('class')).toBeNull()
  })

  it('labels the content from a Field', () => {
    render(
      <Field label="Notes">
        <RichTextEditor>
          <RichTextEditorContent />
        </RichTextEditor>
      </Field>,
    )
    expect(screen.getByRole('textbox', { name: 'Notes' })).toBe(editor())
  })

  it('opens the link field from a link tool and from the shortcut', () => {
    render(
      <RichTextEditor defaultValue="<p>Hello</p>">
        <RichTextEditorToolbar>
          <RichTextEditorTool name="link" />
        </RichTextEditorToolbar>
        <RichTextEditorContent />
      </RichTextEditor>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Link' }))
    expect(screen.getByRole('textbox', { name: 'Link address' })).toBeInTheDocument()
  })

  it('throws when a part is rendered outside the editor', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    expect(() => render(<RichTextEditorContent />)).toThrow(
      'RichTextEditorContent must be used within a <RichTextEditor>',
    )
    expect(() => render(<RichTextEditorTool name="bold" />)).toThrow(
      'RichTextEditorTool must be used within a <RichTextEditor>',
    )
    expect(() => render(<RichTextEditorGroup />)).toThrow(
      'RichTextEditorGroup must be used within a <RichTextEditor>',
    )
    expect(() => render(<RichTextEditorToolbar />)).toThrow(
      'RichTextEditorToolbar must be used within a <RichTextEditor>',
    )
    error.mockRestore()
  })

  it('keeps the content when the parts move', () => {
    const { rerender } = render(
      <RichTextEditor defaultValue="<p>Hello</p>">
        <RichTextEditorContent />
      </RichTextEditor>,
    )
    expect(editor().innerHTML).toBe('<p>Hello</p>')
    rerender(
      <RichTextEditor defaultValue="<p>Hello</p>">
        <RichTextEditorToolbar />
        <RichTextEditorContent />
      </RichTextEditor>,
    )
    expect(editor().innerHTML).toBe('<p>Hello</p>')
  })
})
