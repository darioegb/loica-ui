import { foldText } from '../../../overlay/fold-text'

export const matchesQuery = (
  label: string,
  query: string,
  locale: string,
  filter: boolean,
): boolean => !filter || foldText(label, locale).includes(foldText(query, locale))
