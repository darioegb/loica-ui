import { fireEvent, render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { Avatar, AvatarGroup, AvatarOverflow } from '..'
import { getInitials } from '../avatar-initials'
import { LocaleProvider } from '../../../../locale/locale-provider'

describe('getInitials', () => {
  it.each([
    ['Ada Lovelace', 'AL'],
    ['grace', 'G'],
    ['  Margaret   Heafield  Hamilton ', 'MH'],
    ['éric dupont', 'ÉD'],
    ['', ''],
    [undefined, ''],
  ])('turns %j into %j', (name, initials) => {
    expect(getInitials(name, 'en')).toBe(initials)
  })

  it('capitalizes with the rules of the locale', () => {
    expect(getInitials('ilker ince', 'en')).toBe('II')
    expect(getInitials('ilker ince', 'tr')).toBe('İİ')
  })
})

describe('Avatar component', () => {
  it('shows the initials of the name when there is no image', () => {
    render(<Avatar name="Ada Lovelace" />)
    expect(screen.getByText('AL')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Ada Lovelace' })).toBeInTheDocument()
  })

  it('capitalizes the initials with the locale of the LocaleProvider', () => {
    render(
      <LocaleProvider locale="tr">
        <Avatar name="ilker ince" />
      </LocaleProvider>,
    )
    expect(screen.getByText('İİ')).toBeInTheDocument()
  })

  it('shows an icon when it has neither an image nor a name', () => {
    const { container } = render(<Avatar />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('is hidden from assistive technology when it has no name', () => {
    const { container } = render(<Avatar />)
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')
    expect(screen.queryByRole('img')).toBeNull()
  })

  it('shows a custom fallback', () => {
    render(<Avatar fallback="?" name="Ada" />)
    expect(screen.getByText('?')).toBeInTheDocument()
    expect(screen.queryByText('A')).toBeNull()
  })

  it('shows the image and names the avatar with the name or the alt', () => {
    const { container, rerender } = render(<Avatar name="Ada" src="/ada.png" />)
    expect(container.querySelector('img')).toHaveAttribute('src', '/ada.png')
    expect(screen.getByRole('img', { name: 'Ada' })).toBeInTheDocument()
    rerender(<Avatar alt="Photo of Ada" name="Ada" src="/ada.png" />)
    expect(screen.getByRole('img', { name: 'Photo of Ada' })).toBeInTheDocument()
  })

  it('falls back to the initials when the image fails and tries again with a new src', () => {
    const { container, rerender } = render(<Avatar name="Ada Lovelace" src="/broken.png" />)
    fireEvent.error(container.querySelector('img') as HTMLImageElement)
    expect(container.querySelector('img')).toBeNull()
    expect(screen.getByText('AL')).toBeInTheDocument()
    rerender(<Avatar name="Ada Lovelace" src="/ada.png" />)
    expect(container.querySelector('img')).toHaveAttribute('src', '/ada.png')
  })

  it('uses the label the user gives it', () => {
    render(<Avatar aria-label="Profile of Ada" name="Ada" />)
    expect(screen.getByRole('img', { name: 'Profile of Ada' })).toBeInTheDocument()
  })

  it('shows a status and includes it in the name', () => {
    const { container } = render(<Avatar name="Ada" status="online" />)
    expect(screen.getByRole('img', { name: 'Ada, Online' })).toBeInTheDocument()
    expect(container.querySelector('[data-loica-avatar-status-dot]')).toBeInTheDocument()
    expect(container.firstChild).toHaveAttribute('data-status', 'online')
  })

  it.each([
    ['away', 'Away'],
    ['busy', 'Busy'],
    ['offline', 'Offline'],
    ['online', 'Online'],
  ] as const)('names the %s status', (status, text) => {
    render(<Avatar name="Ada" status={status} />)
    expect(screen.getByRole('img', { name: `Ada, ${text}` })).toBeInTheDocument()
  })

  it('takes another text for the status', () => {
    render(
      <LocaleProvider messages={{ avatar: { busy: 'Ocupada' } }}>
        <Avatar name="Ada" status="busy" />
      </LocaleProvider>,
    )
    expect(screen.getByRole('img', { name: 'Ada, Ocupada' })).toBeInTheDocument()
  })

  it('takes the texts of the status from the LocaleProvider, inside a group too', () => {
    render(
      <LocaleProvider messages={{ avatar: { online: 'En línea' } }}>
        <AvatarGroup>
          <Avatar name="Ada" status="online" />
          <LocaleProvider messages={{ avatar: { online: 'Conectada' } }}>
            <Avatar name="Grace" status="online" />
          </LocaleProvider>
        </AvatarGroup>
      </LocaleProvider>,
    )
    expect(screen.getByRole('img', { name: 'Ada, En línea' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Grace, Conectada' })).toBeInTheDocument()
  })

  it('has no status by default', () => {
    const { container } = render(<Avatar name="Ada" />)
    expect(container.querySelector('[data-loica-avatar-status-dot]')).toBeNull()
  })

  it('is a subtle, medium, round avatar by default', () => {
    const { container } = render(<Avatar name="Ada" />)
    expect(container.firstChild).toHaveClass('avatar', 'md', 'pill')
    expect(container.querySelector('[data-loica-avatar-fallback]')).toHaveClass(
      'fallback',
      'subtle',
    )
  })

  it.each(['sm', 'md', 'lg'] as const)('supports the %s size', (size) => {
    const { container } = render(<Avatar name="Ada" size={size} />)
    expect(container.firstChild).toHaveClass(size)
  })

  it.each(['rounded', 'pill'] as const)('supports the %s shape', (shape) => {
    const { container } = render(<Avatar name="Ada" shape={shape} />)
    expect(container.firstChild).toHaveClass(shape)
  })

  it.each(['outline', 'solid', 'subtle'] as const)('supports the %s variant', (variant) => {
    const { container } = render(<Avatar name="Ada" variant={variant} />)
    expect(container.querySelector('[data-loica-avatar-fallback]')).toHaveClass(variant)
  })

  it('sets the color variables', () => {
    const { container } = render(<Avatar colorScheme="success" name="Ada" />)
    expect(container.firstChild).toHaveStyle('--avatar-solid: var(--loica-color-success-solid)')
  })

  it('keeps the custom className and style', () => {
    const { container } = render(<Avatar className="custom" name="Ada" style={{ width: '60px' }} />)
    expect(container.firstChild).toHaveClass('avatar', 'custom')
    expect(container.firstChild).toHaveStyle({ width: '60px' })
  })

  it('drops the Loica classes when unstyled', () => {
    const { container } = render(
      <Avatar className="custom" name="Ada" status="busy" variant="unstyled" />,
    )
    expect(container.firstChild).toHaveAttribute('class', 'custom')
    expect(container.querySelector('[data-loica-avatar-fallback]')).not.toHaveAttribute('class')
    expect(container.querySelector('[data-loica-avatar-status-dot]')).not.toHaveAttribute('class')
  })

  it('forwards the ref', () => {
    const ref = createRef<HTMLSpanElement>()
    render(<Avatar name="Ada" ref={ref} />)
    expect(ref.current).toHaveAttribute('data-loica-avatar')
  })
})

describe('AvatarGroup component', () => {
  const people = ['Ada Lovelace', 'Grace Hopper', 'Margaret Hamilton', 'Katherine Johnson']

  const renderGroup = (props = {}) =>
    render(
      <AvatarGroup aria-label="Team" {...props}>
        {people.map((name) => (
          <Avatar key={name} name={name} />
        ))}
      </AvatarGroup>,
    )

  it('is a group with the avatars inside', () => {
    renderGroup()
    expect(screen.getByRole('group', { name: 'Team' })).toBeInTheDocument()
    expect(screen.getAllByRole('img')).toHaveLength(4)
  })

  it('shows all of them when there is no max or it is not reached', () => {
    renderGroup({ max: 10 })
    expect(screen.getAllByRole('img')).toHaveLength(4)
    expect(screen.queryByText(/^\+/)).toBeNull()
  })

  it('shows a counter with the rest when there are more than max', () => {
    renderGroup({ max: 2 })
    expect(screen.getByText('AL')).toBeInTheDocument()
    expect(screen.getByText('GH')).toBeInTheDocument()
    expect(screen.queryByText('MH')).toBeNull()
    expect(screen.getByText('+2')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: '2 more' })).toBeInTheDocument()
  })

  it('takes the text of the counter from the LocaleProvider', () => {
    render(
      <LocaleProvider messages={{ avatarGroup: { overflow: (hidden) => `${hidden} más` } }}>
        <AvatarGroup aria-label="Team" max={3}>
          {people.map((name) => (
            <Avatar key={name} name={name} />
          ))}
        </AvatarGroup>
      </LocaleProvider>,
    )
    expect(screen.getByRole('img', { name: '1 más' })).toBeInTheDocument()
  })

  it('works with a max of zero', () => {
    renderGroup({ max: 0 })
    expect(screen.getByText('+4')).toBeInTheDocument()
    expect(screen.queryByText('AL')).toBeNull()
  })

  it('gives its size, shape, color and variant to the avatars', () => {
    const { container } = renderGroup({
      colorScheme: 'success',
      max: 1,
      shape: 'rounded',
      size: 'lg',
      variant: 'solid',
    })
    const avatars = container.querySelectorAll('[data-loica-avatar]')
    expect(avatars).toHaveLength(2)
    avatars.forEach((avatar) => {
      expect(avatar).toHaveClass('lg', 'rounded')
      expect(avatar).toHaveStyle('--avatar-solid: var(--loica-color-success-solid)')
      expect(avatar.querySelector('[data-loica-avatar-fallback]')).toHaveClass('solid')
    })
  })

  it('lets an avatar keep its own size', () => {
    const { container } = render(
      <AvatarGroup size="lg">
        <Avatar name="Ada" size="sm" />
      </AvatarGroup>,
    )
    expect(container.querySelector('[data-loica-avatar]')).toHaveClass('sm')
  })

  it('keeps the custom className and drops the Loica class when unstyled', () => {
    const { container, rerender } = render(
      <AvatarGroup className="custom">
        <Avatar name="Ada" />
      </AvatarGroup>,
    )
    expect(container.firstChild).toHaveClass('group', 'custom')
    rerender(
      <AvatarGroup className="custom" variant="unstyled">
        <Avatar name="Ada" />
      </AvatarGroup>,
    )
    expect(container.firstChild).toHaveAttribute('class', 'custom')
  })

  it('forwards the ref', () => {
    const ref = createRef<HTMLDivElement>()
    render(
      <AvatarGroup ref={ref}>
        <Avatar name="Ada" />
      </AvatarGroup>,
    )
    expect(ref.current).toHaveAttribute('data-loica-avatar-group')
  })
})

describe('Avatar elements', () => {
  it('draws the fallback and the status dot itself', () => {
    const { container } = render(<Avatar name="Ada Lovelace" status="online" />)
    const root = container.firstElementChild as HTMLElement
    expect(root.children).toHaveLength(2)
    expect(root.children[0]).toHaveAttribute('data-loica-avatar-fallback')
    expect(root.children[0]).toHaveClass('fallback', 'subtle')
    expect(root.children[0]).toHaveTextContent('AL')
    expect(root.children[1]).toHaveAttribute('data-loica-avatar-status-dot')
    expect(root.children[1]).toHaveClass('status')
  })

  it('shows the image instead of the fallback and goes back to it when the image fails', () => {
    const { container } = render(<Avatar name="Ada Lovelace" src="/broken.png" />)
    expect(container.querySelector('[data-loica-avatar-fallback]')).toBeNull()
    expect(container.querySelector('img')).toHaveClass('image')
    fireEvent.error(container.querySelector('img') as HTMLImageElement)
    expect(container.querySelector('img')).toBeNull()
    expect(container.querySelector('[data-loica-avatar-fallback]')).toHaveTextContent('AL')
  })

  it('replaces the content of the fallback', () => {
    render(<Avatar fallback="?!" name="Ada" />)
    expect(screen.getByText('?!')).toBeInTheDocument()
    expect(screen.queryByText('A')).toBeNull()
  })

  it('exposes the status in a data attribute and draws no dot without it', () => {
    const { container } = render(<Avatar name="Ada" status="away" />)
    expect(container.querySelector('[data-loica-avatar-status-dot]')).toHaveAttribute(
      'data-status',
      'away',
    )
    const { container: other } = render(<Avatar name="Ada" />)
    expect(other.querySelector('[data-loica-avatar-status-dot]')).toBeNull()
  })

  it('drops the Loica classes of every element when unstyled', () => {
    const { container } = render(
      <Avatar name="Ada" src="/ada.png" status="busy" variant="unstyled" />,
    )
    expect(container.querySelector('img')).not.toHaveAttribute('class')
    expect(container.querySelector('[data-loica-avatar-status-dot]')).not.toHaveAttribute('class')
    fireEvent.error(container.querySelector('img') as HTMLImageElement)
    expect(container.querySelector('[data-loica-avatar-fallback]')).not.toHaveAttribute('class')
  })
})

describe('AvatarOverflow', () => {
  it('shows +count and names itself with the text of the LocaleProvider', () => {
    render(
      <LocaleProvider messages={{ avatarGroup: { overflow: (hidden) => `${hidden} más` } }}>
        <AvatarGroup>
          <AvatarOverflow count={5} />
        </AvatarGroup>
      </LocaleProvider>,
    )
    expect(screen.getByText('+5')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: '5 más' })).toBeInTheDocument()
  })

  it('works outside a group with the default text', () => {
    const { container } = render(<AvatarOverflow count={3} />)
    expect(screen.getByRole('img', { name: '3 more' })).toBeInTheDocument()
    expect(container.firstElementChild).toHaveAttribute('data-overflow')
  })

  it('takes another content, className and ref', () => {
    const ref = createRef<HTMLSpanElement>()
    render(
      <AvatarOverflow className="custom" count={2} ref={ref}>
        and 2 more
      </AvatarOverflow>,
    )
    expect(ref.current).toHaveClass('avatar', 'custom')
    expect(screen.getByText('and 2 more')).toBeInTheDocument()
  })

  it('is what the group renders for the hidden avatars', () => {
    const { container } = render(
      <AvatarGroup max={1}>
        <Avatar name="Ada" />
        <Avatar name="Grace" />
      </AvatarGroup>,
    )
    expect(container.querySelector('[data-overflow]')).toHaveTextContent('+1')
  })
})
