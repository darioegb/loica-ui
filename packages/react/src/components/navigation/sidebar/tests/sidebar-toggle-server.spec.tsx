import { act, screen } from '@testing-library/react'
import { hydrateRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { SidebarProvider, SidebarToggle } from '..'

const page = (
  <SidebarProvider>
    <SidebarToggle />
  </SidebarProvider>
)

beforeEach(() => {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    addEventListener: () => undefined,
    matches: query !== 'not all',
    media: query,
    removeEventListener: () => undefined,
  }))
})

describe('SidebarToggle on the server', () => {
  it('does not say whether the sidebar is expanded, because the server does not know the screen', () => {
    const html = renderToString(page)
    expect(html).toContain('data-loica-sidebar-toggle')
    expect(html).not.toContain('aria-expanded')
  })

  it('says it once the page is loaded, without a hydration mismatch', () => {
    const container = document.createElement('div')
    container.innerHTML = renderToString(page)
    document.body.appendChild(container)
    const errors = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    try {
      act(() => {
        hydrateRoot(container, page)
      })
      expect(errors).not.toHaveBeenCalled()
      expect(screen.getByRole('button', { name: 'Toggle sidebar' })).toHaveAttribute(
        'aria-expanded',
        'false',
      )
    } finally {
      errors.mockRestore()
      container.remove()
    }
  })
})
