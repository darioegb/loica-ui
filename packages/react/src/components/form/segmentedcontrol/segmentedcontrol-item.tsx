'use client'

import type { ComponentPropsWithoutRef, ForwardedRef } from 'react'
import { forwardRef } from 'react'
import { Radio } from '../radio'
import { useRadioGroupContext } from '../radio/radio-group-context'

export interface SegmentedControlItemOwnProps {
  /**
   * Disables this segment.
   *
   * @default false
   */
  disabled?: boolean
  /** Value of the option, which the `value` and `onValueChange` of the `SegmentedControl` use. */
  value: string
}

export type SegmentedControlItemProps = ComponentPropsWithoutRef<'label'> &
  SegmentedControlItemOwnProps

/**
 * An option of a `SegmentedControl`: the segment, a label that holds the native radio and its `children`. The radio
 * covers the segment, invisible, so a click or a tap anywhere on it selects it. For a segment with only an icon, give
 * it an `aria-label`, which names the radio.
 *
 * @since 1.3
 */
export const SegmentedControlItem = forwardRef<HTMLLabelElement, SegmentedControlItemProps>(
  (
    {
      'aria-label': ariaLabel,
      children,
      disabled = false,
      value,
      ...rest
    }: SegmentedControlItemProps,
    ref: ForwardedRef<HTMLLabelElement>,
  ) => {
    const group = useRadioGroupContext()
    const isDisabled = disabled || Boolean(group?.disabled)
    return (
      <label
        {...rest}
        data-checked={group?.value === value ? '' : undefined}
        data-disabled={isDisabled ? '' : undefined}
        data-loica-segmentedcontrol-item=""
        ref={ref}
      >
        <Radio
          aria-label={ariaLabel}
          data-loica-segmentedcontrol-input=""
          disabled={disabled}
          value={value}
          variant="unstyled"
        />
        {children ?? value}
      </label>
    )
  },
)

SegmentedControlItem.displayName = 'SegmentedControlItem'
