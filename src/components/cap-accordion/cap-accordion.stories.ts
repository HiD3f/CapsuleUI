import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';

const FAQ = [
  {
    id: 'q1',
    label: 'What is CapsuleUI?',
    content: 'CapsuleUI is a retro-themed web component library built with Stencil.js. It provides fully accessible, shadow-DOM-isolated components styled with CSS custom properties.',
  },
  {
    id: 'q2',
    label: 'Can I use it with any framework?',
    content: 'Yes. Web components work natively in the browser. Use them in plain HTML, React, Vue, Angular, Svelte, or any other framework.',
  },
  {
    id: 'q3',
    label: 'How do I customise the theme?',
    content: 'Override the CSS custom properties defined in <code>tokens.css</code>. Every visual decision — colours, spacing, typography, borders — is a token.',
  },
  {
    id: 'q4',
    label: 'Is keyboard navigation supported?',
    content: 'All components follow WAI-ARIA patterns. Accordion headers are focusable buttons; Enter/Space toggles a panel.',
  },
  {
    id: 'q5',
    label: 'Is this item disabled?',
    content: 'You should never read this.',
    disabled: true,
  },
];

const meta: Meta = {
  title: 'Components/Layout/Accordion',
  component: 'cap-accordion',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Collapsible panel list. Each header is a \`<button>\` with \`aria-expanded\`; panels use \`role="region"\`.

**Prop:** \`items\` — array of \`{ id, label, content?, disabled? }\`

**Prop:** \`multiple\` — allow multiple panels open at once (default false)

**Prop:** \`open-items\` — controlled: id or array of ids of open panels

**Event:** \`capChange\` — detail: \`{ id, open, openItems }\`

**Content:** set \`content\` (HTML string) on the item, or use a named slot \`<div slot="{id}">\`.
        `.trim(),
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div style="max-width: 560px; padding: 24px;">
      <cap-accordion
        .items=${FAQ}
        id="acc1"
      ></cap-accordion>
    </div>
  `,
};

export const MultipleOpen: Story = {
  name: 'Multiple open',
  render: () => html`
    <div style="max-width: 560px; padding: 24px;">
      <p style="font-family: 'Courier New', monospace; font-size: 13px; margin: 0 0 16px;">
        Multiple panels can be open simultaneously.
      </p>
      <cap-accordion
        .items=${FAQ.slice(0, 4)}
        multiple
        .openItems=${['q1', 'q3']}
      ></cap-accordion>
    </div>
  `,
};

export const DefaultOpen: Story = {
  name: 'Default open',
  render: () => html`
    <div style="max-width: 560px; padding: 24px;">
      <cap-accordion
        .items=${FAQ}
        open-items="q2"
      ></cap-accordion>
    </div>
  `,
};

export const WithEvents: Story = {
  name: 'With events',
  render: () => html`
    <div style="max-width: 560px; padding: 24px; font-family: 'Courier New', monospace;">
      <cap-accordion .items=${FAQ.slice(0, 4)} id="acc-events"></cap-accordion>
      <p id="acc-log" style="margin-top: 16px; font-size: 13px; color: #666;">
        Toggle a panel to see the event.
      </p>
      <script>
        document.querySelector('#acc-events').addEventListener('capChange', (e) => {
          document.querySelector('#acc-log').textContent =
            'capChange: id=' + e.detail.id + ' open=' + e.detail.open +
            ' openItems=[' + e.detail.openItems.join(', ') + ']';
        });
      </script>
    </div>
  `,
};
