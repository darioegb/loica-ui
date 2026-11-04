import type { ChangeEvent, ReactNode } from 'react'
import { useId, useMemo, useState } from 'react'
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
    <div className="plume-overview">
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
                <a className="plume-overview-card" href={`./?path=/docs/${entry.id}`} target="_top">
                  <span className="plume-overview-name">{entry.name}</span>
                  <span className="plume-overview-summary">{entry.summary}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}
      {count === 0 ? <p>No component matches “{query.trim()}”.</p> : null}
    </div>
  )
}

export default ComponentOverview
