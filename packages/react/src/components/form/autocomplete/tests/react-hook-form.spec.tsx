import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { Controller, useForm } from 'react-hook-form'
import { Field } from '../../field'
import { Autocomplete } from '..'

interface Values {
  city: string
}

const cities = [{ label: 'Madrid' }, { label: 'Valencia' }]

function CityForm({ onSubmit }: { onSubmit: (values: Values) => void }): React.ReactNode {
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<Values>({ defaultValues: { city: '' } })

  return (
    <form
      noValidate
      onSubmit={(event) => {
        void handleSubmit(onSubmit)(event)
      }}
    >
      <Controller
        control={control}
        name="city"
        render={({ field }) => (
          <Field errorText={errors.city?.message} label="City" required>
            <Autocomplete
              name={field.name}
              onBlur={field.onBlur}
              onValueChange={field.onChange}
              options={cities}
              value={field.value}
            />
          </Field>
        )}
        rules={{ required: 'Tell us the city' }}
      />
      <button type="submit">Send</button>
      <button onClick={() => reset({ city: 'Valencia' })} type="button">
        Reset
      </button>
    </form>
  )
}

describe('Autocomplete with react-hook-form', () => {
  it('sends the text the user typed, even when it is not in the list', async () => {
    const onSubmit = vi.fn()
    render(<CityForm onSubmit={onSubmit} />)
    await userEvent.type(screen.getByRole('combobox', { name: /City/ }), 'Bilbao')
    await userEvent.click(screen.getByRole('button', { name: 'Send' }))
    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ city: 'Bilbao' }, expect.anything()))
  })

  it('sends the label of the option the user chose', async () => {
    const onSubmit = vi.fn()
    render(<CityForm onSubmit={onSubmit} />)
    await userEvent.type(screen.getByRole('combobox', { name: /City/ }), 'val')
    await userEvent.click(screen.getByRole('option', { name: 'Valencia' }))
    await userEvent.click(screen.getByRole('button', { name: 'Send' }))
    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ city: 'Valencia' }, expect.anything()))
  })

  it('shows the error of the rule and marks the field as invalid', async () => {
    render(<CityForm onSubmit={vi.fn()} />)
    await userEvent.click(screen.getByRole('button', { name: 'Send' }))
    expect(await screen.findByText('Tell us the city')).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: /City/ })).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByRole('combobox', { name: /City/ })).toBeRequired()
  })

  it('shows the value that the form sets', async () => {
    render(<CityForm onSubmit={vi.fn()} />)
    await userEvent.click(screen.getByRole('button', { name: 'Reset' }))
    expect(screen.getByRole('combobox', { name: /City/ })).toHaveValue('Valencia')
  })
})
