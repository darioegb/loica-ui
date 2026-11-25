'use client'

import type { ForwardedRef, ReactNode } from 'react'
import { forwardRef, useCallback, useContext } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { useFieldContext } from '../field/field-context'
import {
  RichTextEditorContentDefaultsContext,
  useRichTextEditorContext,
} from './richtexteditor-context'
import type { RichTextEditorContentProps } from './richtexteditor-types'
import styles from './richtexteditor.module.css'

/**
 * The editable area. It is the element a `Field` labels. It takes the `ref`, the `placeholder` and the native
 * attributes of the `RichTextEditor` as its defaults, and its own props win over them.
 * @since 1.5
 */
export const RichTextEditorContent = forwardRef<HTMLDivElement, RichTextEditorContentProps>(
  (props: RichTextEditorContentProps, ref: ForwardedRef<HTMLDivElement>): ReactNode => {
    const { disabled, invalid, isStyled, labels, readOnly, required, setEditable } =
      useRichTextEditorContext('RichTextEditorContent')
    const defaults = useContext(RichTextEditorContentDefaultsContext)
    const { className, placeholder, ...rest } = {
      ...defaults?.props,
      ...props,
    }
    const field = useFieldContext()
    const fieldLabel = field?.controlId === rest.id ? field?.labelId : undefined
    const labelledBy = rest['aria-labelledby'] ?? (rest['aria-label'] ? undefined : fieldLabel)
    const locked = readOnly || disabled

    const inherited = defaults?.ref
    const setRefs = useCallback(
      (node: HTMLDivElement | null) => {
        setEditable(node)
        for (const target of [inherited, ref]) {
          if (typeof target === 'function') target(node)
          else if (target) target.current = node
        }
      },
      [inherited, ref, setEditable],
    )

    return (
      <div
        ref={setRefs}
        aria-disabled={disabled || undefined}
        aria-invalid={invalid || undefined}
        aria-label={rest['aria-label'] ?? (labelledBy ? undefined : labels.editor)}
        aria-labelledby={labelledBy}
        aria-multiline="true"
        aria-placeholder={placeholder}
        aria-readonly={readOnly || undefined}
        aria-required={required || undefined}
        className={joinClasses(isStyled && styles.field, className)}
        contentEditable={!locked}
        data-loica-richtexteditor-field=""
        data-placeholder={placeholder}
        role="textbox"
        spellCheck
        suppressContentEditableWarning
        tabIndex={disabled ? undefined : 0}
        {...rest}
      />
    )
  },
)

RichTextEditorContent.displayName = 'RichTextEditorContent'
