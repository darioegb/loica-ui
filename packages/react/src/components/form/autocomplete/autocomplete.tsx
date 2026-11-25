'use client'

import type { ForwardedRef, ReactNode } from 'react'
import { forwardRef, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { useLabels, useResolvedLocale } from '../../../locale/locale-provider'
import type { Placement } from '../../../overlay'
import { hasPart } from '../../../overlay/has-part'
import { useControllableState } from '../../../overlay/use-controllable-state'
import { useOpenState } from '../../../overlay/use-open-state'
import type { ColorScheme, Shape, Size } from '../../../theme'
import { useFieldContext } from '../field/field-context'
import {
  SelectContext,
  type SelectContextValue,
  type SelectedOption,
} from '../select/select-context'
import { createDefaultLabels } from '../select/select-labels'
import { matchesQuery } from '../select/select-match'
import { useSelectRegistry } from '../select/use-select-registry'
import { AutocompleteContent } from './autocomplete-content'
import {
  AutocompleteContext,
  type AutocompleteContextValue,
  type AutocompleteVariant,
} from './autocomplete-context'
import { AutocompleteInput, type AutocompleteInputProps } from './autocomplete-input'
import { AutocompleteOption } from './autocomplete-option'
import { useAutocompleteKeyboard } from './use-autocomplete-keyboard'

/** An option of the `options` prop of an `Autocomplete`. */
export interface AutocompleteOptionData {
  /** A second line of text under the option. */
  description?: ReactNode
  /** Makes the option impossible to choose. */
  disabled?: boolean
  /** An icon or an image before the text. */
  icon?: ReactNode
  /** The text of the option, the one the field takes when it is chosen. */
  label: string
  /** What the option gives to `onOptionSelect`. It defaults to the `label`. */
  value?: string
}

export interface AutocompleteOwnProps {
  /**
   * Ids of the elements that describe the field. A `Field` adds its helper text and its error.
   */
  'aria-describedby'?: string
  /**
   * Marks the value as invalid, and the field draws its border with the error color. A `Field` sets
   * it.
   */
  'aria-invalid'?: boolean | 'true' | 'false'
  /** The name of the field, when there is no `Field` label. It also names the list of suggestions. */
  'aria-label'?: string
  /** Id of the element that names the field and its list. */
  'aria-labelledby'?: string
  /**
   * The `AutocompleteInput` and the `AutocompleteContent`, each one optional: the `Autocomplete` draws
   * the one you leave out. Children that are not parts are the options of the list.
   */
  children?: ReactNode
  /**
   * Color of the focus ring, from the theme palette (custom schemes included).
   * @default 'secondary'
   */
  colorScheme?: ColorScheme
  /**
   * Whether the list is open at first, for an uncontrolled autocomplete.
   * @default false
   */
  defaultOpen?: boolean
  /**
   * The text of an uncontrolled autocomplete at first.
   * @default ''
   */
  defaultValue?: string
  /**
   * Disables the field.
   * @default false
   */
  disabled?: boolean
  /**
   * Whether the list hides the options that don't match the text, ignoring case and accents, with the
   * `locale` of the `LocaleProvider`. Turn it off when the options already come filtered, as in a
   * search on a server.
   * @default true
   */
  filter?: boolean
  /**
   * Opens on the opposite side when there is no room on the one asked for.
   * @default true
   */
  flip?: boolean
  /** Id of the field. A `Field` sets it, to link its label to it. */
  id?: string
  /**
   * Shows a `Loader` in the list and marks it busy, while the suggestions arrive. The options you
   * already have stay in the list.
   * @default false
   */
  loading?: boolean
  /**
   * Distance in pixels between the field and the list.
   * @default 4
   */
  offset?: number
  /** Called with the new state when the list opens or closes. */
  onOpenChange?: (open: boolean) => void
  /**
   * Called with the option the user chooses from the list, after the text has taken its label. It is
   * not called for the text the user types: that is what `onValueChange` and `onSearchChange` are for.
   */
  onOptionSelect?: (option: SelectedOption) => void
  /**
   * Called with the text each time the user types, and not when they choose an option. Search on a
   * server with it, and turn off `filter`; wait for the user to stop typing with `useDebounce`.
   */
  onSearchChange?: (query: string) => void
  /**
   * Called with the new text, when the user types and when they choose an option.
   */
  onValueChange?: (value: string) => void
  /** Whether the list is open, for a controlled autocomplete. Pair it with `onOpenChange`. */
  open?: boolean
  /**
   * The suggestions as data, so the autocomplete can be written without children:
   * `<Autocomplete aria-label="City" options={[{ label: 'Madrid' }]} />`. The autocomplete draws an
   * `AutocompleteContent` with an `AutocompleteOption` for each one, unless you give it your own.
   */
  options?: readonly AutocompleteOptionData[]
  /**
   * Where the list opens, relative to the field.
   * @default 'bottom-start'
   */
  placement?: Placement
  /**
   * The text is shown and focusable, but it can't be edited and the list does not open.
   * @default false
   */
  readOnly?: boolean
  /**
   * Marks the field as required.
   * @default false
   */
  required?: boolean
  /**
   * Shape of the `outline` field.
   * @default 'rounded'
   */
  shape?: Shape
  /**
   * Slides the list along its side to keep it inside the screen.
   * @default true
   */
  shift?: boolean
  /**
   * Height and text size of the field.
   * @default 'md'
   */
  size?: Size
  /** The text of a controlled autocomplete. Pair it with `onValueChange`. */
  value?: string
  /**
   * Visual variant, the same ones as `Input`. `unstyled` drops the Loica styles so you can bring
   * your own.
   * @default 'outline'
   */
  variant?: AutocompleteVariant
}

export type AutocompleteProps = Omit<AutocompleteInputProps, keyof AutocompleteOwnProps> &
  AutocompleteOwnProps

const NO_SELECTION: readonly string[] = []
const NO_OPTIONS: readonly SelectedOption[] = []
const noop = (): void => undefined

/**
 * A text field that suggests options as the user types and accepts a text that is not in the list,
 * such as a city, a tag or an email address. The value is the text. Written without children it draws an
 * `AutocompleteInput` and an `AutocompleteContent` with the `options`; the native attributes
 * of the field (`placeholder`, `name`, `maxLength`...), its `className`, `style` and `ref` go to the
 * input it draws, or to your own `AutocompleteInput`.
 * @since 1.5
 */
export const Autocomplete = forwardRef<HTMLInputElement, AutocompleteProps>(
  (
    {
      'aria-describedby': describedBy,
      'aria-invalid': ariaInvalid,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby,
      children,
      colorScheme = 'secondary',
      defaultOpen = false,
      defaultValue = '',
      disabled = false,
      filter = true,
      flip = true,
      id,
      loading = false,
      offset = 4,
      onOpenChange,
      onOptionSelect,
      onSearchChange,
      onValueChange,
      open: openProp,
      options: optionsData,
      placement = 'bottom-start',
      readOnly = false,
      required = false,
      shape = 'rounded',
      shift = true,
      size = 'md',
      value: valueProp,
      variant = 'outline',
      ...rest
    }: AutocompleteProps,
    ref: ForwardedRef<HTMLInputElement>,
  ): ReactNode => {
    const generatedId = useId()
    const baseId = id ?? generatedId
    const field = useFieldContext()
    const [input, setInput] = useState<HTMLInputElement | null>(null)
    const [listbox, setListbox] = useState<HTMLElement | null>(null)
    const [emptyShown, setEmptyShown] = useState(false)
    const [requested, setRequested] = useOpenState({ defaultOpen, onOpenChange, open: openProp })
    const [text, setText] = useControllableState({
      defaultValue,
      onChange: onValueChange,
      value: valueProp,
    })
    const { options, register } = useSelectRegistry()
    const locale = useResolvedLocale()
    const defaults = useMemo(() => createDefaultLabels(locale), [locale])
    const labels = useLabels('select', defaults)
    const canEdit = !disabled && !readOnly
    const isControlled = valueProp !== undefined

    const hasMatches = useMemo(
      () => options.some((option) => matchesQuery(option.label, text, locale, filter)),
      [filter, locale, options, text],
    )
    const open = requested && (hasMatches || loading || emptyShown)
    const anchor = useMemo(
      () => input?.closest<HTMLElement>('[data-loica-input-control]') ?? input,
      [input],
    )

    const setOpen = useCallback(
      (next: boolean): void => {
        if (!next || canEdit) setRequested(next)
      },
      [canEdit, setRequested],
    )

    const close = useCallback(
      (returnFocus: boolean): void => {
        setRequested(false)
        if (returnFocus) input?.focus()
      },
      [input, setRequested],
    )

    const latestSearch = useRef(onSearchChange)
    latestSearch.current = onSearchChange
    const latestSelect = useRef(onOptionSelect)
    latestSelect.current = onOptionSelect

    const choose = useCallback(
      (optionValue: string): void => {
        const record = options.find((option) => option.value === optionValue)
        if (!canEdit || !record) return
        setText(record.label)
        latestSelect.current?.({ icon: record.icon, label: record.label, value: record.value })
        close(true)
      },
      [canEdit, close, options, setText],
    )

    const { activeId, onKeyDown, setActiveId } = useAutocompleteKeyboard({
      canEdit,
      close,
      listbox,
      open,
      openList: () => setOpen(true),
      options,
      select: choose,
      value: text,
    })

    const onValueInput = useCallback(
      (next: string): void => {
        setText(next)
        setActiveId(undefined)
        latestSearch.current?.(next)
        setOpen(true)
      },
      [setActiveId, setOpen, setText],
    )

    useEffect(() => {
      const form = input?.closest('form')
      if (!form || isControlled) return undefined
      const reset = (): void => setText(defaultValue)
      form.addEventListener('reset', reset)
      return () => form.removeEventListener('reset', reset)
    }, [defaultValue, input, isControlled, setText])


    const selectedValues = useMemo(
      () =>
        new Set(text ? options.filter((option) => option.label === text).map((o) => o.value) : []),
      [options, text],
    )
    const isSelected = useCallback((item: string): boolean => selectedValues.has(item), [selectedValues])
    const invalid = ariaInvalid === true || ariaInvalid === 'true'
    const fieldLabel = field?.controlId === baseId ? field.labelId : undefined
    const labelling = useMemo(
      () => ({
        label: ariaLabel,
        labelledBy: ariaLabelledby ?? (ariaLabel ? undefined : fieldLabel),
      }),
      [ariaLabel, ariaLabelledby, fieldLabel],
    )
    const listboxId = `${baseId}-listbox`
    const isStyled = variant !== 'unstyled'

    const selectContext = useMemo<SelectContextValue>(
      () => ({
        activeId,
        canClear: false,
        clear: noop,
        close,
        colorScheme,
        controlId: baseId,
        describedBy,
        disabled,
        filter,
        flip,
        invalid,
        isSelected,
        isStyled,
        labelling,
        labels,
        listboxId,
        loading,
        locale,
        multiple: false,
        name: undefined,
        offset,
        onListKeyDown: noop,
        open,
        options,
        placement,
        query: text,
        readOnly,
        register,
        remove: noop,
        required,
        searchable: false,
        select: choose,
        selected: NO_SELECTION,
        selectedOptions: NO_OPTIONS,
        setActiveId,
        setLabelling: noop,
        setListbox,
        setOpen,
        setQuery: noop,
        setTrigger: noop,
        shape,
        shift,
        size,
        trigger: anchor,
        variant,
      }),
      [
        activeId,
        anchor,
        baseId,
        choose,
        close,
        colorScheme,
        describedBy,
        disabled,
        filter,
        flip,
        invalid,
        isSelected,
        isStyled,
        labelling,
        labels,
        listboxId,
        loading,
        locale,
        offset,
        open,
        options,
        placement,
        readOnly,
        register,
        required,
        setActiveId,
        setOpen,
        shape,
        shift,
        size,
        text,
        variant,
      ],
    )

    const context = useMemo<AutocompleteContextValue>(
      () => ({
        activeId,
        anchor,
        ariaDescribedBy: describedBy,
        ariaInvalid,
        ariaLabel,
        ariaLabelledBy: ariaLabelledby,
        close,
        colorScheme,
        controlId: baseId,
        disabled,
        flip,
        isStyled,
        listboxId,
        offset,
        onKeyDown,
        onValueInput,
        open,
        placement,
        readOnly,
        required,
        setEmptyShown,
        setInput,
        shape,
        shift,
        size,
        value: text,
        variant,
      }),
      [
        activeId,
        anchor,
        ariaInvalid,
        ariaLabel,
        ariaLabelledby,
        baseId,
        close,
        colorScheme,
        describedBy,
        disabled,
        flip,
        isStyled,
        listboxId,
        offset,
        onKeyDown,
        onValueInput,
        open,
        placement,
        readOnly,
        required,
        shape,
        shift,
        size,
        text,
        variant,
      ],
    )

    const composed = hasPart(children, [AutocompleteInput, AutocompleteContent])
    const hasInput = hasPart(children, [AutocompleteInput])
    const hasContent = hasPart(children, [AutocompleteContent])
    const items = optionsData?.map(({ description, disabled: off, icon, label, value }) => (
      <AutocompleteOption
        description={description}
        disabled={off}
        icon={icon}
        key={value ?? label}
        label={label}
        value={value ?? label}
      />
    ))

    return (
      <SelectContext.Provider value={selectContext}>
        <AutocompleteContext.Provider value={context}>
          {hasInput ? null : <AutocompleteInput {...rest} ref={ref} />}
          {composed ? children : null}
          {hasContent ? null : (
            <AutocompleteContent>
              {items}
              {composed ? null : children}
            </AutocompleteContent>
          )}
        </AutocompleteContext.Provider>
      </SelectContext.Provider>
    )
  },
)

Autocomplete.displayName = 'Autocomplete'
