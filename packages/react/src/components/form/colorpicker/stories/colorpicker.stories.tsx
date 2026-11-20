import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { LocaleProvider } from '../../../../locale'
import { defaultTheme } from '../../../../theme'
import { Field } from '../../field'
import {
  ColorPicker,
  ColorPickerArea,
  ColorPickerChannels,
  ColorPickerHue,
  ColorPickerInput,
  ColorPickerPanel,
  ColorPickerSwatches,
} from '..'

const colorSchemes = Object.keys(defaultTheme.colors)

const swatches = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7', '#0f172a']

/**
 * A field to type a color, or pick it in a panel with an area, sliders, fields for its channels, swatches and an
 * eyedropper. Use it where a user chooses a color (a theme, a label, a chart series) and the `<input type="color">` of
 * the browser, which looks different in every browser, can't be themed and has no opacity, doesn't fit.
 *
 * The value is a string in the **format** of the picker, so `onValueChange` gets `#4f46e5`, `rgb(79, 70, 229)` or
 * `hsl(243, 75%, 59%)`, and the field reads any of them, plus `#rgb` and `#rrggbbaa`. The field takes what is typed when
 * it loses the focus or on <kbd>Enter</kbd>, and an empty value means no color. A `<form>` submits the text of the
 * field with its `name`.
 *
 * The panel is an area where the pointer and the arrow keys (ten times as much with <kbd>Shift</kbd>) choose the
 * saturation and the brightness, a slider for the hue, fields for the numbers and, with the right props, a slider for
 * the opacity, swatches and an eyedropper.
 */
export default {
  title: 'Components/ColorPicker',
  component: ColorPicker,
  tags: ['autodocs'],
  parameters: {
    docs: {
      story: { inline: false, iframeHeight: 460 },
      toc: {
        title: 'On this page',
        disable: false,
      },
    },
    layout: 'padded',
  },
  argTypes: {
    alpha: { control: 'boolean' },
    children: { control: false },
    className: { control: 'text' },
    colorScheme: { control: 'select', options: colorSchemes },
    defaultValue: { control: 'text' },
    disabled: { control: 'boolean' },
    eyeDropper: { control: 'boolean' },
    format: { control: 'radio', options: ['hex', 'rgb', 'hsl'] },
    onValueChange: { control: false },
    panel: { control: 'boolean' },
    placeholder: { control: 'text' },
    readOnly: { control: 'boolean' },
    shape: { control: 'radio', options: ['rounded', 'pill'] },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    style: { control: false },
    swatches: { control: false },
    value: { control: false },
    variant: { control: 'radio', options: ['outline', 'filled', 'underline', 'unstyled'] },
    'aria-describedby': { control: false },
    'aria-invalid': { control: false },
    'aria-labelledby': { control: false },
    id: { control: false },
    name: { control: 'text' },
    required: { control: 'boolean' },
  },
  args: {
    'aria-label': 'Brand color',
    defaultValue: '#4f46e5',
    swatches,
  },
} satisfies Meta<typeof ColorPicker>

type Story = StoryObj<typeof ColorPicker>

/**
 * This is the default ColorPicker: a field with a button that opens the panel.
 */
export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: `<ColorPicker
  aria-label="Brand color"
  defaultValue="#4f46e5"
  swatches={['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7', '#0f172a']}
/>`,
      },
    },
  },
}

/**
 * Use the **variant** prop to pick how the field and the panel look: `outline`, `filled` or `underline`, as in the
 * `Input`. `unstyled` drops the Loica styles so you can style every part yourself.
 */
export const Variants: Story = {
  parameters: {
    docs: {
      story: { iframeHeight: 540 },
      source: {
        code: `<div className="flex flex-col gap-4">
  <ColorPicker aria-label="Outline" defaultValue="#4f46e5" variant="outline" />
  <ColorPicker aria-label="Filled" defaultValue="#4f46e5" variant="filled" />
  <ColorPicker aria-label="Underline" defaultValue="#4f46e5" variant="underline" />
  <ColorPicker aria-label="Unstyled" defaultValue="#4f46e5" variant="unstyled" />
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex w-64 flex-col gap-4">
      <ColorPicker aria-label="Outline" defaultValue="#4f46e5" variant="outline" />
      <ColorPicker aria-label="Filled" defaultValue="#4f46e5" variant="filled" />
      <ColorPicker aria-label="Underline" defaultValue="#4f46e5" variant="underline" />
      <ColorPicker aria-label="Unstyled" defaultValue="#4f46e5" variant="unstyled" />
    </div>
  ),
}

/**
 * Use the **size** prop to change the size of the field and of the text of the panel.
 */
export const Sizes: Story = {
  parameters: {
    docs: {
      story: { iframeHeight: 520 },
      source: {
        code: `<div className="flex flex-col gap-4">
  <ColorPicker aria-label="Small" defaultValue="#4f46e5" size="sm" />
  <ColorPicker aria-label="Medium" defaultValue="#4f46e5" size="md" />
  <ColorPicker aria-label="Large" defaultValue="#4f46e5" size="lg" />
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex w-64 flex-col gap-4">
      <ColorPicker aria-label="Small" defaultValue="#4f46e5" size="sm" />
      <ColorPicker aria-label="Medium" defaultValue="#4f46e5" size="md" />
      <ColorPicker aria-label="Large" defaultValue="#4f46e5" size="lg" />
    </div>
  ),
}

/**
 * The **colorScheme** prop colors the focus of the field and of the area, and the swatch that is picked. The `filled`
 * and `underline` panels also draw their accent line with it.
 */
export const Colors: Story = {
  parameters: {
    docs: {
      story: { iframeHeight: 1100 },
      source: {
        code: `<ColorPicker colorScheme="primary" defaultValue="#ef4444" panel swatches={['#ef4444', '#22c55e']} />
<ColorPicker colorScheme="success" defaultValue="#ef4444" panel swatches={['#ef4444', '#22c55e']} />
<ColorPicker colorScheme="error" defaultValue="#ef4444" panel swatches={['#ef4444', '#22c55e']} />`,
      },
    },
  },
  render: () => (
    <div className="grid w-full gap-4 grid-cols-[repeat(auto-fill,minmax(16rem,1fr))]">
      {colorSchemes.map((colorScheme) => (
        <ColorPicker
          aria-label={colorScheme}
          colorScheme={colorScheme as keyof typeof defaultTheme.colors}
          defaultValue="#ef4444"
          eyeDropper={false}
          key={colorScheme}
          panel
          swatches={['#ef4444', '#22c55e']}
        />
      ))}
    </div>
  ),
}

/**
 * The **format** prop sets how the value is written, and which fields the panel shows: `hex` has one, `rgb` and `hsl`
 * have one for each channel. The picker reads a color in any format, so a value in `hsl` can be shown as `rgb`.
 */
export const Formats: Story = {
  parameters: {
    docs: {
      story: { iframeHeight: 700 },
      source: {
        code: `<ColorPicker aria-label="Hex" defaultValue="#4f46e5" format="hex" panel />
<ColorPicker aria-label="RGB" defaultValue="#4f46e5" format="rgb" panel />
<ColorPicker aria-label="HSL" defaultValue="#4f46e5" format="hsl" panel />`,
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap gap-6">
      <ColorPicker aria-label="Hex" defaultValue="#4f46e5" eyeDropper={false} format="hex" panel />
      <ColorPicker aria-label="RGB" defaultValue="#4f46e5" eyeDropper={false} format="rgb" panel />
      <ColorPicker aria-label="HSL" defaultValue="#4f46e5" eyeDropper={false} format="hsl" panel />
    </div>
  ),
}

/**
 * With **alpha** the panel adds a slider and a field for the opacity, and the value carries it when it is below 1:
 * `#4f46e580`, `rgba(79, 70, 229, 0.5)` or `hsla(243, 75%, 59%, 0.5)`. A color that is opaque has no opacity in it.
 */
export const Opacity: Story = {
  parameters: {
    docs: {
      source: {
        code: `<ColorPicker alpha aria-label="Overlay" defaultValue="#4f46e580" />`,
      },
    },
  },
  args: { alpha: true, 'aria-label': 'Overlay', defaultValue: '#4f46e580' },
}

/**
 * **swatches** are colors to pick with one click, in any CSS format the picker reads. The one that is picked is
 * marked with `aria-pressed`.
 */
export const Swatches: Story = {
  parameters: {
    docs: {
      source: {
        code: `<ColorPicker
  aria-label="Label color"
  defaultValue="#22c55e"
  swatches={['#ef4444', 'rgb(245 158 11)', '#22c55e', 'hsl(217 91% 60%)', '#a855f7']}
/>`,
      },
    },
  },
  args: {
    'aria-label': 'Label color',
    defaultValue: '#22c55e',
    swatches: ['#ef4444', 'rgb(245 158 11)', '#22c55e', 'hsl(217 91% 60%)', '#a855f7'],
  },
}

/**
 * With **panel** the picker is only the panel, always in the page and with no field. Use it where there is room,
 * or inside your own `Popover` or `Modal`.
 */
export const Panel: Story = {
  parameters: {
    docs: {
      story: { iframeHeight: 440 },
      source: {
        code: `<ColorPicker
  aria-label="Brand color"
  defaultValue="#4f46e5"
  panel
  swatches={['#ef4444', '#22c55e', '#3b82f6']}
/>`,
      },
    },
  },
  args: { panel: true },
}

function ControlledExample(): React.ReactNode {
  const [color, setColor] = useState('#4f46e5')
  return (
    <div className="flex w-64 flex-col items-center gap-3">
      <ColorPicker aria-label="Brand color" onValueChange={setColor} swatches={swatches} value={color} />
      <div className="h-16 w-full rounded-lg border border-border" style={{ background: color }} />
      <small>Chosen: {color || 'nothing'}</small>
    </div>
  )
}

/**
 * Give it a **value** and an **onValueChange** to control it. It follows the value you pass, in any format it reads,
 * and writes it back in its own.
 */
export const Controlled: Story = {
  parameters: {
    docs: {
      source: {
        code: `function Example() {
  const [color, setColor] = useState('#4f46e5')
  return (
    <div className="flex flex-col items-center gap-3">
      <ColorPicker aria-label="Brand color" onValueChange={setColor} value={color} />
      <div className="h-16 w-full rounded-lg border border-border" style={{ background: color }} />
      <small>Chosen: {color || 'nothing'}</small>
    </div>
  )
}`,
      },
    },
  },
  render: () => <ControlledExample />,
}

/**
 * Every text can be changed with the `colorPicker` texts of the `LocaleProvider`, here in Spanish. The numbers a
 * screen reader reads follow the `locale`, and the sliders take their name from the same texts.
 */
export const Translated: Story = {
  parameters: {
    docs: {
      source: {
        code: `<LocaleProvider
  locale="es"
  messages={{
    colorPicker: {
      alpha: 'Opacidad',
      area: 'Saturación y brillo',
      areaValue: (saturation, brightness) => \`Saturación \${saturation} %, brillo \${brightness} %\`,
      colorPicker: 'Selector de color',
      eyeDropper: 'Tomar un color de la pantalla',
      hex: 'Hexadecimal',
      hue: 'Tono',
      openColorPicker: 'Abrir el selector de color',
      swatches: 'Muestras',
    },
  }}
>
  <ColorPicker
    alpha
    aria-label="Color de la marca"
    defaultValue="#4f46e5"
    swatches={['#ef4444', '#22c55e', '#3b82f6']}
  />
</LocaleProvider>`,
      },
    },
  },
  render: () => (
    <LocaleProvider
      locale="es"
      messages={{
        colorPicker: {
          alpha: 'Opacidad',
          area: 'Saturación y brillo',
          areaValue: (saturation, brightness) =>
            `Saturación ${saturation} %, brillo ${brightness} %`,
          colorPicker: 'Selector de color',
          eyeDropper: 'Tomar un color de la pantalla',
          hex: 'Hexadecimal',
          hue: 'Tono',
          openColorPicker: 'Abrir el selector de color',
          swatches: 'Muestras',
        },
      }}
    >
      <ColorPicker
        alpha
        aria-label="Color de la marca"
        defaultValue="#4f46e5"
        swatches={swatches}
      />
    </LocaleProvider>
  ),
}

/**
 * A picker can be **disabled**, **readOnly** or invalid (`aria-invalid`, which a `Field` sets). A read-only color
 * stays readable and focusable, but it can't be typed or picked.
 */
export const States: Story = {
  parameters: {
    docs: {
      story: { iframeHeight: 520 },
      source: {
        code: `<div className="flex flex-col gap-4">
  <ColorPicker aria-label="Disabled" defaultValue="#4f46e5" disabled />
  <ColorPicker aria-label="Read only" defaultValue="#4f46e5" readOnly />
  <ColorPicker aria-invalid aria-label="Invalid" defaultValue="#4f46e5" />
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex w-64 flex-col gap-4">
      <ColorPicker aria-label="Disabled" defaultValue="#4f46e5" disabled />
      <ColorPicker aria-label="Read only" defaultValue="#4f46e5" readOnly />
      <ColorPicker aria-invalid aria-label="Invalid" defaultValue="#4f46e5" />
    </div>
  ),
}

/**
 * Inside a `Field`, the label names the field, and the helper text and the error go with it.
 */
export const WithField: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Field helperText="Used for the buttons and the links." label="Brand color">
  <ColorPicker defaultValue="#4f46e5" />
</Field>`,
      },
    },
  },
  render: () => (
    <div className="w-64">
      <Field helperText="Used for the buttons and the links." label="Brand color">
        <ColorPicker defaultValue="#4f46e5" />
      </Field>
    </div>
  ),
}

/**
 * Every piece is a part, so you can rebuild the panel: here it has the area, the hue and the swatches, in that order,
 * and the field has its own name. The parts are `ColorPickerInput` (the field with its button), `ColorPickerPanel`,
 * `ColorPickerArea`, `ColorPickerHue`, `ColorPickerAlpha`, `ColorPickerChannels`, `ColorPickerSwatches` and
 * `ColorPickerEyeDropper`.
 */
export const Compound: Story = {
  parameters: {
    docs: {
      source: {
        code: `<ColorPicker defaultValue="#4f46e5" swatches={['#ef4444', '#22c55e', '#3b82f6']}>
  <ColorPickerInput aria-label="Brand color" />
  <ColorPickerPanel>
    <ColorPickerSwatches />
    <ColorPickerArea />
    <ColorPickerHue />
  </ColorPickerPanel>
</ColorPicker>`,
      },
    },
  },
  render: () => (
    <ColorPicker defaultValue="#4f46e5" swatches={['#ef4444', '#22c55e', '#3b82f6']}>
      <ColorPickerInput aria-label="Brand color" />
      <ColorPickerPanel>
        <ColorPickerSwatches />
        <ColorPickerArea />
        <ColorPickerHue />
      </ColorPickerPanel>
    </ColorPicker>
  ),
}

/**
 * The picker with `variant="unstyled"` and Tailwind utilities. The area, the sliders, the fields and the swatches take
 * a class each, and what is inside a part (the thumb of the area, the inputs) is reached with its `data-loica-*`
 * attributes, or with a selector. A `Slider` that is unstyled is a native range input, so the track of the hue is
 * painted here.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      story: { iframeHeight: 400 },
      source: {
        code: `<ColorPicker
  defaultValue="#4f46e5"
  eyeDropper={false}
  panel
  swatches={['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7']}
  variant="unstyled"
>
  <ColorPickerPanel
    aria-label="Brand color"
    className="w-64 gap-3 rounded-xl border border-border bg-surface p-3 text-sm text-foreground shadow-lg"
  >
    <ColorPickerArea className="h-36 rounded-lg [&>span]:size-4 [&>span]:rounded-full [&>span]:border-2 [&>span]:border-white [&>span]:bg-(--colorpicker-current) [&>span]:shadow" />
    <ColorPickerHue className="[&_input]:h-3 [&_input]:w-full [&_input]:cursor-pointer [&_input]:appearance-none [&_input]:rounded-full [&_input]:bg-[linear-gradient(to_right,red,yellow,lime,cyan,blue,magenta,red)] [&_input::-webkit-slider-thumb]:size-4 [&_input::-webkit-slider-thumb]:appearance-none [&_input::-webkit-slider-thumb]:rounded-full [&_input::-webkit-slider-thumb]:border-2 [&_input::-webkit-slider-thumb]:border-white [&_input::-webkit-slider-thumb]:bg-primary-solid" />
    <ColorPickerChannels className="gap-2 [&_input]:w-full [&_input]:rounded-md [&_input]:border [&_input]:border-border [&_input]:bg-surface [&_input]:px-2 [&_input]:py-1 [&_span]:text-xs [&_span]:text-muted" />
    <ColorPickerSwatches className="[&>button]:size-6 [&>button]:rounded-md [&>button]:border [&>button]:border-border [&>button]:bg-(--colorpicker-swatch) [&>button[aria-pressed=true]]:ring-2 [&>button[aria-pressed=true]]:ring-primary-solid" />
  </ColorPickerPanel>
</ColorPicker>`,
      },
    },
  },
  render: () => (
    <ColorPicker
      defaultValue="#4f46e5"
      eyeDropper={false}
      panel
      swatches={['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7']}
      variant="unstyled"
    >
      <ColorPickerPanel
        aria-label="Brand color"
        className="w-64 gap-3 rounded-xl border border-border bg-surface p-3 text-sm text-foreground shadow-lg"
      >
        <ColorPickerArea className="h-36 rounded-lg [&>span]:size-4 [&>span]:rounded-full [&>span]:border-2 [&>span]:border-white [&>span]:bg-(--colorpicker-current) [&>span]:shadow" />
        <ColorPickerHue className="[&_input]:h-3 [&_input]:w-full [&_input]:cursor-pointer [&_input]:appearance-none [&_input]:rounded-full [&_input]:bg-[linear-gradient(to_right,red,yellow,lime,cyan,blue,magenta,red)] [&_input::-webkit-slider-thumb]:size-4 [&_input::-webkit-slider-thumb]:appearance-none [&_input::-webkit-slider-thumb]:rounded-full [&_input::-webkit-slider-thumb]:border-2 [&_input::-webkit-slider-thumb]:border-white [&_input::-webkit-slider-thumb]:bg-primary-solid" />
        <ColorPickerChannels className="gap-2 [&_input]:w-full [&_input]:rounded-md [&_input]:border [&_input]:border-border [&_input]:bg-surface [&_input]:px-2 [&_input]:py-1 [&_span]:text-xs [&_span]:text-muted" />
        <ColorPickerSwatches className="[&>button]:size-6 [&>button]:rounded-md [&>button]:border [&>button]:border-border [&>button]:bg-(--colorpicker-swatch) [&>button[aria-pressed=true]]:ring-2 [&>button[aria-pressed=true]]:ring-primary-solid" />
      </ColorPickerPanel>
    </ColorPicker>
  ),
}

/**
 * The same with Bootstrap: the panel is a `card`, and the part of Bootstrap that styles an element inside a part
 * (the inputs, the swatches) goes in a rule of the story, under a class of its own.
 */
export const Bootstrap: Story = {
  parameters: {
    docs: {
      story: { iframeHeight: 440 },
      source: {
        code: `<ColorPicker
  defaultValue="#4f46e5"
  eyeDropper={false}
  panel
  swatches={['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7']}
  variant="unstyled"
>
  <ColorPickerPanel aria-label="Brand color" className="bs-color card card-body gap-3 shadow-sm">
    <ColorPickerArea className="rounded" />
    <ColorPickerHue />
    <ColorPickerChannels className="gap-2" />
    <ColorPickerSwatches className="gap-2" />
  </ColorPickerPanel>
</ColorPicker>`,
      },
    },
  },
  render: () => (
    <>
      <style>{`
        .bs-color { width: 16rem; }
        .bs-color [data-loica-colorpicker-area] { height: 9rem; }
        .bs-color [data-loica-colorpicker-thumb] { border: 2px solid var(--bs-white); border-radius: 50%; background: var(--colorpicker-current); box-shadow: var(--bs-box-shadow-sm); }
        .bs-color input[type='text'] { display: block; width: 100%; padding: 0.25rem 0.5rem; border: var(--bs-border-width) solid var(--bs-border-color); border-radius: var(--bs-border-radius); background: var(--bs-body-bg); color: var(--bs-body-color); }
        .bs-color input[type='range'] { width: 100%; accent-color: var(--bs-primary); }
        .bs-color [data-loica-colorpicker-channel] span { font-size: 0.75rem; color: var(--bs-secondary-color); }
        .bs-color [data-loica-colorpicker-swatch] { width: 1.5rem; height: 1.5rem; padding: 0; border: var(--bs-border-width) solid var(--bs-border-color); border-radius: var(--bs-border-radius); background: var(--colorpicker-swatch); }
        .bs-color [data-loica-colorpicker-swatch][aria-pressed='true'] { outline: 2px solid var(--bs-primary); outline-offset: 2px; }
      `}</style>
      <ColorPicker
        defaultValue="#4f46e5"
        eyeDropper={false}
        panel
        swatches={['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7']}
        variant="unstyled"
      >
        <ColorPickerPanel aria-label="Brand color" className="bs-color card card-body gap-3 shadow-sm">
          <ColorPickerArea className="rounded" />
          <ColorPickerHue />
          <ColorPickerChannels className="gap-2" />
          <ColorPickerSwatches className="gap-2" />
        </ColorPickerPanel>
      </ColorPicker>
    </>
  ),
}
