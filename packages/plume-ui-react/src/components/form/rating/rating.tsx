'use client'

import type { ComponentPropsWithoutRef, CSSProperties, ForwardedRef, ReactNode } from 'react'
import { forwardRef, useId } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { visuallyHidden } from '../../../overlay/visually-hidden'
import { useLabels } from '../../../locale/locale-provider'
import type { ColorScheme, Size } from '../../../theme'
import { useFieldContext } from '../field/field-context'
import { StarIcon } from './rating-icons'
import { RatingItem } from './rating-item'
import type { RatingLabels } from './rating-types'
import styles from './rating.module.css'
import { useRating } from './use-rating'

export type { RatingLabels }

export type RatingVariant = 'outline' | 'solid' | 'unstyled'

export interface RatingOwnProps {
  /**
   * Lets the user pick half a star: every star gets two radios, one for each half.
   * @default false
   */
  allowHalf?: boolean
  /**
   * Lets the user remove the score, by clicking the chosen star again or pressing
   * <kbd>Backspace</kbd> or <kbd>Delete</kbd>. The score goes to `0`.
   * @default false
   */
  clearable?: boolean
  /**
   * Color scheme from the theme palette, custom schemes included.
   * @default 'warning'
   */
  colorScheme?: ColorScheme
  /**
   * The score the rating starts with, when it is not controlled. It is rounded to a whole number,
   * or to a half with `allowHalf`.
   * @default 0
   */
  defaultValue?: number
  /**
   * Disables the radios and dims the rating.
   * @default false
   */
  disabled?: boolean
  /** The icon of an empty star. By default it is an outline of the star, or of your `icon`. */
  emptyIcon?: ReactNode
  /**
   * The icon of a star, in the color of the rating. A custom one is also used for the empty stars
   * unless you give `emptyIcon`.
   */
  icon?: ReactNode
  /**
   * How many stars there are, which is also the highest score.
   * @default 5
   */
  max?: number
  /**
   * Name of the radios in a form. It is generated when you don't give one. A form submits the
   * chosen score.
   */
  name?: string
  /** Called with the new score. It is `0` when the score is cleared. */
  onValueChange?: (value: number) => void
  /**
   * Shows the score without letting the user change it. The group keeps its name and renders the
   * score as text instead of radio buttons, so it can't be focused.
   * @default false
   */
  readOnly?: boolean
  /** Marks the group as required (`aria-required`). A read only rating ignores it. */
  required?: boolean
  /**
   * Size of the stars.
   * @default 'md'
   */
  size?: Size
  /**
   * The score, from `0` to `max`. Makes the rating controlled: pass `onValueChange` to update it.
   */
  value?: number
  /**
   * Visual variant. `solid` fills the chosen stars with the color of the rating, `outline` draws
   * them as a thicker outline in that color (a custom `icon` keeps its own shape and takes the
   * color). `unstyled` drops the Plume styles so you can bring your own; the stars keep working
   * and have `data-state`.
   * @default 'solid'
   */
  variant?: RatingVariant
}

export type RatingProps = Omit<
  ComponentPropsWithoutRef<'fieldset'>,
  'children' | 'defaultValue' | 'name' | 'onChange'
> &
  RatingOwnProps

const DEFAULT_LABELS: RatingLabels = {
  item: (value) => `${value} ${value === 1 ? 'star' : 'stars'}`,
  readOnly: (value, max) => `${value} out of ${max}`,
}

const SOLID_ICON = <StarIcon appearance="solid" />
const OUTLINE_ICON = <StarIcon appearance="outline" />
const EMPTY_ICON = <StarIcon appearance="empty" />

function ratingClasses({
  className,
  disabled,
  isStyled,
  readOnly,
  size,
  variant,
}: {
  className: string | undefined
  disabled: boolean
  isStyled: boolean
  readOnly: boolean
  size: Size
  variant: RatingVariant
}): string | undefined {
  return joinClasses(
    isStyled && styles.rating,
    variant === 'outline' && styles.outline,
    isStyled && styles[size],
    isStyled && !readOnly && !disabled && styles.interactive,
    isStyled && disabled && styles.disabled,
    className,
  )
}

export const Rating = forwardRef<HTMLFieldSetElement, RatingProps>(
  (
    {
      allowHalf = false,
      className,
      clearable = false,
      colorScheme = 'warning',
      defaultValue,
      disabled = false,
      emptyIcon,
      icon,
      max = 5,
      name,
      onValueChange,
      readOnly = false,
      required = false,
      size = 'md',
      style,
      value: valueProp,
      variant = 'solid',
      ...rest
    }: RatingProps,
    ref: ForwardedRef<HTMLFieldSetElement>,
  ): ReactNode => {
    const field = useFieldContext()
    const generatedName = useId()
    const rating = useRating({
      allowHalf,
      defaultValue,
      max,
      onValueChange,
      value: valueProp,
    })
    const isStyled = variant !== 'unstyled'
    const text = useLabels('rating', DEFAULT_LABELS)
    const fieldLabel = field?.controlId === rest.id ? field?.labelId : undefined
    const labelledBy = rest['aria-labelledby'] ?? (rest['aria-label'] ? undefined : fieldLabel)
    const filledIcon = icon ?? (variant === 'outline' ? OUTLINE_ICON : SOLID_ICON)
    const resolvedEmptyIcon = emptyIcon ?? icon ?? EMPTY_ICON
    const positions = [...new Array(max).keys()].map((index) => index + 1)
    const { preview, setHover, setValue, value } = rating
    const resolvedName = name ?? generatedName
    const classes = ratingClasses({ className, disabled, isStyled, readOnly, size, variant })
    const colorVars = {
      '--rating-edge': `var(--plume-color-${colorScheme}-text)`,
      '--rating-solid': `var(--plume-color-${colorScheme}-solid)`,
      '--rating-empty': 'var(--plume-border-strong)',
      ...style,
    } as CSSProperties
    const invalid = rest['aria-invalid'] === true || rest['aria-invalid'] === 'true'

    return (
      <fieldset
        {...rest}
        aria-labelledby={labelledBy}
        aria-required={(required && !readOnly) || undefined}
        className={classes}
        data-disabled={disabled ? '' : undefined}
        data-invalid={invalid ? '' : undefined}
        data-plume-rating=""
        data-readonly={readOnly ? '' : undefined}
        disabled={disabled}
        onPointerLeave={readOnly ? undefined : () => setHover(undefined)}
        ref={ref}
        role={readOnly ? undefined : 'radiogroup'}
        style={colorVars}
      >
        {readOnly ? (
          <span data-plume-rating-value-text="" style={visuallyHidden}>
            {text.readOnly(value, max)}
          </span>
        ) : null}
        {positions.map((position) => (
          <RatingItem
            allowHalf={allowHalf}
            clearable={clearable}
            emptyIcon={resolvedEmptyIcon}
            filledIcon={filledIcon}
            isStyled={isStyled}
            key={position}
            labels={text}
            max={max}
            name={resolvedName}
            position={position}
            readOnly={readOnly}
            setHover={setHover}
            setValue={setValue}
            shown={readOnly ? value : preview}
            value={value}
          />
        ))}
      </fieldset>
    )
  },
)

Rating.displayName = 'Rating'
