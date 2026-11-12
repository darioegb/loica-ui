import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { LocaleProvider } from '../../../../locale'
import { Button } from '../../../interaction/button'
import { ConfirmProvider, useConfirm, type ConfirmOptions } from '..'

/**
 * A question the user answers with yes or no, asked from code: `useConfirm()` returns a function that opens the
 * dialog and resolves to `true` or `false`, so the check reads in a line, before the action.
 *
 * ```tsx
 * const confirm = useConfirm()
 * if (await confirm({ title: 'Delete project?', colorScheme: 'error' })) remove(project)
 * ```
 *
 * Mount a **ConfirmProvider** once, near the root, as the `ToastProvider`. It renders the dialog, a `Modal` with
 * `role="alertdialog"`, and shows one at a time: a call made while another is open waits for its turn. The focus
 * starts on the cancel button, so Enter never accepts by accident, <kbd>Esc</kbd> and a click outside refuse, and
 * the focus goes back to what had it. The texts of the buttons come from the `confirm` key of the `LocaleProvider`.
 *
 * A confirmation that needs more than a question, such as typing the name of what is deleted, is a `Modal` of its
 * own. The dialog takes the styles of the `Modal` and the `Button`, so with the CSS by component, import
 * `modal.css` and `button.css`.
 */
export default {
  title: 'Components/Confirm',
  component: ConfirmProvider,
  tags: ['autodocs'],
  parameters: {
    docs: {
      toc: {
        title: 'On this page',
        disable: false,
      },
    },
    layout: 'padded',
  },
  argTypes: {
    children: {
      control: false,
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
    },
  },
  args: {
    size: 'sm',
  },
} satisfies Meta<typeof ConfirmProvider>

type Story = StoryObj<typeof ConfirmProvider>

function Ask({
  label,
  options,
}: Readonly<{ label: string; options: ConfirmOptions }>): React.ReactNode {
  const confirm = useConfirm()
  const [answer, setAnswer] = useState<boolean | undefined>(undefined)

  return (
    <div className="flex items-center gap-4">
      <Button
        onClick={() => {
          void confirm(options).then(setAnswer)
        }}
      >
        {label}
      </Button>
      <output className="text-sm text-muted">
        {answer === undefined ? 'Not asked yet' : answer ? 'Confirmed' : 'Cancelled'}
      </output>
    </div>
  )
}

/**
 * This is the default confirmation: a title, and the two buttons with their texts. It resolves to `true` when the
 * user accepts.
 */
export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: `const confirm = useConfirm()

<Button onClick={async () => {
  if (await confirm({ title: 'Publish the page?' })) publish()
}}>
  Publish
</Button>`,
      },
    },
  },
  render: (args) => (
    <ConfirmProvider {...args}>
      <Ask label="Publish" options={{ title: 'Publish the page?' }} />
    </ConfirmProvider>
  ),
}

/**
 * For something that can't be undone, say what it costs in the **description** and give the accepting button the
 * action as its text (**confirmLabel**) and the `error` **colorScheme**. **cancelLabel** changes the other button.
 */
export const Destructive: Story = {
  parameters: {
    docs: {
      source: {
        code: `const confirm = useConfirm()

<Button colorScheme="error" onClick={async () => {
  const confirmed = await confirm({
    colorScheme: 'error',
    confirmLabel: 'Delete project',
    description: 'The project and its history will be removed. This cannot be undone.',
    title: 'Delete "Website redesign"?',
  })
  if (confirmed) remove(project)
}}>
  Delete
</Button>`,
      },
    },
  },
  render: (args) => (
    <ConfirmProvider {...args}>
      <Ask
        label="Delete"
        options={{
          colorScheme: 'error',
          confirmLabel: 'Delete project',
          description: 'The project and its history will be removed. This cannot be undone.',
          title: 'Delete "Website redesign"?',
        }}
      />
    </ConfirmProvider>
  ),
}

/**
 * The texts of the buttons that a call doesn't set come from the `confirm` key of the `LocaleProvider`, with
 * `cancel` and `confirm`.
 */
export const Texts: Story = {
  parameters: {
    docs: {
      source: {
        code: `<LocaleProvider messages={{ confirm: { cancel: 'Cancelar', confirm: 'Aceptar' } }}>
  <ConfirmProvider>
    <App />
  </ConfirmProvider>
</LocaleProvider>`,
      },
    },
  },
  render: (args) => (
    <LocaleProvider messages={{ confirm: { cancel: 'Cancelar', confirm: 'Aceptar' } }}>
      <ConfirmProvider {...args}>
        <Ask label="Publicar" options={{ title: '¿Publicar la página?' }} />
      </ConfirmProvider>
    </LocaleProvider>
  ),
}
