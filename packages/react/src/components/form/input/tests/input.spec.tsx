import { fireEvent, render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { createRef } from 'react'
import { Field } from '../../field'
import { Input } from '..'
import { LocaleProvider } from '../../../../locale'

describe('Input component', () => {
  it('renders a text input by default', () => {
    render(<Input placeholder="Name" />)
    const input = screen.getByPlaceholderText('Name')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('type', 'text')
  })

  it('forwards the type', () => {
    render(<Input placeholder="Mail" type="email" />)
    expect(screen.getByPlaceholderText('Mail')).toHaveAttribute('type', 'email')
  })

  it('supports disabled and readOnly', () => {
    render(
      <>
        <Input disabled placeholder="off" />
        <Input placeholder="ro" readOnly />
      </>,
    )
    expect(screen.getByPlaceholderText('off')).toBeDisabled()
    expect(screen.getByPlaceholderText('ro')).toHaveAttribute('readonly')
  })

  it('applies size, shape and variant classes', () => {
    render(<Input placeholder="x" shape="pill" size="lg" variant="filled" />)
    const input = screen.getByPlaceholderText('x')
    expect(input).toHaveClass('lg')
    expect(input).toHaveClass('pill')
    expect(input).toHaveClass('filled')
  })

  it('does not apply Loica classes when unstyled', () => {
    render(<Input className="form-control" placeholder="x" variant="unstyled" />)
    const input = screen.getByPlaceholderText('x')
    expect(input).toHaveClass('form-control')
    expect(input).not.toHaveClass('outline')
    expect(input).not.toHaveClass('md')
  })

  it('maps the color scheme to palette CSS variables', () => {
    render(<Input colorScheme="success" placeholder="x" />)
    const { style } = screen.getByPlaceholderText('x')
    expect(style.getPropertyValue('--input-color')).toBe('var(--loica-color-success-text)')
  })

  it('switches to the error colors when aria-invalid is set', () => {
    render(<Input aria-invalid colorScheme="success" placeholder="x" />)
    const input = screen.getByPlaceholderText('x')
    expect(input).toHaveClass('invalid')
    expect(input.style.getPropertyValue('--input-color')).toBe('var(--loica-color-error-text)')
  })

  it('lets the style prop override the color variables', () => {
    render(<Input placeholder="x" style={{ '--input-color': 'hotpink' } as React.CSSProperties} />)
    expect(screen.getByPlaceholderText('x').style.getPropertyValue('--input-color')).toBe('hotpink')
  })

  it('calls onChange when typing', () => {
    const onChange = vi.fn()
    render(<Input onChange={onChange} placeholder="x" />)

    fireEvent.change(screen.getByPlaceholderText('x'), { target: { value: 'abc' } })

    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('supports an uncontrolled defaultValue', () => {
    render(<Input defaultValue="hello" placeholder="x" />)
    expect(screen.getByPlaceholderText('x')).toHaveValue('hello')
  })

  it('passes required to the input', () => {
    render(<Input placeholder="x" required />)
    expect(screen.getByPlaceholderText('x')).toBeRequired()
  })

  it('forwards the ref to the input element', () => {
    const ref = { current: null as HTMLInputElement | null }
    render(<Input placeholder="x" ref={ref} />)
    expect(ref.current).toBe(screen.getByPlaceholderText('x'))
  })

  describe('addons and elements', () => {
    it('renders addons and elements around the input', () => {
      render(
        <Input
          addonAfter={<span>after</span>}
          addonBefore={<span>before</span>}
          elementAfter={<span>el-after</span>}
          elementBefore={<span>el-before</span>}
          placeholder="x"
        />,
      )
      expect(screen.getByText('before')).toBeInTheDocument()
      expect(screen.getByText('after')).toBeInTheDocument()
      expect(screen.getByText('el-before')).toBeInTheDocument()
      expect(screen.getByText('el-after')).toBeInTheDocument()
    })

    it('puts the color variables on the group wrapper', () => {
      const { container } = render(
        <Input addonBefore={<span>$</span>} colorScheme="info" placeholder="x" />,
      )
      const group = container.firstChild as HTMLElement
      expect(group.style.getPropertyValue('--input-color')).toBe('var(--loica-color-info-text)')
    })

    it('does not wrap the input when there is nothing to group', () => {
      const { container } = render(<Input placeholder="x" />)
      expect(container.firstChild).toBe(screen.getByPlaceholderText('x'))
    })

    it('keeps the group markup unstyled when variant is unstyled', () => {
      const { container } = render(
        <Input addonAfter={<span>after</span>} placeholder="x" variant="unstyled" />,
      )
      const group = container.firstChild as HTMLElement
      expect(group).not.toHaveClass('inputGroup')
      expect(screen.getByText('after').parentElement).not.toHaveClass('addOn')
    })
  })

  describe('mask', () => {
    it('formats typed characters with the mask', () => {
      render(<Input mask="##/##/####" placeholder="date" />)
      const input = screen.getByPlaceholderText('date')

      fireEvent.change(input, { target: { value: '15082024' } })

      expect(input).toHaveValue('15/08/2024')
    })

    it('supports phone and card masks', () => {
      render(
        <>
          <Input mask="(###) ###-####" placeholder="phone" />
          <Input mask="#### #### #### ####" placeholder="card" />
        </>,
      )

      fireEvent.change(screen.getByPlaceholderText('phone'), { target: { value: '5551234567' } })
      fireEvent.change(screen.getByPlaceholderText('card'), {
        target: { value: '4111111111111111' },
      })

      expect(screen.getByPlaceholderText('phone')).toHaveValue('(555) 123-4567')
      expect(screen.getByPlaceholderText('card')).toHaveValue('4111 1111 1111 1111')
    })

    it('applies the mask to a defaultValue', () => {
      render(<Input defaultValue="0930" mask="##:##" placeholder="time" />)
      expect(screen.getByPlaceholderText('time')).toHaveValue('09:30')
    })

    it('masks a controlled value and still notifies onChange', () => {
      const received: string[] = []
      render(
        <Input
          mask="##:##"
          onChange={(event) => {
            received.push(event.target.value)
          }}
          placeholder="time"
          value=""
        />,
      )

      fireEvent.change(screen.getByPlaceholderText('time'), { target: { value: '0930' } })

      expect(received).toEqual(['09:30'])
    })

    it('masks inside an input group as well', () => {
      render(<Input addonBefore={<span>+</span>} mask="##-##" placeholder="grouped" />)
      const input = screen.getByPlaceholderText('grouped')

      fireEvent.change(input, { target: { value: '1234' } })

      expect(input).toHaveValue('12-34')
    })
  })
  describe('revealable password', () => {
    const toggle = (): HTMLElement => screen.getByRole('button', { name: 'Show password' })

    it('has no button by default', () => {
      render(<Input placeholder="Secret" type="password" />)
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })

    it('adds a toggle button to a revealable password', () => {
      render(<Input placeholder="Secret" revealable type="password" />)
      expect(toggle()).toHaveAttribute('aria-pressed', 'false')
      expect(screen.getByPlaceholderText('Secret')).toHaveAttribute('type', 'password')
    })

    it('shows and hides the password', async () => {
      render(<Input placeholder="Secret" revealable type="password" />)
      await userEvent.click(toggle())
      expect(screen.getByPlaceholderText('Secret')).toHaveAttribute('type', 'text')
      expect(toggle()).toHaveAttribute('aria-pressed', 'true')
      await userEvent.click(toggle())
      expect(screen.getByPlaceholderText('Secret')).toHaveAttribute('type', 'password')
    })

    it('keeps the text and the focus order when it toggles', async () => {
      render(<Input defaultValue="abc" placeholder="Secret" revealable type="password" />)
      await userEvent.click(toggle())
      expect(screen.getByPlaceholderText('Secret')).toHaveValue('abc')
    })

    it('takes the label of the button from the LocaleProvider', () => {
      render(
        <LocaleProvider messages={{ input: { reveal: 'Mostrar' } }}>
          <Input placeholder="Secret" revealable type="password" />
        </LocaleProvider>,
      )
      expect(screen.getByRole('button', { name: 'Mostrar' })).toBeInTheDocument()
    })

    it('ignores revealable on any other type', () => {
      render(<Input placeholder="Mail" revealable type="email" />)
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })

    it('disables the button with the input', () => {
      render(<Input disabled placeholder="Secret" revealable type="password" />)
      expect(toggle()).toBeDisabled()
    })

    it('puts an elementAfter before the button', () => {
      render(
        <Input elementAfter={<span>after</span>} placeholder="Secret" revealable type="password" />,
      )
      const control = screen.getByPlaceholderText('Secret').parentElement as HTMLElement
      const children = Array.from(control.children)
      expect(children.indexOf(screen.getByText('after').parentElement as Element)).toBeLessThan(
        children.indexOf(toggle()),
      )
    })

    it('keeps the classes of the button in every variant', () => {
      render(<Input placeholder="Secret" revealable type="password" />)
      expect(toggle()).toHaveClass('reveal')
    })

    it('drops the Loica classes of the button when it is unstyled', () => {
      render(<Input placeholder="Secret" revealable type="password" variant="unstyled" />)
      expect(toggle()).not.toHaveAttribute('class')
      expect(toggle().closest('[data-loica-input-group]')).not.toHaveAttribute('class')
    })

    it('forwards autoComplete', () => {
      render(<Input autoComplete="current-password" placeholder="Secret" type="password" />)
      expect(screen.getByPlaceholderText('Secret')).toHaveAttribute(
        'autocomplete',
        'current-password',
      )
    })
  })

  describe('group', () => {
    it('draws the group, the control, the addons and the elements in order', () => {
      const { container } = render(
        <Input
          addonAfter={<span>after</span>}
          addonBefore={<span>before</span>}
          elementAfter={<span>el-after</span>}
          elementBefore={<span>el-before</span>}
          placeholder="x"
        />,
      )
      const group = container.firstElementChild as HTMLElement
      expect(group).toHaveAttribute('data-loica-input-group')
      expect(group.children).toHaveLength(3)
      expect(group.children[0]).toHaveAttribute('data-loica-input-addon')
      expect(group.children[0]).toHaveAttribute('data-position', 'before')
      expect(group.children[1]).toHaveAttribute('data-loica-input-control')
      expect(group.children[2]).toHaveAttribute('data-loica-input-addon')
      expect(group.children[2]).toHaveAttribute('data-position', 'after')
      const control = group.children[1]
      expect(control.children).toHaveLength(3)
      expect(control.children[0]).toHaveAttribute('data-loica-input-element')
      expect(control.children[0]).toHaveAttribute('data-position', 'before')
      expect(control.children[1]).toBe(screen.getByPlaceholderText('x'))
      expect(control.children[1]).toHaveAttribute('data-loica-input-field')
      expect(control.children[2]).toHaveAttribute('data-loica-input-element')
      expect(control.children[2]).toHaveAttribute('data-position', 'after')
    })

    it('puts className and style on the group, and the ref on the input', () => {
      const ref = createRef<HTMLInputElement>()
      const { container } = render(
        <Input
          addonBefore="$"
          className="mine"
          placeholder="x"
          ref={ref}
          style={{ width: 120 }}
        />,
      )
      expect(container.firstElementChild).toHaveClass('inputGroup', 'mine')
      expect(container.firstElementChild).toHaveStyle({ width: '120px' })
      expect(screen.getByPlaceholderText('x')).not.toHaveClass('mine')
      expect(ref.current).toBe(screen.getByPlaceholderText('x'))
    })

    it('puts className and style on the input when there is no group', () => {
      render(<Input className="mine" placeholder="x" style={{ width: 120 }} />)
      expect(screen.getByPlaceholderText('x')).toHaveClass('mine')
      expect(screen.getByPlaceholderText('x')).toHaveStyle({ width: '120px' })
    })

    it('passes every native attribute to the input', () => {
      const onBlur = vi.fn()
      render(
        <Input
          addonBefore="$"
          aria-describedby="hint"
          data-testid="field"
          id="amount"
          name="amount"
          onBlur={onBlur}
          placeholder="x"
          required
          title="Amount"
        />,
      )
      const input = screen.getByTestId('field')
      expect(input).toBe(screen.getByPlaceholderText('x'))
      expect(input).toHaveAttribute('id', 'amount')
      expect(input).toHaveAttribute('name', 'amount')
      expect(input).toHaveAttribute('title', 'Amount')
      expect(input).toHaveAttribute('aria-describedby', 'hint')
      expect(input).toBeRequired()
      fireEvent.blur(input)
      expect(onBlur).toHaveBeenCalledTimes(1)
    })

    it('marks the group and the input when disabled and invalid', () => {
      const { container } = render(
        <Input addonBefore="$" aria-invalid disabled placeholder="x" revealable type="password" />,
      )
      const input = screen.getByPlaceholderText('x')
      expect(input).toBeDisabled()
      expect(input).toHaveClass('invalid', 'disabled')
      expect(input).toHaveAttribute('data-invalid')
      expect(input).toHaveAttribute('data-disabled')
      expect(container.firstElementChild).toHaveAttribute('data-invalid')
      expect(container.firstElementChild).toHaveAttribute('data-disabled')
      expect(screen.getByRole('button')).toBeDisabled()
      expect(screen.getByRole('button')).toHaveAttribute('data-disabled')
    })

    it('drops the Loica classes of every inner element when it is unstyled', () => {
      const { container } = render(
        <Input
          addonAfter="addon"
          className="g"
          elementBefore="element"
          placeholder="x"
          revealable
          type="password"
          variant="unstyled"
        />,
      )
      expect(container.firstElementChild).toHaveAttribute('class', 'g')
      expect(screen.getByText('addon')).not.toHaveAttribute('class')
      expect(screen.getByText('element')).not.toHaveAttribute('class')
      expect(screen.getByPlaceholderText('x')).not.toHaveAttribute('class')
      expect(screen.getByRole('button')).not.toHaveAttribute('class')
      expect(screen.getByPlaceholderText('x').parentElement).not.toHaveAttribute('class')
    })

    it('calls onChange once and masks inside a group', async () => {
      const onChange = vi.fn()
      render(<Input addonBefore="$" mask="##-##" onChange={onChange} placeholder="x" />)
      await userEvent.type(screen.getByPlaceholderText('x'), '1234')
      expect(screen.getByPlaceholderText('x')).toHaveValue('12-34')
      expect(onChange).toHaveBeenCalledTimes(4)
    })
  })

  describe('with a Field', () => {
    it('is labelled and described by it', () => {
      render(
        <Field errorText="Required" helperText="Your mail" label="Mail">
          <Input addonBefore="@" type="email" />
        </Field>,
      )
      const input = screen.getByLabelText('Mail')
      expect(input.tagName).toBe('INPUT')
      expect(input).toHaveAttribute('aria-invalid', 'true')
      expect(input).toHaveAccessibleDescription('Required Your mail')
    })

    it('takes the disabled and required state of it', () => {
      render(
        <Field disabled label="Mail" required>
          <Input />
        </Field>,
      )
      const input = screen.getByLabelText(/Mail/)
      expect(input).toBeDisabled()
      expect(input).toBeRequired()
    })
  })
})
