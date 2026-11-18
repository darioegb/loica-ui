'use client'

import type { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import {
  CommandPalette,
  CommandPaletteGroup,
  CommandPaletteItem,
  useTheme,
} from '@loica-ui/react'
import { DashboardIcon, MoonIcon, ProjectsIcon, SettingsIcon, SunIcon, TeamIcon } from './icons'

const pages = [
  { href: '/', icon: <DashboardIcon />, label: 'dashboard' },
  { href: '/projects', icon: <ProjectsIcon />, label: 'projects' },
  { href: '/team', icon: <TeamIcon />, label: 'team' },
  { href: '/settings', icon: <SettingsIcon />, label: 'settings' },
] as const

export function CommandMenu({
  onOpenChange,
  onToggleColorMode,
  open,
}: Readonly<{
  onOpenChange: (open: boolean) => void
  onToggleColorMode: () => void
  open: boolean
}>): ReactNode {
  const t = useTranslations('nav')
  const tCommands = useTranslations('commands')
  const router = useRouter()
  const { colorMode } = useTheme()

  return (
    <CommandPalette onOpenChange={onOpenChange} open={open}>
      <CommandPaletteGroup heading={tCommands('goTo')}>
        {pages.map((page) => (
          <CommandPaletteItem icon={page.icon} key={page.href} onSelect={() => router.push(page.href)}>
            {t(page.label)}
          </CommandPaletteItem>
        ))}
      </CommandPaletteGroup>
      <CommandPaletteGroup heading={tCommands('actions')}>
        <CommandPaletteItem icon={<ProjectsIcon />} onSelect={() => router.push('/projects/new')}>
          {t('newProject')}
        </CommandPaletteItem>
        <CommandPaletteItem
          icon={colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}
          keywords={['theme', 'dark', 'light', 'tema', 'oscuro', 'claro']}
          onSelect={onToggleColorMode}
        >
          {colorMode === 'dark' ? t('switchToLight') : t('switchToDark')}
        </CommandPaletteItem>
      </CommandPaletteGroup>
    </CommandPalette>
  )
}
