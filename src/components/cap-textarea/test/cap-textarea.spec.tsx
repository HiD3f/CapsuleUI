import { newSpecPage } from '@stencil/core/testing';
import { CapTextarea } from '../cap-textarea';
import { describe, expect, it } from '@stencil/vitest';

describe('cap-textarea', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CapTextarea],
      html: `<cap-textarea></cap-textarea>`,
    });
    expect(page.root).toEqualHtml(`
      <cap-textarea>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </cap-textarea>
    `);
  });
});
