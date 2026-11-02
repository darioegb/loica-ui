import type { ComponentPropsWithoutRef, ElementType, ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { Size } from '../../../theme'
import styles from './emptystate.module.css'

export type EmptyStateTitleTag = 'div' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

export type EmptyStateVariant = 'filled' | 'outline' | 'plain' | 'unstyled'

export interface EmptyStateOwnProps {
  /** What the user can do: usually a `Button` or a link. */
  action?: ReactNode
  /** Anything else, after the description and before the action: an illustration, a list... */
  children?: ReactNode
  /** Why it is empty, or what the user can do about it. */
  description?: ReactNode
  /** An SVG shown above the title. It is decorative and takes the size of the EmptyState. */
  icon?: ReactNode
  /**
   * Size of the EmptyState: its padding, its text and the size of the icon.
   *
   * @default 'md'
   */
  size?: Size
  /** What is empty, in a few words. */
  title?: ReactNode
  /**
   * Element of the title: a `div` or a heading level.
   *
   * @default 'div'
   */
  titleAs?: EmptyStateTitleTag
  /**
   * Visual variant. `plain` has no box, `outline` draws a dashed border and `filled` gives it a
   * muted background. `unstyled` drops the Plume styles so you can bring your own.
   *
   * @default 'plain'
   */
  variant?: EmptyStateVariant
}

export type EmptyStateProps = Omit<ComponentPropsWithoutRef<'div'>, 'title'> & EmptyStateOwnProps

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    {
      action,
      children,
      className,
      description,
      icon,
      size = 'md',
      style,
      title,
      titleAs = 'div',
      variant = 'plain',
      ...rest
    }: EmptyStateProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    const isStyled = variant !== 'unstyled'
    const Title: ElementType = titleAs

    return (
      <div
        className={joinClasses(
          isStyled && styles.emptystate,
          isStyled && styles[size],
          isStyled && styles[variant],
          className,
        )}
        data-plume-emptystate=""
        ref={ref}
        style={style}
        {...rest}
      >
        {icon ? (
          <span aria-hidden="true" className={isStyled ? styles.icon : undefined} data-plume-emptystate-icon="">
            {icon}
          </span>
        ) : null}
        {title ? (
          <Title className={isStyled ? styles.title : undefined} data-plume-emptystate-title="">
            {title}
          </Title>
        ) : null}
        {description ? (
          <p className={isStyled ? styles.description : undefined} data-plume-emptystate-description="">
            {description}
          </p>
        ) : null}
        {children}
        {action ? (
          <div className={isStyled ? styles.action : undefined} data-plume-emptystate-action="">
            {action}
          </div>
        ) : null}
      </div>
    )
  },
)

EmptyState.displayName = 'EmptyState'
