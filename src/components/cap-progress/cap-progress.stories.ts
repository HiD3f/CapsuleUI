import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  title: 'Components/Progress',
  component: 'cap-progress',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Progress bar. Supports determinate (numeric \`value\`) and indeterminate (no \`value\`) modes.

**Props:** \`value\` (0–\`max\`), \`max\` (default 100), \`label\`, \`show-value\`, \`variant\`

**Variants:** \`default\`, \`success\`, \`warning\`, \`danger\`
        `.trim(),
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 20px; padding: 24px; max-width: 480px;">
      <cap-progress value="0" label="Not started"></cap-progress>
      <cap-progress value="35" label="In progress" show-value></cap-progress>
      <cap-progress value="72" label="Almost there" show-value></cap-progress>
      <cap-progress value="100" label="Complete" show-value></cap-progress>
    </div>
  `,
};

export const Variants: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 20px; padding: 24px; max-width: 480px;">
      <cap-progress value="60" label="Default" variant="default" show-value></cap-progress>
      <cap-progress value="60" label="Success" variant="success" show-value></cap-progress>
      <cap-progress value="60" label="Warning" variant="warning" show-value></cap-progress>
      <cap-progress value="60" label="Danger"  variant="danger"  show-value></cap-progress>
    </div>
  `,
};

export const Indeterminate: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 20px; padding: 24px; max-width: 480px;">
      <cap-progress label="Loading…"></cap-progress>
      <cap-progress label="Uploading file…" variant="success"></cap-progress>
    </div>
  `,
};

export const Animated: Story = {
  name: 'Animated (live update)',
  render: () => html`
    <div style="padding: 24px; max-width: 480px; font-family: 'Courier New', monospace;">
      <cap-progress id="anim-bar" value="0" label="Downloading" show-value></cap-progress>
      <div style="margin-top: 16px; display: flex; gap: 12px;">
        <cap-button id="anim-start" size="sm">Start</cap-button>
        <cap-button id="anim-reset" size="sm" variant="outline">Reset</cap-button>
      </div>
      <script>
        (function () {
          const bar = document.querySelector('#anim-bar');
          let iv = null;
          document.querySelector('#anim-start').addEventListener('click', () => {
            if (iv) return;
            bar.value = 0;
            iv = setInterval(() => {
              bar.value = Math.min(100, (bar.value || 0) + Math.random() * 8);
              if (bar.value >= 100) { clearInterval(iv); iv = null; bar.variant = 'success'; }
            }, 200);
          });
          document.querySelector('#anim-reset').addEventListener('click', () => {
            clearInterval(iv); iv = null;
            bar.value = 0;
            bar.variant = 'default';
          });
        })();
      </script>
    </div>
  `,
};
