import path from 'node:path'
import { getUnreadTokens } from '../../scripts/unread-tokens'

describe('getUnreadTokens', () => {
  it('finds no token of the default theme that the components do not read', () => {
    expect(getUnreadTokens(path.join(__dirname, '..'))).toEqual([])
  })
})
