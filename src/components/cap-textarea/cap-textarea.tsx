import { Component, Host, Prop, State, Event, EventEmitter, Watch, h } from '@stencil/core';

export type TextareaResize = 'none' | 'vertical' | 'both';
export type TextareaStatus = 'default' | 'error' | 'success';

@Component({
  tag: 'cap-textarea',
  styleUrl: 'cap-textarea.css',
  shadow: true,
})

export class CapTextarea {
  private textareaId = `cap-textarea-${Math.random().toString(36).slice(2, 9)}`;
  private textareaEl?: HTMLTextAreaElement;

  /** The current value of the textarea */
  @Prop({ mutable: true, reflect: true }) value: string = '';

  /** Name attribute for form submission */
  @Prop() name: string;

  /** Placeholder text */
  @Prop() placeholder: string;

  /** Label text */
  @Prop() label: string;

  /** Hint text shown below the textarea */
  @Prop() hint: string;

  /** Error message — takes priority over hint and success */
  @Prop() error: string;

  /** Success message — takes priority over hint */
  @Prop() success: string;

  /** Number of visible rows */
  @Prop() rows: number = 4;

  /** Whether the textarea can be resized */
  @Prop() resize: TextareaResize = 'vertical';

  /** Maximum number of characters allowed */
  @Prop() maxlength: number;

  /** Disables the textarea */
  @Prop() disabled: boolean = false;

  /** Makes the textarea read-only */
  @Prop() readonly: boolean = false;

  /** Marks the textarea as required */
  @Prop() required: boolean = false;

  /** Accessible label for when no visible label is used */
  @Prop() ariaLabel: string;

  /** Tracks current character count for the counter display */
  @State() currentLength: number = 0;

  /** Emitted when the value changes (on blur) */
  @Event() capChange: EventEmitter<string>;

  /** Emitted on every keystroke */
  @Event() capInput: EventEmitter<string>;

  /** Emitted when the textarea is focused */
  @Event() capFocus: EventEmitter<FocusEvent>;

  /** Emitted when the textarea loses focus */
  @Event() capBlur: EventEmitter<FocusEvent>;

  @Watch('value')
  valueChanged(newValue: string) {
    if (this.textareaEl && this.textareaEl.value !== newValue) {
      this.textareaEl.value = newValue;
    }
    this.currentLength = newValue.length;
  }

  private handleInput = (e: Event) => {
    const input = e.target as HTMLTextAreaElement;
    this.value = input.value;
    this.currentLength = input.value.length;
    this.capInput.emit(this.value);
  };

  private handleChange = (e: Event) => {
    const input = e.target as HTMLTextAreaElement;
    this.value = input.value;
    this.capChange.emit(this.value);
  };

  private handleFocus = (e: FocusEvent) => this.capFocus.emit(e);
  private handleBlur = (e: FocusEvent) => this.capBlur.emit(e);

  private get status(): TextareaStatus {
    if (this.error) return 'error';
    if (this.success) return 'success';
    return 'default';
  }

  private get feedbackId(): string {
    return `${this.textareaId}-feedback`;
  }

  private get counterId(): string {
    return `${this.textareaId}-counter`;
  }

  private renderLabel() {
    if (!this.label) return null;

    return (
      <label class="textarea__label" htmlFor={this.textareaId}>
        {this.label}
        {this.required && (
          <span class="textarea__required" aria-hidden="true"> *</span>
        )}
      </label>
    );
  }

  private renderFeedback() {
    if (!this.error && !this.success && !this.hint) return null;

    return (
      <div
        id={this.feedbackId}
        class={{
          'textarea__feedback': true,
          'textarea__feedback--error': this.status === 'error',
          'textarea__feedback--success': this.status === 'success',
          'textarea__feedback--hint': this.status === 'default',
        }}
        aria-live={this.status === 'error' ? 'assertive' : 'polite'}
      >
        {this.error
          ? <slot name="error">{this.error}</slot>
          : this.success
          ? <slot name="success">{this.success}</slot>
          : <slot name="hint">{this.hint}</slot>}
      </div>
    );
  }

  private renderCounter() {
    if (!this.maxlength) return null;

    const remaining = this.maxlength - this.currentLength;
    const isNearLimit = remaining <= 20;
    const isAtLimit = remaining <= 0;

    return (
      <div
        id={this.counterId}
        class={{
          'textarea__counter': true,
          'textarea__counter--warning': isNearLimit && !isAtLimit,
          'textarea__counter--danger': isAtLimit,
        }}
        aria-live="polite"
        aria-atomic="true"
      >
        {this.currentLength} / {this.maxlength}
      </div>
    );
  }

  render() {
    const hasFeedback = !!(this.error || this.success || this.hint);
    const hasCounter = !!this.maxlength;

    return (
      <Host>
        <div
          class={{
            'textarea-wrapper': true,
            [`textarea-wrapper--${this.status}`]: true,
            'textarea-wrapper--disabled': this.disabled,
          }}
        >
          {this.renderLabel()}

          <div class="textarea__field">
            <textarea
              id={this.textareaId}
              ref={(el) => (this.textareaEl = el)}
              name={this.name}
              placeholder={this.placeholder}
              rows={this.rows}
              maxLength={this.maxlength}
              disabled={this.disabled}
              readOnly={this.readonly}
              required={this.required}
              aria-required={this.required ? 'true' : undefined}
              aria-invalid={this.status === 'error' ? 'true' : undefined}
              aria-describedby={
                hasFeedback && hasCounter
                  ? `${this.feedbackId} ${this.counterId}`
                  : hasFeedback
                  ? this.feedbackId
                  : hasCounter
                  ? this.counterId
                  : undefined
              }
              aria-label={this.ariaLabel}
              onInput={this.handleInput}
              onChange={this.handleChange}
              onFocus={this.handleFocus}
              onBlur={this.handleBlur}
            >
              {this.value}
            </textarea>
          </div>

          <div class="textarea__bottom">
            {this.renderFeedback()}
            {this.renderCounter()}
          </div>
        </div>
      </Host>
    );
  }
}