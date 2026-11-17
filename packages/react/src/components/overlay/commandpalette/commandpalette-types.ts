export type CommandPaletteVariant = 'default' | 'unstyled'

/**
 * Every text the component shows or announces: the name of the dialog (`label`), the hint of the search box
 * (`placeholder`), what is shown when nothing matches (`empty`) and the count that is announced as the user types
 * (`results`).
 *
 * @since 1.3
 */
export interface CommandPaletteLabels {
  empty: string
  label: string
  placeholder: string
  results: (count: number) => string
}

export type CommandPaletteFilter = (
  value: string,
  query: string,
  keywords: readonly string[],
) => boolean
