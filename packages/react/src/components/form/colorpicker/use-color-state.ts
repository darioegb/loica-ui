'use client'

import { useCallback, useState } from 'react'
import { useControllableState } from '../../../overlay/use-controllable-state'
import { formatColor, parseColor, type ColorFormat, type Hsva } from './color-math'

const EMPTY: Hsva = { a: 1, h: 0, s: 1, v: 1 }

interface UseColorStateOptions {
  alpha: boolean
  defaultValue: string
  format: ColorFormat
  onValueChange?: (value: string) => void
  value?: string
}

export interface ColorState {
  clear: () => void
  color: Hsva
  hasColor: boolean
  setColor: (change: Partial<Hsva>) => void
  setFromText: (text: string) => boolean
  text: string
}

export function useColorState({
  alpha,
  defaultValue,
  format,
  onValueChange,
  value: valueProp,
}: Readonly<UseColorStateOptions>): ColorState {
  const [value, setValue] = useControllableState({
    defaultValue,
    onChange: onValueChange,
    value: valueProp,
  })
  const [color, setHsva] = useState<Hsva>(() => parseColor(value) ?? EMPTY)
  const parsed = parseColor(value, color.h)

  if (parsed && formatColor(parsed, format, alpha) !== formatColor(color, format, alpha)) {
    setHsva(parsed)
  }

  const commit = useCallback(
    (next: Hsva): void => {
      setHsva(next)
      setValue(formatColor(next, format, alpha))
    },
    [alpha, format, setValue],
  )

  const setColor = useCallback(
    (change: Partial<Hsva>): void => commit({ ...color, ...change }),
    [color, commit],
  )

  const setFromText = useCallback(
    (text: string): boolean => {
      const next = parseColor(text, color.h)
      if (next) commit(next)
      return next !== null
    },
    [color.h, commit],
  )

  const clear = useCallback((): void => setValue(''), [setValue])

  return {
    clear,
    color,
    hasColor: parsed !== null,
    setColor,
    setFromText,
    text: parsed ? formatColor(color, format, alpha) : '',
  }
}
