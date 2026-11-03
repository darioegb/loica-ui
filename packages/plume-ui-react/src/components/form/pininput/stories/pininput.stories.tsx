import type { StoryObj, Meta } from "@storybook/react-vite";
import { useState } from "react";
import { defaultTheme } from "../../../../theme";
import { Field } from "../../field";
import { PinInput } from "..";

const colorSchemes = Object.keys(defaultTheme.colors);

/**
 * A row of one-character boxes for a code the user types or pastes: a one-time password, a verification code, a
 * PIN. Use it when the length is fixed and short.
 *
 * Typing a character moves to the next box, <kbd>Backspace</kbd> removes it and goes back, and <kbd>←</kbd>,
 * <kbd>→</kbd>, <kbd>Home</kbd> and <kbd>End</kbd> move between the boxes. Pasting a code fills the boxes from the
 * one that has the focus, and the whole code that arrives in one box (the autofill of a one-time code on a phone)
 * is spread over them. Only the characters of the `type` are accepted: digits, letters and digits, or anything
 * but spaces.
 *
 * It is a `<fieldset>` with one input for each character. Every box has its own name (`Digit 1 of 6`), the group
 * takes the name you give it, and there is a single tab stop, on the next box to fill, so a screen reader or a
 * keyboard user does not walk through six empty boxes. `onComplete` runs when the last box is filled. With a
 * `name` the code is submitted in a hidden input. It composes with `Field`, which names the group and gives the
 * focus to the next box to fill when its label is clicked.
 *
 * It draws the boxes itself, so it takes no children: each one is an `<input data-plume-pininput-cell>`, with
 * `data-filled` when it has a character, and the hidden input of a `name` is `data-plume-pininput-hidden`. To style
 * the boxes, use selectors on the group (`[&>[data-plume-pininput-cell]]:h-12` in Tailwind). The look
 * (`variant`, `size`, `shape`), the type and the mask go on the `PinInput`.
 */
export default {
  title: "Components/PinInput",
  component: PinInput,
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
    className: { control: "text" },
    style: { control: false },
    length: { control: { type: "number", min: 1, max: 10 } },
    type: { control: "radio", options: ["numeric", "alphanumeric", "text"] },
    mask: { control: "boolean" },
    placeholder: { control: "text" },
    value: { control: false },
    defaultValue: { control: "text" },
    onValueChange: { control: false },
    onComplete: { control: false },
    colorScheme: { control: "select", options: colorSchemes },
    size: { control: "radio", options: ["sm", "md", "lg"] },
    shape: { control: "radio", options: ["rounded", "pill"] },
    variant: {
      control: "radio",
      options: ["outline", "filled", "underline", "unstyled"],
    },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    focusOnMount: { control: "boolean" },
    autoComplete: { control: "text" },
    name: { control: "text" },
    required: { control: "boolean" },
    id: { control: false },
    title: { control: "text" },
    hidden: { control: false },
    "aria-label": { control: "text" },
    "aria-labelledby": { control: false },
    "aria-describedby": { control: false },
    "aria-invalid": { control: "boolean" },
  },
  args: {
    "aria-label": "Verification code",
  },
} satisfies Meta<typeof PinInput>;

type Story = StoryObj<typeof PinInput>;

/**
 * This is the default PinInput: six digits. Type, or paste a code.
 */
export const Default: Story = {};

/**
 * Use the **variant** prop to pick how the boxes look, the same ones as the `Input`. `unstyled` drops the Plume
 * styles so you can style them yourself.
 */
export const Variants: Story = {
  parameters: {
    docs: {
      source: {
        code: `<PinInput aria-label="Outline" length={4} variant="outline" />
<PinInput aria-label="Filled" length={4} variant="filled" />
<PinInput aria-label="Underline" length={4} variant="underline" />
<PinInput
  aria-label="Unstyled"
  length={4}
  variant="unstyled"
/>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <PinInput aria-label="Outline" length={4} variant="outline" />
      <PinInput aria-label="Filled" length={4} variant="filled" />
      <PinInput aria-label="Underline" length={4} variant="underline" />
      <PinInput aria-label="Unstyled" length={4} variant="unstyled" />
    </div>
  ),
};

/**
 * Use the **size** prop to change the size of the boxes.
 */
export const Sizes: Story = {
  parameters: {
    docs: {
      source: {
        code: `<PinInput aria-label="sm" length={4} size="sm" />
<PinInput aria-label="md" length={4} size="md" />
<PinInput aria-label="lg" length={4} size="lg" />`,
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      {(["sm", "md", "lg"] as const).map((size) => (
        <PinInput aria-label={size} key={size} length={4} size={size} />
      ))}
    </div>
  ),
};

/**
 * Use the **colorScheme** prop to pick the color of the focus ring from the theme. It is the color of the focused
 * box in every variant: its border and ring in `outline`, its bottom border in `filled` and `underline`. An
 * invalid PinInput uses the error color instead.
 */
export const Colors: Story = {
  parameters: {
    docs: {
      source: {
        code: `<PinInput aria-label="primary" colorScheme="primary" length={4} />
<PinInput aria-label="success" colorScheme="success" length={4} />
<PinInput aria-label="error" colorScheme="error" length={4} />`,
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      {colorSchemes.map((scheme) => (
        <PinInput
          aria-label={scheme}
          colorScheme={scheme as keyof typeof defaultTheme.colors}
          key={scheme}
          length={4}
        />
      ))}
    </div>
  ),
};

/**
 * Use the **shape** prop for rounded or pill boxes.
 */
export const Shapes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <PinInput aria-label="Rounded" length={4} shape="rounded" />
      <PinInput aria-label="Pill" length={4} shape="pill" />
    </div>
  ),
};

/**
 * **length** is the number of boxes, and **type** what they accept: `numeric` (the default), `alphanumeric` or
 * `text`. A character that doesn't fit is not typed, and a pasted code drops what doesn't fit.
 */
export const LengthAndType: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <PinInput aria-label="Four digits" length={4} />
      <PinInput aria-label="Licence code" length={5} type="alphanumeric" />
    </div>
  ),
};

/**
 * **mask** hides what is typed, for a PIN. Pair it with `autoComplete="off"` so the browser doesn't offer to save
 * it, and with a **placeholder** if you want to show the empty boxes.
 */
export const Masked: Story = {
  args: {
    "aria-label": "PIN",
    autoComplete: "off",
    length: 4,
    mask: true,
    placeholder: "○",
  },
};

function OtpExample(): React.ReactNode {
  const [value, setValue] = useState("");
  const [done, setDone] = useState<string | null>(null);
  return (
    <div className="flex flex-col items-start gap-3">
      <PinInput
        aria-label="One-time code"
        focusOnMount
        onComplete={setDone}
        onValueChange={(next) => {
          setValue(next);
          setDone(null);
        }}
        value={value}
      />
      <p className="text-sm">
        {done ? `Code entered: ${done}` : `Typed: ${value || "nothing yet"}`}
      </p>
      <button
        className="rounded-sm border border-gray-400 px-2 py-1 text-sm"
        onClick={() => setValue("")}
        type="button"
      >
        Clear
      </button>
    </div>
  );
}

/**
 * Pass **value** and **onValueChange** to control the code, and **onComplete** to react when the last box is
 * filled, for example to verify it. The component has `focusOnMount` here, so the first box is ready to type.
 */
export const Controlled: Story = {
  render: () => <OtpExample />,
  parameters: {
    docs: {
      source: {
        code: `function Example() {
  const [value, setValue] = useState('')
  const [done, setDone] = useState<string | null>(null)
  return (
    <div className="flex flex-col items-start gap-3">
      <PinInput
        aria-label="One-time code"
        focusOnMount
        onComplete={setDone}
        onValueChange={(next) => {
          setValue(next)
          setDone(null)
        }}
        value={value}
      />
      <p className="text-sm">
        {done ? \`Code entered: \${done}\` : \`Typed: \${value || 'nothing yet'}\`}
      </p>
      <button onClick={() => setValue('')} type="button">
        Clear
      </button>
    </div>
  )
}`,
      },
    },
  },
};

/**
 * A pin can be disabled, read only or invalid. A read only code stays readable and focusable, but it can't be
 * typed, pasted or deleted.
 */
export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <PinInput aria-label="Disabled" defaultValue="123456" disabled />
      <PinInput aria-label="Read only" defaultValue="123456" readOnly />
      <PinInput aria-invalid aria-label="Invalid" defaultValue="123456" />
    </div>
  ),
};

/**
 * With a **name** the code takes part in a form: it is submitted in a hidden input, as one string.
 */
export const InAForm: Story = {
  render: () => (
    <form
      className="flex flex-col items-start gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        const code = new FormData(event.currentTarget).get("code");
        window.alert(`code = "${typeof code === "string" ? code : ""}"`);
      }}
    >
      <PinInput aria-label="Verification code" length={4} name="code" />
      <button
        className="rounded-sm border border-gray-400 px-3 py-1 text-sm"
        type="submit"
      >
        Verify
      </button>
    </form>
  ),
};

/**
 * Wrap the PinInput in a `Field` to give it a label, a helper text and an error message. The Field names the
 * group, links its texts and sets `disabled`, `readOnly`, `required` and `aria-invalid`. Its `id`, its texts and
 * the `ref` of the PinInput go to the `<fieldset>`, which also takes `aria-invalid`; every box repeats the
 * invalid and required state, since a group can't announce them. Clicking the label gives the focus to the next
 * box to fill.
 */
export const WithField: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <Field helperText="We sent it by SMS." label="Verification code">
        <PinInput length={4} />
      </Field>
      <Field
        errorText="That code is not right."
        invalid
        label="Verification code"
        required
      >
        <PinInput defaultValue="1234" length={4} />
      </Field>
    </div>
  ),
};

/**
 * Some examples of PinInput with Tailwind classes. With `variant="unstyled"` the boxes have none of the Plume
 * classes: `className` styles the group and, through `[&>[data-plume-pininput-cell]]:`, its boxes. A filled box has
 * `data-filled`, so `[&>[data-filled]]:` styles it. The boxes also have `data-disabled` and `data-invalid`, and the
 * group `data-disabled`, `data-invalid` and `data-readonly`.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<PinInput
  aria-label="Verification code"
  className="flex gap-2 [&>[data-plume-pininput-cell]]:h-12 [&>[data-plume-pininput-cell]]:w-10 [&>[data-plume-pininput-cell]]:rounded-lg [&>[data-plume-pininput-cell]]:border [&>[data-plume-pininput-cell]]:border-border [&>[data-plume-pininput-cell]]:bg-surface [&>[data-plume-pininput-cell]]:text-center [&>[data-plume-pininput-cell]]:text-lg [&>[data-plume-pininput-cell]]:text-foreground [&>[data-filled]]:border-blue-500"
  length={6}
  variant="unstyled"
/>`,
      },
    },
  },
  render: () => (
    <PinInput
      aria-label="Verification code"
      className="flex gap-2 [&>[data-plume-pininput-cell]]:h-12 [&>[data-plume-pininput-cell]]:w-10 [&>[data-plume-pininput-cell]]:rounded-lg [&>[data-plume-pininput-cell]]:border [&>[data-plume-pininput-cell]]:border-border [&>[data-plume-pininput-cell]]:bg-surface [&>[data-plume-pininput-cell]]:text-center [&>[data-plume-pininput-cell]]:text-lg [&>[data-plume-pininput-cell]]:text-foreground [&>[data-filled]]:border-blue-500"
      length={6}
      variant="unstyled"
    />
  ),
};

/**
 * Some examples of PinInput with Bootstrap classes: `d-flex gap-2` for the group. Bootstrap has no class for the
 * boxes inside a group, so they keep the look of the browser; and `form-control` can't reach them.
 */
export const Bootstrap: Story = {
  parameters: {
    docs: {
      source: {
        code: `<PinInput
  aria-label="Verification code"
  className="d-flex gap-2"
  length={6}
  style={{ maxWidth: '100%', width: '20rem' }}
  variant="unstyled"
/>`,
      },
    },
  },
  render: () => (
    <PinInput
      aria-label="Verification code"
      className="d-flex gap-2"
      length={6}
      style={{ maxWidth: "100%", width: "20rem" }}
      variant="unstyled"
    />
  ),
};
