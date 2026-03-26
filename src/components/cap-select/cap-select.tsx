import { Component, Host, Prop, State, Event, EventEmitter, Element, Watch, h } from '@stencil/core';
import { firstEnabledIndex, lastEnabledIndex, nextEnabledIndex, prevEnabledIndex } from '../../utils/listbox-keyboard';
import { createClickOutsideHandler } from '../../utils/click-outside';

export type SelectStatus = 'default' | 'error';

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

@Component({
  tag: 'cap-select',
  styleUrl: 'cap-select.css',
  shadow: true,
})
export class CapSelect {
  private selectId = `cap-select-${Math.random().toString(36).slice(2, 9)}`;
  private triggerEl?: HTMLButtonElement;
  private listboxEl?: HTMLUListElement;
  private clickOutsideHandler: (e: MouseEvent) => void;

  @Element() el: HTMLElement;

  /** Currently selected value */
  @Prop({ mutable: true, reflect: true }) value: string = '';

  /** Array of options to render */
  @Prop() options: SelectOption[] = [];

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

  /** Disables the select */
  @Prop() disabled: boolean = false;

  /** Marks the select as required */
  @Prop() required: boolean = false;

  @State() open: boolean = false;
  @State() activeIndex: number = -1;

  /** Emitted when the selected value changes */
  @Event() capChange: EventEmitter<string>;

  /** Emitted when the trigger is focused */
  @Event() capFocus: EventEmitter<FocusEvent>;

  /** Emitted when focus leaves the component */
  @Event() capBlur: EventEmitter<FocusEvent>;

  connectedCallback() {
    this.clickOutsideHandler = createClickOutsideHandler(this.el, () => {
      this.open = false;
      this.activeIndex = -1;
    });
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

  private get status(): SelectStatus {
    return this.error ? 'error' : 'default';
  }

  private get selectedLabel(): string {
    return this.options.find((o) => o.value === this.value)?.label ?? '';
  }

  private get feedbackId(): string {
    return `${this.selectId}-feedback`;
  }

  private get labelId(): string {
    return `${this.selectId}-label`;
  }

  private get triggerId(): string {
    return `${this.selectId}-trigger`;
  }

  private get listboxId(): string {
    return `${this.selectId}-listbox`;
  }

  private optionId(index: number): string {
    return `${this.selectId}-option-${index}`;
  }


  // ─── Actions ──────────────────────────────────────────────────────────────

  private openDropdown() {
    if (this.disabled) return;
    const selectedIdx = this.options.findIndex((o) => o.value === this.value && !o.disabled);
    this.activeIndex = selectedIdx >= 0 ? selectedIdx : firstEnabledIndex(this.options);
    this.open = true;
  }

  private closeDropdown(returnFocus = true) {
    this.open = false;
    this.activeIndex = -1;
    if (returnFocus) this.triggerEl?.focus();
  }

  private selectOption(opt: SelectOption) {
    this.value = opt.value;
    this.capChange.emit(this.value);
    this.closeDropdown();
  }

  // ─── Event handlers ───────────────────────────────────────────────────────

  private handleTriggerClick = () => {
    if (this.open) {
      this.closeDropdown(false);
    } else {
      this.openDropdown();
    }
  };

  private handleKeyDown = (e: KeyboardEvent) => {
    if (this.disabled) return;

    if (!this.open) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.openDropdown();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        this.activeIndex = nextEnabledIndex(this.options, this.activeIndex);
        break;
      case 'ArrowUp':
        e.preventDefault();
        this.activeIndex = prevEnabledIndex(this.options, this.activeIndex);
        break;
      case 'Home':
        e.preventDefault();
        this.activeIndex = firstEnabledIndex(this.options);
        break;
      case 'End':
        e.preventDefault();
        this.activeIndex = lastEnabledIndex(this.options);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (this.activeIndex >= 0 && !this.options[this.activeIndex]?.disabled) {
          this.selectOption(this.options[this.activeIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        this.closeDropdown();
        break;
      case 'Tab':
        this.closeDropdown(false);
        break;
    }
  };

  private handleTriggerFocus = (e: FocusEvent) => this.capFocus.emit(e);

  private handleTriggerBlur = (e: FocusEvent) => {
    if (!this.el.contains(e.relatedTarget as Node)) {
      this.capBlur.emit(e);
    }
  };

  private handleOptionMouseDown = (e: MouseEvent, opt: SelectOption) => {
    // Prevent blur on trigger before click registers
    e.preventDefault();
    if (!opt.disabled) {
      this.selectOption(opt);
    }
  };

  private handleOptionMouseEnter = (index: number, opt: SelectOption) => {
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
          'select__feedback': true,
          'select__feedback--error': this.status === 'error',
          'select__feedback--hint': this.status === 'default',
        }}
        aria-live={this.status === 'error' ? 'assertive' : 'polite'}
      >
        {this.error || this.hint}
      </div>
    );
  }

  render() {
    const hasFeedback = !!(this.error || this.hint);
    const displayValue = this.selectedLabel || this.placeholder || '';
    const hasValue = !!this.selectedLabel;
    const activeOptionId = this.open && this.activeIndex >= 0
      ? this.optionId(this.activeIndex)
      : undefined;

    return (
      <Host>
        <div
          class={{
            'select-wrapper': true,
            'select-wrapper--error': this.status === 'error',
            'select-wrapper--disabled': this.disabled,
            'select-wrapper--open': this.open,
          }}
        >
          {/* Label */}
          {this.label && (
            <span id={this.labelId} class="select__label">
              {this.label}
              {this.required && (
                <span class="select__required" aria-hidden="true"> *</span>
              )}
            </span>
          )}

          {/* Combobox container */}
          <div class="select__container">
            {/* Trigger button */}
            <button
              id={this.triggerId}
              ref={(el) => (this.triggerEl = el)}
              type="button"
              role="combobox"
              aria-haspopup="listbox"
              aria-expanded={String(this.open)}
              aria-controls={this.listboxId}
              aria-labelledby={this.label ? this.labelId : undefined}
              aria-activedescendant={activeOptionId}
              aria-required={this.required ? 'true' : undefined}
              aria-invalid={this.status === 'error' ? 'true' : undefined}
              aria-describedby={hasFeedback ? this.feedbackId : undefined}
              disabled={this.disabled}
              class={{
                'select__trigger': true,
                'select__trigger--placeholder': !hasValue,
              }}
              onClick={this.handleTriggerClick}
              onKeyDown={this.handleKeyDown}
              onFocus={this.handleTriggerFocus}
              onBlur={this.handleTriggerBlur}
            >
              <span class="select__trigger-value">{displayValue}</span>
              <span class="select__trigger-arrow" aria-hidden="true">▼</span>
            </button>

            {/* Listbox */}
            <ul
              id={this.listboxId}
              ref={(el) => (this.listboxEl = el)}
              role="listbox"
              aria-labelledby={this.label ? this.labelId : undefined}
              class="select__listbox"
              hidden={!this.open}
            >
              {this.options.map((opt, i) => (
                <li
                  id={this.optionId(i)}
                  key={opt.value}
                  role="option"
                  aria-selected={opt.value === this.value ? 'true' : 'false'}
                  aria-disabled={opt.disabled ? 'true' : undefined}
                  class={{
                    'select__option': true,
                    'select__option--selected': opt.value === this.value,
                    'select__option--active': i === this.activeIndex,
                    'select__option--disabled': !!opt.disabled,
                  }}
                  onMouseDown={(e) => this.handleOptionMouseDown(e, opt)}
                  onMouseEnter={() => this.handleOptionMouseEnter(i, opt)}
                >
                  {opt.value === this.value && (
                    <span class="select__option-check" aria-hidden="true">✓</span>
                  )}
                  {opt.label}
                </li>
              ))}
            </ul>
          </div>

          {/* Hidden native select for form submission */}
          <select
            aria-hidden="true"
            tabIndex={-1}
            name={this.name}
            required={this.required}
            disabled={this.disabled}
            class="select__native"
          >
            {!this.value && <option value="" selected></option>}
            {this.options.map((opt) => (
              <option value={opt.value} selected={opt.value === this.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Feedback */}
          {this.renderFeedback()}
        </div>
      </Host>
    );
  }
}
