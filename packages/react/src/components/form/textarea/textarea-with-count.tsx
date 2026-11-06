'use client'

import type { ChangeEvent, ForwardedRef, ReactNode } from 'react'
import { forwardRef, useId, useState } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { visuallyHidden } from '../../../overlay/visually-hidden'
import { useLabels } from '../../../locale/locale-provider'
import { isTextareaInvalid, textareaColorVars, textareaFieldClasses } from './textarea-styles'
import type { TextareaLabels, TextareaProps } from './textarea-types'
import styles from './textarea.module.css'

const DEFAULT_LABELS: TextareaLabels = {
  count: (count, max) => (max === undefined ? String(count) : `${count} / ${max}`),
  remaining: (remaining) => `${remaining} ${remaining === 1 ? 'character' : 'characters'} left`,
}

const isNearLimit = (remaining: number, max: number): boolean =>
  remaining <= Math.max(10, Math.ceil(max / 10))

type TextareaWithCountProps = Omit<
  TextareaProps,
  'colorScheme' | 'resize' | 'rows' | 'shape' | 'showCount' | 'size' | 'variant'
> &
  Required<Pick<TextareaProps, 'colorScheme' | 'resize' | 'rows' | 'shape' | 'size' | 'variant'>>

export const TextareaWithCount = forwardRef<HTMLTextAreaElement, TextareaWithCountProps>(
  (
    {
      className,
      colorScheme,
      disabled,
      onChange,
      resize,
      shape,
      size,
      style,
      variant,
      ...rest
    }: TextareaWithCountProps,
    ref: ForwardedRef<HTMLTextAreaElement>,
  ): ReactNode => {
    const text = useLabels('textarea', DEFAULT_LABELS)
    const countId = useId()
    const [typedLength, setTypedLength] = useState(() => String(rest.defaultValue ?? '').length)
    const count = rest.value === undefined ? typedLength : String(rest.value).length
    const remaining = rest.maxLength === undefined ? undefined : rest.maxLength - count
    const invalid = isTextareaInvalid(rest['aria-invalid'])
    const describedBy = [rest['aria-describedby'], countId].filter(Boolean).join(' ')
    const announcement =
      rest.maxLength !== undefined && remaining !== undefined && isNearLimit(remaining, rest.maxLength)
        ? text.remaining(Math.max(remaining, 0))
        : ''
    const isStyled = variant !== 'unstyled'
    const state = {
      'data-disabled': disabled ? '' : undefined,
      'data-invalid': invalid ? '' : undefined,
    }

    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>): void => {
      setTypedLength(event.target.value.length)
      onChange?.(event)
    }

    return (
      <div
        {...state}
        className={className}
        data-loica-textarea-group=""
        style={textareaColorVars(invalid ? 'error' : colorScheme, style)}
      >
        <textarea
          {...rest}
          {...state}
          aria-describedby={describedBy}
          className={textareaFieldClasses({
            disabled: Boolean(disabled),
            invalid,
            resize,
            shape,
            size,
            variant,
          })}
          data-loica-textarea-field=""
          disabled={disabled}
          onChange={handleChange}
          ref={ref}
        />
        <span
          {...state}
          className={joinClasses(isStyled && styles.count)}
          data-limit={remaining !== undefined && remaining <= 0 ? '' : undefined}
          data-loica-textarea-count=""
          id={countId}
        >
          {text.count(count, rest.maxLength)}
        </span>
        <output data-loica-textarea-status="" style={visuallyHidden}>
          {announcement}
        </output>
      </div>
    )
  },
)

TextareaWithCount.displayName = 'TextareaWithCount'
