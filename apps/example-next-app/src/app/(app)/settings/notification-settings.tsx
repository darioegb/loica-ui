'use client'

import type { ReactNode } from 'react'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button, Checkbox, Field, Stack, Text, TimePicker, Toggle, useToast } from '@loica-ui/react'

const channels = ['email', 'push', 'digest'] as const

export function NotificationSettings(): ReactNode {
  const t = useTranslations('settings.notifications')
  const toast = useToast()
  const [paused, setPaused] = useState(false)
  const [enabled, setEnabled] = useState<string[]>(['email', 'digest'])
  const [digestTime, setDigestTime] = useState('08:00')

  const toggle = (id: string): void =>
    setEnabled((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]))

  return (
    <Stack className="max-w-xl py-2" gap={5}>
      <Field helperText={t('pauseHelper')} label={t('pause')} orientation="inline">
        <Toggle checked={paused} onChange={(event) => setPaused(event.target.checked)} />
      </Field>
      <Stack aria-label={t('channels')} gap={3} role="group">
        {channels.map((channel) => (
          <Field key={channel} label={t(channel)} orientation="inline">
            <Checkbox
              checked={enabled.includes(channel)}
              disabled={paused}
              onChange={() => toggle(channel)}
            />
          </Field>
        ))}
      </Stack>
      <Stack gap={1}>
        <Text as="label" htmlFor="digest-time" variant="label">
          {t('digestTime')}
        </Text>
        <TimePicker
          disabled={paused || !enabled.includes('digest')}
          id="digest-time"
          minuteStep={15}
          onValueChange={setDigestTime}
          value={digestTime}
        />
        <Text muted variant="caption">
          {t('digestTimeHelper')}
        </Text>
      </Stack>
      <div>
        <Button onClick={() => toast.success({ description: t('savedAt', { time: digestTime }), title: t('saved') })}>{t('save')}</Button>
      </div>
    </Stack>
  )
}
