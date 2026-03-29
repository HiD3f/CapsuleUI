import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  title: 'Components/Switch',
  component: 'cap-switch',
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    hint: { control: 'text' },
    error: { control: 'text' },
    name: { control: 'text' },
    value: { control: 'text' },
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
  },
  args: {
    label: 'Enable notifications',
    checked: false,
    disabled: false,
    required: false,
    value: 'on',
  },
  parameters: {
    docs: {
      description: {
        component: `iOS-style toggle switch. Semantically uses \`role="switch"\` with \`aria-checked\`. A hidden \`<input type="checkbox">\` handles form submission. Emits \`capChange\` with \`{ checked, value }\` on toggle.`,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  name: 'Default (off)',
  render: (args) => html`
    <cap-switch
      label=${args.label}
      hint=${args.hint}
      error=${args.error}
      name=${args.name}
      value=${args.value}
      ?checked=${args.checked}
      ?disabled=${args.disabled}
      ?required=${args.required}
    ></cap-switch>
  `,
};

export const Checked: Story = {
  name: 'Checked (on)',
  render: () => html`
    <cap-switch label="Enable notifications" checked></cap-switch>
  `,
};

export const DisabledOff: Story = {
  name: 'Disabled off',
  render: () => html`
    <cap-switch label="Disabled off" disabled></cap-switch>
  `,
};

export const DisabledOn: Story = {
  name: 'Disabled on',
  render: () => html`
    <cap-switch label="Disabled on" disabled checked></cap-switch>
  `,
};

export const WithLabel: Story = {
  name: 'With label',
  render: () => html`
    <cap-switch label="Dark mode" hint="Applies to all pages in your account"></cap-switch>
  `,
};

export const WithError: Story = {
  name: 'With error',
  render: () => html`
    <cap-switch
      label="Accept terms"
      required
      error="You must accept the terms to continue"
    ></cap-switch>
  `,
};

export const FullFormDemo: Story = {
  name: 'Full form demo',
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 20px; max-width: 320px;">
      <cap-switch
        label="Email notifications"
        hint="Receive updates via email"
        checked
      ></cap-switch>
      <cap-switch
        label="SMS alerts"
        hint="Receive urgent alerts by text"
      ></cap-switch>
      <cap-switch
        label="Marketing emails"
        hint="Hear about new features and offers"
        disabled
      ></cap-switch>
      <cap-switch
        label="Accept terms &amp; conditions"
        required
        error="Required to proceed"
      ></cap-switch>
    </div>
  `,
};
