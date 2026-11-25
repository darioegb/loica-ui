import type { Doc, Point, Selection } from './richtexteditor-model'
import { isList } from './richtexteditor-model'
import { isTrailingBreak } from './richtexteditor-parse'
import { inlineHtml, TAGS } from './richtexteditor-serialize'

const TEXT = 3

export const renderBlock = (owner: Document, block: Doc['blocks'][number]): HTMLElement => {
  const element = owner.createElement(TAGS[block.type])
  element.innerHTML = inlineHtml(block)
  if (block.align) element.style.textAlign = block.align
  return element
}

const syncChildren = (parent: Node, desired: readonly Node[]): void => {
  let reference = parent.firstChild
  for (const node of desired) {
    if (node === reference) reference = reference.nextSibling
    else parent.insertBefore(node, reference)
  }
  while (reference) {
    const next: ChildNode | null = reference.nextSibling
    parent.removeChild(reference)
    reference = next
  }
}

export interface RenderCache {
  elements: WeakMap<object, HTMLElement>
  lists: WeakMap<Element, HTMLElement>
}

export const createRenderCache = (): RenderCache => ({
  elements: new WeakMap(),
  lists: new WeakMap(),
})

export const renderDoc = (root: HTMLElement, doc: Doc, cache: RenderCache): Element[] => {
  const owner = root.ownerDocument
  const elements: Element[] = []
  const used = new Set<Element>()
  const top: Node[] = []
  let items: HTMLElement[] = []
  let listType: string | null = null
  const closeList = (): void => {
    if (!items.length) return
    const tag = listType === 'bullet' ? 'UL' : 'OL'
    let container = cache.lists.get(items[0])
    if (container?.tagName !== tag) {
      container = owner.createElement(tag.toLowerCase())
      cache.lists.set(items[0], container)
    }
    syncChildren(container, items)
    top.push(container)
    items = []
    listType = null
  }
  for (const block of doc.blocks) {
    let element = cache.elements.get(block)
    if (!element || used.has(element)) {
      element = renderBlock(owner, block)
      cache.elements.set(block, element)
    }
    elements.push(element)
    used.add(element)
    if (isList(block.type)) {
      if (listType !== block.type) closeList()
      listType = block.type
      items.push(element)
    } else {
      closeList()
      top.push(element)
    }
  }
  closeList()
  syncChildren(root, top)
  return elements
}

const sizeOf = (node: Node, block: Node): number => {
  if (node.nodeType === TEXT) return (node as Text).data.length
  if ((node as Element).tagName === 'BR') return isTrailingBreak(node, block) ? 0 : 1
  return Array.from(node.childNodes).reduce((total, child) => total + sizeOf(child, block), 0)
}

export const offsetIn = (block: Element, target: Node, offset: number): number => {
  let total = 0
  let done = false
  const visit = (node: Node): void => {
    if (done) return
    if (node === target) {
      if (node.nodeType === TEXT) total += offset
      else {
        for (let i = 0; i < offset; i++) total += sizeOf(node.childNodes[i], block)
      }
      done = true
    } else if (node.nodeType === TEXT || (node as Element).tagName === 'BR') {
      total += sizeOf(node, block)
    } else {
      node.childNodes.forEach(visit)
    }
  }
  visit(block)
  return total
}

export const pointIn = (block: Element, offset: number): [Node, number] => {
  let remaining = offset
  let found: [Node, number] | null = null
  const visit = (node: Node): void => {
    if (found) return
    if (node.nodeType === TEXT) {
      const length = (node as Text).data.length
      if (remaining <= length) found = [node, remaining]
      else remaining -= length
    } else if ((node as Element).tagName === 'BR') {
      if (isTrailingBreak(node, block)) return
      if (remaining <= 1) {
        const siblings = Array.from(node.parentNode?.childNodes ?? [])
        found = [node.parentNode as Node, siblings.indexOf(node as ChildNode) + remaining]
      } else {
        remaining -= 1
      }
    } else {
      node.childNodes.forEach(visit)
    }
  }
  visit(block)
  return found ?? [block, 0]
}

export const domPoint = (elements: readonly Element[], point: Point): [Node, number] => {
  const element = elements[Math.min(Math.max(point.block, 0), elements.length - 1)]
  return pointIn(element, point.offset)
}

export const pointFromDom = (
  elements: readonly Element[],
  root: Element,
  node: Node,
  offset: number,
): Point | null => {
  if (!root.contains(node)) return null
  for (let current: Node | null = node; current; current = current.parentNode) {
    const index = elements.indexOf(current as Element)
    if (index >= 0) return { block: index, offset: offsetIn(elements[index], node, offset) }
    if (current === root) break
  }
  const child = node.childNodes[offset]
  const inside = (candidate: Element): boolean => node.contains(candidate)
  if (child) {
    const index = elements.findIndex(
      (candidate) => child === candidate || child.contains(candidate),
    )
    if (index >= 0) return { block: index, offset: 0 }
  }
  let index = elements.length - 1
  for (let i = elements.length - 1; i >= 0; i--) {
    if (inside(elements[i])) {
      index = i
      break
    }
  }
  return {
    block: index,
    offset: offsetIn(elements[index], elements[index], elements[index].childNodes.length),
  }
}

export const selectionFromDom = (
  elements: readonly Element[],
  root: Element,
  anchor: [Node | null, number],
  focus: [Node | null, number],
): Selection | null => {
  if (!anchor[0] || !focus[0]) return null
  const a = pointFromDom(elements, root, anchor[0], anchor[1])
  const f = pointFromDom(elements, root, focus[0], focus[1])
  return a && f ? { anchor: a, focus: f } : null
}

export const applyDomSelection = (elements: readonly Element[], selection: Selection): void => {
  const owner = elements[0]?.ownerDocument
  const domSelection = owner?.getSelection()
  if (!domSelection) return
  const [anchorNode, anchorOffset] = domPoint(elements, selection.anchor)
  const [focusNode, focusOffset] = domPoint(elements, selection.focus)
  domSelection.setBaseAndExtent(anchorNode, anchorOffset, focusNode, focusOffset)
}
