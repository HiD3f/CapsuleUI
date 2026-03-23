import { newE2EPage } from '@stencil/core/testing';
import { describe, expect, it } from '@stencil/vitest';

describe('cap-input', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<cap-input></cap-input>');

    const element = await page.find('cap-input');
    expect(element).toHaveClass('hydrated');
  });
});
