import { Component, Host, Prop, State, Event, EventEmitter, Element, Watch, h } from '@stencil/core';
import { firstEnabledIndex, lastEnabledIndex, nextEnabledIndex, prevEnabledIndex } from '../../utils/listbox-keyboard';
import { createClickOutsideHandler } from '../../utils/click-outside';

export type MultiselectStatus = 'default' | 'error';
export type MultiselectOverflow = 'grow' | 'single-line';

export interface MultiselectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

@Component({
  tag: 'cap-multiselect',
  styleUrl: 'cap-multiselect.css',
  shadow: true,
})
export class CapMultiselect {
  private msId = `cap-multiselect-${Math.random().toString(36).slice(2, 9)}`;
  private triggerEl?: HTMLElement;
  private inputEl?: HTMLInputElement;
  private listboxEl?: HTMLUListElement;
  private clickOutsideHandler: (e: MouseEvent) => void;

  @Element() el: HTMLElement;

  /** Currently selected values */
  @Prop({ mutable: true }) value: string[] = [];

  /** Array of options to display */
  @Prop() options: MultiselectOption[] = [];

  /** Placeholder shown when no value is selected */
  @Prop() placeholder: string;

  /** Name attribute for form submission */
  @Prop() name: string;

  /** Label text */
  @Prop() label: string;

  /** Hint text */
  @Prop() hint: string;

  /** Error message */
  @Prop() error: string;

  /** Disables the component */
  @Prop() disabled: boolean = false;

  /** Marks the component as required */
  @Prop() required: boolean = false;

  /**
   * Controls chip layout.
   * grow (default): the trigger expands vertically as chips are added.
   * single-line: trigger stays one line; excess chips collapse into a "+N" badge.
   */
  @Prop() overflow: MultiselectOverflow = 'grow';

  /**
   * Maximum chips shown in the trigger before a "+N" badge appears.
   * Only relevant when overflow="single-line".
   */
  @Prop() maxVisibleChips: number = 3;

  /**
   * When true, a text input is shown inside the trigger for filtering options.
   * When false (default), the trigger is a select-only control.
   */
  @Prop() filterable: boolean = false;

  /** Forces the dropdown open — useful for debugging styles */
  @Prop() defaultOpen: boolean = false;

  @State() open: boolean = false;
  @State() activeIndex: number = -1;
  @State() filterText: string = '';
  @State() announcement: string = '';

  /** Emitted when the selected values change */
  @Event() capChange: EventEmitter<string[]>;

  /** Emitted on every keystroke in filterable mode */
  @Event() capInput: EventEmitter<string>;

  /** Emitted when the trigger is focused */
  @Event() capFocus: EventEmitter<FocusEvent>;

  /** Emitted when focus leaves the component */
  @Event() capBlur: EventEmitter<FocusEvent>;

  componentWillLoad() {
    if (this.defaultOpen) this.open = true;
  }

  connectedCallback() {
    this.clickOutsideHandler = createClickOutsideHandler(
      this.el,
      () => {
        this.open = false;
        this.activeIndex = -1;
        this.filterText = '';
      },
      () => this.defaultOpen,
    );
    document.addEventListener('mousedown', this.clickOutsideHandler);
  }

  disconnectedCallback() {
    document.removeEventListener('mousedown', this.clickOutsideHandler);
  }

  componentDidUpdate() {
    if (this.open && this.activeIndex >= 0 && this.listboxEl) {
      const activeEl = this.listboxEl.querySelector(`#${this.optionId(this.activeIndex)}`);
      (activeEl as HTMLElement)?.scrollIntoView({ block: 'nearest' });
    }
  }

  @Watch('options')
  optionsChanged() {
    this.activeIndex = -1;
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  private get status(): MultiselectStatus {
    return this.error ? 'error' : 'default';
  }

  private get selectedOptions(): MultiselectOption[] {
    return this.value
      .map(v => this.options.find(o => o.value === v))
      .filter(Boolean) as MultiselectOption[];
  }

  private get filteredOptions(): MultiselectOption[] {
    if (!this.filterText) return this.options;
    const q = this.filterText.toLowerCase();
    return this.options.filter(o => o.label.toLowerCase().includes(q));
  }

  private get visibleChips(): MultiselectOption[] {
    if (this.overflow === 'grow') return this.selectedOptions;
    return this.selectedOptions.slice(0, this.maxVisibleChips);
  }

  private get hiddenChipCount(): number {
    if (this.overflow !== 'single-line') return 0;
    return Math.max(0, this.selectedOptions.length - this.maxVisibleChips);
  }

  private get triggerAriaLabel(): string {
    const base = this.label || 'Select options';
    if (this.value.length === 0) return base;
    const names = this.selectedOptions.map(o => o.label).join(', ');
    return `${base}, ${this.value.length} selected: ${names}`;
  }

  private get feedbackId(): string { return `${this.msId}-feedback`; }
  private get labelId(): string { return `${this.msId}-label`; }
  private get listboxId(): string { return `${this.msId}-listbox`; }
  private get inputId(): string { return `${this.msId}-input`; }
  private optionId(index: number): string { return `${this.msId}-option-${index}`; }


  // ─── Actions ──────────────────────────────────────────────────────────────

  private openDropdown() {
    if (this.disabled) return;
    this.activeIndex = firstEnabledIndex(this.filteredOptions);
    this.open = true;
  }

  private closeDropdown() {
    this.open = false;
    this.activeIndex = -1;
    this.filterText = '';
  }

  private toggleOption(opt: MultiselectOption) {
    if (opt.disabled) return;
    const isSelected = this.value.includes(opt.value);
    this.value = isSelected
      ? this.value.filter(v => v !== opt.value)
      : [...this.value, opt.value];
    this.capChange.emit(this.value);
    this.announce(isSelected ? `${opt.label} removed` : `${opt.label} added`);
  }

  private removeChip(opt: MultiselectOption) {
    this.value = this.value.filter(v => v !== opt.value);
    this.capChange.emit(this.value);
    this.announce(`${opt.label} removed`);
  }

  private removeLastChip() {
    if (this.value.length === 0) return;
    const last = this.selectedOptions[this.selectedOptions.length - 1];
    this.removeChip(last);
  }

  private clearAll() {
    this.value = [];
    this.capChange.emit(this.value);
    this.announce('All selections cleared');
  }

  private announce(msg: string) {
    // Reset first to force re-announcement if the same message fires twice
    this.announcement = '';
    setTimeout(() => { this.announcement = msg; }, 50);
  }

  private focusTrigger() {
    if (this.filterable) {
      this.inputEl?.focus();
    } else {
      (this.triggerEl as HTMLElement)?.focus();
    }
  }

  // ─── Event handlers ───────────────────────────────────────────────────────

  private handleTriggerClick = () => {
    if (this.disabled) return;
    if (this.open) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  };

  private handleKeyDown = (e: KeyboardEvent) => {
    if (this.disabled) return;
    const filtered = this.filteredOptions;

    if (!this.open) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.openDropdown();
        return;
      }
      if (e.key === 'Backspace' && !this.filterText) {
        this.removeLastChip();
        return;
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        this.activeIndex = this.activeIndex < 0
          ? firstEnabledIndex(filtered)
          : nextEnabledIndex(filtered, this.activeIndex);
        break;
      case 'ArrowUp':
        e.preventDefault();
        this.activeIndex = this.activeIndex < 0
          ? lastEnabledIndex(filtered)
          : prevEnabledIndex(filtered, this.activeIndex);
        break;
      case 'Home':
        e.preventDefault();
        this.activeIndex = firstEnabledIndex(filtered);
        break;
      case 'End':
        e.preventDefault();
        this.activeIndex = lastEnabledIndex(filtered);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (this.activeIndex >= 0 && filtered[this.activeIndex]) {
          this.toggleOption(filtered[this.activeIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        this.closeDropdown();
        this.focusTrigger();
        break;
      case 'Tab':
        this.closeDropdown();
        break;
      case 'Backspace':
        if (this.filterable && !this.filterText) {
          this.removeLastChip();
        }
        break;
    }
  };

  private handleInput = (e: Event) => {
    const input = e.target as HTMLInputElement;
    this.filterText = input.value;
    this.activeIndex = -1;
    this.open = true;
    this.capInput.emit(this.filterText);
  };

  private handleFocus = (e: FocusEvent) => this.capFocus.emit(e);

  private handleBlur = (e: FocusEvent) => {
    if (!this.el.contains(e.relatedTarget as Node)) {
      this.closeDropdown();
      this.capBlur.emit(e);
    }
  };

  private handleToggleMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    this.handleTriggerClick();
    this.focusTrigger();
  };

  private handleClearMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    this.clearAll();
    this.focusTrigger();
  };

  private handleOptionMouseDown = (e: MouseEvent, opt: MultiselectOption) => {
    e.preventDefault();
    if (!opt.disabled) {
      this.toggleOption(opt);
      this.focusTrigger();
    }
  };

  private handleOptionMouseEnter = (index: number, opt: MultiselectOption) => {
    if (!opt.disabled) {
      this.activeIndex = index;
    }
  };

  private handleChipRemoveMouseDown = (e: MouseEvent, opt: MultiselectOption) => {
    e.preventDefault();
    e.stopPropagation();
    this.removeChip(opt);
    this.focusTrigger();
  };

  // ─── Render helpers ───────────────────────────────────────────────────────

  private renderChip(opt: MultiselectOption) {
    return (
      <span class="multiselect__chip" key={opt.value}>
        <span class="multiselect__chip-label">{opt.label}</span>
        <button
          type="button"
          class="multiselect__chip-remove"
          tabIndex={-1}
          aria-label={`Remove ${opt.label}`}
          disabled={this.disabled}
          onMouseDown={(e) => this.handleChipRemoveMouseDown(e, opt)}
        >
          ✕
        </button>
      </span>
    );
  }

  private renderChipsArea() {
    const visible = this.visibleChips;
    const hidden = this.hiddenChipCount;
    const hasSelection = this.value.length > 0;

    return (
      <div class="multiselect__chips-area">
        {visible.map(opt => this.renderChip(opt))}
        {hidden > 0 && (
          <span class="multiselect__overflow-badge" aria-hidden="true">+{hidden}</span>
        )}
        {this.filterable && (
          <input
            id={this.inputId}
            ref={(el) => (this.inputEl = el)}
            type="text"
            role="combobox"
            value={this.filterText}
            placeholder={!hasSelection ? this.placeholder : undefined}
            disabled={this.disabled}
            autoComplete="off"
            aria-expanded={String(this.open)}
            aria-autocomplete="list"
            aria-haspopup="listbox"
            aria-controls={this.listboxId}
            aria-activedescendant={this.open && this.activeIndex >= 0 ? this.optionId(this.activeIndex) : undefined}
            aria-required={this.required ? 'true' : undefined}
            aria-invalid={this.status === 'error' ? 'true' : undefined}
            aria-describedby={!!(this.error || this.hint) ? this.feedbackId : undefined}
            aria-label={this.triggerAriaLabel}
            class="multiselect__input"
            onInput={this.handleInput}
            onKeyDown={this.handleKeyDown}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            onClick={() => { if (!this.open) this.openDropdown(); }}
          />
        )}
        {!this.filterable && !hasSelection && (
          <span class="multiselect__placeholder">{this.placeholder}</span>
        )}
      </div>
    );
  }

  private renderFeedback() {
    if (!this.error && !this.hint) return null;
    return (
      <div
        id={this.feedbackId}
        class={{
          'multiselect__feedback': true,
          'multiselect__feedback--error': this.status === 'error',
          'multiselect__feedback--hint': this.status === 'default',
        }}
        aria-live={this.status === 'error' ? 'assertive' : 'polite'}
      >
        {this.error || this.hint}
      </div>
    );
  }

  render() {
    const hasFeedback = !!(this.error || this.hint);
    const filtered = this.filteredOptions;
    const hasSelection = this.value.length > 0;
    const activeOptionId = this.open && this.activeIndex >= 0
      ? this.optionId(this.activeIndex)
      : undefined;

    return (
      <Host>
        <div
          class={{
            'multiselect-wrapper': true,
            'multiselect-wrapper--error': this.status === 'error',
            'multiselect-wrapper--disabled': this.disabled,
            'multiselect-wrapper--open': this.open,
            'multiselect-wrapper--has-value': hasSelection,
            'multiselect-wrapper--grow': this.overflow === 'grow',
            'multiselect-wrapper--single-line': this.overflow === 'single-line',
            'multiselect-wrapper--filterable': this.filterable,
          }}
        >
          {/* Label */}
          {this.label && (
            <span id={this.labelId} class="multiselect__label">
              {this.label}
              {this.required && <span class="multiselect__required" aria-hidden="true"> *</span>}
            </span>
          )}

          {/* Container */}
          <div class="multiselect__container">
            <div class="multiselect__field">

              {this.filterable ? (
                /* Filterable: input inside chips-area is the combobox */
                this.renderChipsArea()
              ) : (
                /* Select-only: the div is the combobox */
                <div
                  ref={(el) => (this.triggerEl = el as HTMLElement)}
                  role="combobox"
                  tabIndex={this.disabled ? -1 : 0}
                  aria-haspopup="listbox"
                  aria-expanded={String(this.open)}
                  aria-controls={this.listboxId}
                  aria-activedescendant={activeOptionId}
                  aria-required={this.required ? 'true' : undefined}
                  aria-invalid={this.status === 'error' ? 'true' : undefined}
                  aria-describedby={hasFeedback ? this.feedbackId : undefined}
                  aria-label={this.triggerAriaLabel}
                  class="multiselect__trigger"
                  onClick={this.handleTriggerClick}
                  onKeyDown={this.handleKeyDown}
                  onFocus={this.handleFocus}
                  onBlur={this.handleBlur}
                >
                  {this.renderChipsArea()}
                </div>
              )}

              {/* Clear all */}
              {hasSelection && (
                <button
                  type="button"
                  class="multiselect__clear"
                  tabIndex={-1}
                  aria-label="Clear all"
                  disabled={this.disabled}
                  onMouseDown={this.handleClearMouseDown}
                >
                  ✕
                </button>
              )}

              {/* Toggle */}
              <button
                type="button"
                class="multiselect__toggle"
                tabIndex={-1}
                aria-hidden="true"
                disabled={this.disabled}
                onMouseDown={this.handleToggleMouseDown}
              >
                <span
                  class={{ 'multiselect__arrow': true, 'multiselect__arrow--open': this.open }}
                  aria-hidden="true"
                >
                  ▼
                </span>
              </button>
            </div>

            {/* Listbox */}
            <ul
              id={this.listboxId}
              ref={(el) => (this.listboxEl = el)}
              role="listbox"
              aria-multiselectable="true"
              aria-labelledby={this.label ? this.labelId : undefined}
              class="multiselect__listbox"
              hidden={!this.open}
            >
              {filtered.length > 0
                ? filtered.map((opt, i) => (
                    <li
                      id={this.optionId(i)}
                      key={opt.value}
                      role="option"
                      aria-selected={this.value.includes(opt.value) ? 'true' : 'false'}
                      aria-disabled={opt.disabled ? 'true' : undefined}
                      class={{
                        'multiselect__option': true,
                        'multiselect__option--selected': this.value.includes(opt.value),
                        'multiselect__option--active': i === this.activeIndex,
                        'multiselect__option--disabled': !!opt.disabled,
                      }}
                      onMouseDown={(e) => this.handleOptionMouseDown(e, opt)}
                      onMouseEnter={() => this.handleOptionMouseEnter(i, opt)}
                    >
                      <span class="multiselect__option-check" aria-hidden="true">
                        {this.value.includes(opt.value) ? '✓' : ''}
                      </span>
                      {opt.label}
                    </li>
                  ))
                : (
                  <li class="multiselect__empty" role="presentation">
                    No results found
                  </li>
                )
              }
            </ul>
          </div>

          {/* Hidden native select for form submission */}
          <select
            multiple
            aria-hidden="true"
            tabIndex={-1}
            name={this.name}
            required={this.required}
            disabled={this.disabled}
            class="multiselect__native"
          >
            {this.options.map(opt => (
              <option value={opt.value} selected={this.value.includes(opt.value)}>
                {opt.label}
              </option>
            ))}
          </select>

          {this.renderFeedback()}

          {/* Screen reader live region for chip add/remove announcements */}
          <div aria-live="polite" aria-atomic="true" class="multiselect__announcer">
            {this.announcement}
          </div>
        </div>
      </Host>
    );
  }
}
