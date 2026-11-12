import { act } from '@testing-library/react'
import { hydrateRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { ThemeProvider } from '../../../../theme'
import { Select, SelectContent, SelectOption, SelectTrigger } from '..'

const options = [
  { icon: <svg data-testid="unit-icon" />, label: 'Unidad', value: 'unit' },
  { label: 'Local principal', value: 'main' },
]

const render = (element: React.ReactNode): string =>
  renderToString(<ThemeProvider>{element}</ThemeProvider>)

describe('Select on the server', () => {
  it('shows the chosen option of `options` in the HTML', () => {
    const html = render(<Select aria-label="Type" defaultValue="unit" options={options} />)
    expect(html).toContain('Unidad')
    expect(html).toContain('data-testid="unit-icon"')
    expect(html).not.toContain('Local principal')
  })

  it('shows every chosen option of a multiple select', () => {
    const html = render(
      <Select aria-label="Type" defaultValue={['unit', 'main']} multiple options={options} />,
    )
    expect(html).toContain('Unidad')
    expect(html).toContain('Local principal')
  })

  it('shows the value of a controlled select', () => {
    expect(render(<Select aria-label="Type" options={options} value="main" />)).toContain(
      'Local principal',
    )
  })

  it('shows the placeholder when nothing is chosen', () => {
    const html = render(<Select aria-label="Type" options={options} placeholder="Pick one" />)
    expect(html).toContain('Pick one')
    expect(html).not.toContain('Unidad')
  })

  it('has no label to show for an option written as a child, which registers after mount', () => {
    const html = render(
      <Select defaultValue="unit">
        <SelectTrigger aria-label="Type" />
        <SelectContent>
          <SelectOption label="Unidad" value="unit" />
        </SelectContent>
      </Select>,
    )
    expect(html).not.toContain('Unidad')
  })

  it('hydrates what the server rendered without a mismatch', () => {
    const element = (
      <ThemeProvider>
        <Select aria-label="Type" defaultValue="unit" options={options} />
      </ThemeProvider>
    )
    const container = document.createElement('div')
    container.innerHTML = renderToString(element)
    document.body.appendChild(container)
    const errors = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    try {
      act(() => {
        hydrateRoot(container, element)
      })
      expect(errors).not.toHaveBeenCalled()
      expect(container).toHaveTextContent('Unidad')
    } finally {
      errors.mockRestore()
      container.remove()
    }
  })
})
