'use client'

import type { ForwardedRef, ReactNode } from 'react'
import { forwardRef, useMemo } from 'react'
import { mergeRefs } from '../../../overlay/trigger'
import { Input, type InputProps } from '../input'
import { useAutocompleteContext } from './autocomplete-context'

export type AutocompleteInputProps = Omit<
  InputProps,
  | 'aria-describedby'
  | 'aria-invalid'
  | 'aria-label'
  | 'aria-labelledby'
  | 'colorScheme'
  | 'defaultValue'
  | 'disabled'
  | 'id'
  | 'mask'
  | 'onChange'
  | 'readOnly'
  | 'required'
  | 'revealable'
  | 'shape'
  | 'size'
  | 'type'
  | 'value'
  | 'variant'
>

/**
 * The text field, an `Input` with the `combobox` role: what the user types is the value of the
 * autocomplete. It takes the addons and elements of the `Input` (`elementBefore` for an icon), and the
 * native attributes of the field, such as `placeholder`, `name`, `autoComplete` or `maxLength`.
 * The size, shape, variant, color, `disabled`, `readOnly`, `required` and the ARIA attributes
 * that name it come from the `Autocomplete`.
 * @since 1.5
 */
export const AutocompleteInput = forwardRef<HTMLInputElement, AutocompleteInputProps>(
  (
    { onKeyDown, ...rest }: AutocompleteInputProps,
    ref: ForwardedRef<HTMLInputElement>,
  ): ReactNode => {
    const context = useAutocompleteContext('AutocompleteInput')
    const { setInput } = context
    const mergedRef = useMemo(() => mergeRefs<HTMLInputElement>(setInput, ref), [ref, setInput])

    return (
      <Input
        autoComplete="off"
        {...rest}
        aria-activedescendant={context.open ? context.activeId : undefined}
        aria-autocomplete="list"
        aria-controls={context.listboxId}
        aria-describedby={context.ariaDescribedBy}
        aria-expanded={context.open}
        aria-invalid={context.ariaInvalid}
        aria-label={context.ariaLabel}
        aria-labelledby={context.ariaLabelledBy}
        colorScheme={context.colorScheme}
        data-loica-autocomplete-input=""
        data-open={context.open ? '' : undefined}
        disabled={context.disabled}
        id={context.controlId}
        onChange={(event) => context.onValueInput(event.target.value)}
        onKeyDown={(event) => {
          onKeyDown?.(event)
          if (!event.defaultPrevented) context.onKeyDown(event)
        }}
        readOnly={context.readOnly}
        ref={mergedRef}
        required={context.required}
        role="combobox"
        shape={context.shape}
        size={context.size}
        type="text"
        value={context.value}
        variant={context.variant}
      />
    )
  },
)

AutocompleteInput.displayName = 'AutocompleteInput'
