export const createCountFormatter = (locale: string): ((count: number) => string) => {
  const numbers = new Intl.NumberFormat(locale, { maximumFractionDigits: 20 })
  return (count) => numbers.format(count)
}
