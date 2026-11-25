import { describe, expect, it } from 'vitest'
import {
  createRenderCache,
  domPoint,
  offsetIn,
  pointFromDom,
  pointIn,
  renderDoc,
  selectionFromDom,
} from '../richtexteditor-dom'
import type { Doc } from '../richtexteditor-model'
import { fromHtml } from '../richtexteditor-parse'

const mount = (html: string) => {
  const root = document.createElement('div')
  document.body.append(root)
  const doc: Doc = fromHtml(html)
  const elements = renderDoc(root, doc, createRenderCache())
  return { root, doc, elements }
}

describe('dom positions', () => {
  it('maps an offset to a text node and back', () => {
    const { root, elements } = mount('<p>ab<strong>cd</strong>ef</p>')
    const [node, offset] = pointIn(elements[0], 3)
    expect(node.textContent).toBe('cd')
    expect(offset).toBe(1)
    expect(pointFromDom(elements, root, node, offset)).toEqual({
      block: 0,
      offset: 3,
    })
    expect(pointIn(elements[0], 2)[0].textContent).toBe('ab')
  })

  it('keeps the position after a line break, including a trailing one', () => {
    const { elements, doc } = mount('<p>a<br>b</p><p>c<br><br></p><p><br></p>')
    expect(doc.blocks.map((b) => b.runs[0]?.text)).toEqual(['a\nb', 'c\n', undefined])
    expect(pointIn(elements[0], 2)).toEqual([elements[0], 2])
    const [parent, index] = pointIn(elements[1], 2)
    expect(parent).toBe(elements[1])
    expect(index).toBe(2)
    expect(offsetIn(elements[1], parent, index)).toBe(2)
    expect(pointIn(elements[0], 1)[0].textContent).toBe('a')
    expect(pointIn(elements[2], 0)).toEqual([elements[2], 0])
    const before = pointIn(elements[0], 1)
    expect(offsetIn(elements[0], before[0], before[1])).toBe(1)
    const [at, atIndex] = pointIn(elements[1], 1)
    expect(at.textContent).toBe('c')
    expect(atIndex).toBe(1)
  })

  it('reads a position given as a container and an index', () => {
    const { root, elements } = mount('<p>ab</p><ul><li>cd</li><li>ef</li></ul>')
    expect(pointFromDom(elements, root, root, 0)).toEqual({
      block: 0,
      offset: 0,
    })
    expect(pointFromDom(elements, root, root, 1)).toEqual({
      block: 1,
      offset: 0,
    })
    expect(pointFromDom(elements, root, root, 2)).toEqual({
      block: 2,
      offset: 2,
    })
    const list = root.querySelector('ul') as Node
    expect(pointFromDom(elements, root, list, 1)).toEqual({
      block: 2,
      offset: 0,
    })
    expect(pointFromDom(elements, root, list, 2)).toEqual({
      block: 2,
      offset: 2,
    })
    expect(pointFromDom(elements, root, document.body, 0)).toBeNull()
  })

  it('builds a selection from two DOM points', () => {
    const { root, elements } = mount('<p>ab</p><p>cd</p>')
    const first = elements[0].firstChild as Node
    const second = elements[1].firstChild as Node
    expect(selectionFromDom(elements, root, [first, 1], [second, 2])).toEqual({
      anchor: { block: 0, offset: 1 },
      focus: { block: 1, offset: 2 },
    })
    expect(selectionFromDom(elements, root, [null, 0], [second, 0])).toBeNull()
    expect(selectionFromDom(elements, root, [document.body, 0], [second, 0])).toBeNull()
    expect(domPoint(elements, { block: 9, offset: 0 })[0]).toBe(elements[1].firstChild)
  })

  it('reads a block that the browser left outside of the model', () => {
    const root = document.createElement('div')
    root.append('loose')
    expect(pointFromDom([root], root, root.firstChild as Node, 2)).toEqual({
      block: 0,
      offset: 2,
    })
  })

  it('reuses the elements of the blocks that did not change', () => {
    const root = document.createElement('div')
    const cache = createRenderCache()
    const doc = fromHtml('<p>a</p><ul><li>b</li></ul>')
    const first = renderDoc(root, doc, cache)
    const list = root.querySelector('ul')
    const next = renderDoc(root, { blocks: [doc.blocks[0], doc.blocks[1], doc.blocks[1]] }, cache)
    expect(next[0]).toBe(first[0])
    expect(root.querySelector('ul')).toBe(list)
    expect(root.querySelectorAll('li')).toHaveLength(2)
    renderDoc(root, { blocks: [doc.blocks[0]] }, cache)
    expect(root.children).toHaveLength(1)
  })
})
