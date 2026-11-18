import { fileURLToPath } from 'node:url'

import { serveStatic } from './serve-static.mjs'

const server = await serveStatic(fileURLToPath(new URL('../storybook-static', import.meta.url)), 6006)
console.log(`Storybook (static build): http://127.0.0.1:${server.address().port}`)
