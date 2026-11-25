import type { EditorState } from './richtexteditor-model'
import { last } from './richtexteditor-model'

export interface History {
  past: readonly EditorState[]
  future: readonly EditorState[]
  kind: string | null
  time: number
}

const LIMIT = 200
const WINDOW = 1000
const COALESCED = new Set(['type', 'delete'])

export const emptyHistory = (): History => ({
  past: [],
  future: [],
  kind: null,
  time: 0,
})

export const record = (
  history: History,
  before: EditorState,
  kind: string,
  now: number,
): History => {
  const coalesce = COALESCED.has(kind) && history.kind === kind && now - history.time < WINDOW
  return {
    past: coalesce ? history.past : [...history.past, before].slice(-LIMIT),
    future: [],
    kind,
    time: now,
  }
}

export const breakRun = (history: History): History =>
  history.kind === null ? history : { ...history, kind: null }

export const undo = (
  history: History,
  current: EditorState,
): { history: History; state: EditorState } | null => {
  const state = last(history.past)
  if (!state) return null
  return {
    state,
    history: {
      past: history.past.slice(0, -1),
      future: [current, ...history.future],
      kind: null,
      time: 0,
    },
  }
}

export const redo = (
  history: History,
  current: EditorState,
): { history: History; state: EditorState } | null => {
  const state = history.future[0]
  if (!state) return null
  return {
    state,
    history: {
      past: [...history.past, current],
      future: history.future.slice(1),
      kind: null,
      time: 0,
    },
  }
}
