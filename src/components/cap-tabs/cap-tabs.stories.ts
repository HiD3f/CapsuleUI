import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';

const BASIC_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'details',  label: 'Details' },
  { id: 'settings', label: 'Settings' },
];

const TABS_WITH_DISABLED = [
  { id: 'profile',   label: 'Profile' },
  { id: 'security',  label: 'Security' },
  { id: 'billing',   label: 'Billing', disabled: true },
  { id: 'advanced',  label: 'Advanced' },
];

const meta: Meta = {
  title: 'Components/Tabs',
  component: 'cap-tabs',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Tab strip with associated panels. Follows the WAI-ARIA Tabs pattern.

**Prop:** \`tabs\` — array of \`{ id, label, disabled? }\`

**Prop:** \`active-tab\` — id of the currently active tab (mutable)

**Event:** \`capChange\` — detail: \`{ id }\`

**Content:** Use named slots matching the tab \`id\`. E.g. \`<div slot="overview">…</div>\`.

**Keyboard:** ← → move focus between tabs · Home / End jump to first/last
        `.trim(),
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div style="max-width: 560px; padding: 24px; font-family: 'Courier New', monospace; font-size: 13px;">
      <cap-tabs .tabs=${BASIC_TABS}>
        <div slot="overview">
          <p style="margin: 0;"><strong>Overview</strong></p>
          <p>This panel shows a high-level summary of the item.</p>
        </div>
        <div slot="details">
          <p style="margin: 0;"><strong>Details</strong></p>
          <p>Technical specifications and metadata are listed here.</p>
        </div>
        <div slot="settings">
          <p style="margin: 0;"><strong>Settings</strong></p>
          <p>Configuration options for the selected item.</p>
        </div>
      </cap-tabs>
    </div>
  `,
};

export const WithDisabled: Story = {
  name: 'With disabled tab',
  render: () => html`
    <div style="max-width: 560px; padding: 24px; font-family: 'Courier New', monospace; font-size: 13px;">
      <cap-tabs .tabs=${TABS_WITH_DISABLED}>
        <div slot="profile">Profile settings content.</div>
        <div slot="security">Security settings content.</div>
        <div slot="billing">Billing content (unreachable — tab is disabled).</div>
        <div slot="advanced">Advanced configuration options.</div>
      </cap-tabs>
    </div>
  `,
};

export const DefaultActive: Story = {
  name: 'Default active tab',
  render: () => html`
    <div style="max-width: 560px; padding: 24px; font-family: 'Courier New', monospace; font-size: 13px;">
      <cap-tabs .tabs=${BASIC_TABS} active-tab="details">
        <div slot="overview">Overview content.</div>
        <div slot="details">Details panel — open by default.</div>
        <div slot="settings">Settings content.</div>
      </cap-tabs>
    </div>
  `,
};

export const WithEvents: Story = {
  name: 'With events',
  render: () => html`
    <div style="max-width: 560px; padding: 24px; font-family: 'Courier New', monospace; font-size: 13px;">
      <cap-tabs .tabs=${BASIC_TABS} id="tabs-events">
        <div slot="overview">Overview.</div>
        <div slot="details">Details.</div>
        <div slot="settings">Settings.</div>
      </cap-tabs>
      <p id="tab-log" style="margin-top: 16px; color: #666;">Switch a tab to see the event.</p>
      <script>
        document.querySelector('#tabs-events').addEventListener('capChange', (e) => {
          document.querySelector('#tab-log').textContent = 'capChange: id=' + e.detail.id;
        });
      </script>
    </div>
  `,
};

export const ManyTabs: Story = {
  name: 'Many tabs (scroll)',
  render: () => {
    const many = Array.from({ length: 10 }, (_, i) => ({
      id: `tab${i + 1}`,
      label: `Tab ${i + 1}`,
    }));
    return html`
      <div style="max-width: 400px; padding: 24px; font-family: 'Courier New', monospace; font-size: 13px;">
        <cap-tabs .tabs=${many}>
          ${many.map(t => html`<div slot=${t.id}>Content for ${t.label}.</div>`)}
        </cap-tabs>
      </div>
    `;
  },
};
