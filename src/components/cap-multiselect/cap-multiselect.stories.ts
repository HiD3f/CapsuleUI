import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';

const MONTHS = [
  { label: 'January', value: 'january' },
  { label: 'February', value: 'february' },
  { label: 'March', value: 'march' },
  { label: 'April', value: 'april' },
  { label: 'May', value: 'may' },
  { label: 'June', value: 'june' },
  { label: 'July', value: 'july' },
  { label: 'August', value: 'august' },
  { label: 'September', value: 'september' },
  { label: 'October', value: 'october' },
  { label: 'November', value: 'november' },
  { label: 'December', value: 'december' },
];

const FRAMEWORKS = [
  { label: 'Angular', value: 'angular' },
  { label: 'Astro', value: 'astro' },
  { label: 'Ember', value: 'ember', disabled: true },
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
  title: 'Components/Multiselect',
  component: 'cap-multiselect',
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    hint: { control: 'text' },
    error: { control: 'text' },
    placeholder: { control: 'text' },
    name: { control: 'text' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    filterable: { control: 'boolean' },
    overflow: { control: 'select', options: ['grow', 'single-line'] },
    maxVisibleChips: { control: 'number' },
  },
  args: {
    label: 'Month',
    placeholder: 'Pick one or more months…',
    disabled: false,
    required: false,
    filterable: false,
    overflow: 'grow',
    maxVisibleChips: 3,
  },
  parameters: {
    docs: {
      description: {
        component: `
Multi-value select with chip display. Implements WAI-ARIA multiselect listbox pattern (\`aria-multiselectable="true"\`). Options stay visible in the listbox after selection and are toggled on/off.

**Props:**
- \`overflow="grow"\` (default) — trigger expands vertically as chips are added
- \`overflow="single-line"\` — trigger stays one line; excess chips shown as "+N" badge (controlled by \`maxVisibleChips\`)
- \`filterable\` — adds a text input for filtering options
- **Backspace** on an empty input removes the last chip
- **Space / Enter** in the listbox toggles selection without closing
        `.trim(),
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <cap-multiselect
      label=${args.label}
      hint=${args.hint}
      error=${args.error}
      placeholder=${args.placeholder}
      name=${args.name}
      overflow=${args.overflow}
      max-visible-chips=${args.maxVisibleChips}
      .options=${MONTHS}
      ?disabled=${args.disabled}
      ?required=${args.required}
      ?filterable=${args.filterable}
    ></cap-multiselect>
  `,
};

export const WithSelections: Story = {
  render: () => html`
    <cap-multiselect
      label="Month"
      .options=${MONTHS}
      .value=${['january', 'march']}
    ></cap-multiselect>
  `,
};

export const Filterable: Story = {
  name: 'Filterable (filterable=true)',
  render: () => html`
    <cap-multiselect
      label="Framework"
      placeholder="Search…"
      hint="Type to filter options"
      filterable
      .options=${FRAMEWORKS}
    ></cap-multiselect>
  `,
};

export const SingleLine: Story = {
  name: 'Single-line overflow',
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 24px; max-width: 320px;">
      <p style="font-family: 'Courier New', monospace; font-size: 12px; margin: 0;">
        overflow="single-line", maxVisibleChips=2. Select 3+ to see the +N badge.
      </p>
      <cap-multiselect
        label="Framework"
        placeholder="Pick some…"
        overflow="single-line"
        max-visible-chips="2"
        .options=${FRAMEWORKS}
        .value=${['react', 'vue', 'svelte']}
      ></cap-multiselect>
    </div>
  `,
};

export const FilterableSingleLine: Story = {
  name: 'Filterable + single-line',
  render: () => html`
    <cap-multiselect
      label="Framework"
      placeholder="Search…"
      overflow="single-line"
      max-visible-chips="2"
      filterable
      .options=${FRAMEWORKS}
      .value=${['react', 'vue', 'svelte']}
    ></cap-multiselect>
  `,
};

export const States: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 24px; max-width: 320px;">
      <cap-multiselect
        label="Default"
        placeholder="Pick one or more months…"
        .options=${MONTHS}
      ></cap-multiselect>

      <cap-multiselect
        label="With hint"
        placeholder="Pick one or more months…"
        hint="You can select multiple"
        .options=${MONTHS}
      ></cap-multiselect>

      <cap-multiselect
        label="With error"
        placeholder="Pick one or more months…"
        error="Please select at least one option"
        .options=${MONTHS}
      ></cap-multiselect>

      <cap-multiselect
        label="Disabled"
        .options=${MONTHS}
        .value=${['january']}
        disabled
      ></cap-multiselect>

      <cap-multiselect
        label="Required"
        placeholder="Pick one or more months…"
        required
        .options=${MONTHS}
      ></cap-multiselect>
    </div>
  `,
};

export const Interactive: Story = {
  render: () => html`
    <cap-multiselect
      label="Favourite frameworks"
      placeholder="Pick some…"
      filterable
      id="interactive-ms"
      .options=${FRAMEWORKS}
    ></cap-multiselect>
    <p id="result" style="font-family: 'Courier New', monospace; margin-top: 16px; font-size: 13px;">
      Value: none
    </p>
    <script>
      document.querySelector('#interactive-ms').addEventListener('capChange', (e) => {
        document.querySelector('#result').textContent = 'Value: [' + e.detail.join(', ') + ']';
      });
    </script>
  `,
};

export const OpenDropdown: Story = {
  name: 'Open (dropdown visible)',
  render: () => html`
    <div style="min-height: 320px;">
      <cap-multiselect
        label="Month"
        placeholder="Pick one or more months…"
        default-open
        .options=${MONTHS}
        .value=${['january']}
      ></cap-multiselect>
    </div>
  `,
};

export const Keyboard: Story = {
  name: 'Keyboard Navigation',
  render: () => html`
    <p style="font-family: 'Courier New', monospace; font-size: 12px; margin-bottom: 16px;">
      ↑↓ navigate → Space/Enter toggle → Backspace removes last chip → Esc closes
    </p>
    <cap-multiselect
      label="Month"
      placeholder="Pick one or more months…"
      .options=${MONTHS}
    ></cap-multiselect>
  `,
};
