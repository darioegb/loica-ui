'use client'

import type { ReactNode } from 'react'
import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import {
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  Card,
  CardHeader,
  ProgressBar,
  Splitter,
  SplitterPanel,
} from '@loica-ui/react'
import type { Project } from '@/lib/data'
import { formatDue } from '@/lib/format'
import { statusColor } from '@/lib/status'

export function ProjectExplorer({ projects }: Readonly<{ projects: Project[] }>): ReactNode {
  const t = useTranslations('dashboard')
  const tStatus = useTranslations('status')
  const locale = useLocale()
  const [selectedId, setSelectedId] = useState(projects[0]?.id)
  const project = projects.find((item) => item.id === selectedId)

  return (
    <Card variant="outline">
      <CardHeader>{t('explorer')}</CardHeader>
      <Splitter aria-label={t('explorerLabel')} className="h-60" defaultSizes={[34, 66]}>
        <SplitterPanel collapsible minSize={20}>
          <ul className="flex flex-col gap-1 p-2">
            {projects.map((item) => (
              <li key={item.id}>
                <Button
                  aria-current={item.id === selectedId ? 'true' : undefined}
                  colorScheme={item.id === selectedId ? 'primary' : undefined}
                  className="w-full justify-start"
                  onClick={() => setSelectedId(item.id)}
                  size="sm"
                  variant={item.id === selectedId ? 'solid' : 'ghost'}
                >
                  {item.name}
                </Button>
              </li>
            ))}
          </ul>
        </SplitterPanel>
        <SplitterPanel minSize={40}>
          {project ? (
            <div className="flex flex-col gap-3 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold">{project.name}</span>
                <Badge colorScheme={statusColor[project.status]} dot variant="subtle">
                  {tStatus(project.status)}
                </Badge>
              </div>
              <span className="text-sm text-(--loica-muted)">
                {t('due', { date: formatDue(project.due, locale) })}
              </span>
              <ProgressBar
                aria-label={t('progress', { name: project.name })}
                colorScheme={statusColor[project.status]}
                showValue
                value={project.progress}
              />
              <AvatarGroup max={4} size="sm">
                {project.team.map((member) => (
                  <Avatar key={member} name={member} />
                ))}
              </AvatarGroup>
            </div>
          ) : null}
        </SplitterPanel>
      </Splitter>
    </Card>
  )
}
