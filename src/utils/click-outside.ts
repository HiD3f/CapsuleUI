/**
 * Creates a mousedown handler that calls `onOutside` when a click occurs
 * outside the given element. Pass an optional `guard` function that returns
 * true to skip the check (e.g. when a defaultOpen prop is active).
 */
export function createClickOutsideHandler(
  element: HTMLElement,
  onOutside: () => void,
  guard?: () => boolean,
): (e: MouseEvent) => void {
  return (e: MouseEvent) => {
    if (guard?.()) return;
    if (!element.contains(e.target as Node)) {
      onOutside();
    }
  };
}
