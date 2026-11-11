import { render, screen } from '@testing-library/react'
import { createRef, forwardRef } from 'react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '../../components/navigation/breadcrumb'
import { Button } from '../../components/interaction/button'
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from '../../components/navigation/navbar'
import {
  Sidebar,
  SidebarContent,
  SidebarItem,
  SidebarProvider,
} from '../../components/navigation/sidebar'
import { LinkProvider } from '..'
import type { LinkComponentProps } from '..'

const RouterLink = forwardRef<HTMLAnchorElement, LinkComponentProps>(
  ({ children, href, ...rest }: LinkComponentProps, ref) => (
    <a {...rest} data-router="" href={`/app${href}`} ref={ref}>
      {children}
    </a>
  ),
)
RouterLink.displayName = 'RouterLink'

const Links = () => (
  <>
    <Navbar aria-label="Main">
      <NavbarBrand href="/">Brand</NavbarBrand>
      <NavbarContent>
        <NavbarItem href="/docs">Docs</NavbarItem>
        <NavbarItem disabled href="/soon">
          Soon
        </NavbarItem>
      </NavbarContent>
    </Navbar>
    <SidebarProvider>
      <Sidebar aria-label="Menu">
        <SidebarContent aria-label="Pages">
          <SidebarItem href="/guide">Guide</SidebarItem>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
    <Breadcrumb>
      <BreadcrumbItem>
        <BreadcrumbLink href="/home">Home</BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumb>
    <Button href="/go">Go</Button>
  </>
)

describe('LinkProvider', () => {
  it('leaves the links as plain anchors without a provider', () => {
    render(<Links />)
    expect(screen.getByRole('link', { name: 'Docs' })).toHaveAttribute('href', '/docs')
    expect(document.querySelector('[data-router]')).toBeNull()
  })

  it.each([
    ['NavbarBrand', 'Brand', '/app/'],
    ['NavbarItem', 'Docs', '/app/docs'],
    ['SidebarItem', 'Guide', '/app/guide'],
    ['BreadcrumbLink', 'Home', '/app/home'],
    ['Button', 'Go', '/app/go'],
  ])('renders the component of the provider in a %s', (_name, label, href) => {
    render(
      <LinkProvider component={RouterLink}>
        <Links />
      </LinkProvider>,
    )
    const link = screen.getByRole('link', { name: label })
    expect(link).toHaveAttribute('data-router')
    expect(link).toHaveAttribute('href', href)
  })

  it('keeps a disabled link as a plain anchor without href', () => {
    render(
      <LinkProvider component={RouterLink}>
        <Links />
      </LinkProvider>,
    )
    const disabled = screen.getByText('Soon')
    expect(disabled).not.toHaveAttribute('data-router')
    expect(disabled).not.toHaveAttribute('href')
    expect(disabled).toHaveAttribute('aria-disabled', 'true')
  })

  it('gives the ref and the attributes of the item to the component', () => {
    const ref = createRef<HTMLElement>()
    render(
      <LinkProvider component={RouterLink}>
        <Navbar aria-label="Main">
          <NavbarContent>
            <NavbarItem active href="/docs" ref={ref} rel="noreferrer" target="_blank">
              Docs
            </NavbarItem>
          </NavbarContent>
        </Navbar>
      </LinkProvider>,
    )
    const link = screen.getByRole('link', { name: 'Docs' })
    expect(ref.current).toBe(link)
    expect(link).toHaveAttribute('aria-current', 'page')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noreferrer')
    expect(link).toHaveAttribute('data-loica-navbar-item')
  })

  it.each([
    ['an absolute URL', { href: 'https://example.com/docs' }],
    ['a URL without a scheme slashes', { href: '//example.com/docs' }],
    ['a mailto', { href: 'mailto:hi@example.com' }],
    ['a tel', { href: 'tel:+123456' }],
    ['a target that opens elsewhere', { href: '/docs', target: '_blank' }],
  ])('leaves %s as a plain anchor', (_name, props) => {
    render(
      <LinkProvider component={RouterLink}>
        <Button {...props}>Go</Button>
        <Navbar aria-label="Main">
          <NavbarBrand {...props}>Brand</NavbarBrand>
        </Navbar>
      </LinkProvider>,
    )
    expect(document.querySelector('[data-router]')).toBeNull()
    expect(screen.getByRole('link', { name: 'Go' })).toHaveAttribute('href', props.href)
    expect(screen.getByRole('link', { name: 'Brand' })).toHaveAttribute('href', props.href)
  })

  it.each([
    ['a path', '/docs'],
    ['a relative path', 'docs/intro'],
    ['a query', '?page=2'],
    ['a hash', '#top'],
  ])('gives %s to the component of the provider', (_name, href) => {
    render(
      <LinkProvider component={RouterLink}>
        <Button href={href}>Go</Button>
      </LinkProvider>,
    )
    expect(screen.getByRole('link', { name: 'Go' })).toHaveAttribute('data-router')
  })

  it('gives a target of _self to the component of the provider', () => {
    render(
      <LinkProvider component={RouterLink}>
        <Button href="/docs" target="_self">
          Go
        </Button>
      </LinkProvider>,
    )
    expect(screen.getByRole('link', { name: 'Go' })).toHaveAttribute('data-router')
  })

  it('uses the nearest provider', () => {
    const Inner = forwardRef<HTMLAnchorElement, LinkComponentProps>(
      ({ children, href, ...rest }: LinkComponentProps, ref) => (
        <a {...rest} data-inner="" href={href} ref={ref}>
          {children}
        </a>
      ),
    )
    Inner.displayName = 'Inner'
    render(
      <LinkProvider component={RouterLink}>
        <LinkProvider component={Inner}>
          <Button href="/go">Go</Button>
        </LinkProvider>
      </LinkProvider>,
    )
    expect(screen.getByRole('link', { name: 'Go' })).toHaveAttribute('data-inner')
  })
})
