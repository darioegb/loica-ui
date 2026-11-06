import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { hasPart } from '../../../overlay/has-part'
import type { ComponentProps, Size } from '../../../theme'
import { CardBody } from './card-body'
import { CardFooter } from './card-footer'
import { CardHeader } from './card-header'
import styles from './card.module.css'

export interface CardOwnProps {
  /**
   * The text of the Card, rendered in a `CardBody`, so it can be written without children:
   * `<Card title="Plan" description="10 projects and 5 members." />`. `children` without Card parts
   * go in the same body, after it.
   */
  description?: ReactNode
  /**
   * Size of the Card: the padding of its parts and the size of its text.
   *
   * @default 'md'
   */
  size?: Size
  /** The title of the Card, rendered in a `CardHeader` before the rest. */
  title?: ReactNode
  /**
   * Visual variant. `elevated` floats the Card with a shadow, `outline` draws its border and
   * divides its parts, and `filled` gives it a muted background. `unstyled` drops the Loica styles
   * so you can bring your own.
   *
   * @default 'elevated'
   */
  variant?: CardVariant
}

export type CardVariant = 'elevated' | 'outline' | 'filled' | 'unstyled'

type CardRootAttributes = Pick<
  HTMLAttributes<HTMLDivElement>,
  'aria-label' | 'aria-labelledby' | 'children' | 'hidden' | 'id' | 'role'
>

export type CardProps = Omit<ComponentProps, 'index'> & CardRootAttributes & CardOwnProps

const CARD_PARTS = [CardBody, CardFooter, CardHeader]

function cardContent(
  children: ReactNode,
  title: ReactNode,
  description: ReactNode,
): ReactNode {
  if (title == null && description == null) return children
  const header = title == null ? null : <CardHeader>{title}</CardHeader>
  if (hasPart(children, CARD_PARTS)) {
    return (
      <>
        {header}
        {description == null ? null : <CardBody>{description}</CardBody>}
        {children}
      </>
    )
  }
  return (
    <>
      {header}
      {description == null && children == null ? null : (
        <CardBody>
          {description}
          {children}
        </CardBody>
      )}
    </>
  )
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      className,
      description,
      size = 'md',
      style,
      title,
      variant = 'elevated',
      ...rest
    }: CardProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    const isStyled = variant !== 'unstyled'
    const classes = joinClasses(
      isStyled && styles.card,
      isStyled && styles[size],
      isStyled && styles[variant],
      className,
    )

    return (
      <div className={classes} data-loica-card="" ref={ref} style={style} {...rest}>
        {cardContent(children, title, description)}
      </div>
    )
  },
)

Card.displayName = 'Card'
