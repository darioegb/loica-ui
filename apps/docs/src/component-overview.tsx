import type { ChangeEvent, ReactNode } from 'react'
import { useEffect, useId, useMemo, useState } from 'react'
import { ThemeProvider, useTheme } from 'plume-ui-react'
import previews from './component-previews'
import overview from './components.generated.json'

interface ComponentEntry {
  category: string
  id: string
  name: string
  summary: string
}

const { categories, components }: { categories: string[]; components: ComponentEntry[] } = overview

const matches = (entry: ComponentEntry, query: string): boolean =>
  `${entry.name} ${entry.summary} ${entry.category}`.toLowerCase().includes(query)

type ColorMode = 'dark' | 'light'

const currentMode = (): ColorMode =>
  document.documentElement.getAttribute('data-plume-color-mode') === 'dark' ? 'dark' : 'light'

// The previews are Plume components, so they follow the color mode of the docs page.
function SyncColorMode(): null {
  const { setColorMode } = useTheme()
  useEffect(() => {
    setColorMode(currentMode())
    const observer = new MutationObserver(() => setColorMode(currentMode()))
    observer.observe(document.documentElement, {
      attributeFilter: ['data-plume-color-mode'],
      attributes: true,
    })
    return () => observer.disconnect()
  }, [setColorMode])
  return null
}

function ComponentOverview(): ReactNode {
  const [query, setQuery] = useState('')
  const searchId = useId()
  const normalized = query.trim().toLowerCase()
  const groups = useMemo(
    () =>
      categories
        .map((category) => ({
          category,
          entries: components.filter(
            (entry) => entry.category === category && (!normalized || matches(entry, normalized)),
          ),
        }))
        .filter(({ entries }) => entries.length > 0),
    [normalized],
  )
  const count = groups.reduce((total, { entries }) => total + entries.length, 0)

  return (
    <ThemeProvider applyToBody={false} className="plume-overview" defaultColorMode={currentMode()}>
      <SyncColorMode />
      <div className="plume-overview-search">
        <label htmlFor={searchId}>Filter components</label>
        <input
          autoComplete="off"
          id={searchId}
          onChange={(event: ChangeEvent<HTMLInputElement>) => setQuery(event.target.value)}
          placeholder="Name or purpose, for example date or menu"
          type="search"
          value={query}
        />
        <output aria-live="polite">
          {count === components.length ? `${count} components` : `${count} of ${components.length} components`}
        </output>
      </div>
      {groups.map(({ category, entries }) => (
        <section aria-labelledby={`${searchId}-${category}`} key={category}>
          <h2 id={`${searchId}-${category}`}>{category}</h2>
          <ul className="plume-overview-grid">
            {entries.map((entry) => (
              <li key={entry.id}>
                <div className="plume-overview-card">
                  <div aria-hidden="true" className="plume-overview-preview" inert>
                    {previews[entry.name]}
                  </div>
                  <a className="plume-overview-name" href={`./?path=/docs/${entry.id}`} target="_top">
                    {entry.name}
                  </a>
                  <span className="plume-overview-summary">{entry.summary}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
      {count === 0 ? <p>No component matches “{query.trim()}”.</p> : null}
    </ThemeProvider>
  )
}

export default ComponentOverview
