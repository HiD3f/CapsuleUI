import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  title: 'Components/Form/Input',
  component: 'cap-input',
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'search'],
      description: 'Input type',
    },
    value: { control: 'text' },
    placeholder: { control: 'text' },
    label: { control: 'text' },
    hint: { control: 'text' },
    error: { control: 'text' },
    success: { control: 'text' },
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' },
    required: { control: 'boolean' },
  },
  args: {
    type: 'text',
    label: 'Label',
    placeholder: 'Type something...',
    disabled: false,
    readonly: false,
    required: false,
  },
  parameters: {
    docs: {
      description: {
        component: `Single-line text input. Types: \`text\`, \`email\`, \`password\` (show/hide toggle), \`number\`, \`search\` (clear button). Supports \`error\`, \`success\`, \`hint\`, \`readonly\`. \`aria-required\`, \`aria-invalid\`, and \`aria-describedby\` set automatically.`,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <cap-input
      type=${args.type}
      label=${args.label}
      placeholder=${args.placeholder}
      value=${args.value}
      hint=${args.hint}
      error=${args.error}
      success=${args.success}
      ?disabled=${args.disabled}
      ?readonly=${args.readonly}
      ?required=${args.required}
    ></cap-input>
  `,
};

export const Types: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
      <cap-input type="text"     label="Text"     placeholder="Plain text"></cap-input>
      <cap-input type="email"    label="Email"    placeholder="you@example.com"></cap-input>
      <cap-input type="password" label="Password" placeholder="Enter password"></cap-input>
      <cap-input type="number"   label="Number"   placeholder="0"></cap-input>
      <cap-input type="search"   label="Search"   placeholder="Search..."></cap-input>
    </div>
  `,
};

export const States: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
      <cap-input label="Default"  placeholder="Default state"></cap-input>
      <cap-input label="Hint"     placeholder="With hint"     hint="This is a helpful hint"></cap-input>
      <cap-input label="Error"    placeholder="With error"    error="This field is required"></cap-input>
      <cap-input label="Success"  placeholder="With success"  success="Looks good!"></cap-input>
      <cap-input label="Disabled" placeholder="Disabled"      disabled></cap-input>
      <cap-input label="Readonly" value="Read only value"     readonly></cap-input>
    </div>
  `,
};

export const Required: Story = {
  render: () => html`
    <div style="max-width: 400px;">
      <cap-input label="Email" placeholder="you@example.com" type="email" required></cap-input>
    </div>
  `,
};

export const Password: Story = {
  render: () => html`
    <div style="max-width: 400px;">
      <cap-input type="password" label="Password" placeholder="Enter your password"></cap-input>
    </div>
  `,
};

export const Search: Story = {
  render: () => html`
    <div style="max-width: 400px;">
      <cap-input type="search" label="Search" placeholder="Search..." value="some query"></cap-input>
    </div>
  `,
};