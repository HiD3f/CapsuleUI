import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';

const FILE_MENU = [
  { type: 'action', label: 'New File', value: 'new-file', icon: '📄' },
  { type: 'action', label: 'New Folder', value: 'new-folder', icon: '📁' },
  { type: 'separator' },
  {
    type: 'action',
    label: 'Open Recent',
    value: 'open-recent',
    icon: '🕓',
    items: [
      { type: 'action', label: 'index.tsx', value: 'recent-1' },
      { type: 'action', label: 'cap-button.css', value: 'recent-2' },
      { type: 'action', label: 'tokens.css', value: 'recent-3' },
      { type: 'separator' },
      { type: 'action', label: 'Clear Recent', value: 'clear-recent', icon: '✕' },
    ],
  },
  { type: 'separator' },
  { type: 'action', label: 'Save', value: 'save', icon: '💾' },
  { type: 'action', label: 'Save As…', value: 'save-as' },
  { type: 'separator' },
  { type: 'action', label: 'Quit', value: 'quit', icon: '⏻', disabled: true },
];

const EDIT_MENU = [
  { type: 'action', label: 'Undo', value: 'undo', icon: '↩' },
  { type: 'action', label: 'Redo', value: 'redo', icon: '↪', disabled: true },
  { type: 'separator' },
  { type: 'action', label: 'Cut', value: 'cut' },
  { type: 'action', label: 'Copy', value: 'copy' },
  { type: 'action', label: 'Paste', value: 'paste' },
  { type: 'separator' },
  { type: 'action', label: 'Select All', value: 'select-all' },
];

const VIEW_MENU = [
  { type: 'toggle', label: 'Show Sidebar', value: 'sidebar', checked: true },
  { type: 'toggle', label: 'Show Minimap', value: 'minimap', checked: false },
  { type: 'toggle', label: 'Word Wrap', value: 'word-wrap', checked: true },
  { type: 'separator' },
  {
    type: 'action',
    label: 'Theme',
    value: 'theme',
    items: [
      { type: 'action', label: 'Retro (default)', value: 'theme-retro' },
      { type: 'action', label: 'Dark', value: 'theme-dark' },
      { type: 'action', label: 'Light', value: 'theme-light' },
    ],
  },
  { type: 'separator' },
  { type: 'action', label: 'Zoom In', value: 'zoom-in', icon: '+', persistent: true },
  { type: 'action', label: 'Zoom Out', value: 'zoom-out', icon: '−', persistent: true },
];

const LINKS_MENU = [
  { type: 'link', label: 'Documentation', value: 'docs', icon: '📖', href: 'https://stenciljs.com/docs', target: '_blank' },
  { type: 'link', label: 'GitHub', value: 'github', icon: '⌥', href: 'https://github.com', target: '_blank' },
  { type: 'separator' },
  { type: 'link', label: 'Disabled link', value: 'disabled', href: 'https://example.com', disabled: true },
];

const meta: Meta = {
  title: 'Components/Overlay/Dropdown Menu',
  component: 'cap-dropdown-menu',
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    icon: { control: 'text' },
    align: { control: 'select', options: ['start', 'end'] },
    disabled: { control: 'boolean' },
  },
  args: {
    label: 'File',
    disabled: false,
    align: 'start',
  },
  parameters: {
    docs: {
      description: {
        component: `
Trigger button + \`role="menu"\` panel. Uses \`role="menuitem"\`, \`role="menuitemcheckbox"\`, and \`role="separator"\` — completely separate from the listbox family used by select/combobox/multiselect.

**Item types:**
- \`action\` — fires \`capSelect\` and closes the menu
- \`link\` — renders as \`<a>\`, fires \`capSelect\` and closes
- \`toggle\` — fires \`capToggle\` with new checked state, menu stays open
- \`separator\` — visual divider

**Sub-menus:** add an \`items\` array to any non-separator item (one level deep).

**Keyboard:** ↑↓ navigate · Enter/Space activate · → enter sub-menu · ← exit sub-menu · Esc close
        `.trim(),
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <div style="min-height: 320px; padding: 24px;">
      <cap-dropdown-menu
        label=${args.label}
        icon=${args.icon}
        align=${args.align}
        .items=${FILE_MENU}
        ?disabled=${args.disabled}
      ></cap-dropdown-menu>
    </div>
  `,
};

export const WithSubMenu: Story = {
  name: 'With sub-menu',
  render: () => html`
    <div style="min-height: 320px; padding: 24px;">
      <cap-dropdown-menu
        label="File"
        .items=${FILE_MENU}
      ></cap-dropdown-menu>
    </div>
  `,
};

export const TogglesMenu: Story = {
  name: 'Toggle items',
  render: () => html`
    <div style="min-height: 280px; padding: 24px;">
      <cap-dropdown-menu
        label="View"
        .items=${VIEW_MENU}
        id="view-menu"
      ></cap-dropdown-menu>
      <p id="toggle-result" style="font-family: 'Courier New', monospace; margin-top: 16px; font-size: 13px;">
        Toggle an item to see the event
      </p>
      <script>
        document.querySelector('#view-menu').addEventListener('capToggle', (e) => {
          document.querySelector('#toggle-result').textContent =
            e.detail.item.label + ': ' + (e.detail.checked ? 'on' : 'off');
        });
      </script>
    </div>
  `,
};

export const LinksMenu: Story = {
  name: 'Link items',
  render: () => html`
    <div style="min-height: 200px; padding: 24px;">
      <cap-dropdown-menu
        label="Links"
        icon="🔗"
        .items=${LINKS_MENU}
      ></cap-dropdown-menu>
    </div>
  `,
};

export const AlignEnd: Story = {
  name: 'Align end',
  render: () => html`
    <div style="min-height: 280px; padding: 24px; display: flex; justify-content: flex-end;">
      <cap-dropdown-menu
        label="Edit"
        align="end"
        .items=${EDIT_MENU}
      ></cap-dropdown-menu>
    </div>
  `,
};

export const MenuBar: Story = {
  name: 'Menu bar',
  render: () => html`
    <div style="min-height: 360px;">
      <div style="display: flex; border-bottom: 2px solid black;">
        <cap-dropdown-menu label="File" .items=${FILE_MENU}></cap-dropdown-menu>
        <cap-dropdown-menu label="Edit" .items=${EDIT_MENU}></cap-dropdown-menu>
        <cap-dropdown-menu label="View" .items=${VIEW_MENU}></cap-dropdown-menu>
      </div>
    </div>
  `,
};

export const Interactive: Story = {
  render: () => html`
    <div style="min-height: 320px; padding: 24px;">
      <cap-dropdown-menu
        label="File"
        .items=${FILE_MENU}
        id="interactive-menu"
      ></cap-dropdown-menu>
      <p id="menu-result" style="font-family: 'Courier New', monospace; margin-top: 16px; font-size: 13px;">
        Activate an item to see the event
      </p>
      <script>
        document.querySelector('#interactive-menu').addEventListener('capSelect', (e) => {
          document.querySelector('#menu-result').textContent = 'capSelect: ' + e.detail.value;
        });
      </script>
    </div>
  `,
};

export const Keyboard: Story = {
  name: 'Keyboard navigation',
  render: () => html`
    <p style="font-family: 'Courier New', monospace; font-size: 12px; margin-bottom: 16px;">
      Enter/Space/↓ open · ↑↓ navigate · → enter sub-menu · ← exit · Esc close
    </p>
    <div style="min-height: 320px; padding: 24px;">
      <cap-dropdown-menu label="File" .items=${FILE_MENU}></cap-dropdown-menu>
    </div>
  `,
};
