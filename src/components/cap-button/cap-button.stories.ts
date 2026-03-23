import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  title: 'Components/Button',
  component: 'cap-button',
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'danger'],
      description: 'Visual style of the button',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the button',
    },
    type: {
      control: 'select',
      options: ['button', 'submit', 'reset'],
      description: 'HTML button type',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the button',
    },
    loading: {
      control: 'boolean',
      description: 'Shows a loading spinner',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Stretches button to full width',
    },
    ariaLabel: {
      control: 'text',
      description: 'Accessible label for icon-only buttons',
    },
  },
  args: {
    variant: 'primary',
    size: 'md',
    type: 'button',
    disabled: false,
    loading: false,
    fullWidth: false,
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <cap-button
      variant=${args.variant}
      size=${args.size}
      type=${args.type}
      ?disabled=${args.disabled}
      ?loading=${args.loading}
      ?full-width=${args.fullWidth}
      aria-label=${args.ariaLabel}
    >
      Click me
    </cap-button>
  `,
};

export const AllVariants: Story = {
  render: () => html`
    <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center;">
      <cap-button variant="primary">Primary</cap-button>
      <cap-button variant="secondary">Secondary</cap-button>
      <cap-button variant="outline">Outline</cap-button>
      <cap-button variant="danger">Danger</cap-button>
    </div>
  `,
};

export const Sizes: Story = {
  render: () => html`
    <div style="display: flex; gap: 16px; align-items: center;">
      <cap-button size="sm">Small</cap-button>
      <cap-button size="md">Medium</cap-button>
      <cap-button size="lg">Large</cap-button>
    </div>
  `,
};

export const States: Story = {
  render: () => html`
    <div style="display: flex; gap: 16px; align-items: center;">
      <cap-button>Normal</cap-button>
      <cap-button loading>Loading</cap-button>
      <cap-button disabled>Disabled</cap-button>
    </div>
  `,
};

export const WithIcons: Story = {
  render: () => html`
    <div style="display: flex; gap: 16px; align-items: center;">
      <cap-button>
        <span slot="icon-start">⚡</span>
        Icon Start
      </cap-button>
      <cap-button>
        Icon End
        <span slot="icon-end">→</span>
      </cap-button>
      <cap-button>
        <span slot="icon-start">🔍</span>
        Both Icons
        <span slot="icon-end">→</span>
      </cap-button>
    </div>
  `,
};

export const FullWidth: Story = {
  render: () => html`
    <div style="max-width: 400px;">
      <cap-button full-width>Full Width Button</cap-button>
    </div>
  `,
};