import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  title: 'Components/Overlay/Tooltip',
  component: 'cap-tooltip',
  tags: ['autodocs'],
  argTypes: {
    placement: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
    },
    delay: {
      control: 'number',
    },
    disabled: {
      control: 'boolean',
    },
  },
  args: {
    content: 'Helpful tooltip text',
    placement: 'top',
    delay: 150,
    disabled: false,
  },
  parameters: {
    docs: {
      description: {
        component: `Wraps any content via a slot and shows a tooltip panel on hover and focus. Supports four placements with automatic viewport flip and clamping. Uses \`position: fixed\` with a probe to handle CSS transform ancestors correctly.`,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <div style="padding: 60px; display: flex; justify-content: center;">
      <cap-tooltip
        content=${args.content}
        placement=${args.placement}
        delay=${args.delay}
        ?disabled=${args.disabled}
      >
        <button style="font-family: Georgia, serif; font-size: 14px; padding: 8px 16px; border: 2px solid #000; background: #FFE500; cursor: pointer; box-shadow: 3px 3px 0 #000;">
          Hover me
        </button>
      </cap-tooltip>
    </div>
  `,
};

export const Placements: Story = {
  name: 'All Placements',
  render: () => html`
    <div style="padding: 80px; display: flex; gap: 32px; justify-content: center; flex-wrap: wrap; align-items: center;">
      <cap-tooltip content="Top tooltip" placement="top">
        <button style="font-family: Georgia, serif; font-size: 13px; padding: 8px 14px; border: 2px solid #000; background: #fff; cursor: pointer; box-shadow: 3px 3px 0 #000;">
          Top
        </button>
      </cap-tooltip>
      <cap-tooltip content="Bottom tooltip" placement="bottom">
        <button style="font-family: Georgia, serif; font-size: 13px; padding: 8px 14px; border: 2px solid #000; background: #fff; cursor: pointer; box-shadow: 3px 3px 0 #000;">
          Bottom
        </button>
      </cap-tooltip>
      <cap-tooltip content="Left tooltip" placement="left">
        <button style="font-family: Georgia, serif; font-size: 13px; padding: 8px 14px; border: 2px solid #000; background: #fff; cursor: pointer; box-shadow: 3px 3px 0 #000;">
          Left
        </button>
      </cap-tooltip>
      <cap-tooltip content="Right tooltip" placement="right">
        <button style="font-family: Georgia, serif; font-size: 13px; padding: 8px 14px; border: 2px solid #000; background: #fff; cursor: pointer; box-shadow: 3px 3px 0 #000;">
          Right
        </button>
      </cap-tooltip>
    </div>
  `,
};

export const LongContent: Story = {
  name: 'Long Content (Flip)',
  render: () => html`
    <div style="padding: 20px; display: flex; justify-content: center;">
      <cap-tooltip content="This tooltip has quite a long description that might overflow near viewport edges" placement="top">
        <button style="font-family: Georgia, serif; font-size: 13px; padding: 8px 14px; border: 2px solid #000; background: #FFE500; cursor: pointer; box-shadow: 3px 3px 0 #000;">
          Hover (near top edge will flip to bottom)
        </button>
      </cap-tooltip>
    </div>
  `,
};

export const Disabled: Story = {
  name: 'Disabled',
  render: () => html`
    <div style="padding: 60px; display: flex; gap: 24px; justify-content: center; align-items: center;">
      <cap-tooltip content="This tooltip is active" placement="top">
        <button style="font-family: Georgia, serif; font-size: 13px; padding: 8px 14px; border: 2px solid #000; background: #FFE500; cursor: pointer; box-shadow: 3px 3px 0 #000;">
          Enabled tooltip
        </button>
      </cap-tooltip>
      <cap-tooltip content="You will never see this" placement="top" disabled>
        <button style="font-family: Georgia, serif; font-size: 13px; padding: 8px 14px; border: 2px solid #000; background: #fff; cursor: pointer; box-shadow: 3px 3px 0 #000; opacity: 0.5;">
          Disabled tooltip
        </button>
      </cap-tooltip>
    </div>
  `,
};

export const OnText: Story = {
  name: 'On Text',
  render: () => html`
    <div style="padding: 60px; font-family: Georgia, serif; font-size: 14px; line-height: 1.6;">
      Hover over the
      <cap-tooltip content="This is an abbreviation" placement="top">
        <span style="border-bottom: 2px dotted #000; cursor: help;">technical term</span>
      </cap-tooltip>
      to see its definition.
    </div>
  `,
};

export const Delay: Story = {
  name: 'Delay Comparison',
  render: () => html`
    <div style="padding: 60px; display: flex; gap: 32px; justify-content: center; align-items: center;">
      <div style="display: flex; flex-direction: column; gap: 8px; align-items: center;">
        <span style="font-size: 11px; font-family: monospace; opacity: 0.6;">delay=0</span>
        <cap-tooltip content="Instant tooltip" placement="top" delay="0">
          <button style="font-family: Georgia, serif; font-size: 13px; padding: 8px 14px; border: 2px solid #000; background: #FFE500; cursor: pointer; box-shadow: 3px 3px 0 #000;">
            Instant
          </button>
        </cap-tooltip>
      </div>
      <div style="display: flex; flex-direction: column; gap: 8px; align-items: center;">
        <span style="font-size: 11px; font-family: monospace; opacity: 0.6;">delay=500</span>
        <cap-tooltip content="Slow tooltip" placement="top" delay="500">
          <button style="font-family: Georgia, serif; font-size: 13px; padding: 8px 14px; border: 2px solid #000; background: #fff; cursor: pointer; box-shadow: 3px 3px 0 #000;">
            500ms delay
          </button>
        </cap-tooltip>
      </div>
    </div>
  `,
};
