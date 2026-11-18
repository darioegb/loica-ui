import type {
  ChangeEvent,
  ComponentPropsWithoutRef,
  CSSProperties,
  ForwardedRef,
  ReactNode,
} from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ColorScheme, Size } from '../../../theme'
import { schemeVar } from '../../../theme'
import { RadioGroup, type RadioGroupOrientation } from '../radio'
import { SegmentedControlItem } from './segmentedcontrol-item'
import styles from './segmentedcontrol.module.css'

export type SegmentedControlVariant = 'solid' | 'outline' | 'unstyled'

export interface SegmentedControlOption {
  /** Disables this option. */
  disabled?: boolean
  /** What the segment shows. Defaults to the `value`. */
  label?: ReactNode
  /** Value of the option, which `value` and `onValueChange` use. */
  value: string
}

export interface SegmentedControlOwnProps {
  /**
   * Color scheme from the theme palette, custom schemes included, for the selected segment.
   *
   * @default 'primary'
   */
  colorScheme?: ColorScheme
  /** Value of the option selected at first, when the control is uncontrolled. */
  defaultValue?: string
  /**
   * Disables every segment.
   *
   * @default false
   */
  disabled?: boolean
  /** Name of the radios of the control, which a form submits. A generated one is used when it is not set. */
  name?: string
  /** Called with the value of the option the user selects. */
  onValueChange?: (value: string, event: ChangeEvent<HTMLInputElement>) => void
  /**
   * The options, as `{ value, label, disabled }`. Without `children` the control builds a `SegmentedControlItem`
   * for each one; with them, the items you write are the options.
   */
  options?: SegmentedControlOption[]
  /**
   * Direction in which the segments are laid out.
   *
   * @default 'horizontal'
   */
  orientation?: RadioGroupOrientation
  /**
   * Keeps the selection without letting the user change it.
   *
   * @default false
   */
  readOnly?: boolean
  /**
   * Marks the control as required in a form.
   *
   * @default false
   */
  required?: boolean
  /**
   * Size of the segments.
   *
   * @default 'md'
   */
  size?: Size
  /** Value of the selected option, for a controlled control. Pair it with `onValueChange`. */
  value?: string
  /**
   * Visual variant. `solid` fills the selected segment on a muted track, `outline` draws the track with a border and
   * tints the selected segment, and `unstyled` drops the Loica styles but keeps the structure that makes it work.
   *
   * @default 'solid'
   */
  variant?: SegmentedControlVariant
}

export type SegmentedControlProps = Omit<
  ComponentPropsWithoutRef<'div'>,
  'defaultValue' | 'onChange'
> &
  SegmentedControlOwnProps

const segmentedControlColorVars = (colorScheme: ColorScheme, style?: CSSProperties): CSSProperties =>
  ({
    '--segmentedcontrol-solid': schemeVar(colorScheme, 'solid'),
    '--segmentedcontrol-contrast': schemeVar(colorScheme, 'solid-contrast'),
    '--segmentedcontrol-tint': schemeVar(colorScheme, 'tint-strong'),
    '--segmentedcontrol-tint-text': schemeVar(colorScheme, 'tint-text'),
    ...style,
  }) as CSSProperties

/**
 * A short list of options, side by side, of which one is selected: "Day / Week / Month", the alignment of a text.
 * It is a `radiogroup` of native radios, so it is one tab stop, the arrow keys move the selection (and follow the
 * direction of the page), and a form submits its `name` and `value`.
 *
 * @since 1.3
 */
export const SegmentedControl = forwardRef<HTMLDivElement, SegmentedControlProps>(
  (
    {
      children,
      className,
      colorScheme = 'primary',
      options,
      orientation = 'horizontal',
      size = 'md',
      style,
      variant = 'solid',
      ...rest
    }: SegmentedControlProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    const isStyled = variant !== 'unstyled'
    return (
      <RadioGroup
        {...rest}
        className={joinClasses(
          isStyled && styles.segmentedcontrol,
          isStyled && styles[variant],
          isStyled && styles[size],
          className,
        )}
        data-loica-segmentedcontrol=""
        orientation={orientation}
        ref={ref}
        style={segmentedControlColorVars(colorScheme, style)}
        variant="unstyled"
      >
        {children ??
          options?.map((option) => (
            <SegmentedControlItem disabled={option.disabled} key={option.value} value={option.value}>
              {option.label ?? option.value}
            </SegmentedControlItem>
          ))}
      </RadioGroup>
    )
  },
)

SegmentedControl.displayName = 'SegmentedControl'
