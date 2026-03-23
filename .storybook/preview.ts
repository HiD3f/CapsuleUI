import { html } from 'lit';
import type { Preview } from '@storybook/web-components-vite';
import { defineCustomElements } from '../dist/esm/loader';
import '../src/styles/tokens.css';
import '../src/styles/themes/light.css';
import '../src/styles/themes/dark.css';

defineCustomElements();

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', icon: 'sun', title: 'Light' },
          { value: 'dark', icon: 'moon', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (story, context) => {
      const theme = context.globals.theme || 'light';
      return html`
        <div
          data-theme="${theme}"
          style="background: var(--cap-color-background); padding: 32px; box-sizing: border-box;"
        >
          ${story()}
        </div>
      `;
    },
  ],
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