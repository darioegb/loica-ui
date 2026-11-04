import type { StoryObj, Meta } from "@storybook/react-vite";
import { useState } from "react";
import { defaultTheme } from "../../../../theme";
import { Field } from "../../field";
import { Slider, type SliderValue } from "..";

const colorSchemes = Object.keys(defaultTheme.colors);

const frame = { maxWidth: "100%", width: "22rem" };

const stack = (gap: string): React.CSSProperties => ({
  display: "flex",
  flexDirection: "column",
  gap,
  ...frame,
});

/**
 * A control to pick a number, or a range of two, by dragging a thumb along a track. Use it for a value where the
 * exact number matters less than the position, like a volume, a price range or a zoom.
 *
 * Every thumb is a native `<input type="range">`, so the browser brings the keyboard (<kbd>←</kbd> <kbd>→</kbd>
 * <kbd>↑</kbd> <kbd>↓</kbd>, <kbd>Home</kbd>, <kbd>End</kbd>, <kbd>PageUp</kbd> and <kbd>PageDown</kbd>), the
 * touch support, the role `slider` with `aria-valuenow`, `aria-valuemin` and `aria-valuemax`, and the value in a
 * form. Plume draws the track, the filled part and the marks around it. Name it with an `aria-label`, or with a
 * `Field` label, which also gives it its description, disabled and invalid state like any other control; the `ref`
 * goes to the input, so it works with `register` of react-hook-form. Use **formatValue** when the number is not the
 * best way to say the value ("$40"): screen readers read it as the value text.
 *
 * **Range.** Pass an array of two numbers in **value** or **defaultValue** and the slider has two thumbs, named
 * "Minimum" and "Maximum" inside a group that takes the name you give it. The thumbs can't cross. Pressing on the
 * track moves the nearest thumb. **onValueChange** then gets a pair too. In a form both thumbs are sent with the
 * same **name**.
 *
 * **onValueChange** is called while the user drags; use **onValueCommit** to act only on the final value, for
 * example to fetch results.
 *
 * With `variant="unstyled"` only the native inputs are rendered, inside a body: the track, the filled part and the
 * marks are Plume's, and they go away. A range then shows two stacked inputs, so style them as one control or use the
 * `solid` and `outline` variants.
 *
 * The Slider draws its elements itself: the body, the track with its range, the marks and a thumb for each value.
 * Each carries a `data-plume-slider-*` attribute, so you style it from the root (`[&_[data-plume-slider-track]]:h-2`
 * in Tailwind). A thumb is named by the `aria-label` of the Slider, or, in a range, by the `slider.thumb` text of the
 * `LocaleProvider`.
 */
export default {
  title: "Components/Slider",
  component: Slider,
  tags: ["autodocs"],
  parameters: {
    docs: {
      toc: {
        title: "On this page",
        disable: false,
      },
    },
    layout: "centered",
  },
  argTypes: {
    className: {
      control: "text",
    },
    style: {
      control: false,
    },
    value: {
      control: false,
    },
    defaultValue: {
      control: "number",
    },
    onValueChange: {
      control: false,
    },
    onValueCommit: {
      control: false,
    },
    min: {
      control: "number",
    },
    max: {
      control: "number",
    },
    step: {
      control: "number",
    },
    marks: {
      control: false,
    },
    orientation: {
      control: "radio",
      options: ["horizontal", "vertical"],
    },
    formatValue: {
      control: false,
    },
    disabled: {
      control: "boolean",
    },
    readOnly: {
      control: "boolean",
    },
    invalid: {
      control: "boolean",
    },
    colorScheme: {
      control: "select",
      options: colorSchemes,
    },
    size: {
      control: "radio",
      options: ["sm", "md", "lg"],
    },
    variant: {
      control: "radio",
      options: ["solid", "outline", "unstyled"],
    },
    id: {
      control: false,
    },
    name: {
      control: "text",
    },
    title: {
      control: "text",
    },
    hidden: {
      control: false,
    },
    "aria-label": {
      control: "text",
    },
    "aria-labelledby": {
      control: false,
    },
    "aria-describedby": {
      control: false,
    },
    "aria-invalid": {
      control: false,
    },
  },
  args: {
    "aria-label": "Volume",
    defaultValue: 40,
    style: frame,
  },
} satisfies Meta<typeof Slider>;

type Story = StoryObj<typeof Slider>;

/**
 * This is the default Slider, from 0 to 100.
 */
export const Default: Story = {};

/**
 * Use the **variant** prop to pick how the Slider looks: `solid` has a thick track and a filled thumb, and `outline`
 * a thin track and a hollow thumb. `unstyled` renders only the native input, to style it yourself.
 */
export const Variants: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Slider aria-label="solid" defaultValue={40} variant="solid" />
<Slider aria-label="outline" defaultValue={40} variant="outline" />
<Slider
  aria-label="unstyled"
  defaultValue={40}
  variant="unstyled"
/>`,
      },
    },
  },
  render: () => (
    <div style={stack("1.5rem")}>
      {(["solid", "outline"] as const).map((variant) => (
        <Slider
          aria-label={variant}
          defaultValue={40}
          key={variant}
          variant={variant}
        />
      ))}
      <Slider aria-label="unstyled" defaultValue={40} variant="unstyled" />
    </div>
  ),
};

/**
 * Use the **size** prop to change the size of the thumb and the track.
 */
export const Sizes: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Slider aria-label="Size sm" defaultValue={40} size="sm" />
<Slider aria-label="Size md" defaultValue={40} size="md" />
<Slider aria-label="Size lg" defaultValue={40} size="lg" />`,
      },
    },
  },
  render: () => (
    <div style={stack("1.5rem")}>
      {(["sm", "md", "lg"] as const).map((size) => (
        <Slider
          aria-label={`Size ${size}`}
          defaultValue={40}
          key={size}
          size={size}
        />
      ))}
    </div>
  ),
};

/**
 * Use the **colorScheme** prop to pick a color from the theme. It colors the filled part and the thumb in `solid`,
 * and the filled part and the border of the hollow thumb in `outline`.
 */
export const Colors: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Slider aria-label="primary" colorScheme="primary" defaultValue={60} />
<Slider aria-label="success" colorScheme="success" defaultValue={60} />
<Slider aria-label="error" colorScheme="error" defaultValue={60} />`,
      },
    },
  },
  render: () => (
    <div style={stack("1rem")}>
      {colorSchemes.map((scheme) => (
        <Slider
          aria-label={scheme}
          colorScheme={scheme as keyof typeof defaultTheme.colors}
          defaultValue={60}
          key={scheme}
        />
      ))}
    </div>
  ),
};

/**
 * Pass a pair in **defaultValue** or **value** for a range with two thumbs. They are named "Minimum" and
 * "Maximum" (change them with the `slider.thumb` text of the `LocaleProvider`) inside a group named by the `aria-label`, and they can't cross.
 */
export const Range: Story = {
  args: {
    "aria-label": "Price",
    defaultValue: [20, 70],
    formatValue: (value: number) => `$${value}`,
  },
};

/**
 * **step** sets the distance between values, and **marks** shows them on the track. Use a list of
 * `{ value, label }` to write something under a mark.
 */
export const Marks: Story = {
  render: () => (
    <div style={stack("3rem")}>
      <Slider
        aria-label="Every step"
        defaultValue={30}
        marks
        max={50}
        step={10}
      />
      <Slider
        aria-label="Temperature"
        defaultValue={20}
        formatValue={(value) => `${value} degrees`}
        marks={[
          { label: "0°", value: 0 },
          { label: "20°", value: 20 },
          { label: "50°", value: 50 },
          { label: "100°", value: 100 },
        ]}
      />
      <Slider
        aria-label="Budget"
        defaultValue={[25, 75]}
        marks={[0, 25, 50, 75, 100]}
        step={25}
      />
    </div>
  ),
};

/**
 * A vertical slider is 12rem high, with the minimum at the bottom. Use it where the height is the natural way to
 * think about the value, like a volume or a zoom.
 */
export const Vertical: Story = {
  render: () => (
    <div style={{ alignItems: "flex-start", display: "flex", gap: "3rem" }}>
      <Slider
        aria-label="Volume"
        defaultValue={40}
        orientation="vertical"
        style={undefined}
      />
      <Slider
        aria-label="Range"
        defaultValue={[20, 70]}
        marks={[
          { label: "Low", value: 0 },
          { label: "High", value: 100 },
        ]}
        orientation="vertical"
        style={undefined}
      />
    </div>
  ),
};

function ControlledSlider(): React.ReactNode {
  const [value, setValue] = useState<SliderValue>(40);
  return (
    <div style={stack("0.75rem")}>
      <Slider aria-label="Opacity" onValueChange={setValue} value={value} />
      <p className="text-sm">Opacity: {String(value)}%</p>
      <div className="flex gap-2">
        {[0, 50, 100].map((preset) => (
          <button
            className="rounded-sm border border-gray-400 px-2 py-1 text-sm"
            key={preset}
            onClick={() => setValue(preset)}
            type="button"
          >
            {preset}%
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Pass **value** and **onValueChange** to control the Slider, for example to show the number or to set it from
 * outside.
 */
export const Controlled: Story = {
  parameters: {
    docs: {
      source: {
        code: `function Example() {
  const [value, setValue] = useState<SliderValue>(40)
  return (
    <div className="flex flex-col gap-3">
      <Slider aria-label="Opacity" onValueChange={setValue} value={value} />
      <p className="text-sm">Opacity: {value}%</p>
      <div className="flex gap-2">
        {[0, 50, 100].map((preset) => (
          <button
            className="rounded-sm border border-gray-400 px-2 py-1 text-sm"
            key={preset}
            onClick={() => setValue(preset)}
            type="button"
          >
            {preset}%
          </button>
        ))}
      </div>
    </div>
  )
}`,
      },
    },
  },
  render: () => <ControlledSlider />,
};

function CommitSlider(): React.ReactNode {
  const [value, setValue] = useState<SliderValue>(30);
  const [committed, setCommitted] = useState<SliderValue>(30);
  return (
    <div style={stack("0.75rem")}>
      <Slider
        aria-label="Zoom"
        onValueChange={setValue}
        onValueCommit={setCommitted}
        value={value}
      />
      <p className="text-sm">
        Dragging: {String(value)}. Last committed: {String(committed)}.
      </p>
    </div>
  );
}

/**
 * **onValueChange** fires all the time while the user drags. Use **onValueCommit** to act once, with the final
 * value: to save it or to fetch results.
 */
export const Commit: Story = {
  parameters: {
    docs: {
      source: {
        code: `function Example() {
  const [value, setValue] = useState<SliderValue>(30)
  const [committed, setCommitted] = useState<SliderValue>(30)
  return (
    <div className="flex flex-col gap-3">
      <Slider
        aria-label="Zoom"
        onValueChange={setValue}
        onValueCommit={setCommitted}
        value={value}
      />
      <p className="text-sm">
        Dragging: {value}. Last committed: {committed}.
      </p>
    </div>
  )
}`,
      },
    },
  },
  render: () => <CommitSlider />,
};

/**
 * A disabled slider can't be used. A read only one shows the value, can be focused and says so with
 * `aria-readonly`.
 */
export const Disabled: Story = {
  render: () => (
    <div style={stack("1.5rem")}>
      <Slider aria-label="Disabled" defaultValue={40} disabled />
      <Slider aria-label="Read only" defaultValue={40} readOnly />
    </div>
  ),
};

/**
 * **invalid** (or `aria-invalid`) turns the slider to the error color.
 */
export const Invalid: Story = {
  args: { invalid: true },
};

/**
 * Inside a `Field` it gets its label, its helper and error text, and the disabled, read only and invalid states.
 */
export const WithField: Story = {
  render: () => (
    <div style={stack("1.5rem")}>
      <Field helperText="Between 0 and 100" label="Volume">
        <Slider defaultValue={40} />
      </Field>
      <Field errorText="Choose a lower price" label="Price" required>
        <Slider defaultValue={[20, 90]} />
      </Field>
    </div>
  ),
};

/**
 * Some examples of Slider with Tailwind classes. With `variant="unstyled"` only the native input is rendered, so
 * Tailwind's `accent-*` utilities color it, and the classes go on the root with a selector for the input. A solid
 * Slider can restyle its track and its range the same way, with the `data-plume-slider-*` attributes.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Slider
  aria-label="Volume"
  className="[&_input]:h-2 [&_input]:w-full [&_input]:cursor-pointer [&_input]:accent-primary-solid"
  defaultValue={40}
  variant="unstyled"
/>
<Slider
  aria-label="Budget"
  className="[&_[data-plume-slider-track]]:h-2 [&_[data-plume-slider-range]]:bg-emerald-500"
  defaultValue={[25, 75]}
/>`,
      },
    },
  },
  render: () => (
    <div style={stack("1.5rem")}>
      <Slider
        aria-label="Volume"
        className="[&_input]:h-2 [&_input]:w-full [&_input]:cursor-pointer [&_input]:accent-primary-solid"
        defaultValue={40}
        variant="unstyled"
      />
      <Slider
        aria-label="Budget"
        className="[&_[data-plume-slider-track]]:h-2 [&_[data-plume-slider-range]]:bg-emerald-500"
        defaultValue={[25, 75]}
      />
    </div>
  ),
};

/**
 * Some examples of Slider with Bootstrap classes. Bootstrap's `form-range` is a class of the `<input>`, which the
 * Slider draws itself and gives no class, so the unstyled Slider keeps the look of the browser and only its box can
 * take Bootstrap classes. Bootstrap's own range can't have two thumbs either, which is one reason to use Plume's
 * variants for a range.
 */
export const Bootstrap: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Slider aria-label="Volume" className="d-flex" defaultValue={40} variant="unstyled" />`,
      },
    },
  },
  render: () => (
    <div style={stack("1.5rem")}>
      <Slider
        aria-label="Volume"
        className="d-flex"
        defaultValue={40}
        variant="unstyled"
      />
      <Slider
        aria-label="Quality"
        className="d-flex"
        defaultValue={70}
        variant="unstyled"
      />
    </div>
  ),
};
