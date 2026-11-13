import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { useRef, useState } from 'react'
import { LocaleProvider } from '../../../../locale'
import { ConfirmProvider, useConfirm, type ConfirmOptions } from '..'

function Ask({ options = { title: 'Delete project?' } }: Readonly<{ options?: ConfirmOptions }>): React.ReactNode {
  const confirm = useConfirm()
  const [answer, setAnswer] = useState('none')
  return (
    <>
      <button onClick={() => void confirm(options).then((confirmed) => setAnswer(String(confirmed)))} type="button">
        Ask
      </button>
      <output>{answer}</output>
    </>
  )
}

const setup = (ui: React.ReactNode) => render(<ConfirmProvider>{ui}</ConfirmProvider>)

describe('useConfirm', () => {
  it('throws outside of a ConfirmProvider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    expect(() => render(<Ask />)).toThrow('useConfirm must be used within a <ConfirmProvider>')
    spy.mockRestore()
  })

  it('returns the same function on every render', () => {
    const seen: unknown[] = []
    function Spy(): React.ReactNode {
      seen.push(useConfirm())
      return null
    }
    const { rerender } = render(
      <ConfirmProvider>
        <Spy />
      </ConfirmProvider>,
    )
    rerender(
      <ConfirmProvider>
        <Spy />
      </ConfirmProvider>,
    )
    expect(new Set(seen).size).toBe(1)
  })
})

describe('ConfirmProvider', () => {
  it('shows nothing until confirm is called', () => {
    setup(<Ask />)
    expect(screen.queryByRole('alertdialog')).toBeNull()
  })

  it('opens an alertdialog named by the title and described by the description', async () => {
    setup(<Ask options={{ description: 'This cannot be undone.', title: 'Delete project?' }} />)
    await userEvent.click(screen.getByText('Ask'))
    const dialog = screen.getByRole('alertdialog', { name: 'Delete project?' })
    expect(dialog).toHaveAccessibleDescription('This cannot be undone.')
  })

  it('has no description when it gets none', async () => {
    setup(<Ask />)
    await userEvent.click(screen.getByText('Ask'))
    expect(screen.getByRole('alertdialog')).not.toHaveAttribute('aria-describedby')
  })

  it('starts with the focus on Cancel', async () => {
    setup(<Ask />)
    await userEvent.click(screen.getByText('Ask'))
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus()
  })

  it('resolves true when the user accepts, and closes', async () => {
    setup(<Ask />)
    await userEvent.click(screen.getByText('Ask'))
    await userEvent.click(screen.getByRole('button', { name: 'Confirm' }))
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('true'))
    expect(screen.queryByRole('alertdialog')).toBeNull()
  })

  it('resolves false when the user cancels', async () => {
    setup(<Ask />)
    await userEvent.click(screen.getByText('Ask'))
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('false'))
    expect(screen.queryByRole('alertdialog')).toBeNull()
  })

  it('resolves false on Escape', async () => {
    setup(<Ask />)
    await userEvent.click(screen.getByText('Ask'))
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('false'))
    expect(screen.queryByRole('alertdialog')).toBeNull()
  })

  it('resolves false on a click outside the dialog', async () => {
    setup(<Ask />)
    await userEvent.click(screen.getByText('Ask'))
    await userEvent.click(document.body)
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('false'))
  })

  it('gives the focus back to what had it', async () => {
    setup(<Ask />)
    const ask = screen.getByText('Ask')
    await userEvent.click(ask)
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    await waitFor(() => expect(ask).toHaveFocus())
  })

  it('uses the texts of the LocaleProvider, and the ones of the call win', async () => {
    render(
      <LocaleProvider messages={{ confirm: { cancel: 'Cancelar', confirm: 'Aceptar' } }}>
        <ConfirmProvider>
          <Ask options={{ confirmLabel: 'Eliminar', title: '¿Eliminar?' }} />
        </ConfirmProvider>
      </LocaleProvider>,
    )
    await userEvent.click(screen.getByText('Ask'))
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Eliminar' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Aceptar' })).toBeNull()
  })

  it('takes a cancelLabel and a colorScheme for the accepting button', async () => {
    setup(<Ask options={{ cancelLabel: 'Keep it', colorScheme: 'error', confirmLabel: 'Delete', title: 'Sure?' }} />)
    await userEvent.click(screen.getByText('Ask'))
    expect(screen.getByRole('button', { name: 'Keep it' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Delete' })).toHaveStyle('--button-color: var(--loica-color-error-text)')
  })

  it('shows the calls one after another', async () => {
    const answers: boolean[] = []
    function Two(): React.ReactNode {
      const confirm = useConfirm()
      return (
        <button
          onClick={() => {
            void confirm({ title: 'First' }).then((value) => answers.push(value))
            void confirm({ title: 'Second' }).then((value) => answers.push(value))
          }}
          type="button"
        >
          Ask
        </button>
      )
    }
    setup(<Two />)
    await userEvent.click(screen.getByText('Ask'))
    expect(screen.getByRole('alertdialog', { name: 'First' })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Confirm' }))
    expect(await screen.findByRole('alertdialog', { name: 'Second' })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    await waitFor(() => expect(answers).toEqual([true, false]))
  })

  it('resolves false what is pending when the provider unmounts', async () => {
    let result: boolean | undefined
    function Start(): React.ReactNode {
      const confirm = useConfirm()
      const started = useRef(false)
      if (!started.current) {
        started.current = true
        void confirm({ title: 'Never answered' }).then((value) => {
          result = value
        })
      }
      return null
    }
    const { unmount } = setup(<Start />)
    await waitFor(() => expect(screen.getByRole('alertdialog')).toBeInTheDocument())
    unmount()
    await waitFor(() => expect(result).toBe(false))
  })
})
