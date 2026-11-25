import type { ReactNode } from 'react'

const svg = (children: ReactNode, mirror = false): ReactNode => (
  <svg
    aria-hidden="true"
    data-loica-richtexteditor-mirror={mirror ? '' : undefined}
    fill="none"
    focusable="false"
    height="1em"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    width="1em"
  >
    {children}
  </svg>
)

export const ICONS = {
  bold: svg(<path d="M7 5h6a3.5 3.5 0 0 1 0 7H7zM7 12h7a3.5 3.5 0 0 1 0 7H7z" />),
  italic: svg(<path d="M19 4h-9M14 20H5M15 4 9 20" />),
  underline: svg(<path d="M7 4v7a5 5 0 0 0 10 0V4M5 20h14" />),
  code: svg(<path d="m16 18 6-6-6-6M8 6l-6 6 6 6" />),
  link: svg(
    <path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" />,
  ),
  quote: svg(<path d="M4 6v12M9 8h11M9 12h11M9 16h7" />, true),
  codeBlock: svg(<path d="M3 5h18v14H3zM9 10l-2 2 2 2M15 10l2 2-2 2" />),
  bullet: svg(<path d="M9 6h12M9 12h12M9 18h12M4 6h.01M4 12h.01M4 18h.01" />, true),
  ordered: svg(
    <path d="M10 6h11M10 12h11M10 18h11M4 6h1v4M4 10h2M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />,
  ),
  alignStart: svg(<path d="M4 6h16M4 12h10M4 18h14" />, true),
  alignCenter: svg(<path d="M4 6h16M7 12h10M5 18h14" />),
  alignEnd: svg(<path d="M4 6h16M10 12h10M6 18h14" />, true),
  alignJustify: svg(<path d="M4 6h16M4 12h16M4 18h16" />),
  undo: svg(<path d="M9 14 4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3" />, true),
  redo: svg(<path d="m15 14 5-5-5-5M20 9H10a6 6 0 0 0 0 12h3" />, true),
  h1: svg(<path d="M4 6v12M12 6v12M4 12h8M17 12l3-2v8" />),
  h2: svg(<path d="M4 6v12M12 6v12M4 12h8M16 11a2.5 2.5 0 0 1 4.5 1.5c0 2-4.5 3.5-4.5 5.5h5" />),
  h3: svg(<path d="M4 6v12M12 6v12M4 12h8M16 10h4.5l-2.5 3a2.5 2.5 0 1 1-2 4" />),
  paragraph: svg(<path d="M13 4v16M17 4v16M13 4H9.5a4.5 4.5 0 0 0 0 9H13" />),
}
