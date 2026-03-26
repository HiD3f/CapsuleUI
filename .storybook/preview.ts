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
    focusStyle: {
      description: 'Focus indicator style',
      defaultValue: 'shadow',
      toolbar: {
        title: 'Focus',
        icon: 'accessibility',
        items: [
          { value: 'shadow', icon: 'box', title: 'Shadow' },
          { value: 'outline', icon: 'outline', title: 'Outline' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (story, context) => {
      const theme = context.globals.theme || 'light';
      const focusStyle = context.globals.focusStyle || 'shadow';
      return html`
        <div
          data-theme="${theme}"
          class="${focusStyle === 'outline' ? 'cap-focus-outline' : ''}"
          style="background: var(--cap-color-background); padding: 32px; box-sizing: border-box;"
        >
          ${story()}
        </div>
      `;
    },
  ],
  parameters: {
    options: {
      storySort: {
        order: ['Welcome', 'Components'],
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;