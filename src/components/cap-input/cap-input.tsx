import { Component, Host, Prop, State, Event, EventEmitter, Watch, h } from '@stencil/core';

export type InputType = 'text' | 'email' | 'password' | 'number' | 'search';
export type InputStatus = 'default' | 'error' | 'success';

@Component({
  tag: 'cap-input',
  styleUrl: 'cap-input.css',
  shadow: true,
})
export class CapInput {
  private inputId = `cap-input-${Math.random().toString(36).slice(2, 9)}`;
  private inputEl?: HTMLInputElement;

  /** Input type */
  @Prop() type: InputType = 'text';

  /** Input value */
  @Prop({ mutable: true, reflect: true }) value: string = '';

  /** Input name for forms */
  @Prop() name: string;

  /** Placeholder text */
  @Prop() placeholder: string;

  /** Label text */
  @Prop() label: string;

  /** Hint text */
  @Prop() hint: string;

  /** Error message — takes priority over hint and success */
  @Prop() error: string;

  /** Success message — takes priority over hint */
  @Prop() success: string;

  /** Disables the input */
  @Prop() disabled: boolean = false;

  /** Makes the input read-only */
  @Prop() readonly: boolean = false;

  /** Marks the input as required */
  @Prop() required: boolean = false;

  /** Whether password is visible (only for type="password") */
  @State() passwordVisible: boolean = false;

  /** Emitted when the value changes */
  @Event() capChange: EventEmitter<string>;

  /** Emitted on input (every keystroke) */
  @Event() capInput: EventEmitter<string>;

  /** Emitted when the input is focused */
  @Event() capFocus: EventEmitter<FocusEvent>;

  /** Emitted when the input loses focus */
  @Event() capBlur: EventEmitter<FocusEvent>;

  /** Emitted when the clear button is clicked (search type) */
  @Event() capClear: EventEmitter<void>;

  @Watch('value')
  valueChanged(newValue: string) {
    if (this.inputEl && this.inputEl.value !== newValue) {
      this.inputEl.value = newValue;
    }
  }

  private handleInput = (e: Event) => {
    const input = e.target as HTMLInputElement;
    this.value = input.value;
    this.capInput.emit(this.value);
  };

  private handleChange = (e: Event) => {
    const input = e.target as HTMLInputElement;
    this.value = input.value;
    this.capChange.emit(this.value);
  };

  private handleFocus = (e: FocusEvent) => this.capFocus.emit(e);
  private handleBlur = (e: FocusEvent) => this.capBlur.emit(e);

  private handleClear = () => {
    this.value = '';
    this.capClear.emit();
    this.inputEl?.focus();
  };

  private togglePassword = () => {
    this.passwordVisible = !this.passwordVisible;
  };

  private get status(): InputStatus {
    if (this.error) return 'error';
    if (this.success) return 'success';
    return 'default';
  }

  private get feedbackMessage(): string {
    if (this.error) return this.error;
    if (this.success) return this.success;
    if (this.hint) return this.hint;
    return '';
  }

  private get feedbackId(): string {
    return `${this.inputId}-feedback`;
  }

  private get resolvedType(): string {
    if (this.type === 'password') {
      return this.passwordVisible ? 'text' : 'password';
    }
    return this.type;
  }

  private renderIcon() {
    const hasCustomIcon = false; // will be true when slot is used
    if (hasCustomIcon) return <slot name="icon" />;

    switch (this.type) {
      case 'search': return <span class="input__icon" aria-hidden="true">⌕</span>;
      case 'email':  return <span class="input__icon" aria-hidden="true">✉</span>;
      default:       return null;
    }
  }

  private renderAction() {
    if (this.type === 'password') {
      return (
        <button
          class="input__action"
          type="button"
          onClick={this.togglePassword}
          aria-label={this.passwordVisible ? 'Hide password' : 'Show password'}
        >
          {this.passwordVisible ? '🙈' : '👁'}
        </button>
      );
    }
    if (this.type === 'search' && this.value) {
      return (
        <button
          class="input__action"
          type="button"
          onClick={this.handleClear}
          aria-label="Clear search"
        >
          ✕
        </button>
      );
    }
    return null;
  }

  private renderFeedback() {
    const message = this.feedbackMessage;
    if (!message && !this.hasSlotContent()) return null;

    return (
      <div
        id={this.feedbackId}
        class={{
          'input__feedback': true,
          'input__feedback--error': this.status === 'error',
          'input__feedback--success': this.status === 'success',
          'input__feedback--hint': this.status === 'default',
        }}
        aria-live={this.status === 'error' ? 'assertive' : 'polite'}
      >
        {this.error ? <slot name="error">{this.error}</slot>
          : this.success ? <slot name="success">{this.success}</slot>
          : <slot name="hint">{this.hint}</slot>}
      </div>
    );
  }

  private hasSlotContent(): boolean {
    return false; // simplified for now
  }

  render() {
    const hasFeedback = !!(this.error || this.success || this.hint);
    const icon = this.renderIcon();

    return (
      <Host>
        <div class={{ 
          'input-wrapper': true,
          [`input-wrapper--${this.status}`]: true,
          'input-wrapper--disabled': this.disabled,
        }}>

          {/* Label */}
          {this.label && (
            <label class="input__label" htmlFor={this.inputId}>
              <slot name="label">{this.label}</slot>
              {this.required && <span class="input__required" aria-hidden="true"> *</span>}
            </label>
          )}

          {/* Field */}
          <div class={{ 'input__field': true, 'input__field--has-icon': !!icon }}>
            {icon}
            <input
              id={this.inputId}
              ref={(el) => (this.inputEl = el)}
              type={this.resolvedType}
              name={this.name}
              value={this.value}
              placeholder={this.placeholder}
              disabled={this.disabled}
              readOnly={this.readonly}
              required={this.required}
              aria-required={this.required ? 'true' : undefined}
              aria-invalid={this.status === 'error' ? 'true' : undefined}
              aria-describedby={hasFeedback ? this.feedbackId : undefined}
              onInput={this.handleInput}
              onChange={this.handleChange}
              onFocus={this.handleFocus}
              onBlur={this.handleBlur}
            />
            {this.renderAction()}
          </div>

          {/* Feedback */}
          {this.renderFeedback()}
        </div>
      </Host>
    );
  }
}