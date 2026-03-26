import { Component, Host, Prop, State, Event, EventEmitter, Element, Watch, h } from '@stencil/core';
import { firstEnabledIndex, lastEnabledIndex, nextEnabledIndex, prevEnabledIndex } from '../../utils/listbox-keyboard';
import { createClickOutsideHandler } from '../../utils/click-outside';

export type ComboboxStatus = 'default' | 'error';

export interface ComboboxOption {
  label: string;
  value: string;
  disabled?: boolean;
}

@Component({
  tag: 'cap-combobox',
  styleUrl: 'cap-combobox.css',
  shadow: true,
})
export class CapCombobox {
  private comboboxId = `cap-combobox-${Math.random().toString(36).slice(2, 9)}`;
  private inputEl?: HTMLInputElement;
  private listboxEl?: HTMLUListElement;
  private clickOutsideHandler: (e: MouseEvent) => void;

  @Element() el: HTMLElement;

  /** Committed value — option.value when selected, or typed text when freeText=true */
  @Prop({ mutable: true, reflect: true }) value: string = '';

  /** Array of options to filter and display */
  @Prop() options: ComboboxOption[] = [];

  /** Placeholder shown when input is empty */
  @Prop() placeholder: string;

  /** Name attribute for form submission */
  @Prop() name: string;

  /** Label text */
  @Prop() label: string;

  /** Hint text */
  @Prop() hint: string;

  /** Error message */
  @Prop() error: string;

  /** Disables the combobox */
  @Prop() disabled: boolean = false;

  /** Marks the combobox as required */
  @Prop() required: boolean = false;

  /**
   * When true, typed text that doesn't match any option is accepted as a valid value.
   * When false (default), blurring without selecting reverts the input to the last valid selection.
   */
  @Prop() freeText: boolean = false;

  /** Forces the dropdown open — useful for debugging styles */
  @Prop() defaultOpen: boolean = false;

  @State() inputText: string = '';
  @State() open: boolean = false;
  @State() activeIndex: number = -1;

  /** Emitted when the committed value changes */
  @Event() capChange: EventEmitter<string>;

  /** Emitted on every keystroke */
  @Event() capInput: EventEmitter<string>;

  /** Emitted when the input is focused */
  @Event() capFocus: EventEmitter<FocusEvent>;

  /** Emitted when focus leaves the component */
  @Event() capBlur: EventEmitter<FocusEvent>;

  componentWillLoad() {
    this.syncInputFromValue(this.value);
    if (this.defaultOpen) this.open = true;
  }

  connectedCallback() {
    this.clickOutsideHandler = createClickOutsideHandler(
      this.el,
      () => {
        this.commitOrRevert();
        this.open = false;
        this.activeIndex = -1;
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

  @Watch('value')
  valueChanged(newValue: string) {
    this.syncInputFromValue(newValue);
  }

  @Watch('options')
  optionsChanged() {
    this.activeIndex = -1;
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  private syncInputFromValue(val: string) {
    const opt = this.options.find((o) => o.value === val);
    this.inputText = opt ? opt.label : this.freeText ? val : '';
  }

  private get status(): ComboboxStatus {
    return this.error ? 'error' : 'default';
  }

  private get filteredOptions(): ComboboxOption[] {
    if (!this.inputText) return this.options;
    const q = this.inputText.toLowerCase();
    return this.options.filter((o) => o.label.toLowerCase().includes(q));
  }

  private get feedbackId(): string {
    return `${this.comboboxId}-feedback`;
  }

  private get labelId(): string {
    return `${this.comboboxId}-label`;
  }

  private get inputId(): string {
    return `${this.comboboxId}-input`;
  }

  private get listboxId(): string {
    return `${this.comboboxId}-listbox`;
  }

  private optionId(index: number): string {
    return `${this.comboboxId}-option-${index}`;
  }


  // ─── Actions ──────────────────────────────────────────────────────────────

  /**
   * On blur or click-outside:
   * - freeText=false → revert input to label of last valid selection
   * - freeText=true  → commit typed text as value
   */
  private commitOrRevert() {
    if (this.freeText) {
      if (this.inputText !== this.value) {
        this.value = this.inputText;
        this.capChange.emit(this.value);
      }
    } else {
      const opt = this.options.find((o) => o.value === this.value);
      this.inputText = opt ? opt.label : '';
    }
  }

  private selectOption(opt: ComboboxOption) {
    this.value = opt.value;
    this.inputText = opt.label;
    this.open = false;
    this.activeIndex = -1;
    this.capChange.emit(this.value);
  }

  // ─── Event handlers ───────────────────────────────────────────────────────

  private handleInput = (e: Event) => {
    const input = e.target as HTMLInputElement;
    this.inputText = input.value;
    this.activeIndex = -1;
    this.open = true;
    this.capInput.emit(this.inputText);
  };

  private handleKeyDown = (e: KeyboardEvent) => {
    if (this.disabled) return;
    const filtered = this.filteredOptions;

    if (!this.open) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        this.activeIndex = firstEnabledIndex(filtered);
        this.open = true;
        return;
      }
      if (e.key === 'Escape' && this.inputText) {
        e.preventDefault();
        this.inputText = '';
        this.value = '';
        this.capChange.emit('');
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
        e.preventDefault();
        if (this.activeIndex >= 0 && !filtered[this.activeIndex]?.disabled) {
          this.selectOption(filtered[this.activeIndex]);
          this.inputEl?.focus();
        } else if (this.freeText) {
          this.commitOrRevert();
          this.open = false;
        }
        break;
      case 'Escape':
        e.preventDefault();
        this.open = false;
        this.activeIndex = -1;
        if (!this.freeText) {
          const opt = this.options.find((o) => o.value === this.value);
          this.inputText = opt ? opt.label : '';
        }
        break;
      case 'Tab':
        if (this.activeIndex >= 0 && !filtered[this.activeIndex]?.disabled) {
          this.selectOption(filtered[this.activeIndex]);
        } else {
          this.commitOrRevert();
          this.open = false;
        }
        break;
    }
  };

  private handleFocus = (e: FocusEvent) => this.capFocus.emit(e);

  private handleBlur = (e: FocusEvent) => {
    if (!this.el.contains(e.relatedTarget as Node)) {
      this.commitOrRevert();
      this.open = false;
      this.activeIndex = -1;
      this.capBlur.emit(e);
    }
  };

  private handleClear = () => {
    this.inputText = '';
    this.value = '';
    this.open = false;
    this.activeIndex = -1;
    this.capChange.emit('');
    this.inputEl?.focus();
  };

  private handleToggleMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    if (this.open) {
      this.open = false;
      this.activeIndex = -1;
    } else {
      this.activeIndex = -1;
      this.open = true;
    }
    this.inputEl?.focus();
  };

  private handleOptionMouseDown = (e: MouseEvent, opt: ComboboxOption) => {
    e.preventDefault();
    if (!opt.disabled) {
      this.selectOption(opt);
      this.inputEl?.focus();
    }
  };

  private handleOptionMouseEnter = (index: number, opt: ComboboxOption) => {
    if (!opt.disabled) {
      this.activeIndex = index;
    }
  };

  // ─── Render helpers ───────────────────────────────────────────────────────

  private renderFeedback() {
    if (!this.error && !this.hint) return null;

    return (
      <div
        id={this.feedbackId}
        class={{
          'combobox__feedback': true,
          'combobox__feedback--error': this.status === 'error',
          'combobox__feedback--hint': this.status === 'default',
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
    const activeOptionId = this.open && this.activeIndex >= 0
      ? this.optionId(this.activeIndex)
      : undefined;

    return (
      <Host>
        <div
          class={{
            'combobox-wrapper': true,
            'combobox-wrapper--error': this.status === 'error',
            'combobox-wrapper--disabled': this.disabled,
            'combobox-wrapper--open': this.open,
          }}
        >
          {/* Label */}
          {this.label && (
            <label id={this.labelId} class="combobox__label" htmlFor={this.inputId}>
              {this.label}
              {this.required && (
                <span class="combobox__required" aria-hidden="true"> *</span>
              )}
            </label>
          )}

          {/* Field + listbox container */}
          <div class="combobox__container">
            <div class="combobox__field">
            <input
              id={this.inputId}
              ref={(el) => (this.inputEl = el)}
              role="combobox"
              type="text"
              value={this.inputText}
              placeholder={this.placeholder}
              disabled={this.disabled}
              required={this.required}
              autoComplete="off"
              aria-expanded={String(this.open)}
              aria-autocomplete="list"
              aria-controls={this.listboxId}
              aria-activedescendant={activeOptionId}
              aria-required={this.required ? 'true' : undefined}
              aria-invalid={this.status === 'error' ? 'true' : undefined}
              aria-describedby={hasFeedback ? this.feedbackId : undefined}
              onInput={this.handleInput}
              onKeyDown={this.handleKeyDown}
              onFocus={this.handleFocus}
              onBlur={this.handleBlur}
            />

            {/* Clear button */}
            {this.inputText && (
              <button
                type="button"
                class="combobox__clear"
                tabIndex={-1}
                aria-label="Clear"
                onMouseDown={(e) => { e.preventDefault(); this.handleClear(); }}
              >
                ✕
              </button>
            )}

            {/* Toggle button */}
            <button
              type="button"
              class="combobox__toggle"
              tabIndex={-1}
              aria-label={this.open ? 'Close suggestions' : 'Open suggestions'}
              onMouseDown={this.handleToggleMouseDown}
            >
              <span
                class={{ 'combobox__arrow': true, 'combobox__arrow--open': this.open }}
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
            aria-labelledby={this.label ? this.labelId : undefined}
            class="combobox__listbox"
            hidden={!this.open}
          >
            {filtered.length > 0
              ? filtered.map((opt, i) => (
                  <li
                    id={this.optionId(i)}
                    key={opt.value}
                    role="option"
                    aria-selected={opt.value === this.value ? 'true' : 'false'}
                    aria-disabled={opt.disabled ? 'true' : undefined}
                    class={{
                      'combobox__option': true,
                      'combobox__option--selected': opt.value === this.value,
                      'combobox__option--active': i === this.activeIndex,
                      'combobox__option--disabled': !!opt.disabled,
                    }}
                    onMouseDown={(e) => this.handleOptionMouseDown(e, opt)}
                    onMouseEnter={() => this.handleOptionMouseEnter(i, opt)}
                  >
                    {opt.value === this.value && (
                      <span class="combobox__option-check" aria-hidden="true">✓</span>
                    )}
                    {opt.label}
                  </li>
                ))
              : (
                <li class="combobox__empty" role="presentation">
                  No results found
                </li>
              )
            }
          </ul>
          </div>{/* end combobox__container */}

          {/* Hidden input for form submission */}
          <input type="hidden" name={this.name} value={this.value} />

          {this.renderFeedback()}
        </div>
      </Host>
    );
  }
}
