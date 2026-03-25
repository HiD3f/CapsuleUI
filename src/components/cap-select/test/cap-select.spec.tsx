import { newSpecPage } from '@stencil/core/testing';
import { CapSelect } from '../cap-select';
import { describe, expect, it } from '@stencil/vitest';

describe('cap-select', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CapSelect],
      html: `<cap-select></cap-select>`,
    });
    expect(page.root).toEqualHtml(`
      <cap-select>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </cap-select>
    `);
  });
});
