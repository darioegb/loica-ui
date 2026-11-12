import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join, normalize } from 'node:path'

const TYPES = {
  '.css': 'text/css',
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.mjs': 'text/javascript',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
}

/** Serves a static Storybook build on a free local port and returns the server. */
export function serveStatic(dir) {
  if (!existsSync(join(dir, 'index.json'))) {
    throw new Error(`No static Storybook in ${dir}: run \`pnpm build:docs\` first.`)
  }
  const server = createServer((request, response) => {
    const path = normalize(decodeURIComponent(new URL(request.url, 'http://localhost').pathname))
    let file = join(dir, path)
    if (!file.startsWith(dir)) {
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
