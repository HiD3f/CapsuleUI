import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  title: 'Components/RadioGroup',
  component: 'cap-radio-group',
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    hint: { control: 'text' },
    error: { control: 'text' },
    value: { control: 'text' },
    name: { control: 'text' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
  },
  args: {
    label: 'Pick an option',
    value: '',
    disabled: false,
    required: false,
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <cap-radio-group
      label=${args.label}
      hint=${args.hint}
      error=${args.error}
      value=${args.value}
      name=${args.name || 'default-group'}
      ?disabled=${args.disabled}
      ?required=${args.required}
    >
      <cap-radio label="Option A" value="a"></cap-radio>
      <cap-radio label="Option B" value="b"></cap-radio>
      <cap-radio label="Option C" value="c"></cap-radio>
    </cap-radio-group>
  `,
};

export const WithSelection: Story = {
  render: () => html`
    <cap-radio-group label="Favourite season" value="summer" name="season">
      <cap-radio label="Spring" value="spring"></cap-radio>
      <cap-radio label="Summer" value="summer"></cap-radio>
      <cap-radio label="Autumn" value="autumn"></cap-radio>
      <cap-radio label="Winter" value="winter"></cap-radio>
    </cap-radio-group>
  `,
};

export const States: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 32px;">
      <cap-radio-group label="Default" name="s1">
        <cap-radio label="Option A" value="a"></cap-radio>
        <cap-radio label="Option B" value="b"></cap-radio>
      </cap-radio-group>

      <cap-radio-group label="With hint" name="s2" hint="Choose the option that best describes you">
        <cap-radio label="Option A" value="a"></cap-radio>
        <cap-radio label="Option B" value="b"></cap-radio>
      </cap-radio-group>

      <cap-radio-group label="With error" name="s3" error="Please select an option">
        <cap-radio label="Option A" value="a"></cap-radio>
        <cap-radio label="Option B" value="b"></cap-radio>
      </cap-radio-group>

      <cap-radio-group label="Disabled" name="s4" disabled value="a">
        <cap-radio label="Option A" value="a"></cap-radio>
        <cap-radio label="Option B" value="b"></cap-radio>
      </cap-radio-group>

      <cap-radio-group label="Required" name="s5" required>
        <cap-radio label="Option A" value="a"></cap-radio>
        <cap-radio label="Option B" value="b"></cap-radio>
      </cap-radio-group>
    </div>
  `,
};

export const Interactive: Story = {
  render: () => html`
    <cap-radio-group label="What's your preferred stack?" name="stack" id="interactive-group">
      <cap-radio label="Frontend" value="frontend"></cap-radio>
      <cap-radio label="Backend" value="backend"></cap-radio>
      <cap-radio label="Fullstack" value="fullstack"></cap-radio>
    </cap-radio-group>
    <p id="selected" style="font-family: 'Courier New', monospace; margin-top: 16px;">Selected: none</p>
    <script>
      document.querySelector('#interactive-group').addEventListener('capChange', (e) => {
        document.querySelector('#selected').textContent = 'Selected: ' + e.detail;
      });
    </script>
  `,
};
