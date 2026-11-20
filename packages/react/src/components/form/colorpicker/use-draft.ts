'use client'

import type { ChangeEvent, KeyboardEvent } from 'react'
import { useState } from 'react'

interface Draft {
  onBlur: () => void
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void
  value: string
}

export function useDraft(display: string, commit: (text: string) => void): Draft {
  const [draft, setDraft] = useState<string | null>(null)

  const finish = (): void => {
    if (draft === null) return
    commit(draft)
    setDraft(null)
  }

  return {
    onBlur: finish,
    onChange: (event) => setDraft(event.target.value),
    onKeyDown: (event) => {
      if (event.key === 'Enter') finish()
    },
    value: draft ?? display,
  }
}
