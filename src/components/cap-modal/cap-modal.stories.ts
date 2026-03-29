import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  title: 'Components/Overlay/Modal',
  component: 'cap-modal',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Dialog modal with focus trap, scroll lock, and backdrop. Opens centered over the page. The body content and footer use slots.

**Slots:** default (body content), \`footer\` (action buttons row)

**Props:** \`heading\`, \`width\`, \`hideClose\`, \`closeOnBackdrop\`

**Events:** \`capClose\` (close requested), \`capOpen\` (finished opening)

**Methods:** \`show()\`, \`hide()\`

**Focus trap:** Tab / Shift+Tab cycle within the modal. Focus restores to the trigger on close.

**Scroll lock:** Body scroll is frozen while the modal is open.

**Keyboard:** Escape closes the modal.
        `.trim(),
      },
    },
  },
};

export default meta;
type Story = StoryObj;

// ─── Default ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => html`
    <div style="padding: 40px; font-family: 'Courier New', monospace;">
      <cap-button id="open-default">Open Modal</cap-button>

      <cap-modal id="modal-default" heading="Confirm Action" open="false">
        <p style="margin: 0;">Are you sure you want to proceed? This action cannot be undone.</p>
        <div slot="footer">
          <cap-button variant="outline" id="cancel-default">Cancel</cap-button>
          <cap-button variant="primary" id="confirm-default">Confirm</cap-button>
        </div>
      </cap-modal>

      <script>
        (function () {
          const modal = document.querySelector('#modal-default');
          document.querySelector('#open-default').addEventListener('click', () => modal.show());
          document.querySelector('#cancel-default').addEventListener('click', () => modal.hide());
          document.querySelector('#confirm-default').addEventListener('click', () => modal.hide());
        })();
      </script>
    </div>
  `,
};

// ─── Long content (scroll) ────────────────────────────────────────────────────

export const LongContent: Story = {
  name: 'Long content (scroll)',
  render: () => html`
    <div style="padding: 40px; font-family: 'Courier New', monospace;">
      <cap-button id="open-long">Open Modal</cap-button>

      <cap-modal id="modal-long" heading="Terms of Service">
        ${Array.from({ length: 12 }, (_, i) => html`
          <p style="margin: 0 0 16px;">
            Section ${i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
            veniam, quis nostrud exercitation ullamco laboris.
          </p>
        `)}
        <div slot="footer">
          <cap-button variant="outline" id="decline-long">Decline</cap-button>
          <cap-button variant="primary" id="accept-long">Accept</cap-button>
        </div>
      </cap-modal>

      <script>
        (function () {
          const modal = document.querySelector('#modal-long');
          document.querySelector('#open-long').addEventListener('click', () => modal.show());
          document.querySelector('#decline-long').addEventListener('click', () => modal.hide());
          document.querySelector('#accept-long').addEventListener('click', () => modal.hide());
        })();
      </script>
    </div>
  `,
};

// ─── No footer ────────────────────────────────────────────────────────────────

export const NoFooter: Story = {
  name: 'No footer',
  render: () => html`
    <div style="padding: 40px; font-family: 'Courier New', monospace;">
      <cap-button id="open-nofooter">Open Modal</cap-button>

      <cap-modal id="modal-nofooter" heading="Information">
        <p style="margin: 0;">
          This modal has no footer. Close it with the × button or press Escape.
        </p>
      </cap-modal>

      <script>
        (function () {
          const modal = document.querySelector('#modal-nofooter');
          document.querySelector('#open-nofooter').addEventListener('click', () => modal.show());
          modal.addEventListener('capClose', () => modal.hide());
        })();
      </script>
    </div>
  `,
};

// ─── No close on backdrop ─────────────────────────────────────────────────────

export const NoBackdropClose: Story = {
  name: 'No backdrop close',
  render: () => html`
    <div style="padding: 40px; font-family: 'Courier New', monospace;">
      <cap-button id="open-nobackdrop">Open Modal</cap-button>

      <cap-modal id="modal-nobackdrop" heading="Required Action" close-on-backdrop="false">
        <p style="margin: 0;">
          Clicking the backdrop does nothing. You must use the buttons below to proceed.
        </p>
        <div slot="footer">
          <cap-button variant="outline" id="dismiss-nobackdrop">Dismiss</cap-button>
          <cap-button variant="primary" id="ok-nobackdrop">OK</cap-button>
        </div>
      </cap-modal>

      <script>
        (function () {
          const modal = document.querySelector('#modal-nobackdrop');
          document.querySelector('#open-nobackdrop').addEventListener('click', () => modal.show());
          document.querySelector('#dismiss-nobackdrop').addEventListener('click', () => modal.hide());
          document.querySelector('#ok-nobackdrop').addEventListener('click', () => modal.hide());
          modal.addEventListener('capClose', () => modal.hide());
        })();
      </script>
    </div>
  `,
};

// ─── Custom width ─────────────────────────────────────────────────────────────

export const CustomWidth: Story = {
  name: 'Custom width',
  render: () => html`
    <div style="padding: 40px; font-family: 'Courier New', monospace; display: flex; gap: 12px;">
      <cap-button id="open-sm">Small (320px)</cap-button>
      <cap-button id="open-lg">Large (720px)</cap-button>

      <cap-modal id="modal-sm" heading="Small Modal" width="320px">
        <p style="margin: 0;">Compact modal for simple confirmations.</p>
        <div slot="footer">
          <cap-button variant="primary" id="ok-sm">OK</cap-button>
        </div>
      </cap-modal>

      <cap-modal id="modal-lg" heading="Large Modal" width="720px">
        <p style="margin: 0;">Wide modal for forms or detailed content.</p>
        <div slot="footer">
          <cap-button variant="outline" id="cancel-lg">Cancel</cap-button>
          <cap-button variant="primary" id="save-lg">Save</cap-button>
        </div>
      </cap-modal>

      <script>
        (function () {
          const sm = document.querySelector('#modal-sm');
          const lg = document.querySelector('#modal-lg');
          document.querySelector('#open-sm').addEventListener('click', () => sm.show());
          document.querySelector('#open-lg').addEventListener('click', () => lg.show());
          document.querySelector('#ok-sm').addEventListener('click', () => sm.hide());
          document.querySelector('#cancel-lg').addEventListener('click', () => lg.hide());
          document.querySelector('#save-lg').addEventListener('click', () => lg.hide());
          sm.addEventListener('capClose', () => sm.hide());
          lg.addEventListener('capClose', () => lg.hide());
        })();
      </script>
    </div>
  `,
};

// ─── With form ────────────────────────────────────────────────────────────────

export const WithForm: Story = {
  name: 'With form',
  render: () => html`
    <div style="padding: 40px; font-family: 'Courier New', monospace;">
      <cap-button id="open-form">Add Item</cap-button>

      <cap-modal id="modal-form" heading="Add New Item" width="520px">
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <cap-input label="Name" placeholder="Enter item name" required></cap-input>
          <cap-input label="Description" placeholder="Optional description"></cap-input>
          <cap-select
            label="Category"
            .options=${[
              { label: 'Work', value: 'work' },
              { label: 'Personal', value: 'personal' },
              { label: 'Other', value: 'other' },
            ]}
          ></cap-select>
        </div>
        <div slot="footer">
          <cap-button variant="outline" id="cancel-form">Cancel</cap-button>
          <cap-button variant="primary" id="save-form">Save</cap-button>
        </div>
      </cap-modal>

      <script>
        (function () {
          const modal = document.querySelector('#modal-form');
          document.querySelector('#open-form').addEventListener('click', () => modal.show());
          document.querySelector('#cancel-form').addEventListener('click', () => modal.hide());
          document.querySelector('#save-form').addEventListener('click', () => modal.hide());
          modal.addEventListener('capClose', () => modal.hide());
        })();
      </script>
    </div>
  `,
};
