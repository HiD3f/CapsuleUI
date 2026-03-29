import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  title: 'Components/Feedback/Spinner',
  component: 'cap-spinner',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Loading indicator. Retro-style rotating square with a corner fill to show direction.

**Props:** \`size\` (\`sm\` | \`md\` | \`lg\`), \`label\` (screen reader text, default "Loading…")
        `.trim(),
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div style="display: flex; align-items: center; gap: 24px; padding: 40px;">
      <cap-spinner size="sm"></cap-spinner>
      <cap-spinner size="md"></cap-spinner>
      <cap-spinner size="lg"></cap-spinner>
    </div>
  `,
};

export const InContext: Story = {
  name: 'In context',
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px; padding: 24px; font-family: 'Courier New', monospace; font-size: 13px;">
      <div style="display: flex; align-items: center; gap: 8px;">
        <cap-spinner size="sm"></cap-spinner>
        <span>Saving…</span>
      </div>
      <div style="display: flex; align-items: center; gap: 8px;">
        <cap-spinner size="md"></cap-spinner>
        <span>Loading data…</span>
      </div>
      <cap-button variant="primary" disabled style="display: inline-flex; align-items: center; gap: 8px; pointer-events: none;">
        <cap-spinner size="sm" label="Processing"></cap-spinner>
        Processing…
      </cap-button>
    </div>
  `,
};
