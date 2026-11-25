'use client'

import type { ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { useRichTextEditorContext } from './richtexteditor-context'
import type { RichTextEditorGroupProps } from './richtexteditor-types'
import styles from './richtexteditor.module.css'

/**
 * A set of related tools, separated from the next one by a line.
 * @since 1.5
 */
export const RichTextEditorGroup = forwardRef<HTMLSpanElement, RichTextEditorGroupProps>(
  (
    { className, ...rest }: RichTextEditorGroupProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ): ReactNode => {
    const { isStyled } = useRichTextEditorContext('RichTextEditorGroup')

    return (
      <span
        ref={ref}
        className={joinClasses(isStyled && styles.group, className)}
        data-loica-richtexteditor-group=""
        {...rest}
      />
    )
  },
)

RichTextEditorGroup.displayName = 'RichTextEditorGroup'
