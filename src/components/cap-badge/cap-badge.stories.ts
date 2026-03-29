import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  title: 'Components/Badge',
  component: 'cap-badge',
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'success', 'warning', 'danger'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
  },
  args: {
    variant: 'default',
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        component: `A small visual label/pill for communicating status or categorisation. No interactivity — purely decorative. Supports five semantic variants and two sizes.`,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <cap-badge variant=${args.variant} size=${args.size}>${args.variant}</cap-badge>
  `,
};

export const AllVariants: Story = {
  name: 'All Variants',
  render: () => html`
    <div style="display: flex; flex-wrap: wrap; gap: 8px; align-items: center;">
      <cap-badge variant="default">Default</cap-badge>
      <cap-badge variant="primary">Primary</cap-badge>
      <cap-badge variant="success">Success</cap-badge>
      <cap-badge variant="warning">Warning</cap-badge>
      <cap-badge variant="danger">Danger</cap-badge>
    </div>
  `,
};

export const AllSizes: Story = {
  name: 'All Sizes',
  render: () => html`
    <div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center;">
      <div style="display: flex; flex-direction: column; gap: 6px; align-items: flex-start;">
        <span style="font-size: 11px; font-family: monospace; opacity: 0.5;">sm</span>
        <cap-badge variant="default"  size="sm">Default</cap-badge>
        <cap-badge variant="primary"  size="sm">Primary</cap-badge>
        <cap-badge variant="success"  size="sm">Success</cap-badge>
        <cap-badge variant="warning"  size="sm">Warning</cap-badge>
        <cap-badge variant="danger"   size="sm">Danger</cap-badge>
      </div>
      <div style="display: flex; flex-direction: column; gap: 6px; align-items: flex-start;">
        <span style="font-size: 11px; font-family: monospace; opacity: 0.5;">md</span>
        <cap-badge variant="default"  size="md">Default</cap-badge>
        <cap-badge variant="primary"  size="md">Primary</cap-badge>
        <cap-badge variant="success"  size="md">Success</cap-badge>
        <cap-badge variant="warning"  size="md">Warning</cap-badge>
        <cap-badge variant="danger"   size="md">Danger</cap-badge>
      </div>
    </div>
  `,
};

export const InContext: Story = {
  name: 'In Context',
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 12px; font-family: Georgia, serif; font-size: 14px;">
      <div style="display: flex; align-items: center; gap: 8px;">
        Payment status <cap-badge variant="success">Paid</cap-badge>
      </div>
      <div style="display: flex; align-items: center; gap: 8px;">
        Build status <cap-badge variant="danger">Failed</cap-badge>
      </div>
      <div style="display: flex; align-items: center; gap: 8px;">
        Review <cap-badge variant="warning" size="sm">Needs work</cap-badge>
      </div>
      <div style="display: flex; align-items: center; gap: 8px;">
        Release <cap-badge variant="primary" size="sm">v2.0</cap-badge>
      </div>
    </div>
  `,
};
