import { newSpecPage } from '@stencil/core/testing';
import { CapRadioGroup } from '../cap-radio-group';
import { describe, expect, it } from '@stencil/vitest';

describe('cap-radio-group', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CapRadioGroup],
      html: `<cap-radio-group></cap-radio-group>`,
    });
    expect(page.root).toEqualHtml(`
      <cap-radio-group>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </cap-radio-group>
    `);
  });
});
