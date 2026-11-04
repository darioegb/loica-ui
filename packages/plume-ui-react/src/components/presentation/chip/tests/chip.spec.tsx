import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { createRef } from 'react'
import { Chip } from '..'
import { LocaleProvider } from '../../../../locale/locale-provider'

describe('Chip component', () => {
  describe('rendering', () => {
    it('renders its text', () => {
      render(<Chip>Design</Chip>)
      expect(screen.getByText('Design')).toBeInTheDocument()
    })

    it('takes its text from label when it has no children', () => {
      const { rerender } = render(<Chip label="React" onRemove={() => undefined} />)
      expect(screen.getByRole('button', { name: /React/ })).toBeInTheDocument()
      rerender(<Chip label="React">Vue</Chip>)
      expect(screen.getByText('Vue')).toBeInTheDocument()
      expect(screen.queryByText('React')).toBeNull()
    })

    it('is a subtle, medium, pill chip by default', () => {
      const { container } = render(<Chip>Design</Chip>)
      expect(container.firstChild).toHaveClass('chip', 'subtle', 'md', 'pill')
    })

    it.each(['solid', 'outline', 'subtle'] as const)('supports the %s variant', (variant) => {
      const { container } = render(<Chip variant={variant}>Design</Chip>)
      expect(container.firstChild).toHaveClass(variant)
    })

    it.each(['sm', 'md', 'lg'] as const)('supports the %s size', (size) => {
      const { container } = render(<Chip size={size}>Design</Chip>)
      expect(container.firstChild).toHaveClass(size)
    })

    it('supports the rounded shape', () => {
      const { container } = render(<Chip shape="rounded">Design</Chip>)
      expect(container.firstChild).toHaveClass('rounded')
      expect(container.firstChild).not.toHaveClass('pill')
    })

    it('takes its color from the color scheme', () => {
      const { container } = render(<Chip colorScheme="success">Design</Chip>)
      expect(container.firstChild).toHaveStyle({
        '--chip-solid': 'var(--plume-color-success-solid)',
        '--chip-tint-text': 'var(--plume-color-success-tint-text)',
      })
    })

    it('keeps the className and style', () => {
      const { container } = render(
        <Chip className="mine" style={{ width: '120px' }}>
          Design
        </Chip>,
      )
      expect(container.firstChild).toHaveClass('chip', 'mine')
      expect(container.firstChild).toHaveStyle({ width: '120px' })
    })

    it('forwards the ref and the root attributes', () => {
      const ref = createRef<HTMLSpanElement>()
      render(
        <Chip id="tag" ref={ref} title="A tag">
          Design
        </Chip>,
      )
      expect(ref.current).toHaveAttribute('id', 'tag')
      expect(ref.current).toHaveAttribute('title', 'A tag')
    })

    it('hides an icon from screen readers', () => {
      render(<Chip icon={<img alt="" data-testid="icon" src="a.png" />}>Design</Chip>)
      expect(screen.getByTestId('icon').parentElement).toHaveAttribute('aria-hidden', 'true')
      expect(screen.getByTestId('icon').parentElement).toHaveClass('icon')
    })

    it('has no icon and no remove button by default', () => {
      render(<Chip>Design</Chip>)
      expect(screen.queryByRole('button')).toBeNull()
    })
  })

  describe('removing', () => {
    it('renders a remove button named after the chip', () => {
      render(<Chip onRemove={() => undefined}>Design</Chip>)
      expect(screen.getByRole('button', { name: 'Remove Design' })).toBeInTheDocument()
    })

    it('calls onRemove when the button is clicked', async () => {
      const onRemove = vi.fn()
      render(<Chip onRemove={onRemove}>Design</Chip>)
      await userEvent.click(screen.getByRole('button'))
      expect(onRemove).toHaveBeenCalledTimes(1)
    })

    it('can be removed with the keyboard', async () => {
      const onRemove = vi.fn()
      render(<Chip onRemove={onRemove}>Design</Chip>)
      await userEvent.tab()
      await userEvent.keyboard('{Enter}')
      expect(onRemove).toHaveBeenCalledTimes(1)
    })

    it('starts the name of the button with the remove text of the LocaleProvider', () => {
      render(
        <LocaleProvider messages={{ chip: { remove: 'Quitar' } }}>
          <Chip onRemove={() => undefined}>Diseño</Chip>
        </LocaleProvider>,
      )
      expect(screen.getByRole('button', { name: 'Quitar Diseño' })).toBeInTheDocument()
    })

    it('disables the button when it is disabled', async () => {
      const onRemove = vi.fn()
      const { container } = render(
        <Chip disabled onRemove={onRemove}>
          Design
        </Chip>,
      )
      expect(screen.getByRole('button')).toBeDisabled()
      expect(container.firstChild).toHaveClass('disabled')
      await userEvent.click(screen.getByRole('button'))
      expect(onRemove).not.toHaveBeenCalled()
    })
  })

  describe('unstyled', () => {
    it('drops the Plume classes of the parts and keeps the className of the root', () => {
      const { container } = render(
        <Chip className="mine" icon={<i />} onRemove={() => undefined} variant="unstyled">
          Design
        </Chip>,
      )
      expect(container.firstChild).toHaveAttribute('class', 'mine')
      expect(screen.getByText('Design')).not.toHaveAttribute('class')
      expect(screen.getByRole('button')).not.toHaveAttribute('class')
      expect(document.querySelector('[data-plume-chip-icon]')).not.toHaveAttribute('class')
    })

    it('has no class attribute when unstyled and there is none', () => {
      const { container } = render(<Chip variant="unstyled">Design</Chip>)
      expect(container.firstChild).not.toHaveAttribute('class')
    })
  })

  describe('inner elements', () => {
    it('draws the icon, the label and the remove button with their classes and hooks', () => {
      render(
        <Chip icon={<i />} onRemove={() => undefined}>
          Design
        </Chip>,
      )
      expect(document.querySelector('[data-plume-chip-icon]')).toHaveClass('icon')
      expect(document.querySelector('[data-plume-chip-label]')).toHaveClass('label')
      expect(document.querySelector('[data-plume-chip-remove]')).toHaveClass('remove')
    })

    it('puts the icon first, then the label and the remove button', () => {
      render(
        <Chip icon={<i />} onRemove={() => undefined}>
          Design
        </Chip>,
      )
      const root = document.querySelector('[data-plume-chip]') as HTMLElement
      expect(Array.from(root.children).map((child) => Object.keys((child as HTMLElement).dataset)[0])).toEqual([
        'plumeChipIcon',
        'plumeChipLabel',
        'plumeChipRemove',
      ])
    })

    it('names the remove button after the label, and gives it a disabled hook', () => {
      render(
        <Chip disabled onRemove={() => undefined}>
          Design
        </Chip>,
      )
      expect(screen.getByRole('button', { name: 'Remove Design' })).toHaveAttribute('data-disabled')
    })
  })
})
