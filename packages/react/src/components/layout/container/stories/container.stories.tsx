import type { StoryObj, Meta } from '@storybook/react-vite'
import { Container } from '..'

/**
 * Keeps its content to a readable width and centers it on the page, with a gutter on each side.
 *
 * **size** is the widest it gets, a key of the `containers` of the theme (`3xl` is `48rem`), or `full` for no
 * limit; below that it is as wide as its parent. **gutter** is the space on each side, a key of the `spaces` of the
 * theme. **as** picks the element, such as a `main` or a `section`.
 *
 * The widths are the named ones of the theme, which end at `3xl`, so it suits the content of a page, an article or
 * a form. For a wider page use `size="full"`, or `variant="unstyled"` with your own classes.
 */
export default {
  title: 'Components/Container',
  component: Container,
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
    className: {
      control: 'text',
    },
    style: {
      control: false,
    },
    as: {
      control: 'select',
      options: ['div', 'main', 'section', 'article', 'header', 'footer', 'nav', 'aside'],
    },
    gutter: {
      control: 'select',
      options: [1, 1.5, 2, 3, 4, 5, 6, 8, 10, 12, 14, 16, 20],
    },
    size: {
      control: 'select',
      options: ['3xs', '2xs', 'xs', 'sm', 'md', 'lg', '3xl', 'full'],
    },
    variant: {
      control: 'radio',
      options: ['default', 'unstyled'],
    },
  },
  args: {
    gutter: 4,
    size: '3xl',
  },
} satisfies Meta<typeof Container>

type Story = StoryObj<typeof Container>

/**
 * This is the default Container: as wide as `3xl` (`48rem`) at most, centered, with a gutter of `4`.
 */
export const Default: Story = {
  render: (args) => (
    <Container {...args}>
      <div className="rounded-md bg-primary-tint px-3 py-2 text-center text-primary-tint-text">The content</div>
    </Container>
  ),
}

/**
 * Use **variant** to pick the look: `default` limits the width, centers the content and adds the gutter, and `unstyled`
 * drops the Loica styles, so the element is a bare `div` that you size with your own classes.
 */
export const Variants: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-col gap-4">
  <Container >
    <div className="rounded-md bg-primary-tint px-3 py-2 text-center text-primary-tint-text">default</div>
  </Container>
  <Container variant="unstyled">
    <div className="rounded-md bg-primary-tint px-3 py-2 text-center text-primary-tint-text">unstyled</div>
  </Container>
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <Container >
        <div className="rounded-md bg-primary-tint px-3 py-2 text-center text-primary-tint-text">default</div>
      </Container>
      <Container variant="unstyled">
        <div className="rounded-md bg-primary-tint px-3 py-2 text-center text-primary-tint-text">unstyled</div>
      </Container>
    </div>
  ),
}

/**
 * **size** is the widest the Container gets, a key of the `containers` of the theme (`3xl` is `48rem`), or `full` for no
 * limit. Until then it is as wide as its parent.
 */
export const Size: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-col gap-2">
  <Container size="3xs">
    <div className="rounded-md bg-primary-tint px-3 py-2 text-center text-primary-tint-text">3xs</div>
  </Container>
  <Container size="2xs">
    <div className="rounded-md bg-primary-tint px-3 py-2 text-center text-primary-tint-text">2xs</div>
  </Container>
  <Container size="xs">
    <div className="rounded-md bg-primary-tint px-3 py-2 text-center text-primary-tint-text">xs</div>
  </Container>
  <Container size="sm">
    <div className="rounded-md bg-primary-tint px-3 py-2 text-center text-primary-tint-text">sm</div>
  </Container>
  <Container size="md">
    <div className="rounded-md bg-primary-tint px-3 py-2 text-center text-primary-tint-text">md</div>
  </Container>
  <Container size="lg">
    <div className="rounded-md bg-primary-tint px-3 py-2 text-center text-primary-tint-text">lg</div>
  </Container>
  <Container size="3xl">
    <div className="rounded-md bg-primary-tint px-3 py-2 text-center text-primary-tint-text">3xl</div>
  </Container>
  <Container size="full">
    <div className="rounded-md bg-primary-tint px-3 py-2 text-center text-primary-tint-text">full</div>
  </Container>
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-2">
      <Container size="3xs">
        <div className="rounded-md bg-primary-tint px-3 py-2 text-center text-primary-tint-text">3xs</div>
      </Container>
      <Container size="2xs">
        <div className="rounded-md bg-primary-tint px-3 py-2 text-center text-primary-tint-text">2xs</div>
      </Container>
      <Container size="xs">
        <div className="rounded-md bg-primary-tint px-3 py-2 text-center text-primary-tint-text">xs</div>
      </Container>
      <Container size="sm">
        <div className="rounded-md bg-primary-tint px-3 py-2 text-center text-primary-tint-text">sm</div>
      </Container>
      <Container size="md">
        <div className="rounded-md bg-primary-tint px-3 py-2 text-center text-primary-tint-text">md</div>
      </Container>
      <Container size="lg">
        <div className="rounded-md bg-primary-tint px-3 py-2 text-center text-primary-tint-text">lg</div>
      </Container>
      <Container size="3xl">
        <div className="rounded-md bg-primary-tint px-3 py-2 text-center text-primary-tint-text">3xl</div>
      </Container>
      <Container size="full">
        <div className="rounded-md bg-primary-tint px-3 py-2 text-center text-primary-tint-text">full</div>
      </Container>
    </div>
  ),
}

/**
 * **gutter** is the space on each side, a key of the `spaces` of the theme, so the content doesn't touch the edge of a
 * narrow screen. The boxes show the content, inside the padding.
 */
export const Gutter: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-col gap-2">
  <Container gutter={1} size="xs">
    <div className="rounded-md bg-primary-tint px-3 py-2 text-center text-primary-tint-text">gutter 1</div>
  </Container>
  <Container gutter={4} size="xs">
    <div className="rounded-md bg-primary-tint px-3 py-2 text-center text-primary-tint-text">gutter 4</div>
  </Container>
  <Container gutter={10} size="xs">
    <div className="rounded-md bg-primary-tint px-3 py-2 text-center text-primary-tint-text">gutter 10</div>
  </Container>
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-2">
      <Container gutter={1} size="xs">
        <div className="rounded-md bg-primary-tint px-3 py-2 text-center text-primary-tint-text">gutter 1</div>
      </Container>
      <Container gutter={4} size="xs">
        <div className="rounded-md bg-primary-tint px-3 py-2 text-center text-primary-tint-text">gutter 4</div>
      </Container>
      <Container gutter={10} size="xs">
        <div className="rounded-md bg-primary-tint px-3 py-2 text-center text-primary-tint-text">gutter 10</div>
      </Container>
    </div>
  ),
}

/**
 * **as** picks the element for the landmark the content is, such as a `main`, a `header` or a `section`.
 */
export const As: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Container as="main">
  <div className="rounded-md bg-primary-tint px-3 py-2 text-center text-primary-tint-text">The main content of the page</div>
</Container>`,
      },
    },
  },
  render: () => (
    <Container as="main">
      <div className="rounded-md bg-primary-tint px-3 py-2 text-center text-primary-tint-text">The main content of the page</div>
    </Container>
  ),
}

/**
 * With `variant="unstyled"` the Container is a bare element, so Tailwind classes such as `mx-auto max-w-3xl px-4` size it
 * the way you want.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Container className="mx-auto max-w-3xl px-4" variant="unstyled">
  <div className="rounded-md bg-primary-tint px-3 py-2 text-center text-primary-tint-text">Sized with Tailwind</div>
</Container>`,
      },
    },
  },
  render: () => (
    <Container className="mx-auto max-w-3xl px-4" variant="unstyled">
      <div className="rounded-md bg-primary-tint px-3 py-2 text-center text-primary-tint-text">Sized with Tailwind</div>
    </Container>
  ),
}

/**
 * The same with Bootstrap: `container` on an `unstyled` Container gives its centered, responsive width.
 */
export const Bootstrap: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Container className="container" variant="unstyled">
  <div className="border rounded p-2 text-center">Sized with Bootstrap</div>
</Container>`,
      },
    },
  },
  render: () => (
    <Container className="container" variant="unstyled">
      <div className="border rounded p-2 text-center">Sized with Bootstrap</div>
    </Container>
  ),
}
