import { Component, Host, Prop, Event, EventEmitter, h } from '@stencil/core';

export type RadioStatus = 'default' | 'error';

@Component({
  tag: 'cap-radio',
  styleUrl: 'cap-radio.css',
  shadow: true,
})
export class CapRadio {
  private inputId = `cap-radio-${Math.random().toString(36).slice(2, 9)}`;

  /** Whether this radio is selected */
  @Prop({ mutable: true, reflect: true }) checked: boolean = false;

  /** Disables the radio */
  @Prop() disabled: boolean = false;

  /** Marks the radio as required */
  @Prop() required: boolean = false;

  /** Name attribute — shared across radios in the same group */
  @Prop() name: string;

  /** Value submitted with the form */
  @Prop() value: string;

  /** Label text */
  @Prop() label: string;

  /** Hint text */
  @Prop() hint: string;

  /** Error message */
  @Prop() error: string;

  /** Emitted when this radio is selected */
  @Event({ bubbles: true, composed: true }) capChange: EventEmitter<string>;

  private handleChange = () => {
    this.checked = true;
    this.capChange.emit(this.value);
  };

  private get status(): RadioStatus {
    return this.error ? 'error' : 'default';
  }

  private get feedbackId(): string {
    return `${this.inputId}-feedback`;
  }

  private renderFeedback() {
    if (!this.error && !this.hint) return null;

    return (
      <div
        id={this.feedbackId}
        class={{
          'radio__feedback': true,
          'radio__feedback--error': this.status === 'error',
          'radio__feedback--hint': this.status === 'default',
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
            'radio-wrapper': true,
            'radio-wrapper--disabled': this.disabled,
            'radio-wrapper--error': this.status === 'error',
          }}
        >
          <label class="radio__label" htmlFor={this.inputId}>
            <input
              id={this.inputId}
              type="radio"
              name={this.name}
              value={this.value}
              checked={this.checked}
              disabled={this.disabled}
              required={this.required}
              aria-required={this.required ? 'true' : undefined}
              aria-invalid={this.status === 'error' ? 'true' : undefined}
              aria-describedby={hasFeedback ? this.feedbackId : undefined}
              onChange={this.handleChange}
            />
            <span
              class={{
                'radio__control': true,
                'radio__control--checked': this.checked,
              }}
              aria-hidden="true"
            />
            {this.label && (
              <span class="radio__text">
                {this.label}
                {this.required && (
                  <span class="radio__required" aria-hidden="true"> *</span>
                )}
              </span>
            )}
          </label>

          {this.renderFeedback()}
        </div>
      </Host>
    );
  }
}
