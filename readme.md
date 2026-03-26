# CapsuleUI

A retro-styled web component library built with [Stencil.js](https://stenciljs.com). Black, yellow, offset box shadows, zero border-radius — form primitives and dropdowns that look like they escaped from 1994.

Components are framework-agnostic standard Web Components. Use them in React, Vue, plain HTML, or anything else.

---

## Components

| Component | Description |
|---|---|
| `cap-button` | Button |
| `cap-input` | Text, email, password, search, number |
| `cap-textarea` | Textarea with optional character counter |
| `cap-checkbox` | Checkbox with indeterminate state |
| `cap-radio` / `cap-radio-group` | Radio buttons |
| `cap-select` | Custom styled select (select-only combobox) |
| `cap-combobox` | Editable combobox; `freeText` prop for free-text mode |

---

## Getting started

**Requirements:** Node.js 18+

```bash
git clone https://github.com/your-username/capsuleui.git
cd capsuleui
npm install
```

### Run Storybook (component browser)

```bash
npm run storybook
```

Opens at [http://localhost:6006](http://localhost:6006). This is the best way to explore and interact with components.

### Run dev server (raw Stencil)

```bash
npm start
```

Opens at [http://localhost:3333](http://localhost:3333). Watches for changes and rebuilds automatically.

### Build for production

```bash
npm run build
```

Output goes to `dist/` and `loader/`.

### Run tests

```bash
npm test
```

---

## Design tokens & theming

The current look is a retro yellow/black theme — but that's a starting point, not a constraint. Every visual decision (colors, typography, spacing, border radius, shadows, focus styles) is driven by CSS custom properties defined in `src/styles/tokens.css`. The goal is a library that can be reskinned entirely by swapping out a token set, without touching component code.

If you want a different aesthetic, override the custom properties at the `:root` level (or any scope) and the components follow.
