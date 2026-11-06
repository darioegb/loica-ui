'use client'

import type { ButtonHTMLAttributes, ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { Button } from '../../interaction/button'
import { useDatePickerContext } from './datepicker-context'
import styles from './datepicker.module.css'

type PartProps = Omit<ComponentProps, 'index'>

export type DatePickerFooterProps = PartProps & Pick<HTMLAttributes<HTMLDivElement>, 'children'>
export type DatePickerCancelProps = PartProps &
  Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>
export type DatePickerApplyProps = PartProps &
  Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>

/** The footer button that closes the calendar and discards the change. */
export const DatePickerCancel = forwardRef<HTMLButtonElement, DatePickerCancelProps>(
  (
    { children, className, style }: DatePickerCancelProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ): ReactNode => {
    const { closeAndRestoreFocus, labels, variant } = useDatePickerContext('DatePickerCancel')
    const isStyled = variant !== 'unstyled'

    return (
      <Button
        className={joinClasses(isStyled && styles.footerButton, className)}
        data-loica-datepicker-cancel=""
        onClick={closeAndRestoreFocus}
        ref={ref}
        style={style}
        variant={isStyled ? 'ghost' : 'unstyled'}
      >
        {children ?? labels.cancel}
      </Button>
    )
  },
)

DatePickerCancel.displayName = 'DatePickerCancel'

/** The footer button that applies the change and closes the calendar. */
export const DatePickerApply = forwardRef<HTMLButtonElement, DatePickerApplyProps>(
  (
    { children, className, style }: DatePickerApplyProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ): ReactNode => {
    const { colorScheme, labels, onApply, variant } = useDatePickerContext('DatePickerApply')
    const isStyled = variant !== 'unstyled'

    return (
      <Button
        className={joinClasses(isStyled && styles.footerButtonApply, className)}
        colorScheme={colorScheme}
        data-loica-datepicker-apply=""
        onClick={onApply}
        ref={ref}
        style={style}
        variant={isStyled ? 'solid' : 'unstyled'}
      >
        {children ?? labels.apply}
      </Button>
    )
  },
)

DatePickerApply.displayName = 'DatePickerApply'

/** The row of actions shown with `showFooter`. */
export const DatePickerFooter = forwardRef<HTMLDivElement, DatePickerFooterProps>(
  (
    { children, className, style }: DatePickerFooterProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): ReactNode => {
    const { variant } = useDatePickerContext('DatePickerFooter')

    return (
      <div
        className={joinClasses(variant !== 'unstyled' && styles.footerActions, className)}
        data-loica-datepicker-footer=""
        ref={ref}
        style={style}
      >
        {children ?? (
          <>
            <DatePickerCancel />
            <DatePickerApply />
          </>
        )}
      </div>
    )
  },
)

DatePickerFooter.displayName = 'DatePickerFooter'
