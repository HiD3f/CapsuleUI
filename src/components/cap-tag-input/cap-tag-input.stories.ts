import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';

const TECHS = [
  { label: 'CSS', value: 'css' },
  { label: 'GraphQL', value: 'graphql' },
  { label: 'HTML', value: 'html' },
  { label: 'JavaScript', value: 'javascript' },
  { label: 'Node.js', value: 'nodejs' },
  { label: 'Python', value: 'python' },
  { label: 'React', value: 'react' },
  { label: 'Rust', value: 'rust' },
  { label: 'SQL', value: 'sql' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'Vue', value: 'vue' },
  { label: 'WebAssembly', value: 'wasm' },
];

const meta: Meta = {
  title: 'Components/Tag Input',
  component: 'cap-tag-input',
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    hint: { control: 'text' },
    error: { control: 'text' },
    placeholder: { control: 'text' },
    name: { control: 'text' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
  },
  args: {
    label: 'Tags',
    placeholder: 'Add a tag…',
    disabled: false,
    required: false,
  },
  parameters: {
    docs: {
      description: {
        component: `
Free-text tag input. Type and press **Enter** or **Tab** to add a tag. **Backspace** on an empty input removes the last tag. Duplicate tags are silently ignored.

When \`options\` are provided, an autocomplete suggestions dropdown appears as you type. Selecting a suggestion stores the option's \`value\`; free-text tags store the typed string.
        `.trim(),
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <cap-tag-input
      label=${args.label}
      hint=${args.hint}
      error=${args.error}
      placeholder=${args.placeholder}
      name=${args.name}
      .options=${TECHS}
      ?disabled=${args.disabled}
      ?required=${args.required}
    ></cap-tag-input>
  `,
};

export const WithTags: Story = {
  name: 'Free text (no suggestions)',
  render: () => html`
    <cap-tag-input
      label="Tags"
      placeholder="Add a tag…"
      hint="No options provided — pure free text mode"
      .value=${['design', 'typescript', 'accessibility']}
    ></cap-tag-input>
  `,
};

export const WithSuggestions: Story = {
  name: 'With suggestions (options provided)',
  render: () => html`
    <cap-tag-input
      label="Technologies"
      placeholder="Type to search or add…"
      hint="Select from suggestions or type your own"
      .options=${TECHS}
    ></cap-tag-input>
  `,
};

export const WithSuggestionsAndTags: Story = {
  name: 'With suggestions + pre-filled tags',
  render: () => html`
    <cap-tag-input
      label="Technologies"
      placeholder="Type to search or add…"
      .options=${TECHS}
      .value=${['typescript', 'react', 'custom-tag']}
    ></cap-tag-input>
  `,
};

export const States: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 24px; max-width: 360px;">
      <cap-tag-input
        label="Default"
        placeholder="Add a tag…"
      ></cap-tag-input>

      <cap-tag-input
        label="With hint"
        placeholder="Add a tag…"
        hint="Press Enter or Tab to add"
      ></cap-tag-input>

      <cap-tag-input
        label="With error"
        placeholder="Add a tag…"
        error="At least one tag is required"
        .value=${[]}
      ></cap-tag-input>

      <cap-tag-input
        label="Disabled"
        .value=${['design', 'systems']}
        disabled
      ></cap-tag-input>

      <cap-tag-input
        label="Required"
        placeholder="Add a tag…"
        required
      ></cap-tag-input>
    </div>
  `,
};

export const Interactive: Story = {
  render: () => html`
    <cap-tag-input
      label="Skills"
      placeholder="Add a skill…"
      id="interactive-tags"
      .options=${TECHS}
    ></cap-tag-input>
    <p id="result" style="font-family: 'Courier New', monospace; margin-top: 16px; font-size: 13px;">
      Value: []
    </p>
    <script>
      document.querySelector('#interactive-tags').addEventListener('capChange', (e) => {
        document.querySelector('#result').textContent = 'Value: [' + e.detail.join(', ') + ']';
      });
    </script>
  `,
};

export const OpenSuggestions: Story = {
  name: 'Open suggestions (dropdown visible)',
  render: () => html`
    <div style="min-height: 320px;">
      <cap-tag-input
        label="Technologies"
        placeholder="Type to search…"
        default-open
        .options=${TECHS}
      ></cap-tag-input>
    </div>
  `,
};

export const Keyboard: Story = {
  name: 'Keyboard hints',
  render: () => html`
    <p style="font-family: 'Courier New', monospace; font-size: 12px; margin-bottom: 16px;">
      Type a tag → Enter or Tab to add → Backspace to remove last
    </p>
    <cap-tag-input
      label="Tags"
      placeholder="Add a tag…"
    ></cap-tag-input>
  `,
};
