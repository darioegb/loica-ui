import type { Mock } from 'vitest'
import { act, render, renderHook, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { defaultDarkTheme, defaultTheme } from '../config'
import { ThemeProvider, useTheme } from '../theme-provider'

type Listener = () => void

function mockSystemColorScheme(initiallyDark: boolean): {
  setDark: (dark: boolean) => void
  removeEventListener: Mock
} {
  const listeners = new Set<Listener>()
  const query = {
    matches: initiallyDark,
    addEventListener: vi.fn((_: string, listener: Listener) => listeners.add(listener)),
    removeEventListener: vi.fn((_: string, listener: Listener) => listeners.delete(listener)),
  }
  window.matchMedia = vi.fn().mockReturnValue(query)
  return {
    setDark: (dark) => {
      query.matches = dark
      listeners.forEach((listener) => listener())
    },
    removeEventListener: query.removeEventListener,
  }
}

function ColorModeProbe(): React.ReactNode {
  const { colorMode, setColorMode, theme } = useTheme()
  return (
    <>
      <output>{colorMode}</output>
      <span data-testid="background">{theme.semantic.background}</span>
      <button onClick={() => setColorMode('dark')} type="button">
        dark
      </button>
      <button onClick={() => setColorMode('light')} type="button">
        light
      </button>
    </>
  )
}

const root = (): HTMLElement => screen.getByRole('status').closest('.loica-root') as HTMLElement

describe('ThemeProvider', () => {
  afterEach(() => {
    document.documentElement.removeAttribute('data-loica-color-mode')
    document.body.removeAttribute('style')
  })

  it('leaves the default values to tokens.css and only emits what the theme changes', () => {
    render(
      <ThemeProvider>
        <ColorModeProbe />
      </ThemeProvider>,
    )
    expect(root().style.getPropertyValue('--loica-color-primary-solid')).toBe('')
    expect(root().style.getPropertyValue('--loica-space-4')).toBe('')
    expect(root()).toHaveAttribute('data-loica-color-mode', 'light')
  })

  it('declares again the variables that point to another one', () => {
    render(
      <ThemeProvider>
        <ColorModeProbe />
      </ThemeProvider>,
    )
    expect(root().style.getPropertyValue('--loica-focus-ring-color')).toBe(
      defaultTheme.focusRing.color,
    )
    expect(root().style.getPropertyValue('--loica-text-heading-1-size')).toBe(
      defaultTheme.textStyles['heading-1'].fontSize,
    )
  })

  it('merges a partial theme over the default one', () => {
    render(
      <ThemeProvider theme={{ colors: { primary: { 100: '#ff0000' } } }}>
        <ColorModeProbe />
      </ThemeProvider>,
    )
    expect(root()).toHaveStyle('--loica-color-primary-tint: #ff0000')
    expect(root().style.getPropertyValue('--loica-color-primary-solid')).toBe('')
  })

  it('switches between light and dark at runtime', async () => {
    const user = userEvent.setup()
    render(
      <ThemeProvider darkTheme={{ semantic: { background: '#000000' } }}>
        <ColorModeProbe />
      </ThemeProvider>,
    )

    await user.click(screen.getByRole('button', { name: 'dark' }))
    expect(screen.getByRole('status')).toHaveTextContent('dark')
    expect(screen.getByTestId('background')).toHaveTextContent('#000000')
    expect(root()).toHaveAttribute('data-loica-color-mode', 'dark')

    await user.click(screen.getByRole('button', { name: 'light' }))
    expect(screen.getByTestId('background')).toHaveTextContent(defaultTheme.semantic.background)
  })

  it('uses the default dark theme when no dark overrides are given', () => {
    render(
      <ThemeProvider defaultColorMode="dark">
        <ColorModeProbe />
      </ThemeProvider>,
    )
    expect(screen.getByTestId('background')).toHaveTextContent(
      String(defaultDarkTheme.semantic?.background),
    )
  })

  it('themes the page and restores it on unmount', () => {
    document.documentElement.setAttribute('data-loica-color-mode', 'previous')
    const { unmount } = render(
      <ThemeProvider defaultColorMode="dark">
        <ColorModeProbe />
      </ThemeProvider>,
    )
    expect(document.documentElement).toHaveAttribute('data-loica-color-mode', 'dark')
    expect(document.body.style.backgroundColor).not.toBe('')

    unmount()
    expect(document.documentElement).toHaveAttribute('data-loica-color-mode', 'previous')
    expect(document.body.style.backgroundColor).toBe('')
  })

  it('tells the browser the color scheme, for the native controls and the scrollbars', () => {
    document.documentElement.style.colorScheme = 'light'
    const { container, unmount } = render(
      <ThemeProvider defaultColorMode="dark">
        <ColorModeProbe />
      </ThemeProvider>,
    )
    expect(document.documentElement.style.colorScheme).toBe('dark')
    expect(container.querySelector('.loica-root')).toHaveStyle({ colorScheme: 'dark' })

    unmount()
    expect(document.documentElement.style.colorScheme).toBe('light')
    document.documentElement.style.colorScheme = ''
  })

  it('removes the page attribute on unmount when there was none', () => {
    const { unmount } = render(
      <ThemeProvider>
        <ColorModeProbe />
      </ThemeProvider>,
    )
    unmount()
    expect(document.documentElement).not.toHaveAttribute('data-loica-color-mode')
  })

  describe('with several providers that theme the page', () => {
    const page = (): { mode: string | undefined; scheme: string; color: string } => ({
      mode: document.documentElement.dataset.loicaColorMode,
      scheme: document.documentElement.style.colorScheme,
      color: document.body.style.color,
    })

    afterEach(() => {
      document.documentElement.style.colorScheme = ''
    })

    it.each([
      ['in the order they mounted', 'first'],
      ['in the reverse order', 'last'],
    ])('leaves the page as it was when they unmount %s', (_, unmountFirst) => {
      const first = render(<ThemeProvider defaultColorMode="dark">{null}</ThemeProvider>)
      const second = render(<ThemeProvider defaultColorMode="dark">{null}</ThemeProvider>)
      expect(page().mode).toBe('dark')

      if (unmountFirst === 'first') {
        first.unmount()
        second.unmount()
      } else {
        second.unmount()
        first.unmount()
      }
      expect(page()).toEqual({ mode: undefined, scheme: '', color: '' })
    })

    it('keeps the theme of the provider that is left when another one unmounts', () => {
      const first = render(<ThemeProvider defaultColorMode="dark">{null}</ThemeProvider>)
      const second = render(<ThemeProvider defaultColorMode="dark">{null}</ThemeProvider>)

      first.unmount()
      expect(page().mode).toBe('dark')
      expect(page().scheme).toBe('dark')
      second.unmount()
    })

    it('follows the last mounted provider when the mode changes', async () => {
      const first = render(
        <ThemeProvider>
          <ColorModeProbe />
        </ThemeProvider>,
      )
      const second = render(
        <ThemeProvider defaultColorMode="dark">
          <ColorModeProbe />
        </ThemeProvider>,
      )
      await userEvent.click(screen.getAllByRole('button', { name: 'light' })[1])
      expect(page().mode).toBe('light')
      expect(page().scheme).toBe('light')

      second.unmount()
      expect(page().mode).toBe('light')
      first.unmount()
      expect(page().mode).toBeUndefined()
    })
  })

  it('leaves the page alone when applyToBody is false', () => {
    render(
      <ThemeProvider applyToBody={false}>
        <ColorModeProbe />
      </ThemeProvider>,
    )
    expect(document.documentElement).not.toHaveAttribute('data-loica-color-mode')
    expect(document.body.style.backgroundColor).toBe('')
  })

  it('follows the system preference when set to system', () => {
    const system = mockSystemColorScheme(true)
    const { unmount } = render(
      <ThemeProvider defaultColorMode="system">
        <ColorModeProbe />
      </ThemeProvider>,
    )
    expect(screen.getByRole('status')).toHaveTextContent('dark')

    act(() => system.setDark(false))
    expect(screen.getByRole('status')).toHaveTextContent('light')

    unmount()
    expect(system.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function))
  })

  it('applies the className and style to its root element', () => {
    render(
      <ThemeProvider className="app" style={{ padding: '1rem' }}>
        <ColorModeProbe />
      </ThemeProvider>,
    )
    expect(root()).toHaveClass('loica-root app')
    expect(root().style.padding).toBe('1rem')
  })
})

describe('useTheme', () => {
  it('throws outside of a ThemeProvider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
    expect(() => {
      renderHook(() => useTheme())
    }).toThrow('useTheme must be used within a <ThemeProvider>')
    vi.restoreAllMocks()
  })
})
