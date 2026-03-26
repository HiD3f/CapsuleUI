import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';

const FRAMEWORKS = [
  { label: 'Angular', value: 'angular' },
  { label: 'Astro', value: 'astro' },
  { label: 'Ember', value: 'ember' },
  { label: 'Lit', value: 'lit' },
  { label: 'Next.js', value: 'nextjs' },
  { label: 'Nuxt', value: 'nuxt' },
  { label: 'React', value: 'react' },
  { label: 'Remix', value: 'remix' },
  { label: 'Solid', value: 'solid' },
  { label: 'Stencil', value: 'stencil' },
  { label: 'Svelte', value: 'svelte' },
  { label: 'Vue', value: 'vue' },
];

const meta: Meta = {
  title: 'Components/Combobox',
  component: 'cap-combobox',
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
    freeText: { control: 'boolean' },
  },
  args: {
    label: 'Framework',
    placeholder: 'Search…',
    value: '',
    disabled: false,
    required: false,
    freeText: false,
  },
  parameters: {
    docs: {
      description: {
        component: `Filterable select with a text input. \`freeText=false\` (default): must select from list, blurring without selecting reverts input. \`freeText=true\`: typed value is accepted as-is. Implements WAI-ARIA Editable Combobox — \`role="combobox"\` on input, \`aria-autocomplete="list"\`, \`aria-activedescendant\`. Hidden \`<input type="hidden">\` for form submission.`,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <cap-combobox
      label=${args.label}
      hint=${args.hint}
      error=${args.error}
      placeholder=${args.placeholder}
      value=${args.value}
      name=${args.name}
      .options=${FRAMEWORKS}
      ?disabled=${args.disabled}
      ?required=${args.required}
      ?free-text=${args.freeText}
    ></cap-combobox>
  `,
};

export const WithSelection: Story = {
  render: () => html`
    <cap-combobox
      label="Framework"
      value="stencil"
      .options=${FRAMEWORKS}
    ></cap-combobox>
  `,
};

export const FreeText: Story = {
  name: 'Free Text (freeText=true)',
  render: () => html`
    <cap-combobox
      label="Stack"
      placeholder="Type anything or pick from list…"
      hint="You can enter a custom value or pick a suggestion"
      free-text
      .options=${FRAMEWORKS}
    ></cap-combobox>
  `,
};

export const States: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 24px; max-width: 320px;">
      <cap-combobox
        label="Default"
        placeholder="Search…"
        .options=${FRAMEWORKS}
      ></cap-combobox>

      <cap-combobox
        label="With hint"
        placeholder="Search…"
        hint="Start typing to filter options"
        .options=${FRAMEWORKS}
      ></cap-combobox>

      <cap-combobox
        label="With error"
        placeholder="Search…"
        error="Please select a valid option"
        .options=${FRAMEWORKS}
      ></cap-combobox>

      <cap-combobox
        label="Disabled"
        value="react"
        .options=${FRAMEWORKS}
        disabled
      ></cap-combobox>

      <cap-combobox
        label="Required"
        placeholder="Search…"
        .options=${FRAMEWORKS}
        required
      ></cap-combobox>
    </div>
  `,
};

export const Interactive: Story = {
  render: () => html`
    <cap-combobox
      label="Favourite framework"
      placeholder="Search frameworks…"
      id="interactive-combobox"
      .options=${FRAMEWORKS}
    ></cap-combobox>
    <p id="result" style="font-family: 'Courier New', monospace; margin-top: 16px;">Value: none</p>
    <script>
      document.querySelector('#interactive-combobox').addEventListener('capChange', (e) => {
        document.querySelector('#result').textContent = 'Value: ' + e.detail;
      });
    </script>
  `,
};

export const OpenDropdown: Story = {
  name: 'Open (dropdown visible)',
  render: () => html`
    <div style="min-height: 320px;">
      <cap-combobox
        label="Framework"
        placeholder="Search…"
        default-open
        .options=${FRAMEWORKS}
      ></cap-combobox>
    </div>
  `,
};

export const Keyboard: Story = {
  name: 'Keyboard Navigation',
  render: () => html`
    <p style="font-family: 'Courier New', monospace; font-size: 12px; margin-bottom: 16px;">
      Type to filter → ↑↓ navigate → Enter/Tab to select → Esc to cancel
    </p>
    <cap-combobox
      label="Framework"
      placeholder="Type to filter…"
      .options=${FRAMEWORKS}
    ></cap-combobox>
  `,
};
