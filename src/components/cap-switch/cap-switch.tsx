import { Component, Host, Prop, Event, EventEmitter, h } from '@stencil/core';

@Component({
  tag: 'cap-switch',
  styleUrl: 'cap-switch.css',
  shadow: true,
})
export class CapSwitch {
  private instanceId = `cap-switch-${Math.random().toString(36).slice(2, 9)}`;

  /** Whether the switch is on */
  @Prop({ mutable: true, reflect: true }) checked: boolean = false;

  /** Disables the switch */
  @Prop() disabled: boolean = false;

  /** Label text displayed above the switch */
  @Prop() label: string;

  /** Hint text displayed below the switch */
  @Prop() hint: string;

  /** Error message displayed below the switch */
  @Prop() error: string;

  /** Name attribute for form submission */
  @Prop() name: string;

  /** Value submitted with the form when checked */
  @Prop() value: string = 'on';

  /** Marks the switch as required */
  @Prop() required: boolean = false;

  /** Emitted when the checked state changes */
  @Event() capChange: EventEmitter<{ checked: boolean; value: string }>;

  /** Emitted when the switch receives focus */
  @Event() capFocus: EventEmitter<void>;

  /** Emitted when the switch loses focus */
  @Event() capBlur: EventEmitter<void>;

  private handleClick = () => {
    if (this.disabled) return;
    this.checked = !this.checked;
    this.capChange.emit({ checked: this.checked, value: this.value });
  };

  private handleKeyDown = (e: KeyboardEvent) => {
    if (this.disabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      this.handleClick();
    }
  };

  private handleFocus = () => {
    this.capFocus.emit();
  };

  private handleBlur = () => {
    this.capBlur.emit();
  };

  private get status(): 'default' | 'error' {
    return this.error ? 'error' : 'default';
  }

  private get feedbackId(): string {
    return `${this.instanceId}-feedback`;
  }

  private renderFeedback() {
    if (!this.error && !this.hint) return null;

    return (
      <div
        id={this.feedbackId}
        class={{
          'switch__feedback': true,
          'switch__feedback--error': this.status === 'error',
          'switch__feedback--hint': this.status === 'default',
        }}
        aria-live={this.status === 'error' ? 'assertive' : 'polite'}
      >
        {this.error || this.hint}
      </div>
    );
  }

  render() {
    const hasFeedback = !!(this.error || this.hint);

    return (
      <Host>
        <div
          class={{
            'switch-wrapper': true,
            'switch-wrapper--disabled': this.disabled,
            'switch-wrapper--error': this.status === 'error',
          }}
        >
          {this.label && (
            <label class="switch__label" htmlFor={this.instanceId}>
              {this.label}
              {this.required && (
                <span class="switch__required" aria-hidden="true"> *</span>
              )}
            </label>
          )}

          <div class="switch__control-row">
            {/* Hidden native input for form submission */}
            <input
              aria-hidden="true"
              tabIndex={-1}
              type="checkbox"
              name={this.name}
              value={this.value}
              checked={this.checked}
              required={this.required}
            />

            {/* Visible interactive control */}
            <button
              id={this.instanceId}
              type="button"
              role="switch"
              aria-checked={String(this.checked)}
              aria-disabled={this.disabled ? 'true' : undefined}
              aria-required={this.required ? 'true' : undefined}
              aria-describedby={hasFeedback ? this.feedbackId : undefined}
              disabled={this.disabled}
              class={{
                'switch__button': true,
                'switch__button--checked': this.checked,
                'switch__button--disabled': this.disabled,
              }}
              onClick={this.handleClick}
              onKeyDown={this.handleKeyDown}
              onFocus={this.handleFocus}
              onBlur={this.handleBlur}
            >
              <span
                class={{
                  'switch__track': true,
                  'switch__track--checked': this.checked,
                }}
              >
                <span
                  class={{
                    'switch__thumb': true,
                    'switch__thumb--checked': this.checked,
                  }}
                />
              </span>
            </button>
          </div>

          {this.renderFeedback()}
        </div>
      </Host>
    );
  }
}
