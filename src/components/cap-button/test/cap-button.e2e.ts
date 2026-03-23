import { newE2EPage } from '@stencil/core/testing';
import { describe, expect, it } from '@stencil/vitest';

describe('cap-button', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<cap-button></cap-button>');

    const element = await page.find('cap-button');
    expect(element).toHaveClass('hydrated');
  });
});
