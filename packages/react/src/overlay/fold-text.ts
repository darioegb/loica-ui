export function foldText(text: string, locale: string): string {
  return text.toLocaleLowerCase(locale).normalize('NFD').replace(/\p{M}/gu, '')
}
