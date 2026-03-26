import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';

const EDIT_ITEMS = [
  { type: 'action', label: 'Cut', value: 'cut', icon: '✂' },
  { type: 'action', label: 'Copy', value: 'copy', icon: '⎘' },
  { type: 'action', label: 'Paste', value: 'paste', icon: '⎗' },
  { type: 'separator' },
  { type: 'action', label: 'Select All', value: 'select-all' },
  { type: 'separator' },
  {
    type: 'action',
    label: 'Share',
    value: 'share',
    icon: '↗',
    items: [
      { type: 'action', label: 'Copy Link', value: 'share-link', icon: '🔗' },
      { type: 'link', label: 'Open in new tab', value: 'share-tab', href: '#', target: '_blank' },
    ],
  },
  { type: 'separator' },
  { type: 'action', label: 'Delete', value: 'delete', icon: '✕', disabled: true },
];

const FILE_ITEMS = [
  { type: 'action', label: 'Open', value: 'open', icon: '📂' },
  { type: 'action', label: 'Open With…', value: 'open-with', items: [
    { type: 'action', label: 'VS Code', value: 'open-vscode' },
    { type: 'action', label: 'Sublime Text', value: 'open-sublime' },
    { type: 'action', label: 'Notepad', value: 'open-notepad' },
  ]},
  { type: 'separator' },
  { type: 'action', label: 'Rename', value: 'rename', icon: '✎' },
  { type: 'action', label: 'Duplicate', value: 'duplicate' },
  { type: 'action', label: 'Move to Trash', value: 'trash', icon: '🗑' },
  { type: 'separator' },
  { type: 'toggle', label: 'Show Hidden Files', value: 'hidden-files', checked: false },
  { type: 'toggle', label: 'Show Extensions', value: 'extensions', checked: true },
  { type: 'separator' },
  { type: 'action', label: 'Get Info', value: 'info', icon: 'ℹ' },
];

const meta: Meta = {
  title: 'Components/Context Menu',
  component: 'cap-context-menu',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Right-click context menu. Wraps any content via a slot — right-clicking inside the slot area opens the menu at the cursor position. Uses the same \`role="menu"\` / \`role="menuitem"\` ARIA pattern as \`cap-dropdown-menu\`.

**Item types:** same as \`cap-dropdown-menu\` — \`action\`, \`link\`, \`toggle\`, \`separator\`, with optional \`items\` array for one level of sub-menus.

**Positioning:** \`position: fixed\` at the cursor. Automatically clamped to viewport edges.

**Keyboard:** ↑↓ navigate · Enter/Space activate · → enter sub-menu · ← exit · Esc close
        `.trim(),
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const TARGET_STYLE = `
  padding: 48px 64px;
  border: 2px dashed #999;
  cursor: context-menu;
  user-select: none;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  color: #666;
  text-align: center;
`;

export const Default: Story = {
  render: () => html`
    <div style="height: 420px; display: flex; align-items: center; justify-content: center;">
      <cap-context-menu .items=${EDIT_ITEMS} id="default-ctx">
        <div style=${TARGET_STYLE}>Right-click anywhere in this area</div>
      </cap-context-menu>
      <p id="ctx-result" style="position: absolute; bottom: 24px; left: 24px; font-family: 'Courier New', monospace; font-size: 13px;">
        Activate an item to see the event
      </p>
      <script>
        document.querySelector('#default-ctx').addEventListener('capSelect', (e) => {
          document.querySelector('#ctx-result').textContent = 'capSelect: ' + e.detail.value;
        });
      </script>
    </div>
  `,
};

export const FileContextMenu: Story = {
  name: 'File browser',
  render: () => html`
    <div style="height: 420px; padding: 24px;">
      <p style="font-family: 'Courier New', monospace; font-size: 12px; margin: 0 0 16px;">
        Simulates a file browser row — right-click to open the context menu.
      </p>
      <cap-context-menu .items=${FILE_ITEMS} id="file-ctx">
        <div style="display: flex; align-items: center; gap: 12px; padding: 12px; border: 2px solid black; cursor: context-menu; width: 320px; font-family: 'Courier New', monospace; font-size: 13px; box-sizing: border-box;">
          <span style="font-size: 20px;">📄</span>
          <span>project-notes.md</span>
          <span style="margin-left: auto; color: #666;">4 KB</span>
        </div>
      </cap-context-menu>
      <p id="file-result" style="font-family: 'Courier New', monospace; margin-top: 16px; font-size: 13px;">
        Activate an item to see the event
      </p>
      <script>
        document.querySelector('#file-ctx').addEventListener('capSelect', (e) => {
          document.querySelector('#file-result').textContent = 'capSelect: ' + e.detail.value;
        });
        document.querySelector('#file-ctx').addEventListener('capToggle', (e) => {
          document.querySelector('#file-result').textContent =
            e.detail.item.label + ': ' + (e.detail.checked ? 'on' : 'off');
        });
      </script>
    </div>
  `,
};

export const Disabled: Story = {
  render: () => html`
    <div style="height: 280px; display: flex; align-items: center; justify-content: center;">
      <cap-context-menu .items=${EDIT_ITEMS} disabled>
        <div style=${TARGET_STYLE}>
          Context menu is disabled — browser default appears on right-click
        </div>
      </cap-context-menu>
    </div>
  `,
};

export const MultipleTargets: Story = {
  name: 'Multiple targets',
  render: () => html`
    <div style="height: 360px; padding: 24px; display: flex; gap: 24px;">
      <cap-context-menu .items=${EDIT_ITEMS} id="ctx-a">
        <div style="flex: 1; ${TARGET_STYLE}">Area A — right-click me</div>
      </cap-context-menu>
      <cap-context-menu .items=${FILE_ITEMS} id="ctx-b">
        <div style="flex: 1; ${TARGET_STYLE}">Area B — different menu</div>
      </cap-context-menu>
    </div>
  `,
};
