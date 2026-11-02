'use client'

import type { ComponentPropsWithoutRef, ForwardedRef } from 'react'
import { forwardRef } from 'react'
import { get__Name__ContentId, use__Name__Context } from './__slug__-context'
import styles from './__slug__.module.css'

export type __Name__ContentProps = ComponentPropsWithoutRef<'div'>

export const __Name__Content = forwardRef<HTMLDivElement, __Name__ContentProps>(
  (
    { children, className = '', id, ...rest }: __Name__ContentProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    const { baseId, isStyled, size } = use__Name__Context()
    const classes = [isStyled && styles.content, isStyled && styles[size], className]
      .filter(Boolean)
      .join(' ')

    return (
      <div
        className={classes}
        id={id ?? get__Name__ContentId(baseId)}
        ref={ref}
        {...rest}
      >
        {children}
      </div>
    )
  },
)

__Name__Content.displayName = '__Name__Content'
