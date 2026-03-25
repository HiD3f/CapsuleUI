import { newSpecPage } from '@stencil/core/testing';
import { CapRadio } from '../cap-radio';
import { describe, expect, it } from '@stencil/vitest';

describe('cap-radio', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CapRadio],
      html: `<cap-radio></cap-radio>`,
    });
    expect(page.root).toEqualHtml(`
      <cap-radio>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </cap-radio>
    `);
  });
});
