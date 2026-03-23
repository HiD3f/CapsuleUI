import { newSpecPage } from '@stencil/core/testing';
import { CapButton } from '../cap-button';
import { describe, expect, it } from '@stencil/vitest';

describe('cap-button', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CapButton],
      html: `<cap-button></cap-button>`,
    });
    expect(page.root).toEqualHtml(`
      <cap-button>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </cap-button>
    `);
  });
});
