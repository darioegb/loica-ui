import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { RichTextEditor } from '..'

const editor = (): HTMLElement => screen.getByRole('textbox')
const html = (): string => editor().innerHTML

const select = (node: Node, offset: number): void => {
  document.getSelection()?.setBaseAndExtent(node, offset, node, offset)
}

const textOf = (selector: string, index = 0): Text =>
  editor().querySelectorAll(selector)[index].firstChild as Text

const before = (inputType: string, init: InputEventInit = {}): InputEvent => {
  const event = new InputEvent('beforeinput', {
    inputType,
    bubbles: true,
    cancelable: true,
    ...init,
  })
  act(() => {
    editor().dispatchEvent(event)
  })
  return event
}

const setup = (props: Parameters<typeof RichTextEditor>[0] = {}) => {
  const onValueChange = vi.fn<(value: string) => void>()
  render(<RichTextEditor onValueChange={onValueChange} {...props} />)
  editor().focus()
  return onValueChange
}

const lastValue = (fn: ReturnType<typeof vi.fn<(value: string) => void>>): string =>
  fn.mock.calls[fn.mock.calls.length - 1][0]

// What a browser does to the DOM while an IME composes: it rewrites the text node by itself, and the editor only
// hears beforeinput and input events it must not cancel.
const update = (node: Text, start: number, end: number, composed: string): void => {
  before('insertCompositionText', { data: composed, isComposing: true })
  node.data = node.data.slice(0, start) + composed + node.data.slice(end)
  select(node, start + composed.length)
  fireEvent.input(editor())
}

const compose = (node: Text, at: number, steps: string[]): void => {
  fireEvent.compositionStart(editor())
  let end = at
  for (const step of steps) {
    update(node, at, end, step)
    end = at + step.length
  }
  fireEvent.compositionEnd(editor())
}

afterEach(() => {
  document.getSelection()?.removeAllRanges()
})

describe('RichTextEditor composition', () => {
  it('keeps only the final text of a composition that rewrites itself', () => {
    const onValueChange = setup({ defaultValue: '<p>ab</p>' })
    const node = textOf('p')
    compose(node, 2, ['n', 'ni', 'ni h', '你好'])
    expect(html()).toBe('<p>ab你好</p>')
    expect(lastValue(onValueChange)).toBe('<p>ab你好</p>')
    expect(document.getSelection()?.anchorOffset).toBe(4)
  })

  it('does not touch the DOM nodes while it composes', () => {
    setup({ defaultValue: '<p>ab</p><p>cd</p>' })
    const paragraph = editor().querySelectorAll('p')[1]
    const node = textOf('p', 1)
    fireEvent.compositionStart(editor())
    update(node, 2, 2, 'に')
    update(node, 2, 3, 'にほ')
    expect(editor().querySelectorAll('p')[1]).toBe(paragraph)
    expect(paragraph.firstChild).toBe(node)
    expect(node.data).toBe('cdにほ')
    fireEvent.compositionEnd(editor())
    expect(html()).toBe('<p>ab</p><p>cdにほ</p>')
  })

  it('ignores a selection change until the composition ends', () => {
    const onValueChange = setup({ defaultValue: '<p>abc</p>' })
    const node = textOf('p')
    select(node, 1)
    fireEvent.compositionStart(editor())
    update(node, 1, 1, 'に')
    const calls = onValueChange.mock.calls.length
    select(node, 0)
    fireEvent(document, new Event('selectionchange'))
    expect(onValueChange.mock.calls.length).toBe(calls)
    select(node, 2)
    fireEvent.compositionEnd(editor())
    expect(html()).toBe('<p>aにbc</p>')
    expect(document.getSelection()?.anchorOffset).toBe(2)
  })

  it('undoes a whole composition in one step, however slowly it was typed', () => {
    setup({ defaultValue: '<p>ab</p>' })
    const node = textOf('p')
    select(node, 2)
    let now = 0
    const clock = vi.spyOn(Date, 'now').mockImplementation(() => (now += 5000))
    compose(node, 2, ['n', 'ni', '你'])
    clock.mockRestore()
    expect(html()).toBe('<p>ab你</p>')
    before('historyUndo')
    expect(html()).toBe('<p>ab</p>')
    before('historyRedo')
    expect(html()).toBe('<p>ab你</p>')
  })

  it('leaves no undo step for a composition that changed nothing', () => {
    setup({ defaultValue: '<p>ab</p>' })
    const node = textOf('p')
    select(node, 2)
    compose(node, 2, ['n', ''])
    expect(html()).toBe('<p>ab</p>')
    expect(screen.getByRole('button', { name: 'Undo' })).toBeDisabled()
  })

  it('keeps the format of the text it composes in', () => {
    const onValueChange = setup({ defaultValue: '<p>a <strong>bold</strong> c</p>' })
    const node = textOf('strong')
    select(node, 4)
    compose(node, 4, ['か', '漢'])
    expect(html()).toBe('<p>a <strong>bold漢</strong> c</p>')
    expect(lastValue(onValueChange)).toBe('<p>a <strong>bold漢</strong> c</p>')
  })

  it('keeps the type of the block it composes in', () => {
    setup({ defaultValue: '<h2>Title</h2><ul><li>one</li></ul>' })
    const heading = textOf('h2')
    select(heading, 5)
    compose(heading, 5, ['に'])
    const item = textOf('li')
    select(item, 3)
    compose(item, 3, ['ほ'])
    expect(html()).toBe('<h2>Titleに</h2><ul><li>oneほ</li></ul>')
  })

  it('composes in an empty editor and drops the placeholder', () => {
    const onValueChange = setup({ placeholder: 'Write here' })
    expect(editor()).toHaveAttribute('data-empty', 'true')
    const paragraph = editor().querySelector('p') as HTMLElement
    select(paragraph, 0)
    fireEvent.compositionStart(editor())
    before('insertCompositionText', { data: 'に', isComposing: true })
    paragraph.replaceChildren(document.createTextNode('に'))
    select(paragraph.firstChild as Node, 1)
    fireEvent.input(editor())
    fireEvent.compositionEnd(editor())
    expect(html()).toBe('<p>に</p>')
    expect(editor()).toHaveAttribute('data-empty', 'false')
    expect(lastValue(onValueChange)).toBe('<p>に</p>')
  })

  it('types normally after a composition ends', () => {
    setup({ defaultValue: '<p>ab</p>' })
    const node = textOf('p')
    select(node, 2)
    compose(node, 2, ['に'])
    const event = before('insertText', { data: '!' })
    expect(event.defaultPrevented).toBe(true)
    expect(html()).toBe('<p>abに!</p>')
    expect(document.getSelection()?.anchorOffset).toBe(4)
  })

  it('does not split the block when Enter confirms a candidate', () => {
    setup({ defaultValue: '<p>ab</p>' })
    const node = textOf('p')
    select(node, 2)
    fireEvent.compositionStart(editor())
    update(node, 2, 2, 'に')
    fireEvent.keyDown(editor(), { key: 'Enter', isComposing: true })
    const event = before('insertParagraph', { isComposing: true })
    expect(event.defaultPrevented).toBe(false)
    fireEvent.compositionEnd(editor())
    expect(html()).toBe('<p>abに</p>')
  })

  it('does not run a shortcut in the middle of a composition', () => {
    setup({ defaultValue: '<p>ab</p>' })
    const node = textOf('p')
    select(node, 2)
    fireEvent.compositionStart(editor())
    update(node, 2, 2, 'に')
    fireEvent.keyDown(editor(), { key: 'z', ctrlKey: true })
    fireEvent.keyDown(editor(), { key: 'b', ctrlKey: true })
    expect(node.data).toBe('abに')
    fireEvent.compositionEnd(editor())
    expect(html()).toBe('<p>abに</p>')
  })

  it('does not duplicate a composition that Safari reports after compositionend', () => {
    const onValueChange = setup({ defaultValue: '<p>ab</p>' })
    const node = textOf('p')
    select(node, 2)
    fireEvent.compositionStart(editor())
    update(node, 2, 2, 'に')
    fireEvent.compositionEnd(editor())
    before('insertFromComposition', { data: 'に' })
    fireEvent.input(editor())
    expect(html()).toBe('<p>abに</p>')
    expect(lastValue(onValueChange)).toBe('<p>abに</p>')
  })

  it('reads a composition whose final input arrives after compositionend', () => {
    setup({ defaultValue: '<p>ab</p>' })
    const node = textOf('p')
    select(node, 2)
    fireEvent.compositionStart(editor())
    update(node, 2, 2, 'に')
    fireEvent.compositionEnd(editor())
    before('insertText', { data: 'ほ', cancelable: false })
    const live = textOf('p')
    live.data = 'abにほ'
    select(live, 4)
    fireEvent.input(editor())
    expect(html()).toBe('<p>abにほ</p>')
    expect(document.getSelection()?.anchorOffset).toBe(4)
  })

  it('blocks a composition while it is read-only', () => {
    setup({ defaultValue: '<p>ab</p>', readOnly: true })
    const event = before('insertCompositionText', { data: 'に', isComposing: true })
    expect(event.defaultPrevented).toBe(true)
    expect(html()).toBe('<p>ab</p>')
  })

  it('composes in the middle of a paragraph and keeps the text on both sides', () => {
    const onValueChange = setup({ defaultValue: '<p>abcd</p>' })
    const node = textOf('p')
    select(node, 2)
    compose(node, 2, ['n', 'ni', '你'])
    expect(html()).toBe('<p>ab你cd</p>')
    expect(lastValue(onValueChange)).toBe('<p>ab你cd</p>')
    expect(document.getSelection()?.anchorOffset).toBe(3)
  })

  it('applies a format toggled before the composition started', () => {
    setup({ defaultValue: '<p>ab</p>' })
    const node = textOf('p')
    select(node, 2)
    fireEvent.keyDown(editor(), { key: 'b', ctrlKey: true })
    const live = textOf('p')
    select(live, 2)
    compose(live, 2, ['に'])
    expect(html()).toBe('<p>ab<strong>に</strong></p>')
  })
})
