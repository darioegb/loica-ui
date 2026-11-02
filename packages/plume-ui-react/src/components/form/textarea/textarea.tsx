import type { ForwardedRef } from 'react'
import { forwardRef } from 'react'
import { isTextareaInvalid, textareaColorVars, textareaFieldClasses } from './textarea-styles'
import type { TextareaProps } from './textarea-types'
import { TextareaWithCount } from './textarea-with-count'

export type {
  TextareaLabels,
  TextareaOwnProps,
  TextareaProps,
  TextareaResize,
  TextareaVariant,
} from './textarea-types'

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      colorScheme = 'secondary',
      disabled = false,
      resize = 'vertical',
      rows = 3,
      shape = 'rounded',
      showCount = false,
      size = 'md',
      style,
      variant = 'outline',
      ...rest
    }: TextareaProps,
    ref: ForwardedRef<HTMLTextAreaElement>,
  ) => {
    if (showCount) {
      return (
        <TextareaWithCount
          className={className}
          colorScheme={colorScheme}
          disabled={disabled}
          ref={ref}
          resize={resize}
          rows={rows}
          shape={shape}
          size={size}
          style={style}
          variant={variant}
          {...rest}
        />
      )
    }

    const invalid = isTextareaInvalid(rest['aria-invalid'])

    return (
      <textarea
        {...rest}
        className={textareaFieldClasses({
          className,
          disabled,
          invalid,
          resize,
          shape,
          size,
          variant,
        })}
        data-disabled={disabled ? '' : undefined}
        data-invalid={invalid ? '' : undefined}
        data-plume-textarea-field=""
        disabled={disabled}
        ref={ref}
        rows={rows}
        style={textareaColorVars(invalid ? 'error' : colorScheme, style)}
      />
    )
  },
)

Textarea.displayName = 'Textarea'
