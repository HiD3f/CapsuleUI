import { newE2EPage } from '@stencil/core/testing';
import { describe, expect, it } from '@stencil/vitest';

describe('cap-checkbox', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<cap-checkbox></cap-checkbox>');

    const element = await page.find('cap-checkbox');
    expect(element).toHaveClass('hydrated');
  });
});
