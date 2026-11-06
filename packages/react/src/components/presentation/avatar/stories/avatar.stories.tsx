import type { StoryObj, Meta } from '@storybook/react-vite'
import { LocaleProvider } from '../../../../locale'
import { defaultTheme } from '../../../../theme'
import { Avatar, AvatarGroup, AvatarOverflow } from '..'

const colorSchemes = Object.keys(defaultTheme.colors)

const portrait = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7c3aed"/><stop offset="1" stop-color="#f59e0b"/></linearGradient></defs><rect width="80" height="80" fill="url(#g)"/><circle cx="40" cy="31" r="14" fill="#fff" fill-opacity=".85"/><path d="M12 80c0-17 12-28 28-28s28 11 28 28z" fill="#fff" fill-opacity=".85"/></svg>',
)}`

const people = [
  'Ada Lovelace',
  'Grace Hopper',
  'Margaret Hamilton',
  'Katherine Johnson',
  'Alan Turing',
]

/**
 * A picture of a person or a team, with a fallback for when there is none. It shows the **src** image and, when
 * there is no image or it fails to load, the initials of the **name**, an icon, or whatever you pass as
 * **fallback**. A **status** adds a dot for presence.
 *
 * It is an image for assistive technology, named by the **alt** or the **name** and followed by the status
 * (`Ada Lovelace, Online`). With neither a name nor a status it is decorative and is hidden. Use **alt** when the
 * image says something more than the name, and the `avatar` texts of the `LocaleProvider` to translate the status.
 *
 * `AvatarGroup` stacks several avatars. With **max** it shows that many and a counter with the rest, named by
 * the `avatarGroup.overflow` text of the `LocaleProvider`. The group gives its **size**, **shape**, **colorScheme** and **variant** to the avatars that
 * don't set their own.
 *
 * The Avatar draws its image, its fallback and its status dot, and each carries a `data-loica-avatar-image`,
 * `data-loica-avatar-fallback` or `data-loica-avatar-status-dot` attribute. To style one, target it from the Avatar
 * (`[&>img]:size-full` in Tailwind) or give the **fallback** your own element.
 */
export default {
  title: 'Components/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      importNames: ['Avatar', 'AvatarGroup', 'AvatarOverflow'],
      toc: {
        title: 'On this page',
        disable: false,
      },
    },
    layout: 'centered',
  },
  argTypes: {
    name: {
      control: 'text',
    },
    src: {
      control: 'text',
    },
    alt: {
      control: 'text',
    },
    fallback: {
      control: false,
    },
    status: {
      control: 'radio',
      options: [undefined, 'online', 'busy', 'away', 'offline'],
    },
    className: {
      control: 'text',
    },
    style: {
      control: false,
    },
    colorScheme: {
      control: 'select',
      options: colorSchemes,
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
    },
    shape: {
      control: 'radio',
      options: ['pill', 'rounded'],
    },
    variant: {
      control: 'radio',
      options: ['subtle', 'solid', 'outline', 'unstyled'],
    },
    id: {
      control: false,
    },
    title: {
      control: 'text',
    },
    hidden: {
      control: 'boolean',
    },
    'aria-label': {
      control: 'text',
    },
    'aria-labelledby': {
      control: false,
    },
  },
  args: {
    name: 'Ada Lovelace',
  },
} satisfies Meta<typeof Avatar>

type Story = StoryObj<typeof Avatar>

/**
 * This is the default Avatar: with no image, it shows the initials of the name.
 */
export const Default: Story = {}

/**
 * Use the **variant** prop to pick how the fallback looks: `subtle` tints it, `solid` fills it, `outline` draws
 * its border, and `unstyled` drops the Loica styles so you can style it yourself.
 */
export const Variants: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-wrap items-center justify-center gap-4">
  <Avatar colorScheme="primary" name="Ada Lovelace" variant="subtle" />
  <Avatar colorScheme="primary" name="Ada Lovelace" variant="solid" />
  <Avatar colorScheme="primary" name="Ada Lovelace" variant="outline" />
  <Avatar
    fallback={<span>AL</span>}
    name="Ada Lovelace"
    variant="unstyled"
  />
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {(['subtle', 'solid', 'outline'] as const).map((variant) => (
        <Avatar colorScheme="primary" key={variant} name="Ada Lovelace" variant={variant} />
      ))}
      <Avatar fallback={<span>AL</span>} name="Ada Lovelace" variant="unstyled" />
    </div>
  ),
}

/**
 * Use the **size** prop to change the size of the Avatar and its text.
 */
export const Sizes: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-wrap items-center justify-center gap-4">
  <Avatar name="Ada Lovelace" size="sm" />
  <Avatar name="Ada Lovelace" size="md" />
  <Avatar name="Ada Lovelace" size="lg" />
  <Avatar name="Ada Lovelace" size="sm" src={portrait} />
  <Avatar name="Ada Lovelace" size="md" src={portrait} />
  <Avatar name="Ada Lovelace" size="lg" src={portrait} />
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Avatar key={size} name="Ada Lovelace" size={size} />
      ))}
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Avatar key={`image-${size}`} name="Ada Lovelace" size={size} src={portrait} />
      ))}
    </div>
  ),
}

/**
 * Use the **colorScheme** prop to color the fallback. It takes the colors of the theme, including the ones you
 * add to it.
 */
export const Colors: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-wrap items-center justify-center gap-4">
  <Avatar colorScheme="primary" name="primary" />
  <Avatar colorScheme="success" name="success" />
  <Avatar colorScheme="error" name="error" />
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {colorSchemes.map((colorScheme) => (
        <Avatar
          colorScheme={colorScheme as keyof typeof defaultTheme.colors}
          key={colorScheme}
          name={colorScheme}
        />
      ))}
    </div>
  ),
}

/**
 * With **src** it shows the image. If the image can't be loaded, it goes back to the initials.
 */
export const WithImage: Story = {
  args: { src: portrait },
}

/**
 * What it shows when there is no image: the initials of the name, an icon when there is no name, a **fallback**
 * of your own, and the initials again when the image fails to load.
 */
export const Fallbacks: Story = {
  render: () => (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <Avatar name="Ada Lovelace" />
      <Avatar aria-label="Unknown user" />
      <Avatar fallback="AI" name="Assistant" />
      <Avatar name="Grace Hopper" src="/this-image-does-not-exist.png" />
    </div>
  ),
}

/**
 * Use the **shape** prop to choose between a circle (`pill`) and a rounded square (`rounded`).
 */
export const Shapes: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-wrap items-center justify-center gap-4">
  <Avatar name="Ada Lovelace" shape="pill" />
  <Avatar name="Ada Lovelace" shape="rounded" />
  <Avatar name="Ada Lovelace" shape="pill" src={portrait} />
  <Avatar name="Ada Lovelace" shape="rounded" src={portrait} />
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {(['pill', 'rounded'] as const).map((shape) => (
        <Avatar key={shape} name="Ada Lovelace" shape={shape} />
      ))}
      {(['pill', 'rounded'] as const).map((shape) => (
        <Avatar key={`image-${shape}`} name="Ada Lovelace" shape={shape} src={portrait} />
      ))}
    </div>
  ),
}

/**
 * **status** adds a dot with the presence of the person. It is also read by assistive technology after the name,
 * so the color is not the only way to tell it. Change the text with the `avatar` texts of the `LocaleProvider`.
 */
export const Status: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-wrap items-center justify-center gap-4">
  <Avatar name="Ada Lovelace" status="online" />
  <Avatar name="Ada Lovelace" status="busy" />
  <Avatar name="Ada Lovelace" status="away" />
  <Avatar name="Ada Lovelace" status="offline" />
  <Avatar name="Ada Lovelace" size="lg" src={portrait} status="online" />
  <LocaleProvider messages={{ avatar: { online: 'En línea' } }}>
    <Avatar name="Ada Lovelace" status="online" />
  </LocaleProvider>
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {(['online', 'busy', 'away', 'offline'] as const).map((status) => (
        <Avatar key={status} name="Ada Lovelace" status={status} />
      ))}
      {(['online', 'busy'] as const).map((status) => (
        <Avatar
          key={`image-${status}`}
          name="Ada Lovelace"
          size="lg"
          src={portrait}
          status={status}
        />
      ))}
      <LocaleProvider messages={{ avatar: { online: 'En línea' } }}>
        <Avatar name="Ada Lovelace" status="online" />
      </LocaleProvider>
    </div>
  ),
}

/**
 * `AvatarGroup` stacks avatars. It gives them its **size**, **shape**, **colorScheme** and **variant**, and with
 * **max** it shows that many and a counter with the rest.
 */
export const Group: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-col items-center gap-6">
  <AvatarGroup aria-label="Team members">
    <Avatar name="Ada Lovelace" />
    <Avatar name="Grace Hopper" />
    <Avatar name="Margaret Hamilton" />
  </AvatarGroup>
  <AvatarGroup aria-label="Team members, first two" max={2} size="lg">
    <Avatar name="Ada Lovelace" />
    <Avatar name="Grace Hopper" />
    <Avatar name="Margaret Hamilton" />
    <Avatar name="Katherine Johnson" />
  </AvatarGroup>
  <AvatarGroup
    aria-label="Reviewers"
    colorScheme="primary"
    max={2}
    shape="rounded"
    variant="solid"
  >
    <Avatar name="Ada Lovelace" />
    <Avatar name="Grace Hopper" />
    <Avatar name="Margaret Hamilton" />
  </AvatarGroup>
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-col items-center gap-6">
      <AvatarGroup aria-label="Team members">
        {people.map((name) => (
          <Avatar key={name} name={name} />
        ))}
      </AvatarGroup>
      <AvatarGroup aria-label="Team members, first three" max={3} size="lg">
        {people.map((name) => (
          <Avatar key={name} name={name} />
        ))}
      </AvatarGroup>
      <AvatarGroup
        aria-label="Reviewers"
        colorScheme="primary"
        max={2}
        shape="rounded"
        variant="solid"
      >
        {people.map((name) => (
          <Avatar key={name} name={name} />
        ))}
      </AvatarGroup>
      <LocaleProvider messages={{ avatarGroup: { overflow: (hidden) => `${hidden} más` } }}>
        <AvatarGroup aria-label="Con imágenes" max={3}>
          <Avatar name="Ada Lovelace" src={portrait} />
          <Avatar name="Grace Hopper" />
          <Avatar name="Margaret Hamilton" src={portrait} />
          <Avatar name="Katherine Johnson" />
          <Avatar name="Alan Turing" />
        </AvatarGroup>
      </LocaleProvider>
    </div>
  ),
}

/**
 * `AvatarOverflow` is the counter that `AvatarGroup` renders for **max**, and it can be placed by hand. Its
 * `children` replace the `+3`.
 */
export const Overflow: Story = {
  render: () => (
    <AvatarGroup aria-label="Team members">
      <Avatar name="Ada Lovelace" />
      <Avatar name="Grace Hopper" />
      <AvatarOverflow count={3} />
    </AvatarGroup>
  ),
}

/**
 * Some examples of Avatar with Tailwind classes. With `variant="unstyled"` the Avatar has no Loica styles, so it takes the classes you give it, and its image, fallback and status dot are styled from it with their `data-loica-avatar-*` attribute.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Avatar
  className="relative size-12 rounded-full ring-2 ring-blue-700 [&>[data-loica-avatar-fallback]]:flex [&>[data-loica-avatar-fallback]]:size-full [&>[data-loica-avatar-fallback]]:items-center [&>[data-loica-avatar-fallback]]:justify-center [&>[data-loica-avatar-fallback]]:rounded-full [&>[data-loica-avatar-fallback]]:bg-blue-700 [&>[data-loica-avatar-fallback]]:font-semibold [&>[data-loica-avatar-fallback]]:text-white [&>[data-loica-avatar-status-dot]]:absolute [&>[data-loica-avatar-status-dot]]:bottom-0 [&>[data-loica-avatar-status-dot]]:right-0 [&>[data-loica-avatar-status-dot]]:size-3 [&>[data-loica-avatar-status-dot]]:rounded-full [&>[data-loica-avatar-status-dot]]:bg-green-500 [&>[data-loica-avatar-status-dot]]:ring-2 [&>[data-loica-avatar-status-dot]]:ring-white"
  name="Ada Lovelace"
  status="online"
  variant="unstyled"
/>`,
      },
    },
  },
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar
        className="relative size-12 rounded-full ring-2 ring-blue-700 [&>[data-loica-avatar-fallback]]:flex [&>[data-loica-avatar-fallback]]:size-full [&>[data-loica-avatar-fallback]]:items-center [&>[data-loica-avatar-fallback]]:justify-center [&>[data-loica-avatar-fallback]]:rounded-full [&>[data-loica-avatar-fallback]]:bg-blue-700 [&>[data-loica-avatar-fallback]]:font-semibold [&>[data-loica-avatar-fallback]]:text-white [&>[data-loica-avatar-status-dot]]:absolute [&>[data-loica-avatar-status-dot]]:bottom-0 [&>[data-loica-avatar-status-dot]]:right-0 [&>[data-loica-avatar-status-dot]]:size-3 [&>[data-loica-avatar-status-dot]]:rounded-full [&>[data-loica-avatar-status-dot]]:bg-green-500 [&>[data-loica-avatar-status-dot]]:ring-2 [&>[data-loica-avatar-status-dot]]:ring-white"
        name="Ada Lovelace"
        status="online"
        variant="unstyled"
      />
      <Avatar
        className="size-12 rounded-full ring-2 ring-blue-700 [&>img]:size-full [&>img]:rounded-full [&>img]:object-cover"
        name="Ada Lovelace"
        src={portrait}
        variant="unstyled"
      />
    </div>
  ),
}

/**
 * Some examples of Avatar with Bootstrap classes. Bootstrap classes can't reach the inner elements, so the fallback is
 * your own element and the image is clipped by the Avatar.
 */
export const Bootstrap: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Avatar
  className="rounded-circle border border-2 border-primary overflow-hidden"
  fallback={<span className="d-flex align-items-center justify-content-center bg-primary text-white fw-semibold w-100 h-100">AL</span>}
  name="Ada Lovelace"
  style={{ height: '3rem', width: '3rem' }}
  variant="unstyled"
/>`,
      },
    },
  },
  render: () => (
    <div className="d-flex align-items-center gap-3">
      <Avatar
        className="rounded-circle border border-2 border-primary overflow-hidden"
        fallback={
          <span className="d-flex align-items-center justify-content-center bg-primary text-white fw-semibold w-100 h-100">
            AL
          </span>
        }
        name="Ada Lovelace"
        style={{ height: '3rem', width: '3rem' }}
        variant="unstyled"
      />
    </div>
  ),
}
