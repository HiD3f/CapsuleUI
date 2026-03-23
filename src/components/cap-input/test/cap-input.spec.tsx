import { newSpecPage } from '@stencil/core/testing';
import { CapInput } from '../cap-input';
import { describe, expect, it } from '@stencil/vitest';

describe('cap-input', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CapInput],
      html: `<cap-input></cap-input>`,
    });
    expect(page.root).toEqualHtml(`
      <cap-input>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </cap-input>
    `);
  });
});
