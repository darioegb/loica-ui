import type { ReactNode } from 'react'
import { memo, useCallback, useContext, useEffect, useRef, useState } from 'react'
import type StackBlitzSdk from '@stackblitz/sdk'
import {
  Anchor,
  Canvas,
  Controls,
  Description,
  DocsContext,
  SourceContext,
  Subheading,
  useSourceProps,
} from '@storybook/addon-docs/blocks'
import type { buildSandbox } from './stackblitz-sandbox'

type Locals = Record<string, Record<string, string>>

interface Tools {
  build: typeof buildSandbox
  locals: Locals
  sdk: typeof StackBlitzSdk
}

interface DocsStory {
  fileName: string
  id: string
  moduleExport: object
  name: string
  title: string
  withToolbar: boolean
  /** The props the Controls of the story change, for the story that is the playground of the page. */
  controls?: string[]
}

const PACKAGE_DIR = 'packages/react/'

const STACKBLITZ_LOGO = (
  <svg aria-hidden="true" fill="currentColor" focusable="false" height="12" viewBox="0 0 28 28" width="12">
    <path d="M12.747 16.273h-7.46L18.925 1.5l-3.671 10.227h7.46L9.075 26.5l3.671-10.227z" />
  </svg>
)

const StoryHeading = memo(function StoryHeading({ name }: Readonly<{ name: string }>): ReactNode {
  return <Subheading>{name}</Subheading>
})

function useStackBlitzTools(): Tools | null {
  const [tools, setTools] = useState<Tools | null>(null)
  useEffect(() => {
    let active = true
    Promise.all([
      import('@stackblitz/sdk'),
      import('./stackblitz-sandbox'),
      import('./story-locals.generated.json'),
    ])
      .then(([{ default: sdk }, { buildSandbox: build }, { default: locals }]) => {
        if (active) setTools({ build, locals: locals, sdk })
      })
      .catch(() => undefined)
    return () => {
      active = false
    }
  }, [])
  return tools
}

const localsOf = (tools: Tools, fileName: string): Record<string, string> => {
  const start = fileName.indexOf(PACKAGE_DIR)
  return start < 0 ? {} : (tools.locals[fileName.slice(start + PACKAGE_DIR.length)] ?? {})
}

const COPIED_MS = 1500

const COPY_ICON = (
  <svg aria-hidden="true" fill="none" focusable="false" height="12" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="12">
    <rect height="13" rx="2" width="13" x="9" y="9" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
)

function CopyLabel({ register }: Readonly<{ register: (show: (copied: boolean) => void) => void }>): ReactNode {
  const [copied, setCopied] = useState(false)
  useEffect(() => register(setCopied), [register])
  return (
    <>
      {COPY_ICON} {copied ? 'Copied' : 'Copy code'}
    </>
  )
}

const colorModeOf = (): 'dark' | 'light' =>
  document.documentElement.getAttribute('data-loica-color-mode') === 'dark' ? 'dark' : 'light'

function StoryExample({ story, tools }: Readonly<{ story: DocsStory; tools: Tools | null }>): ReactNode {
  const docsContext = useContext(DocsContext)
  const sourceContext = useContext(SourceContext)
  const live = story.controls !== undefined
  const { code = '' } = useSourceProps({ of: story.moduleExport, __forceInitialArgs: !live }, docsContext, sourceContext)
  const open = (): void => {
    if (!tools || !code) return
    const component = story.title.split('/').pop() ?? story.title
    tools.sdk.openProject(
      {
        title: `${component} - ${story.name}`,
        description: `Loica UI React: ${story.title} - ${story.name}`,
        template: 'node',
        files: tools.build(code, story.id, localsOf(tools, story.fileName), colorModeOf()),
      },
      { openFile: 'src/App.tsx', newWindow: true },
    )
  }
  const latestOpen = useRef(open)
  const latestCode = useRef(code)
  const showCopied = useRef<(copied: boolean) => void>(() => undefined)
  useEffect(() => {
    latestOpen.current = open
    latestCode.current = code
  })
  const copy = (): void => {
    navigator.clipboard
      .writeText(latestCode.current)
      .then(() => {
        showCopied.current(true)
        setTimeout(() => showCopied.current(false), COPIED_MS)
      })
      .catch(() => undefined)
  }
  const register = useCallback((show: (copied: boolean) => void) => {
    showCopied.current = show
  }, [])
  return (
    <Anchor storyId={story.id}>
      <StoryHeading name={story.name} />
      <Description of={story.moduleExport} />
      <Canvas
        additionalActions={[
          { title: <CopyLabel register={register} />, onClick: copy },
          { title: <>{STACKBLITZ_LOGO} Open in StackBlitz</>, onClick: () => latestOpen.current() },
        ]}
        of={story.moduleExport}
        source={{ __forceInitialArgs: !live }}
        story={{ __forceInitialArgs: !live }}
        withToolbar={story.withToolbar}
      />
      {story.controls ? <Controls include={story.controls} of={story.moduleExport} sort="requiredFirst" /> : null}
    </Anchor>
  )
}

type Control = { disable?: boolean; type?: string }
type ArgTypes = Record<string, { control?: Control | false; table?: { disable?: boolean } }>

// The Default story is the playground of the page: its Controls change the props that its argTypes give a control.
const controlsOf = (story: { name: string; argTypes?: unknown }): string[] | undefined => {
  if (story.name !== 'Default') return undefined
  const names = Object.entries((story.argTypes ?? {}) as ArgTypes)
    .filter(([, arg]) => Boolean(arg.control && arg.control.type && !arg.control.disable) && !arg.table?.disable)
    .map(([name]) => name)
  return names.length > 0 ? names : undefined
}

function StoryExamples(): ReactNode {
  const { componentStories, projectAnnotations, getStoryContext } = useContext(DocsContext)
  const tools = useStackBlitzTools()
  const filter = (
    projectAnnotations.parameters?.docs as { stories?: { filter?: (...args: unknown[]) => boolean } } | undefined
  )?.stories?.filter
  let stories = componentStories()
  if (filter) stories = stories.filter((story) => filter(story, getStoryContext(story)))
  if (stories.some((story) => story.tags?.includes('autodocs'))) {
    stories = stories.filter((story) => story.tags?.includes('autodocs') && !story.usesMount)
  }
  return (
    <>
      {stories.map((story) => (
        <StoryExample
          key={story.id}
          story={{
            fileName: String(story.parameters.fileName),
            id: story.id,
            moduleExport: story.moduleExport as object,
            name: story.name,
            title: story.title,
            withToolbar:
              (story.parameters.docs as { canvas?: { withToolbar?: boolean } } | undefined)?.canvas?.withToolbar ??
              false,
            controls: controlsOf(story),
          }}
          tools={tools}
        />
      ))}
    </>
  )
}

export default StoryExamples
