'use client'

import type { ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import { OverlayClose, type OverlayCloseProps } from '../../../overlay/overlay-close'
import { useFileUploadContext, useFileUploadItemContext } from './fileupload-context'
import styles from './fileupload.module.css'

export type FileUploadRemoveProps = OverlayCloseProps

/**
 * The button that removes the file. Its name is the `fileUpload.remove` text of the `LocaleProvider` unless you give
 * it a `label`, an element given as `children`, such as a `Button`, becomes the button, and it is
 * not there when the FileUpload is disabled or read only.
 */
export const FileUploadRemove = forwardRef<HTMLElement, FileUploadRemoveProps>(
  ({ label, ...props }: FileUploadRemoveProps, ref: ForwardedRef<HTMLElement>): ReactNode => {
    const { inactive, isStyled, labels, remove } = useFileUploadContext('FileUploadRemove')
    const { file } = useFileUploadItemContext('FileUploadRemove')
    if (inactive) return null

    return (
      <OverlayClose
        {...props}
        closeClassName={isStyled ? styles.remove : undefined}
        data-loica-fileupload-remove=""
        label={label ?? labels.remove(file)}
        onClose={() => remove(file)}
        ref={ref}
      />
    )
  },
)

FileUploadRemove.displayName = 'FileUploadRemove'
