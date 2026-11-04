'use client'

import type { ComponentPropsWithoutRef, ForwardedRef, MouseEvent, ReactNode } from 'react'
import { forwardRef, useContext, useId } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { OverlayClose } from '../../../overlay/overlay-close'
import { useLabels } from '../../../locale/locale-provider'
import type { ColorScheme, Shape, Size } from '../../../theme'
import { tagColorVars } from '../shared/tag-vars'
import tag from '../shared/tag.module.css'
import { ChipRemoveLabelContext, type ChipLabels } from './chip-context'
import styles from './chip.module.css'

export type { ChipLabels } from './chip-context'

export type ChipVariant = 'solid' | 'outline' | 'subtle' | 'unstyled'

export interface ChipOwnProps {
  /**
   * Color scheme from the theme palette, including custom schemes added to it.
   *
   * @default 'secondary'
   */
  colorScheme?: ColorScheme
  /**
   * Dims the Chip and disables its remove button.
   *
   * @default false
   */
  disabled?: boolean
  /**
   * An icon or an image before the text. It is decorative, so it is hidden from screen readers:
   * give an image `alt=""`.
   */
  icon?: ReactNode
  /**
   * The content of the Chip, as a prop, so it can be written without children:
   * `<Chip label="React" />`. `children` take its place when both are set.
   */
  label?: ReactNode
  /** Shows a remove button, and is called when it is clicked. */
  onRemove?: (event: MouseEvent<HTMLButtonElement>) => void
  /**
   * Corners of the Chip.
   *
   * @default 'pill'
   */
  shape?: Shape
  /**
   * Size of the Chip.
   *
   * @default 'md'
   */
  size?: Size
  /**
   * Visual variant. `subtle` tints the Chip, `solid` fills it and `outline` only draws its border.
   * `unstyled` drops the Plume styles so you can bring your own.
   *
   * @default 'subtle'
   */
  variant?: ChipVariant
}

export type ChipProps = ComponentPropsWithoutRef<'span'> & ChipOwnProps

const DEFAULT_LABELS: ChipLabels = { remove: 'Remove' }

interface ChipRemoveButtonProps {
  disabled: boolean
  isStyled: boolean
  labelId: string
  onRemove: (event: MouseEvent<HTMLButtonElement>) => void
}

function ChipRemoveButton({
  disabled,
  isStyled,
  labelId,
  onRemove,
}: Readonly<ChipRemoveButtonProps>): ReactNode {
  const text = useLabels('chip', DEFAULT_LABELS)
  const exactLabel = useContext(ChipRemoveLabelContext)
  const removeId = useId()

  return (
    <OverlayClose
      aria-labelledby={exactLabel ? undefined : `${removeId} ${labelId}`}
      closeClassName={isStyled ? styles.remove : undefined}
      data-disabled={disabled ? '' : undefined}
      data-plume-chip-remove=""
      disabled={disabled}
      id={removeId}
      label={exactLabel ?? text.remove}
      onClose={onRemove}
    />
  )
}

export const Chip = forwardRef<HTMLSpanElement, ChipProps>(
  (
    {
      children,
      className = '',
      colorScheme = 'secondary',
      disabled = false,
      icon,
      label,
      onRemove,
      shape = 'pill',
      size = 'md',
      style,
      variant = 'subtle',
      ...rest
    }: ChipProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ) => {
    const isStyled = variant !== 'unstyled'
    const labelId = useId()
    const classes = joinClasses(
      isStyled && styles.chip,
      isStyled && tag[size],
      isStyled && tag[shape],
      isStyled && tag[variant],
      isStyled && disabled && styles.disabled,
      className,
    )

    return (
      <span
        className={classes}
        data-plume-chip=""
        ref={ref}
        style={tagColorVars('chip', colorScheme, style)}
        {...rest}
      >
        {icon ? (
          <span
            aria-hidden="true"
            className={isStyled ? styles.icon : undefined}
            data-plume-chip-icon=""
          >
            {icon}
          </span>
        ) : null}
        <span className={isStyled ? styles.label : undefined} data-plume-chip-label="" id={labelId}>
          {children ?? label}
        </span>
        {onRemove ? (
          <ChipRemoveButton
            disabled={disabled}
            isStyled={isStyled}
            labelId={labelId}
            onRemove={onRemove}
          />
        ) : null}
      </span>
    )
  },
)

Chip.displayName = 'Chip'
