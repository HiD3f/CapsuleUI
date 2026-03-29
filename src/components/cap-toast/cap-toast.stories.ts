import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  title: 'Components/Overlay/Toast',
  component: 'cap-toast',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Notification toast stack. Place one \`<cap-toast>\` in your app and call \`.show(options)\` to add notifications.

**Method:** \`show({ message, variant?, duration?, closeable? })\` → returns the toast id

**Method:** \`dismiss(id)\` — remove a specific toast

**Method:** \`clear()\` — remove all toasts

**Prop:** \`position\` — \`'top-right'\` (default), \`'top-left'\`, \`'top-center'\`, \`'bottom-right'\`, \`'bottom-left'\`, \`'bottom-center'\`

**Prop:** \`default-duration\` — auto-dismiss delay in ms (default 4000, 0 = manual only)

**Event:** \`capDismiss\` — fired when a toast is removed, detail: \`{ id }\`

**Variants:** \`default\`, \`success\`, \`warning\`, \`danger\`
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
    <div style="padding: 40px; font-family: 'Courier New', monospace; display: flex; flex-wrap: wrap; gap: 12px;">
      <cap-toast id="toast1" position="top-right"></cap-toast>

      <cap-button variant="primary" id="btn-default">Default</cap-button>
      <cap-button variant="primary" id="btn-success">Success</cap-button>
      <cap-button variant="primary" id="btn-warning">Warning</cap-button>
      <cap-button variant="danger"  id="btn-danger">Danger</cap-button>

      <script>
        (function () {
          const toast = document.querySelector('#toast1');
          document.querySelector('#btn-default').addEventListener('click', () =>
            toast.show({ message: 'Item saved successfully.' }));
          document.querySelector('#btn-success').addEventListener('click', () =>
            toast.show({ message: 'Upload complete!', variant: 'success' }));
          document.querySelector('#btn-warning').addEventListener('click', () =>
            toast.show({ message: 'Your session expires in 5 minutes.', variant: 'warning' }));
          document.querySelector('#btn-danger').addEventListener('click', () =>
            toast.show({ message: 'Failed to connect to server.', variant: 'danger' }));
        })();
      </script>
    </div>
  `,
};

// ─── Positions ────────────────────────────────────────────────────────────────

export const Positions: Story = {
  render: () => html`
    <div style="padding: 40px; font-family: 'Courier New', monospace;">
      <cap-toast id="toast-pos" position="top-right"></cap-toast>

      <p style="margin: 0 0 16px; font-size: 13px;">
        Each button fires a toast and then changes the container position.
      </p>

      <div style="display: flex; flex-wrap: wrap; gap: 12px;">
        <cap-button id="btn-tr">Top Right</cap-button>
        <cap-button id="btn-tl">Top Left</cap-button>
        <cap-button id="btn-tc">Top Center</cap-button>
        <cap-button id="btn-br">Bottom Right</cap-button>
        <cap-button id="btn-bl">Bottom Left</cap-button>
        <cap-button id="btn-bc">Bottom Center</cap-button>
      </div>

      <script>
        (function () {
          const toast = document.querySelector('#toast-pos');
          const fire = (pos, label) => {
            toast.position = pos;
            toast.show({ message: label, variant: 'default' });
          };
          document.querySelector('#btn-tr').addEventListener('click', () => fire('top-right', 'Top right'));
          document.querySelector('#btn-tl').addEventListener('click', () => fire('top-left', 'Top left'));
          document.querySelector('#btn-tc').addEventListener('click', () => fire('top-center', 'Top center'));
          document.querySelector('#btn-br').addEventListener('click', () => fire('bottom-right', 'Bottom right'));
          document.querySelector('#btn-bl').addEventListener('click', () => fire('bottom-left', 'Bottom left'));
          document.querySelector('#btn-bc').addEventListener('click', () => fire('bottom-center', 'Bottom center'));
        })();
      </script>
    </div>
  `,
};

// ─── Queue ────────────────────────────────────────────────────────────────────

export const Queue: Story = {
  render: () => html`
    <div style="padding: 40px; font-family: 'Courier New', monospace;">
      <cap-toast id="toast-queue" position="top-right" default-duration="3000"></cap-toast>

      <p style="margin: 0 0 16px; font-size: 13px;">Click rapidly to stack multiple toasts.</p>

      <div style="display: flex; gap: 12px;">
        <cap-button id="btn-queue">Add toast</cap-button>
        <cap-button variant="outline" id="btn-clear">Clear all</cap-button>
      </div>

      <script>
        (function () {
          const toast = document.querySelector('#toast-queue');
          let n = 0;
          const variants = ['default', 'success', 'warning', 'danger'];
          document.querySelector('#btn-queue').addEventListener('click', () => {
            n++;
            toast.show({
              message: 'Notification #' + n,
              variant: variants[n % 4],
            });
          });
          document.querySelector('#btn-clear').addEventListener('click', () => toast.clear());
        })();
      </script>
    </div>
  `,
};

// ─── No auto-dismiss ──────────────────────────────────────────────────────────

export const ManualDismiss: Story = {
  name: 'Manual dismiss',
  render: () => html`
    <div style="padding: 40px; font-family: 'Courier New', monospace;">
      <cap-toast id="toast-manual" position="top-right" default-duration="0"></cap-toast>

      <p style="margin: 0 0 16px; font-size: 13px;">
        Toasts stay until dismissed. <code>duration: 0</code> disables auto-dismiss.
      </p>

      <cap-button id="btn-manual">Show persistent toast</cap-button>

      <script>
        (function () {
          const toast = document.querySelector('#toast-manual');
          document.querySelector('#btn-manual').addEventListener('click', () =>
            toast.show({
              message: 'This toast will not auto-dismiss.',
              variant: 'warning',
              closeable: true,
            }));
        })();
      </script>
    </div>
  `,
};

// ─── Programmatic dismiss ─────────────────────────────────────────────────────

export const ProgrammaticDismiss: Story = {
  name: 'Programmatic dismiss',
  render: () => html`
    <div style="padding: 40px; font-family: 'Courier New', monospace;">
      <cap-toast id="toast-prog" position="top-right" default-duration="0"></cap-toast>

      <p style="margin: 0 0 16px; font-size: 13px;">
        <code>show()</code> returns an id you can pass to <code>dismiss(id)</code>.
      </p>

      <div style="display: flex; gap: 12px;">
        <cap-button id="btn-show-prog">Show</cap-button>
        <cap-button variant="outline" id="btn-hide-prog" disabled>Dismiss last</cap-button>
      </div>

      <script>
        (function () {
          const toast = document.querySelector('#toast-prog');
          const dismissBtn = document.querySelector('#btn-hide-prog');
          let lastId = null;
          document.querySelector('#btn-show-prog').addEventListener('click', async () => {
            lastId = await toast.show({ message: 'Dismiss me programmatically.', closeable: false });
            dismissBtn.disabled = false;
          });
          dismissBtn.addEventListener('click', () => {
            if (lastId) toast.dismiss(lastId);
            dismissBtn.disabled = true;
          });
        })();
      </script>
    </div>
  `,
};
