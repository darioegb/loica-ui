import type { ChangeEvent, ReactNode } from 'react'
import { useEffect, useId, useMemo, useState } from 'react'
import { ThemeProvider, useTheme } from '@loica-ui/react'
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
  document.documentElement.getAttribute('data-loica-color-mode') === 'dark' ? 'dark' : 'light'

// The previews are Loica components, so they follow the color mode of the docs page.
function SyncColorMode(): null {
  const { setColorMode } = useTheme()
  useEffect(() => {
    setColorMode(currentMode())
    const observer = new MutationObserver(() => setColorMode(currentMode()))
    observer.observe(document.documentElement, {
      attributeFilter: ['data-loica-color-mode'],
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
    <ThemeProvider
      applyToBody={false}
      className="loica-overview"
      defaultColorMode={currentMode()}
      style={{ backgroundColor: 'transparent', color: 'inherit' }}
    >
      <SyncColorMode />
      <div className="loica-overview-search">
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
          <ul className="loica-overview-grid">
            {entries.map((entry) => (
              <li key={entry.id}>
                <div className="loica-overview-card">
                  <div aria-hidden="true" className="loica-overview-preview" inert>
                    <div className="loica-overview-preview-content">{previews[entry.name]}</div>
                  </div>
                  <a className="loica-overview-name" href={`./?path=/docs/${entry.id}`} target="_top">
                    {entry.name}
                  </a>
                  <span className="loica-overview-summary">{entry.summary}</span>
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
