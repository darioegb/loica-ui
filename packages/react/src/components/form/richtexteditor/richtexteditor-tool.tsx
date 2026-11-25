'use client'

import type { ForwardedRef, MouseEvent as ReactMouseEvent, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { CheckIcon, ChevronDownIcon } from '../../../overlay/icons'
import type { Size } from '../../../theme'
import { Button } from '../../interaction/button'
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '../../interaction/dropdown'
import { useRichTextEditorContext } from './richtexteditor-context'
import { resolveTool } from './richtexteditor-tools'
import type { RichTextEditorToolProps } from './richtexteditor-types'
import styles from './richtexteditor.module.css'

/**
 * A button of the toolbar. With a `name` it is one of the tools of the editor, with its icon, its text and its pressed
 * state; without one it is a button of your own, with `children` and `onClick`. Either way it takes part in the
 * arrow-key navigation of the toolbar.
 * @since 1.5
 */
export const RichTextEditorTool = forwardRef<HTMLButtonElement, RichTextEditorToolProps>(
  (
    { className, disabled, name, onClick, ...rest }: RichTextEditorToolProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ): ReactNode => {
    const context = useRichTextEditorContext('RichTextEditorTool')
    const { controller, disabled: locked, isStyled, size } = context
    const tool = name ? resolveTool(name, context) : undefined
    const controlSize: Size = size === 'lg' ? 'md' : 'sm'
    const isDisabled = disabled || locked || tool?.disabled
    const shared = {
      'data-loica-richtexteditor-tool': '',
      onMouseDown: (event: ReactMouseEvent) => event.preventDefault(),
      size: controlSize,
      variant: 'ghost' as const,
    }

    if (tool?.menu) {
      return (
        <Dropdown size={size} variant="outline">
          <DropdownTrigger>
            <Button
              ref={ref}
              {...rest}
              {...shared}
              aria-label={`${tool.label}: ${tool.menu.current}`}
              className={joinClasses(isStyled && styles.menuTrigger, className)}
              disabled={isDisabled}
              iconRight={<ChevronDownIcon />}
              label={tool.menu.current}
              onClick={(event) => {
                controller?.captureSelection()
                onClick?.(event)
              }}
            />
          </DropdownTrigger>
          <DropdownMenu aria-label={tool.label}>
            {tool.menu.items.map((item) => (
              <DropdownItem
                key={item.key}
                aria-current={item.active || undefined}
                icon={item.active ? <CheckIcon /> : <span aria-hidden="true" />}
                onSelect={item.run}
              >
                {item.label}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      )
    }

    return (
      <Button
        ref={ref}
        {...(tool
          ? {
              'aria-label': tool.label,
              'aria-pressed': tool.pressed,
              iconLeft: tool.icon,
              title: tool.label,
            }
          : {})}
        {...rest}
        {...shared}
        className={className}
        disabled={isDisabled}
        onClick={(event) => {
          tool?.run?.()
          onClick?.(event)
        }}
      />
    )
  },
)

RichTextEditorTool.displayName = 'RichTextEditorTool'
