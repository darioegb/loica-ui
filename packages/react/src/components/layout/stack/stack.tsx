import type { ComponentPropsWithoutRef, ElementType, ForwardedRef } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { Breakpoints, Spaces } from '../../../theme'
import styles from './stack.module.css'

export type StackElement =
  | 'article'
  | 'aside'
  | 'div'
  | 'footer'
  | 'form'
  | 'header'
  | 'main'
  | 'nav'
  | 'ol'
  | 'section'
  | 'ul'

export type StackDirection = 'column' | 'row'

export type StackAlign = 'baseline' | 'center' | 'end' | 'start' | 'stretch'

export type StackJustify = 'between' | 'center' | 'end' | 'start'

export type StackVariant = 'default' | 'unstyled'

export interface StackOwnProps {
  /**
   * How the children line up on the cross axis: across a `column`, and up and down in a `row`.
   * Without it they stretch.
   *
   * @since 1.2
   */
  align?: StackAlign
  /**
   * The element it renders, for the landmark or the list the content is. A `ul` or an `ol` has no
   * bullets or numbers, and keeps its `list` role for assistive technology.
   *
   * @since 1.2
   * @default 'div'
   */
  as?: StackElement
  /**
   * Whether the children go down, in a `column`, or side by side, in a `row`.
   *
   * @since 1.2
   * @default 'column'
   */
  direction?: StackDirection
  /**
   * The space between the children, as a key of the `spaces` of the theme: `1` is `0.25rem`, `4`
   * is `1rem`.
   *
   * @since 1.2
   * @default 4
   */
  gap?: keyof Spaces
  /**
   * How the children share the free space on the main axis. Without it they start at the
   * beginning; `between` pushes the first to the start and the last to the end.
   *
   * @since 1.2
   */
  justify?: StackJustify
  /**
   * A `row` becomes a `column` on a screen narrower than this breakpoint of the theme. It does
   * nothing on a `column`. The widths are the ones of the default theme.
   *
   * @since 1.2
   */
  stackBelow?: keyof Breakpoints
  /**
   * `unstyled` drops the Loica styles, so you can lay the children out yourself. The `data-*`
   * attributes stay.
   *
   * @since 1.2
   * @default 'default'
   */
  variant?: StackVariant
  /**
   * Lets the children go to the next line when they don't fit in a `row`.
   *
   * @since 1.2
   * @default false
   */
  wrap?: boolean
}

export type StackProps = ComponentPropsWithoutRef<'div'> & StackOwnProps

const isList = (element: StackElement): boolean => element === 'ul' || element === 'ol'

/**
 * Lines its children up in a column or a row, with the same space between them. It is the layout
 * you would write with `display: flex` and a `gap`, with the values of the theme.
 *
 * @since 1.2
 */
export const Stack = forwardRef<HTMLDivElement, StackProps>(
  (
    {
      align,
      as = 'div',
      className,
      direction = 'column',
      gap = 4,
      justify,
      stackBelow,
      variant = 'default',
      wrap = false,
      ...rest
    }: StackProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    const Element = as as ElementType
    return (
      <Element
        className={joinClasses(variant !== 'unstyled' && styles.stack, className)}
        data-align={align}
        data-direction={direction}
        data-gap={gap}
        data-justify={justify}
        data-loica-stack=""
        data-stack-below={stackBelow}
        data-wrap={wrap ? '' : undefined}
        ref={ref}
        role={isList(as) ? 'list' : undefined}
        {...rest}
      />
    )
  },
)

Stack.displayName = 'Stack'
