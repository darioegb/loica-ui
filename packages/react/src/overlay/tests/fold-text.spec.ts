import { foldText } from '../fold-text'

describe('foldText', () => {
  it('ignores the case', () => {
    expect(foldText('Banana', 'en')).toBe('banana')
  })

  it('drops the accents and the diaeresis', () => {
    expect(foldText('Café Ünïcode ñandú', 'en')).toBe('cafe unicode nandu')
  })

  it('folds a letter written with a combining mark the same as the one that already has it', () => {
    expect(foldText('e\u0301', 'en')).toBe(foldText('\u00e9', 'en'))
  })

  it('keeps the letters that are not an accented form of another', () => {
    expect(foldText('Straße Øre', 'en')).toBe('straße øre')
  })

  it('folds the dotted capital i to i, and keeps the dotless i apart, in Turkish', () => {
    expect(foldText('İstanbul', 'tr')).toBe('istanbul')
    expect(foldText('ISPARTA', 'tr')).toBe('ısparta')
    expect(foldText('ısparta', 'tr')).toBe('ısparta')
  })

  it('folds the capital i to i and the dotted capital i to i outside Turkish', () => {
    expect(foldText('ISPARTA', 'en')).toBe('isparta')
    expect(foldText('İstanbul', 'en')).toBe('istanbul')
  })
})
