import { newE2EPage } from '@stencil/core/testing';
import { describe, expect, it } from '@stencil/vitest';

describe('cap-textarea', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<cap-textarea></cap-textarea>');

    const element = await page.find('cap-textarea');
    expect(element).toHaveClass('hydrated');
  });
});
