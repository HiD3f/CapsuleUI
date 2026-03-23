import type { Preview } from '@storybook/web-components-vite'
import { defineCustomElements } from '../dist/esm/loader';

defineCustomElements();

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },
};

export default preview;