import { newSpecPage } from '@stencil/core/testing';
import { CapCheckbox } from '../cap-checkbox';
import { describe, expect, it } from '@stencil/vitest';

describe('cap-checkbox', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CapCheckbox],
      html: `<cap-checkbox></cap-checkbox>`,
    });
    expect(page.root).toEqualHtml(`
      <cap-checkbox>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </cap-checkbox>
    `);
  });
});
