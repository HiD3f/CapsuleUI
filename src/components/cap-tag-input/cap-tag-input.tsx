import { Component, Host, Prop, State, Event, EventEmitter, Element, Watch, h } from '@stencil/core';

export type TagInputStatus = 'default' | 'error';

export interface TagInputOption {
  label: string;
  value: string;
  disabled?: boolean;
}

@Component({
  tag: 'cap-tag-input',
  styleUrl: 'cap-tag-input.css',
  shadow: true,
})
export class CapTagInput {
  private tagId = `cap-tag-input-${Math.random().toString(36).slice(2, 9)}`;
  private inputEl?: HTMLInputElement;
  private listboxEl?: HTMLUListElement;
  private clickOutsideHandler: (e: MouseEvent) => void;

  @Element() el: HTMLElement;

  /**
   * Current tags. When a suggestion is selected, stores the option's value.
   * When typed freely, stores the raw text.
   */
  @Prop({ mutable: true }) value: string[] = [];

  /**
   * Optional list of suggestions shown as an autocomplete dropdown while typing.
   * If omitted, the component operates as a pure free-text tag input.
   */
  @Prop() options: TagInputOption[] = [];

  /** Placeholder shown when input is empty and no tags are present */
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

  /** Forces the dropdown open — useful for debugging styles */
  @Prop() defaultOpen: boolean = false;

  @State() inputText: string = '';
  @State() open: boolean = false;
  @State() activeIndex: number = -1;
  @State() announcement: string = '';

  /** Emitted when the tag list changes */
  @Event() capChange: EventEmitter<string[]>;

  /** Emitted on every keystroke */
  @Event() capInput: EventEmitter<string>;

  /** Emitted when the input is focused */
  @Event() capFocus: EventEmitter<FocusEvent>;

  /** Emitted when focus leaves the component */
  @Event() capBlur: EventEmitter<FocusEvent>;

  componentWillLoad() {
    if (this.defaultOpen) this.open = true;
  }

  connectedCallback() {
    this.clickOutsideHandler = (e: MouseEvent) => {
      if (this.defaultOpen) return;
      if (!this.el.contains(e.target as Node)) {
        this.open = false;
        this.activeIndex = -1;
        this.inputText = '';
      }
    };
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

  private get status(): TagInputStatus {
    return this.error ? 'error' : 'default';
  }

  private get hasSuggestions(): boolean {
    return this.options.length > 0;
  }

  private get filteredOptions(): TagInputOption[] {
    if (!this.inputText) return this.options;
    const q = this.inputText.toLowerCase();
    return this.options.filter(o => o.label.toLowerCase().includes(q));
  }

  private get feedbackId(): string { return `${this.tagId}-feedback`; }
  private get labelId(): string { return `${this.tagId}-label`; }
  private get inputId(): string { return `${this.tagId}-input`; }
  private get listboxId(): string { return `${this.tagId}-listbox`; }
  private optionId(index: number): string { return `${this.tagId}-option-${index}`; }

  private firstEnabledIndex(opts: TagInputOption[]): number {
    return opts.findIndex(o => !o.disabled);
  }

  private lastEnabledIndex(opts: TagInputOption[]): number {
    for (let i = opts.length - 1; i >= 0; i--) {
      if (!opts[i].disabled) return i;
    }
    return -1;
  }

  private nextEnabledIndex(opts: TagInputOption[], from: number): number {
    for (let i = from + 1; i < opts.length; i++) {
      if (!opts[i].disabled) return i;
    }
    return from;
  }

  private prevEnabledIndex(opts: TagInputOption[], from: number): number {
    for (let i = from - 1; i >= 0; i--) {
      if (!opts[i].disabled) return i;
    }
    return from;
  }

  // ─── Actions ──────────────────────────────────────────────────────────────

  private addTag(tag: string) {
    const trimmed = tag.trim();
    if (!trimmed || this.value.includes(trimmed)) return;
    this.value = [...this.value, trimmed];
    this.inputText = '';
    this.open = false;
    this.activeIndex = -1;
    this.capChange.emit(this.value);
    this.announce(`${trimmed} added`);
  }

  private addFromOption(opt: TagInputOption) {
    if (opt.disabled) return;
    if (this.value.includes(opt.value)) return;
    this.value = [...this.value, opt.value];
    this.inputText = '';
    this.open = false;
    this.activeIndex = -1;
    this.capChange.emit(this.value);
    this.announce(`${opt.label} added`);
  }

  private removeTag(tag: string) {
    const label = this.tagLabel(tag);
    this.value = this.value.filter(v => v !== tag);
    this.capChange.emit(this.value);
    this.announce(`${label} removed`);
  }

  private removeLastTag() {
    if (this.value.length === 0) return;
    this.removeTag(this.value[this.value.length - 1]);
  }

  private announce(msg: string) {
    this.announcement = '';
    setTimeout(() => { this.announcement = msg; }, 50);
  }

  /** Resolves the display label for a tag value */
  private tagLabel(val: string): string {
    return this.options.find(o => o.value === val)?.label ?? val;
  }

  // ─── Event handlers ───────────────────────────────────────────────────────

  private handleInput = (e: Event) => {
    const input = e.target as HTMLInputElement;
    this.inputText = input.value;
    this.activeIndex = -1;
    this.open = this.hasSuggestions && this.inputText.length > 0;
    this.capInput.emit(this.inputText);
  };

  private handleKeyDown = (e: KeyboardEvent) => {
    if (this.disabled) return;
    const filtered = this.filteredOptions;

    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        if (this.open && this.activeIndex >= 0 && filtered[this.activeIndex]) {
          this.addFromOption(filtered[this.activeIndex]);
        } else if (this.inputText.trim()) {
          this.addTag(this.inputText);
        }
        break;

      case 'Tab':
        if (this.inputText.trim()) {
          e.preventDefault();
          if (this.open && this.activeIndex >= 0 && filtered[this.activeIndex]) {
            this.addFromOption(filtered[this.activeIndex]);
          } else {
            this.addTag(this.inputText);
          }
        } else {
          this.open = false;
          this.activeIndex = -1;
        }
        break;

      case 'Backspace':
        if (!this.inputText) {
          this.removeLastTag();
        }
        break;

      case 'ArrowDown':
        if (this.hasSuggestions) {
          e.preventDefault();
          if (!this.open) {
            this.activeIndex = this.firstEnabledIndex(filtered);
            this.open = true;
          } else {
            this.activeIndex = this.activeIndex < 0
              ? this.firstEnabledIndex(filtered)
              : this.nextEnabledIndex(filtered, this.activeIndex);
          }
        }
        break;

      case 'ArrowUp':
        if (this.hasSuggestions && this.open) {
          e.preventDefault();
          this.activeIndex = this.activeIndex < 0
            ? this.lastEnabledIndex(filtered)
            : this.prevEnabledIndex(filtered, this.activeIndex);
        }
        break;

      case 'Home':
        if (this.open) {
          e.preventDefault();
          this.activeIndex = this.firstEnabledIndex(filtered);
        }
        break;

      case 'End':
        if (this.open) {
          e.preventDefault();
          this.activeIndex = this.lastEnabledIndex(filtered);
        }
        break;

      case 'Escape':
        if (this.open) {
          e.preventDefault();
          this.open = false;
          this.activeIndex = -1;
        }
        break;
    }
  };

  private handleFocus = (e: FocusEvent) => this.capFocus.emit(e);

  private handleBlur = (e: FocusEvent) => {
    if (!this.el.contains(e.relatedTarget as Node)) {
      this.open = false;
      this.activeIndex = -1;
      this.inputText = '';
      this.capBlur.emit(e);
    }
  };

  private handleOptionMouseDown = (e: MouseEvent, opt: TagInputOption) => {
    e.preventDefault();
    if (!opt.disabled) {
      this.addFromOption(opt);
      this.inputEl?.focus();
    }
  };

  private handleOptionMouseEnter = (index: number, opt: TagInputOption) => {
    if (!opt.disabled) {
      this.activeIndex = index;
    }
  };

  private handleTagRemoveMouseDown = (e: MouseEvent, tag: string) => {
    e.preventDefault();
    e.stopPropagation();
    this.removeTag(tag);
    this.inputEl?.focus();
  };

  private handleFieldClick = () => {
    this.inputEl?.focus();
  };

  // ─── Render helpers ───────────────────────────────────────────────────────

  private renderTag(tag: string) {
    const label = this.tagLabel(tag);
    return (
      <span class="tag-input__tag" key={tag}>
        <span class="tag-input__tag-label">{label}</span>
        <button
          type="button"
          class="tag-input__tag-remove"
          tabIndex={-1}
          aria-label={`Remove ${label}`}
          disabled={this.disabled}
          onMouseDown={(e) => this.handleTagRemoveMouseDown(e, tag)}
        >
          ✕
        </button>
      </span>
    );
  }

  private renderFeedback() {
    if (!this.error && !this.hint) return null;
    return (
      <div
        id={this.feedbackId}
        class={{
          'tag-input__feedback': true,
          'tag-input__feedback--error': this.status === 'error',
          'tag-input__feedback--hint': this.status === 'default',
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
    const hasValue = this.value.length > 0;
    const activeOptionId = this.open && this.activeIndex >= 0
      ? this.optionId(this.activeIndex)
      : undefined;

    return (
      <Host>
        <div
          class={{
            'tag-input-wrapper': true,
            'tag-input-wrapper--error': this.status === 'error',
            'tag-input-wrapper--disabled': this.disabled,
            'tag-input-wrapper--open': this.open,
          }}
        >
          {/* Label */}
          {this.label && (
            <label id={this.labelId} class="tag-input__label" htmlFor={this.inputId}>
              {this.label}
              {this.required && <span class="tag-input__required" aria-hidden="true"> *</span>}
            </label>
          )}

          {/* Container */}
          <div class="tag-input__container">
            <div class="tag-input__field" onClick={this.handleFieldClick}>
              {/* Tags */}
              {this.value.map(tag => this.renderTag(tag))}

              {/* Input */}
              <input
                id={this.inputId}
                ref={(el) => (this.inputEl = el)}
                type="text"
                role={this.hasSuggestions ? 'combobox' : undefined}
                value={this.inputText}
                placeholder={!hasValue ? this.placeholder : undefined}
                disabled={this.disabled}
                required={this.required}
                autoComplete="off"
                aria-expanded={this.hasSuggestions ? String(this.open) : undefined}
                aria-autocomplete={this.hasSuggestions ? 'list' : undefined}
                aria-haspopup={this.hasSuggestions ? 'listbox' : undefined}
                aria-controls={this.hasSuggestions ? this.listboxId : undefined}
                aria-activedescendant={activeOptionId}
                aria-labelledby={this.label ? this.labelId : undefined}
                aria-required={this.required ? 'true' : undefined}
                aria-invalid={this.status === 'error' ? 'true' : undefined}
                aria-describedby={hasFeedback ? this.feedbackId : undefined}
                class="tag-input__input"
                onInput={this.handleInput}
                onKeyDown={this.handleKeyDown}
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
              />
            </div>

            {/* Suggestions listbox — only rendered when options are provided */}
            {this.hasSuggestions && (
              <ul
                id={this.listboxId}
                ref={(el) => (this.listboxEl = el)}
                role="listbox"
                aria-labelledby={this.label ? this.labelId : undefined}
                class="tag-input__listbox"
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
                          'tag-input__option': true,
                          'tag-input__option--selected': this.value.includes(opt.value),
                          'tag-input__option--active': i === this.activeIndex,
                          'tag-input__option--disabled': !!opt.disabled,
                        }}
                        onMouseDown={(e) => this.handleOptionMouseDown(e, opt)}
                        onMouseEnter={() => this.handleOptionMouseEnter(i, opt)}
                      >
                        <span class="tag-input__option-check" aria-hidden="true">
                          {this.value.includes(opt.value) ? '✓' : ''}
                        </span>
                        {opt.label}
                      </li>
                    ))
                  : (
                    <li class="tag-input__empty" role="presentation">
                      No results found
                    </li>
                  )
                }
              </ul>
            )}
          </div>

          {/* Hidden inputs for form submission — one per tag */}
          {this.value.map(tag => (
            <input type="hidden" name={this.name} value={tag} />
          ))}

          {this.renderFeedback()}

          {/* Screen reader announcements */}
          <div aria-live="polite" aria-atomic="true" class="tag-input__announcer">
            {this.announcement}
          </div>
        </div>
      </Host>
    );
  }
}
