import type { ComponentPropsWithoutRef, ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { Heading } from '../../presentation/heading/heading'
import type { HeadingLevel } from '../../presentation/heading/heading'
import { Text } from '../../presentation/text/text'
import styles from './pageheader.module.css'

export type PageHeaderTitleTag = `h${HeadingLevel}`

export type PageHeaderVariant = 'default' | 'unstyled'

export interface PageHeaderOwnProps {
  /**
   * What the page can do, usually a few `Button`s. They sit at the end of the title, and go below
   * it on a narrow screen.
   *
   * @since 1.2
   */
  actions?: ReactNode
  /**
   * What the page is for, in a sentence, under the title.
   *
   * @since 1.2
   */
  description?: ReactNode
  /**
   * The title of the page.
   *
   * @since 1.2
   */
  title: ReactNode
  /**
   * The heading level of the title. Use `h1` for the title of the page, and a lower one when the
   * header is the start of a section. It doesn't change how the title looks.
   *
   * @since 1.2
   * @default 'h1'
   */
  titleAs?: PageHeaderTitleTag
  /**
   * `unstyled` drops the Loica styles, also from the title and the description, so you can bring
   * your own. The header has no other variant.
   *
   * @since 1.2
   * @default 'default'
   */
  variant?: PageHeaderVariant
}

export type PageHeaderProps = Omit<ComponentPropsWithoutRef<'header'>, 'title'> & PageHeaderOwnProps

/**
 * The top of a page: its title, a description and the actions that belong to it.
 *
 * @since 1.2
 */
export const PageHeader = forwardRef<HTMLElement, PageHeaderProps>(
  (
    { actions, className, description, title, titleAs = 'h1', variant = 'default', ...rest }: PageHeaderProps,
    ref: ForwardedRef<HTMLElement>,
  ) => {
    const isStyled = variant !== 'unstyled'

    return (
      <header
        className={joinClasses(isStyled && styles.pageheader, className)}
        data-loica-pageheader=""
        ref={ref}
        {...rest}
      >
        <div data-loica-pageheader-text="">
          <Heading
            data-loica-pageheader-title=""
            level={Number(titleAs.slice(1)) as HeadingLevel}
            size={3}
            variant={variant}
          >
            {title}
          </Heading>
          {description ? (
            <Text data-loica-pageheader-description="" muted variant={isStyled ? 'body' : 'unstyled'}>
              {description}
            </Text>
          ) : null}
        </div>
        {actions ? (
          <div data-loica-pageheader-actions="">
            {actions}
          </div>
        ) : null}
      </header>
    )
  },
)

PageHeader.displayName = 'PageHeader'
