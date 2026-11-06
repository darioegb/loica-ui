export type RatingItemState = 'empty' | 'full' | 'half'

export interface RatingLabels {
  item: (value: number, max: number) => string
  readOnly: (value: number, max: number) => string
}

export const itemState = (position: number, value: number): RatingItemState => {
  if (value >= position) return 'full'
  return value >= position - 0.5 ? 'half' : 'empty'
}
