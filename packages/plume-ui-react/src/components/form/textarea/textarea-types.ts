import type { ComponentPropsWithoutRef } from 'react'
import type { ColorScheme, Shape, Size } from '../../../theme'

export type TextareaVariant = 'outline' | 'filled' | 'underline' | 'unstyled'
export type TextareaResize = 'none' | 'vertical' | 'horizontal' | 'both'

export interface TextareaLabels {
  count: (count: number, max: number | undefined) => string
  remaining: (remaining: number) => string
}

export interface TextareaOwnProps {
  /**
   * Color scheme of the focus ring and of the border while focused, from the theme palette.
   * @default 'secondary'
   */
  colorScheme?: ColorScheme
  /**
   * Which way the user can resize the textarea.
   * @default 'vertical'
   */
  resize?: TextareaResize
  /**
   * Shape of the corners.
   * @default 'rounded'
   */
  shape?: Shape
  /**
   * Shows how many characters there are under the textarea, as `12` or, with `maxLength`, as `12 /
   * 200`. The count describes the textarea to a screen reader, it turns red at the limit, and near
   * the limit a live region says how many characters are left. With it, `className` and `style` go
   * to the wrapper of the textarea and the count, which carries `data-plume-textarea-group`.
   * @default false
   */
  showCount?: boolean
  /**
   * Size of the textarea.
   * @default 'md'
   */
  size?: Size
  /**
   * Visual variant. `unstyled` drops the Plume styles so you can bring your own.
   * @default 'outline'
   */
  variant?: TextareaVariant
}

export type TextareaProps = ComponentPropsWithoutRef<'textarea'> & TextareaOwnProps
