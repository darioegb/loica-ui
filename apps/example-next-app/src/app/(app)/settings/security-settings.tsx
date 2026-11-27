'use client'

import type { ReactNode } from 'react'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Alert, Button, Field, Heading, PinInput, Stack, Text, useToast } from '@loica-ui/react'

const demoCode = '123456'

export function SecuritySettings(): ReactNode {
  const t = useTranslations('settings.security')
  const toast = useToast()
  const [code, setCode] = useState('')
  const [wrong, setWrong] = useState(false)
  const [verified, setVerified] = useState(false)

  const verify = (value: string): void => {
    if (value === demoCode) {
      setVerified(true)
      setWrong(false)
      toast.success({ title: t('on') })
    } else {
      setWrong(true)
    }
  }

  const turnOff = (): void => {
    setVerified(false)
    setCode('')
  }

  return (
    <Stack className="max-w-xl py-2" gap={4}>
      <Stack gap={1}>
        <Heading level={3} size={5}>
          {t('title')}
        </Heading>
        <Text muted variant="body-sm">
          {t('intro')}
        </Text>
      </Stack>
      {verified ? (
        <>
          <Alert status="success" title={t('on')}>
            {t('onBody')}
          </Alert>
          <div>
            <Button onClick={turnOff} variant="outline">
              {t('turnOff')}
            </Button>
          </div>
        </>
      ) : (
        <Field errorText={t('codeError')} helperText={t('codeHelper')} invalid={wrong} label={t('code')} required>
          <PinInput
            onComplete={verify}
            onValueChange={(value) => {
              setCode(value)
              setWrong(false)
            }}
            value={code}
          />
        </Field>
      )}
    </Stack>
  )
}
