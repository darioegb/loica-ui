'use client'

import type { ReactNode } from 'react'
import { useState } from 'react'
import { Button, Tour, type TourStep } from '@loica-ui/react'
import { useTranslations } from 'next-intl'

export function DashboardTour(): ReactNode {
  const t = useTranslations('dashboard.tour')
  const [open, setOpen] = useState(false)

  const steps: TourStep[] = [
    { content: t('welcomeContent'), title: t('welcomeTitle') },
    { content: t('metricsContent'), target: '#dashboard-metrics', title: t('metricsTitle') },
    { content: t('projectsContent'), target: '#dashboard-projects', title: t('projectsTitle') },
  ]

  return (
    <>
      <Button onClick={() => setOpen(true)} size="sm" variant="outline">
        {t('start')}
      </Button>
      <Tour onOpenChange={setOpen} open={open} steps={steps} />
    </>
  )
}
