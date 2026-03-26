# CapsuleUI — Design Notes

Running log of decisions made, reasoning, open questions, and things to revisit.

---

## Stack & Constraints

- **Stencil.js** — web components with Shadow DOM, TSX, scoped CSS per component
- **Storybook** — stories use `lit-html` tagged templates; array/object props use `.prop=${value}` binding
- **Design tokens** — `src/styles/tokens.css`; every visual decision is a CSS custom property — colors, typography, spacing, border radius, shadows, focus styles
- **Aesthetic** — retro yellow/black is the reference theme, not the ceiling. The token system is intentionally broad so the library can be reskinned for any style by overriding custom properties, no component code changes needed.
- **Token pipeline vision** — the CSS custom property layer is designed to be the consumption end of a token pipeline. A tool like Style Dictionary or Tokens Studio could generate the token file from a Figma source, meaning a designer can drive the entire visual output of the library without a single line of code changing hands.

---

## Components Built

### Form primitives
| Component | Status | Notes |
|---|---|---|
| `cap-button` | ✅ done | |
| `cap-input` | ✅ done | text, email, password, search, number |
| `cap-textarea` | ✅ done | character counter, resize options |
| `cap-checkbox` | ✅ done | indeterminate state |
| `cap-radio` | ✅ done | |
| `cap-radio-group` | ✅ done | manages name + checked state across slotted children |

### Dropdown family
| Component | Status | Notes |
|---|---|---|
| `cap-select` | ✅ done | custom ARIA combobox, select-only |
| `cap-combobox` | ✅ done | editable combobox, freeText prop |
| `cap-multiselect` | 🔲 next | |
| `cap-tag-input` | 🔲 next | |

---

## Conventions (apply to all components)

- Random instance ID: `` `cap-{component}-${Math.random().toString(36).slice(2, 9)}` ``
- Props: `label`, `hint`, `error`, `disabled`, `required`, `name`, `value` — consistent naming across all
- Status getter: `'default' | 'error'` derived from `this.error ? 'error' : 'default'`
- Feedback block: hint/error in a div with `aria-live` — assertive for errors, polite for hints
- Events: `capChange`, `capInput`, `capFocus`, `capBlur` — prefixed with `cap`
- CSS: BEM-like naming, `{component}-wrapper`, `{component}__element`, `{component}__element--modifier`
- Focus ring: default is `box-shadow: var(--cap-shadow)` (retro offset); `cap-focus-outline` class on root switches to standard outline

---

## Dropdown Family — Architecture Decisions

### Why a custom dropdown instead of native `<select>`

Native `<select>` can't be styled to match the retro aesthetic inside Shadow DOM.
Custom ARIA combobox gives full styling control while remaining accessible.

### ARIA patterns used

- **`cap-select`** — Select-Only Combobox (`role="combobox"` on a `<button>`, no text input)
- **`cap-combobox`** — Editable Combobox (`role="combobox"` on `<input>`, `aria-autocomplete="list"`)
- **`cap-multiselect`** (planned) — Editable Combobox + multiselect listbox
- **Future `cap-dropdown-menu`** — Different pattern entirely: `role="menu"` / `role="menuitem"` — shares nothing with the listbox family except click-outside and positioning

### Shared primitive decision (cap-listbox)

**Decision: wait.**

All dropdown components share:
- Listbox markup (`role="listbox"`, `role="option"`, `aria-activedescendant`)
- Keyboard nav logic (next/prev/first/last enabled index)
- Click-outside behavior

But they differ enough in ARIA structure and interaction that a shared component would become a configuration mess prematurely.

**Plan:** extract pure behavior utilities once we have 2+ consumers built:
- `src/utils/listbox-keyboard.ts` — index navigation helpers
- `src/utils/click-outside.ts` — document mousedown handler

A `cap-listbox` primitive (just the `<ul>` + options, no trigger, no positioning) may make sense after `cap-multiselect` — revisit then.

### Naming — cap-combobox vs cap-autocomplete

Went back and forth. Final answer:

- **`cap-combobox`** = single component covering both use cases
- `freeText` prop (default `false`):
  - `false` → must select from list; blur without selecting reverts input to last valid value
  - `true` → free text accepted; blur commits typed text as value
- Reasoning: both variants share identical structure (text input + filtered listbox), difference is purely behavioral. One component with a prop is cleaner than two separate components.
- `cap-combobox` name chosen over `cap-autocomplete` because it aligns with WAI-ARIA role naming (`role="combobox"`)

### Blur behavior (cap-combobox)

- `freeText=false`: revert `inputText` to label of last committed `value`
- `freeText=true`: commit `inputText` as `value`, emit `capChange`
- Blur/click-outside race condition solved with `e.preventDefault()` on `mousedown` of options, clear button, and toggle button — keeps focus on input so blur doesn't fire mid-interaction

### Form submission (dropdown components)

cap-select uses a hidden native `<select>` (aria-hidden, tabIndex=-1).
cap-combobox uses a hidden `<input type="hidden">`.
The visible input never carries `name` — only the hidden element does.

### defaultOpen prop (cap-combobox)

Added for debugging styles without the dropdown closing on focus loss.
`defaultOpen=true` also bypasses the click-outside handler.
Useful outside Storybook too (e.g. guided tours, onboarding overlays).

### CSS positioning bug (cap-combobox)

Listbox uses `position: absolute; top: 100%` and requires a `position: relative` ancestor.
cap-select wraps trigger + listbox in `.select__container { position: relative }`.
cap-combobox initially was missing this wrapper — listbox anchored to wrong element.
Fixed by adding `.combobox__container { position: relative }` wrapping field + listbox.
**Rule:** always wrap trigger/field + listbox in a positioned container div.

---

## Components — Dropdown family: what uses a listbox

Grouped by similarity to guide future shared primitive decisions:

**Group 1 — Select-only (no text input, single value)**
- `cap-select` ✅

**Group 2 — Editable combobox (text input + dropdown)**
- `cap-combobox` ✅ (covers both must-select and free-text via prop)

**Group 3 — Multi-value**
- `cap-multiselect` 🔲 — multiple selections, chips in trigger
- `cap-tag-input` 🔲 — free text tags and/or predefined options

**Group 4 — Action menus (not form fields, different ARIA)**
- `cap-dropdown-menu` 🔲 — trigger + list of actions/links (`role="menu"`)
- `cap-context-menu` 🔲 — right-click variant

Groups 1–3 share the listbox pattern. Group 4 is unrelated internally.

---

## Tooling & Infrastructure

### Storybook 10 upgrade

Upgraded to Storybook 10. Breaking change: `@storybook/blocks` import path changed — required updating the import in the docs config.

### Package exports map — types condition ordering

In `package.json` exports, the `types` condition must come **before** `import` and `require`, otherwise TypeScript won't resolve types correctly. Fixed by reordering the conditions in the loader exports entry.

### Storybook welcome page

Added a welcome/intro page and per-component descriptions to improve the Storybook browsing experience.

---

## Open Questions

- [ ] **cap-multiselect**: chips inside trigger or below it? Max visible chips before overflow?
- [ ] **cap-tag-input**: predefined options only, free text only, or both modes (via prop like freeText)?
- [ ] **Dark theme**: tokens exist but no dark theme CSS yet — when do we add it?
- [ ] **cap-listbox primitive**: revisit after cap-multiselect is built
- [ ] **Utility extraction**: `listbox-keyboard.ts` + `click-outside.ts` — do after cap-multiselect

---

## To Do

- [ ] Build `cap-multiselect`
- [ ] Build `cap-tag-input`
- [ ] Extract shared listbox utilities
- [ ] Create design decisions file for each component? Or keep it all here?
- [ ] Decide on Group 4 (menus) — different session, different ARIA mindset

---

## Deferred / Parked

- **`cap-combobox` as two separate components** — rejected in favour of `freeText` prop
- **`cap-autocomplete` as a name** — rejected, confusing with free-text variant
- **Shared `cap-listbox` component** — parked, revisit after multiselect
- **Group 4 menus** — deferred, completely different ARIA pattern, no timeline yet
