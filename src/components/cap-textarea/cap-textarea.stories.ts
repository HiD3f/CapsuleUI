import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  title: 'Components/Textarea',
  component: 'cap-textarea',
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'text' },
    placeholder: { control: 'text' },
    label: { control: 'text' },
    hint: { control: 'text' },
    error: { control: 'text' },
    success: { control: 'text' },
    rows: { control: 'number' },
    maxlength: { control: 'number' },
    resize: {
      control: 'select',
      options: ['none', 'vertical', 'both'],
    },
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' },
    required: { control: 'boolean' },
  },
  args: {
    label: 'Label',
    placeholder: 'Type something...',
    rows: 4,
    resize: 'vertical',
    disabled: false,
    readonly: false,
    required: false,
  },
  parameters: {
    docs: {
      description: {
        component: `Multi-line text input. \`rows\` sets initial height. \`resize\`: \`none\`, \`vertical\` (default), \`both\`. \`maxlength\` shows a live character counter that turns red at the limit. \`aria-required\`, \`aria-invalid\`, and \`aria-describedby\` set automatically.`,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <cap-textarea
      label=${args.label}
      placeholder=${args.placeholder}
      value=${args.value}
      hint=${args.hint}
      error=${args.error}
      success=${args.success}
      rows=${args.rows}
      maxlength=${args.maxlength}
      resize=${args.resize}
      ?disabled=${args.disabled}
      ?readonly=${args.readonly}
      ?required=${args.required}
    ></cap-textarea>
  `,
};

export const States: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px; max-width: 500px;">
      <cap-textarea label="Default"  placeholder="Default state"></cap-textarea>
      <cap-textarea label="Hint"     placeholder="With hint"    hint="This is a helpful hint"></cap-textarea>
      <cap-textarea label="Error"    placeholder="With error"   error="This field is required"></cap-textarea>
      <cap-textarea label="Success"  placeholder="With success" success="Looks good!"></cap-textarea>
      <cap-textarea label="Disabled" placeholder="Disabled"     disabled></cap-textarea>
      <cap-textarea label="Readonly" value="Read only value"    readonly></cap-textarea>
    </div>
  `,
};

export const WithCounter: Story = {
  render: () => html`
    <div style="max-width: 500px;">
      <cap-textarea
        label="Bio"
        placeholder="Tell us about yourself..."
        maxlength="200"
        hint="Keep it short and sweet"
      ></cap-textarea>
    </div>
  `,
};

export const Required: Story = {
  render: () => html`
    <div style="max-width: 500px;">
      <cap-textarea
        label="Message"
        placeholder="Write your message..."
        required
      ></cap-textarea>
    </div>
  `,
};

export const ResizeOptions: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px; max-width: 500px;">
      <cap-textarea label="Resize: none"     placeholder="Can't resize"        resize="none"></cap-textarea>
      <cap-textarea label="Resize: vertical" placeholder="Vertical only"       resize="vertical"></cap-textarea>
      <cap-textarea label="Resize: both"     placeholder="Both directions"      resize="both"></cap-textarea>
    </div>
  `,
};