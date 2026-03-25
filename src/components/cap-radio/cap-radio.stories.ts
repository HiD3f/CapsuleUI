import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  title: 'Components/Radio',
  component: 'cap-radio',
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    hint: { control: 'text' },
    error: { control: 'text' },
    value: { control: 'text' },
    name: { control: 'text' },
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
  },
  args: {
    label: 'Radio label',
    value: 'option',
    checked: false,
    disabled: false,
    required: false,
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <cap-radio
      label=${args.label}
      hint=${args.hint}
      error=${args.error}
      value=${args.value}
      name=${args.name}
      ?checked=${args.checked}
      ?disabled=${args.disabled}
      ?required=${args.required}
    ></cap-radio>
  `,
};

export const States: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <cap-radio label="Unchecked" value="a" name="states"></cap-radio>
      <cap-radio label="Checked" value="b" name="states" checked></cap-radio>
      <cap-radio label="Disabled" value="c" name="states" disabled></cap-radio>
      <cap-radio label="Disabled checked" value="d" name="states" disabled checked></cap-radio>
      <cap-radio label="With hint" value="e" name="states" hint="This is a helpful hint"></cap-radio>
      <cap-radio label="With error" value="f" name="states" error="This field is required"></cap-radio>
      <cap-radio label="Required" value="g" name="states" required></cap-radio>
    </div>
  `,
};

export const Focused: Story = {
  render: () => html`
    <cap-radio label="Tab to me to see focus" value="focus" name="focus-demo"></cap-radio>
    <script>
      setTimeout(() => {
        document.querySelector('cap-radio')
          .shadowRoot.querySelector('input')
          .focus();
      }, 100);
    </script>
  `,
};
