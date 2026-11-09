'use client'

import type { ReactNode } from 'react'
import { createContext, useContext, useMemo } from 'react'
import { mergeLabels } from '../overlay/labels'
import type { MessageMap, LoicaMessages } from './messages'

export interface LocaleContextValue {
  locale?: string
  messages?: LoicaMessages
}

export interface LocaleProviderProps {
  children: ReactNode
  locale?: string
  messages?: LoicaMessages
}

const LocaleContext = createContext<LocaleContextValue>({})

const mergeMessages = (
  parent: LoicaMessages | undefined,
  own: LoicaMessages | undefined,
): LoicaMessages | undefined => {
  if (!parent || !own) return own ?? parent
  const merged: Record<string, object | undefined> = { ...parent }
  for (const key of Object.keys(own)) {
    merged[key] = { ...merged[key], ...own[key as keyof LoicaMessages] }
  }
  return merged
}

export function LocaleProvider({
  children,
  locale,
  messages,
}: Readonly<LocaleProviderProps>): ReactNode {
  const parent = useContext(LocaleContext)
  const value = useMemo(
    () => ({
      locale: locale ?? parent.locale,
      messages: mergeMessages(parent.messages, messages),
    }),
    [locale, messages, parent],
  )
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale(): string | undefined {
  return useContext(LocaleContext).locale
}

export const DEFAULT_LOCALE = 'en'

export function useResolvedLocale(own?: string): string {
  const provided = useContext(LocaleContext).locale
  return own ?? provided ?? DEFAULT_LOCALE
}

export function useLabels<K extends keyof MessageMap>(
  key: K,
  defaults: MessageMap[K],
  labels?: Partial<MessageMap[K]>,
): MessageMap[K] {
  const provided = useContext(LocaleContext).messages?.[key]
  return useMemo(
    () => mergeLabels(mergeLabels(defaults, provided), labels),
    [defaults, provided, labels],
  )
}
