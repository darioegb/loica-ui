'use client'

import type { CSSProperties, ForwardedRef, InputHTMLAttributes, ReactNode } from 'react'
import { forwardRef, useMemo } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { mergeRefs } from '../../../overlay/trigger'
import type { ComponentProps } from '../../../theme'
import { Input } from '../input'
import { PickerTrigger } from '../shared/picker-trigger'
import { cssColor } from './color-math'
import { useColorPickerContext } from './colorpicker-context'
import styles from './colorpicker.module.css'
import { useDraft } from './use-draft'

export type ColorPickerFieldAttributes = Pick<
  InputHTMLAttributes<HTMLInputElement>,
  | 'aria-describedby'
  | 'aria-invalid'
  | 'aria-label'
  | 'aria-labelledby'
  | 'id'
  | 'name'
  | 'placeholder'
  | 'required'
>

export type ColorPickerInputProps = Omit<ComponentProps, 'index'> & ColorPickerFieldAttributes

/**
 * The field where the user types a color, with the button that opens the panel before it, which shows the color. The
 * field takes what is typed when it loses the focus or on <kbd>Enter</kbd>, and a clear field means no color. Its
 * `ref` goes to the native `<input>`, and its `className` and `style` to the box around it. It renders nothing when
 * the picker is `panel`.
 * @since 1.4
 */
export const ColorPickerInput = forwardRef<HTMLInputElement, ColorPickerInputProps>(
  (
    { className, style, ...rest }: ColorPickerInputProps,
    ref: ForwardedRef<HTMLInputElement>,
  ): ReactNode => {
    const {
      blocked,
      colorScheme,
      disabled,
      inputRef,
      isPanel,
      isStyled,
      labels,
      open,
      panelId,
      readOnly,
      setInput,
      shape,
      size,
      state,
      toggle,
      variant,
    } = useColorPickerContext('ColorPickerInput')
    const draft = useDraft(state.text, (text) => {
      if (text.trim() === '') state.clear()
      else state.setFromText(text)
    })
    const setRef = useMemo(() => mergeRefs(setInput, inputRef, ref), [inputRef, ref, setInput])
    if (isPanel) return null

    return (
      <Input
        {...rest}
        {...draft}
        autoComplete="off"
        className={className}
        colorScheme={colorScheme}
        data-loica-colorpicker-field=""
        disabled={disabled}
        elementBefore={
          <PickerTrigger
            controls={panelId}
            data-loica-colorpicker-trigger=""
            disabled={blocked}
            icon={
              <span
                className={joinClasses(isStyled && styles.preview)}
                data-empty={state.hasColor ? undefined : ''}
                data-loica-colorpicker-preview=""
                style={
                  {
                    '--colorpicker-current': state.hasColor ? cssColor(state.color) : 'transparent',
                  } as CSSProperties
                }
              />
            }
            label={labels.openColorPicker}
            onClick={toggle}
            open={open}
            unstyled={!isStyled}
          />
        }
        readOnly={readOnly}
        ref={setRef}
        shape={shape}
        size={size}
        spellCheck={false}
        style={style}
        type="text"
        variant={variant}
      />
    )
  },
)

ColorPickerInput.displayName = 'ColorPickerInput'
