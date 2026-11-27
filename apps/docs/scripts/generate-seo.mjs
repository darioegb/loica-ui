import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dir = join(root, 'storybook-static')
const pkg = JSON.parse(readFileSync(join(root, '../../packages/react/package.json'), 'utf8'))

const siteUrl = pkg.homepage
const title = 'Loica UI React: accessible, themeable React components'
const description =
  'A lightweight React component library with accessible components, a theme made of CSS variables, ' +
  'dark mode, server rendering and a modular bundle. Works with Tailwind and Bootstrap.'
const image = `${siteUrl}og-image.png`

const START = '<!-- seo:start -->'
const END = '<!-- seo:end -->'
const escape = (text) => text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

const tags = [
  START,
  `<meta name="description" content="${escape(description)}" />`,
  `<meta name="keywords" content="${escape(pkg.keywords.join(', '))}" />`,
  `<link rel="canonical" href="${siteUrl}" />`,
  '<meta property="og:type" content="website" />',
  '<meta property="og:site_name" content="Loica UI React" />',
  `<meta property="og:title" content="${escape(title)}" />`,
  `<meta property="og:description" content="${escape(description)}" />`,
  `<meta property="og:url" content="${siteUrl}" />`,
  `<meta property="og:image" content="${image}" />`,
  '<meta property="og:image:width" content="1200" />',
  '<meta property="og:image:height" content="630" />',
  '<meta name="twitter:card" content="summary_large_image" />',
  `<meta name="twitter:title" content="${escape(title)}" />`,
  `<meta name="twitter:description" content="${escape(description)}" />`,
  `<meta name="twitter:image" content="${image}" />`,
  END,
].join('\n    ')

const indexPath = join(dir, 'index.html')
const html = readFileSync(indexPath, 'utf8')
  .replace(new RegExp(`\\s*${START}[\\s\\S]*?${END}`), '')
  .replace(/<title>[^<]*<\/title>/, `<title>${escape(title)}</title>`)
  .replace('</head>', `    ${tags}\n  </head>`)
writeFileSync(indexPath, html)

const index = JSON.parse(readFileSync(join(dir, 'index.json'), 'utf8'))
const pages = Object.values(index.entries)
  .filter((entry) => entry.type === 'docs')
  .map((entry) => `${siteUrl}?path=/docs/${entry.id}`)
const urls = [siteUrl, ...pages]

writeFileSync(
  join(dir, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((url) => `  <url><loc>${escape(url)}</loc></url>`)
    .join('\n')}\n</urlset>\n`,
)
writeFileSync(
  join(dir, 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}sitemap.xml\n`,
)

console.log(`SEO: head tags, robots.txt and a sitemap with ${urls.length} pages`)
