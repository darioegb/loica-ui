'use client'

import type { ReactNode } from 'react'
import { LocaleProvider } from '@loica-ui/react'
import { es } from '@loica-ui/react/locales/es'
import { useLocale } from 'next-intl'

export function LoicaLocale({ children }: Readonly<{ children: ReactNode }>): ReactNode {
  const locale = useLocale()

  return (
    <LocaleProvider locale={locale} messages={locale === 'es' ? es : undefined}>
      {children}
    </LocaleProvider>
  )
}
