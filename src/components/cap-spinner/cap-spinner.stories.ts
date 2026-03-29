import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  title: 'Components/Feedback/Spinner',
  component: 'cap-spinner',
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['circle', 'ascii', 'dots', 'block', 'bar'],
      description: 'Animation style',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the spinner',
    },
    label: {
      control: 'text',
      description: 'Accessible label announced to screen readers',
    },
  },
  args: {
    variant: 'circle',
    size: 'md',
    label: 'Loading…',
  },
  parameters: {
    docs: {
      description: {
        component: `
Loading indicator. Five animation styles via the \`variant\` prop.

| Variant | Style |
|---|---|
| \`circle\` (default) | Spinning circle with a gap |
| \`ascii\` | Cycles \`|\` \`/\` \`—\` \`\\\` — classic terminal spinner |
| \`dots\` | Three dots pulsing in sequence |
| \`block\` | Blinking \`█\` cursor |
| \`bar\` | Four segments lighting up in sequence |

**Props:** \`variant\`, \`size\` (\`sm\` | \`md\` | \`lg\`), \`label\` (screen reader text)
        `.trim(),
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: (args) => html`
    <div style="padding: 40px; display: flex; align-items: center; justify-content: center;">
      <cap-spinner
        variant=${args.variant}
        size=${args.size}
        label=${args.label}
      ></cap-spinner>
    </div>
  `,
};

export const AllVariants: Story = {
  name: 'All variants',
  render: () => html`
    <div style="display: flex; align-items: center; gap: 40px; padding: 40px; flex-wrap: wrap; font-family: 'Courier New', monospace; font-size: 12px;">
      <div style="display: flex; flex-direction: column; align-items: center; gap: 12px;">
        <cap-spinner variant="circle" size="md"></cap-spinner>
        <span>circle</span>
      </div>
      <div style="display: flex; flex-direction: column; align-items: center; gap: 12px;">
        <cap-spinner variant="ascii" size="md"></cap-spinner>
        <span>ascii</span>
      </div>
      <div style="display: flex; flex-direction: column; align-items: center; gap: 12px;">
        <cap-spinner variant="dots" size="md"></cap-spinner>
        <span>dots</span>
      </div>
      <div style="display: flex; flex-direction: column; align-items: center; gap: 12px;">
        <cap-spinner variant="block" size="md"></cap-spinner>
        <span>block</span>
      </div>
      <div style="display: flex; flex-direction: column; align-items: center; gap: 12px;">
        <cap-spinner variant="bar" size="md"></cap-spinner>
        <span>bar</span>
      </div>
    </div>
  `,
};

export const Sizes: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 32px; padding: 40px; font-family: 'Courier New', monospace; font-size: 12px;">
      ${(['circle', 'ascii', 'dots', 'block', 'bar'] as const).map(variant => html`
        <div style="display: flex; align-items: center; gap: 32px;">
          <span style="width: 48px; color: #666;">${variant}</span>
          <cap-spinner variant=${variant} size="sm"></cap-spinner>
          <cap-spinner variant=${variant} size="md"></cap-spinner>
          <cap-spinner variant=${variant} size="lg"></cap-spinner>
        </div>
      `)}
    </div>
  `,
};

export const Circle: Story = {
  render: () => html`
    <div style="display: flex; align-items: center; gap: 24px; padding: 40px;">
      <cap-spinner variant="circle" size="sm"></cap-spinner>
      <cap-spinner variant="circle" size="md"></cap-spinner>
      <cap-spinner variant="circle" size="lg"></cap-spinner>
    </div>
  `,
};

export const Ascii: Story = {
  name: 'ASCII',
  render: () => html`
    <div style="display: flex; align-items: center; gap: 24px; padding: 40px;">
      <cap-spinner variant="ascii" size="sm"></cap-spinner>
      <cap-spinner variant="ascii" size="md"></cap-spinner>
      <cap-spinner variant="ascii" size="lg"></cap-spinner>
    </div>
  `,
};

export const Dots: Story = {
  render: () => html`
    <div style="display: flex; align-items: center; gap: 24px; padding: 40px;">
      <cap-spinner variant="dots" size="sm"></cap-spinner>
      <cap-spinner variant="dots" size="md"></cap-spinner>
      <cap-spinner variant="dots" size="lg"></cap-spinner>
    </div>
  `,
};

export const Block: Story = {
  render: () => html`
    <div style="display: flex; align-items: center; gap: 24px; padding: 40px;">
      <cap-spinner variant="block" size="sm"></cap-spinner>
      <cap-spinner variant="block" size="md"></cap-spinner>
      <cap-spinner variant="block" size="lg"></cap-spinner>
    </div>
  `,
};

export const Bar: Story = {
  render: () => html`
    <div style="display: flex; align-items: center; gap: 24px; padding: 40px;">
      <cap-spinner variant="bar" size="sm"></cap-spinner>
      <cap-spinner variant="bar" size="md"></cap-spinner>
      <cap-spinner variant="bar" size="lg"></cap-spinner>
    </div>
  `,
};

export const InContext: Story = {
  name: 'In context',
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px; padding: 24px; font-family: 'Courier New', monospace; font-size: 13px;">
      <div style="display: flex; align-items: center; gap: 8px;">
        <cap-spinner variant="circle" size="sm"></cap-spinner>
        <span>Saving…</span>
      </div>
      <div style="display: flex; align-items: center; gap: 8px;">
        <cap-spinner variant="ascii" size="md"></cap-spinner>
        <span>Connecting to server…</span>
      </div>
      <div style="display: flex; align-items: center; gap: 8px;">
        <cap-spinner variant="dots" size="sm"></cap-spinner>
        <span>Loading data…</span>
      </div>
    </div>
  `,
};
