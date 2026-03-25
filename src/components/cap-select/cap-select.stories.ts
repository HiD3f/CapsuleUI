import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';

const SEASONS = [
  { label: 'Spring', value: 'spring' },
  { label: 'Summer', value: 'summer' },
  { label: 'Autumn', value: 'autumn' },
  { label: 'Winter', value: 'winter' },
];

const FONTS = [
  { label: 'Georgia', value: 'georgia' },
  { label: 'Courier New', value: 'courier' },
  { label: 'Times New Roman', value: 'times' },
  { label: 'Arial (unavailable)', value: 'arial', disabled: true },
];

const meta: Meta = {
  title: 'Components/Select',
  component: 'cap-select',
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    hint: { control: 'text' },
    error: { control: 'text' },
    placeholder: { control: 'text' },
    value: { control: 'text' },
    name: { control: 'text' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
  },
  args: {
    label: 'Pick a season',
    placeholder: 'Select an option…',
    value: '',
    disabled: false,
    required: false,
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <cap-select
      label=${args.label}
      hint=${args.hint}
      error=${args.error}
      placeholder=${args.placeholder}
      value=${args.value}
      name=${args.name}
      .options=${SEASONS}
      ?disabled=${args.disabled}
      ?required=${args.required}
    ></cap-select>
  `,
};

export const WithSelection: Story = {
  render: () => html`
    <cap-select
      label="Favourite season"
      value="summer"
      .options=${SEASONS}
    ></cap-select>
  `,
};

export const States: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 24px; max-width: 320px;">
      <cap-select
        label="Default"
        placeholder="Select…"
        .options=${SEASONS}
      ></cap-select>

      <cap-select
        label="With hint"
        placeholder="Select…"
        hint="Choose the season you were born in"
        .options=${SEASONS}
      ></cap-select>

      <cap-select
        label="With error"
        placeholder="Select…"
        error="Please select an option"
        .options=${SEASONS}
      ></cap-select>

      <cap-select
        label="Disabled"
        value="summer"
        .options=${SEASONS}
        disabled
      ></cap-select>

      <cap-select
        label="Required"
        placeholder="Select…"
        .options=${SEASONS}
        required
      ></cap-select>

      <cap-select
        label="With disabled option"
        placeholder="Select a font…"
        .options=${FONTS}
      ></cap-select>
    </div>
  `,
};

export const Interactive: Story = {
  render: () => html`
    <cap-select
      label="What's your stack?"
      placeholder="Choose one…"
      id="interactive-select"
      .options=${[
        { label: 'Frontend', value: 'frontend' },
        { label: 'Backend', value: 'backend' },
        { label: 'Fullstack', value: 'fullstack' },
        { label: 'DevOps', value: 'devops' },
      ]}
    ></cap-select>
    <p id="selected" style="font-family: 'Courier New', monospace; margin-top: 16px;">Selected: none</p>
    <script>
      document.querySelector('#interactive-select').addEventListener('capChange', (e) => {
        document.querySelector('#selected').textContent = 'Selected: ' + e.detail;
      });
    </script>
  `,
};

export const Keyboard: Story = {
  name: 'Keyboard Navigation',
  render: () => html`
    <p style="font-family: 'Courier New', monospace; font-size: 12px; margin-bottom: 16px;">
      Tab to focus → Space/Enter/↓ to open → ↑↓ navigate → Enter/Space to select → Esc to cancel
    </p>
    <cap-select
      label="Stack preference"
      placeholder="Open with keyboard…"
      .options=${[
        { label: 'Frontend', value: 'frontend' },
        { label: 'Backend', value: 'backend' },
        { label: 'Fullstack', value: 'fullstack' },
        { label: 'DevOps (unavailable)', value: 'devops', disabled: true },
        { label: 'Mobile', value: 'mobile' },
      ]}
    ></cap-select>
  `,
};
