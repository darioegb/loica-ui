// Serves the static build of Storybook (`storybook-static`), or points at a running Storybook with `--url`, for the
// scripts that open every story in a browser.
import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'

const staticDir = fileURLToPath(new URL('../storybook-static', import.meta.url))

const TYPES = {
  '.css': 'text/css',
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.mjs': 'text/javascript',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
}

function serveStatic() {
  if (!existsSync(join(staticDir, 'index.json'))) {
    console.error('No storybook-static: run `pnpm build:docs` first, or pass --url of a running Storybook.')
    process.exit(1)
  }
  const server = createServer((request, response) => {
    const path = normalize(decodeURIComponent(new URL(request.url, 'http://localhost').pathname))
    let file = join(staticDir, path)
    if (!file.startsWith(staticDir)) {
      response.writeHead(403).end()
      return
    }
    if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html')
    if (!existsSync(file)) {
      response.writeHead(404).end()
      return
    }
    response.writeHead(200, { 'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream' })
    createReadStream(file).pipe(response)
  })
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve(server))
  })
}

// `args` is process.argv.slice(2): the words after the optional `--url <address>` are the filters.
export async function openStorybook(args) {
  const urlFlag = args.indexOf('--url')
  const remoteUrl = urlFlag === -1 ? undefined : args[urlFlag + 1]
  const filters = args.filter((_, index) => urlFlag === -1 || (index !== urlFlag && index !== urlFlag + 1))
  const server = remoteUrl ? undefined : await serveStatic()
  const baseUrl = remoteUrl?.replace(/\/$/, '') ?? `http://127.0.0.1:${server.address().port}`
  const index = await (await fetch(`${baseUrl}/index.json`)).json()
  const stories = Object.values(index.entries)
    .filter((entry) => entry.type === 'story')
    .map((entry) => entry.id)
    .filter((id) => filters.length === 0 || filters.some((word) => id.includes(word.toLowerCase())))
  return { baseUrl, close: () => server?.close(), filters, stories }
}
