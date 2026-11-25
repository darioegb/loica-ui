import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import type { ColorScheme, Size } from '../../../theme'
import type { ButtonProps } from '../../interaction/button'

export type RichTextEditorVariant = 'outline' | 'filled' | 'underline' | 'unstyled'

/**
 * The texts of the editor: the name of the editable area (`editor`), the toolbar and each of its buttons and menus
 * (`font`, `size`, `link`...) and the options of the font, size and alignment controls.
 */
export interface RichTextEditorLabels {
  editor: string
  toolbar: string
  bold: string
  italic: string
  underline: string
  code: string
  link: string
  linkAddress: string
  applyLink: string
  removeLink: string
  paragraph: string
  heading1: string
  heading2: string
  heading3: string
  quote: string
  codeBlock: string
  bullet: string
  ordered: string
  font: string
  fontDefault: string
  fontSans: string
  fontSerif: string
  fontMono: string
  size: string
  sizeDefault: string
  sizeSmall: string
  sizeLarge: string
  sizeHuge: string
  alignStart: string
  alignCenter: string
  alignEnd: string
  alignJustify: string
  undo: string
  redo: string
}

export interface RichTextEditorOwnProps {
  /**
   * The parts, to write the structure yourself: a `RichTextEditorToolbar` with the groups and tools you want, and the
   * `RichTextEditorContent`. Without children the editor renders a toolbar and the content. Its `ref`, `placeholder` and native
   * attributes, such as the `id` a `Field` gives it, reach the `RichTextEditorContent` either way.
   */
  children?: ReactNode
  /**
   * Color scheme of the focus ring and of the pressed buttons of the toolbar, from the theme palette.
   *
   * @default 'secondary'
   */
  colorScheme?: ColorScheme
  /**
   * The content when the editor is controlled, as HTML. Pair it with `onValueChange`. A value that differs from what
   * the editor last reported replaces the content and clears the undo history.
   */
  value?: string
  /** The content at first, as HTML, when the editor is not controlled. */
  defaultValue?: string
  /**
   * Disables the editor and its toolbar: the content can't be focused or changed.
   *
   * @default false
   */
  disabled?: boolean
  /** Called with the HTML of the content after every change. */
  onValueChange?: (value: string) => void
  /** Text shown while the editor is empty. */
  placeholder?: string
  /**
   * Lets the user read, focus and select the content but not change it, and hides the toolbar.
   *
   * @default false
   */
  readOnly?: boolean
  /**
   * Marks the editor as required, for a screen reader and for `Field`.
   *
   * @default false
   */
  required?: boolean
  /**
   * Size of the toolbar and of the text.
   *
   * @default 'md'
   */
  size?: Size
  /**
   * Shows the formatting toolbar above the content, when the editor has no children.
   *
   * @default true
   */
  toolbar?: boolean
  /**
   * Visual variant. `unstyled` drops the Loica styles so you can bring your own.
   *
   * @default 'outline'
   */
  variant?: RichTextEditorVariant
}

export type RichTextEditorProps = Omit<
  ComponentPropsWithoutRef<'div'>,
  'children' | 'contentEditable' | 'defaultValue' | 'dangerouslySetInnerHTML' | 'onChange' | 'role'
> &
  RichTextEditorOwnProps

export type RichTextEditorToolName =
  | 'alignCenter'
  | 'alignEnd'
  | 'alignJustify'
  | 'alignStart'
  | 'bold'
  | 'bullet'
  | 'code'
  | 'codeBlock'
  | 'font'
  | 'heading1'
  | 'heading2'
  | 'heading3'
  | 'italic'
  | 'link'
  | 'ordered'
  | 'paragraph'
  | 'quote'
  | 'redo'
  | 'size'
  | 'underline'
  | 'undo'

export interface RichTextEditorToolOwnProps {
  /**
   * One of the tools of the editor: the formatting buttons, `link`, the alignments, the block types, `undo` and
   * `redo`, and the `font` and `size` menus. Its icon, text and pressed state come with it, and your `onClick` runs
   * after it. Leave it out to make a button of your own, with `children` and `onClick`.
   */
  name?: RichTextEditorToolName
}

export type RichTextEditorToolProps = Omit<
  ButtonProps,
  'colorScheme' | 'href' | 'rel' | 'shape' | 'size' | 'target' | 'variant'
> &
  RichTextEditorToolOwnProps

export type RichTextEditorToolbarProps = ComponentPropsWithoutRef<'div'>

export type RichTextEditorGroupProps = ComponentPropsWithoutRef<'span'>

export interface RichTextEditorContentOwnProps {
  /** Text shown while the editor is empty. */
  placeholder?: string
}

export type RichTextEditorContentProps = Omit<
  ComponentPropsWithoutRef<'div'>,
  'children' | 'contentEditable' | 'dangerouslySetInnerHTML' | 'defaultValue' | 'onChange' | 'role'
> &
  RichTextEditorContentOwnProps
