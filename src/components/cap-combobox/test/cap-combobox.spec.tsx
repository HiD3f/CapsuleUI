import { newSpecPage } from '@stencil/core/testing';
import { CapCombobox } from '../cap-combobox';
import { describe, expect, it } from '@stencil/vitest';

describe('cap-combobox', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CapCombobox],
      html: `<cap-combobox></cap-combobox>`,
    });
    expect(page.root).toEqualHtml(`
      <cap-combobox>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </cap-combobox>
    `);
  });
});
