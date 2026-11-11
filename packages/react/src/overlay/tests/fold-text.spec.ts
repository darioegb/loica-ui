import { foldText } from '../fold-text'

describe('foldText', () => {
  it('ignores the case', () => {
    expect(foldText('Banana')).toBe('banana')
  })

  it('drops the accents and the diaeresis', () => {
    expect(foldText('Café Ünïcode ñandú')).toBe('cafe unicode nandu')
  })

  it('folds a letter written with a combining mark the same as the one that already has it', () => {
    expect(foldText('e\u0301')).toBe(foldText('\u00e9'))
  })

  it('keeps the letters that are not an accented form of another', () => {
    expect(foldText('Straße Øre')).toBe('straße øre')
  })
})
