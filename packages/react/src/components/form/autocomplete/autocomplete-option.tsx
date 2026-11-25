'use client'

import type { ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import { SelectOption, type SelectOptionProps } from '../select/select-option'
import { useAutocompleteContext } from './autocomplete-context'

export interface AutocompleteOptionOwnProps {
  /** The text of the option, or its content. */
  children?: ReactNode
  /** A second line of text under the option. */
  description?: ReactNode
  /**
   * Makes the option impossible to choose.
   * @default false
   */
  disabled?: boolean
  /**
   * An icon or an image before the text. Give an image `alt=""`: it is decorative and the label
   * names the option.
   */
  icon?: ReactNode
  /**
   * The text the field takes when the option is chosen, and the one the search matches, when the
   * content is more than text. Without it the option uses the text of its `children`.
   */
  label?: string
  /**
   * What the option gives to `onOptionSelect`. It defaults to the `label`, or to the `children` when
   * they are text.
   */
  value?: string
}

export type AutocompleteOptionProps = Omit<SelectOptionProps, keyof AutocompleteOptionOwnProps> &
  AutocompleteOptionOwnProps

/**
 * An option of the list: choosing it puts its text in the field. Its `children` are its text. It
 * is the `SelectOption`, so it carries its `data-loica-select-option` attribute, and `data-active`
 * while the arrows are on it, plus `aria-selected` when its text is the one in the field.
 * @since 1.5
 */
export const AutocompleteOption = forwardRef<HTMLDivElement, AutocompleteOptionProps>(
  (
    { children, label, value, ...rest }: AutocompleteOptionProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): ReactNode => {
    useAutocompleteContext('AutocompleteOption')
    const text = typeof children === 'string' ? children : undefined

    return (
      <SelectOption {...rest} label={label} ref={ref} value={value ?? label ?? text ?? ''}>
        {children}
      </SelectOption>
    )
  },
)

AutocompleteOption.displayName = 'AutocompleteOption'
