import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  title: 'Components/Checkbox',
  component: 'cap-checkbox',
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    hint: { control: 'text' },
    error: { control: 'text' },
    value: { control: 'text' },
    checked: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
  },
  args: {
    label: 'Checkbox label',
    checked: false,
    indeterminate: false,
    disabled: false,
    required: false,
  },
  parameters: {
    docs: {
      description: {
        component: `Binary on/off toggle. For mutually exclusive choices use \`cap-radio-group\` instead. Supports \`indeterminate\` state (set programmatically, for "select all" patterns). Uses a hidden native \`<input type="checkbox">\` — \`aria-required\`, \`aria-invalid\`, \`aria-describedby\` set automatically.`,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <cap-checkbox
      label=${args.label}
      hint=${args.hint}
      error=${args.error}
      value=${args.value}
      ?checked=${args.checked}
      ?indeterminate=${args.indeterminate}
      ?disabled=${args.disabled}
      ?required=${args.required}
    ></cap-checkbox>
  `,
};

export const States: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <cap-checkbox label="Unchecked"></cap-checkbox>
      <cap-checkbox label="Checked" checked></cap-checkbox>
      <cap-checkbox label="Indeterminate" indeterminate></cap-checkbox>
      <cap-checkbox label="Disabled" disabled></cap-checkbox>
      <cap-checkbox label="Disabled checked" disabled checked></cap-checkbox>
      <cap-checkbox label="With hint" hint="This is a helpful hint"></cap-checkbox>
      <cap-checkbox label="With error" error="This field is required"></cap-checkbox>
      <cap-checkbox label="Required" required></cap-checkbox>
    </div>
  `,
};

export const SelectAll: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 12px;">
      <cap-checkbox label="Select All" indeterminate></cap-checkbox>
      <div style="padding-left: 24px; display: flex; flex-direction: column; gap: 12px;">
        <cap-checkbox label="Option A" checked></cap-checkbox>
        <cap-checkbox label="Option B"></cap-checkbox>
        <cap-checkbox label="Option C" checked></cap-checkbox>
      </div>
    </div>
  `,
};

export const Focused: Story = {
  render: () => html`
    <cap-checkbox label="Tab to me to see focus" id="focus-demo"></cap-checkbox>
    <script>
      setTimeout(() => {
        document.querySelector('cap-checkbox')
          .shadowRoot.querySelector('input')
          .focus();
      }, 100);
    </script>
  `,
};