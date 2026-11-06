import path from 'node:path'
import { getUnreadTokens } from '../../scripts/unread-tokens'

/**
 * From 1.0 a token is public API and is only removed in a major, so a token the components stop
 * reading waits here until then.
 */
const KEPT_UNTIL_NEXT_MAJOR = new Set<string>([])

describe('getUnreadTokens', () => {
  const unread = getUnreadTokens(path.join(__dirname, '..'))

  it('finds no token of the default theme that the components do not read', () => {
    expect(unread.filter((name) => !KEPT_UNTIL_NEXT_MAJOR.has(name))).toEqual([])
  })

  it('keeps for the next major only tokens that are still unread', () => {
    expect([...KEPT_UNTIL_NEXT_MAJOR].filter((name) => !unread.includes(name))).toEqual([])
  })
})
