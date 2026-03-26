/**
 * Keyboard navigation helpers for listbox-pattern components.
 * Works with any array whose items have an optional `disabled` flag.
 */

export interface ListboxItem {
  disabled?: boolean;
}

export function firstEnabledIndex(items: ListboxItem[]): number {
  return items.findIndex(item => !item.disabled);
}

export function lastEnabledIndex(items: ListboxItem[]): number {
  for (let i = items.length - 1; i >= 0; i--) {
    if (!items[i].disabled) return i;
  }
  return -1;
}

export function nextEnabledIndex(items: ListboxItem[], from: number): number {
  for (let i = from + 1; i < items.length; i++) {
    if (!items[i].disabled) return i;
  }
  return from;
}

export function prevEnabledIndex(items: ListboxItem[], from: number): number {
  for (let i = from - 1; i >= 0; i--) {
    if (!items[i].disabled) return i;
  }
  return from;
}
