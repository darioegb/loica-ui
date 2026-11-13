'use client'

import type { ReactNode } from 'react'
import { useActionState } from 'react'
import { useTranslations } from 'next-intl'
import { Alert, Button, Card, CardBody, CardFooter, CardHeader, Field, Input, Stack } from '@loica-ui/react'
import { signIn, type SignInState } from '@/app/actions'

const initialState: SignInState = {}

export function LoginForm(): ReactNode {
  const t = useTranslations('login')
  const tValidation = useTranslations('validation')
  const [state, action, pending] = useActionState(signIn, initialState)
  const { email, password } = state.errors ?? {}
  return (
    <form action={action} className="w-full max-w-[26rem]" noValidate>
      <Card variant="outline">
        <CardHeader>{t('heading')}</CardHeader>
        <CardBody>
          <Stack gap={4}>
            <Alert status="info">{t('hint')}</Alert>
            <Field errorText={email && tValidation(email)} label={t('email')} required>
              <Input
                autoComplete="email"
                defaultValue={state.email}
                name="email"
                placeholder={t('emailPlaceholder')}
                type="email"
              />
            </Field>
            <Field errorText={password && tValidation(password)} label={t('password')} required>
              <Input autoComplete="current-password" name="password" revealable type="password" />
            </Field>
          </Stack>
        </CardBody>
        <CardFooter>
          <Button loading={pending} loadingText="…" type="submit">
            {t('submit')}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
