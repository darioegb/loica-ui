import type { ComponentPropsWithoutRef, ElementType, ForwardedRef } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { Containers, Spaces } from '../../../theme'
import styles from './container.module.css'

export type ContainerElement =
  | 'article'
  | 'aside'
  | 'div'
  | 'footer'
  | 'header'
  | 'main'
  | 'nav'
  | 'section'

export type ContainerSize = keyof Containers | 'full'

export type ContainerVariant = 'default' | 'unstyled'

export interface ContainerOwnProps {
  /**
   * The element it renders, for the landmark the content is.
   *
   * @since 1.2
   * @default 'div'
   */
  as?: ContainerElement
  /**
   * The space on each side, so the content doesn't touch the edge of a narrow screen, as a key of
   * the `spaces` of the theme.
   *
   * @since 1.2
   * @default 4
   */
  gutter?: keyof Spaces
  /**
   * The widest it gets, as a key of the `containers` of the theme (`3xl` is `48rem`), or `full` for
   * no limit. It is as wide as its parent until then.
   *
   * @since 1.2
   * @default '3xl'
   */
  size?: ContainerSize
  /**
   * `unstyled` drops the Loica styles, so you can set the width yourself. The `data-*` attributes
   * stay.
   *
   * @since 1.2
   * @default 'default'
   */
  variant?: ContainerVariant
}

export type ContainerProps = ComponentPropsWithoutRef<'div'> & ContainerOwnProps

/**
 * Keeps its content to a readable width and centers it on the page, with a gutter on each side.
 *
 * @since 1.2
 */
export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  (
    { as = 'div', className, gutter = 4, size = '3xl', variant = 'default', ...rest }: ContainerProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    const Element = as as ElementType
    return (
      <Element
        className={joinClasses(variant !== 'unstyled' && styles.container, className)}
        data-gutter={gutter}
        data-loica-container=""
        data-size={size}
        ref={ref}
        {...rest}
      />
    )
  },
)

Container.displayName = 'Container'
