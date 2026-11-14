'use client'

import type { ReactNode } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import {
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  ProgressBar,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@loica-ui/react'
import type { Project } from '@/lib/data'
import { formatDue } from '@/lib/format'
import { statusColor } from '@/lib/status'

export function ProjectDrawer({
  onComplete,
  onOpenChange,
  onRemove,
  open,
  project,
}: Readonly<{
  onComplete: (project: Project) => void
  onOpenChange: (open: boolean) => void
  onRemove: (project: Project) => void
  open: boolean
  project: Project | null
}>): ReactNode {
  const t = useTranslations('projects')
  const tDrawer = useTranslations('projects.drawer')
  const tStatus = useTranslations('status')
  const tVisibility = useTranslations('visibility')
  const locale = useLocale()

  const activity = (current: Project): { text: string; when: string }[] => [
    { text: tDrawer('updatedPlan', { name: current.owner }), when: tDrawer('daysAgo', { count: 2 }) },
    {
      text: tDrawer('commented', { name: current.team[1] ?? current.owner }),
      when: tDrawer('daysAgo', { count: 4 }),
    },
    { text: tDrawer('created', { name: current.owner }), when: tDrawer('weeksAgo', { count: 3 }) },
  ]

  return (
    <Drawer onOpenChange={onOpenChange} open={open && project !== null}>
      <DrawerContent>
        {project ? (
          <>
            <DrawerHeader>{project.name}</DrawerHeader>
            <DrawerBody>
              <Tabs>
                <TabList>
                  <Tab label={tDrawer('overview')} />
                  <Tab label={tDrawer('activity')} />
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <div className="flex flex-col gap-4 py-4">
                      <p>{project.description || t('noDescription')}</p>
                      <DescriptionList layout="inline">
                        <DescriptionTerm>{tDrawer('status')}</DescriptionTerm>
                        <DescriptionDetails>
                          <Badge colorScheme={statusColor[project.status]} dot variant="subtle">
                            {tStatus(project.status)}
                          </Badge>
                        </DescriptionDetails>
                        <DescriptionTerm>{tDrawer('due')}</DescriptionTerm>
                        <DescriptionDetails>{formatDue(project.due, locale)}</DescriptionDetails>
                        <DescriptionTerm>{tDrawer('owner')}</DescriptionTerm>
                        <DescriptionDetails className="flex items-center gap-2 text-sm text-(--loica-muted)">
                          <Avatar name={project.owner} size="sm" />
                          {project.owner}
                        </DescriptionDetails>
                        <DescriptionTerm>{tDrawer('team')}</DescriptionTerm>
                        <DescriptionDetails>
                          <AvatarGroup max={5} size="sm">
                            {project.team.map((member) => (
                              <Avatar key={member} name={member} />
                            ))}
                          </AvatarGroup>
                        </DescriptionDetails>
                        <DescriptionTerm>{tDrawer('visibility')}</DescriptionTerm>
                        <DescriptionDetails>
                          <Badge colorScheme="salmon" variant="subtle">
                            {tVisibility(project.visibility)}
                          </Badge>
                        </DescriptionDetails>
                      </DescriptionList>
                      <ProgressBar
                        aria-label={tDrawer('progress')}
                        colorScheme={statusColor[project.status]}
                        showValue
                        value={project.progress}
                      />
                    </div>
                  </TabPanel>
                  <TabPanel>
                    <ul className="flex flex-col gap-3 py-4">
                      {activity(project).map((event) => (
                        <li key={event.text}>
                          {event.text}
                          <span className="block text-sm text-(--loica-muted)">{event.when}</span>
                        </li>
                      ))}
                    </ul>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </DrawerBody>
            <DrawerFooter>
              <Button colorScheme="error" onClick={() => onRemove(project)} variant="ghost">
                {t('delete')}
              </Button>
              <DrawerClose>
                <Button
                  disabled={project.status === 'done'}
                  onClick={() => onComplete(project)}
                  variant="outline"
                >
                  {t('markAsDone')}
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </>
        ) : null}
      </DrawerContent>
    </Drawer>
  )
}
