import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  title: 'Components/Feedback/Alert',
  component: 'cap-alert',
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'info', 'success', 'warning', 'danger'],
      description: 'Visual style variant',
    },
    heading: {
      control: 'text',
      description: 'Bold title line above the message',
    },
    dismissible: {
      control: 'boolean',
      description: 'Show a dismiss (×) button',
    },
  },
  args: {
    variant: 'default',
    heading: '',
    dismissible: false,
  },
  parameters: {
    docs: {
      description: {
        component: `
Inline status banner. Renders with \`role="alert"\` so screen readers announce it immediately.

**Variants:** \`default\`, \`info\`, \`success\`, \`warning\`, \`danger\`

**Slots:** default (message text), \`actions\` (inline action buttons)

**Props:** \`heading\`, \`dismissible\`

**Event:** \`capDismiss\` — fired when the × button is clicked
        `.trim(),
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: (args) => html`
    <div style="padding: 24px; max-width: 560px;">
      <cap-alert
        variant=${args.variant}
        heading=${args.heading ?? ''}
        ?dismissible=${args.dismissible}
      >
        This is an example alert message. Use the controls below to customise it.
      </cap-alert>
    </div>
  `,
};

export const Default: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 12px; padding: 24px; max-width: 560px;">
      <cap-alert variant="default">This is a default alert with useful information.</cap-alert>
      <cap-alert variant="info">Your account has been updated.</cap-alert>
      <cap-alert variant="success">File uploaded successfully.</cap-alert>
      <cap-alert variant="warning">Your trial expires in 3 days.</cap-alert>
      <cap-alert variant="danger">Failed to save changes. Please try again.</cap-alert>
    </div>
  `,
};

export const WithHeading: Story = {
  name: 'With heading',
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 12px; padding: 24px; max-width: 560px;">
      <cap-alert variant="success" heading="Upload complete">
        3 files were uploaded to your workspace.
      </cap-alert>
      <cap-alert variant="danger" heading="Connection failed">
        Unable to reach the server. Check your network and try again.
      </cap-alert>
      <cap-alert variant="warning" heading="Unsaved changes">
        You have unsaved changes that will be lost if you navigate away.
      </cap-alert>
    </div>
  `,
};

export const Dismissible: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 12px; padding: 24px; max-width: 560px;">
      <cap-alert variant="info" heading="New feature available" dismissible>
        Try the new dashboard experience. Visit settings to enable it.
      </cap-alert>
      <cap-alert variant="warning" dismissible>
        Maintenance window scheduled for Sunday 02:00–04:00 UTC.
      </cap-alert>
    </div>
  `,
};

export const WithActions: Story = {
  name: 'With actions',
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px; padding: 24px; max-width: 560px;">
      <cap-alert variant="warning" heading="Unsaved changes">
        You have unsaved changes. Save or discard before leaving.
        <div slot="actions">
          <cap-button size="sm" variant="outline">Discard</cap-button>
          <cap-button size="sm" variant="primary">Save now</cap-button>
        </div>
      </cap-alert>

      <cap-alert variant="danger" heading="Payment failed">
        Your last payment was declined. Update your billing details.
        <div slot="actions">
          <cap-button size="sm" variant="outline">Dismiss</cap-button>
          <cap-button size="sm" variant="primary">Update billing</cap-button>
        </div>
      </cap-alert>
    </div>
  `,
};
