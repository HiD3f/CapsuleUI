import { Component, Host, Prop, Event, EventEmitter, Watch, h } from '@stencil/core';

export type CheckboxStatus = 'default' | 'error';

@Component({
  tag: 'cap-checkbox',
  styleUrl: 'cap-checkbox.css',
  shadow: true,
})
export class CapCheckbox {
  private inputId = `cap-checkbox-${Math.random().toString(36).slice(2, 9)}`;
  private inputEl?: HTMLInputElement;

  /** Whether the checkbox is checked */
  @Prop({ mutable: true, reflect: true }) checked: boolean = false;

  /** Indeterminate state — visually a dash, neither checked nor unchecked */
  @Prop({ mutable: true }) indeterminate: boolean = false;

  /** Disables the checkbox */
  @Prop() disabled: boolean = false;

  /** Marks the checkbox as required */
  @Prop() required: boolean = false;

  /** Name attribute for form submission */
  @Prop() name: string;

  /** Value submitted with the form */
  @Prop() value: string;

  /** Label text */
  @Prop() label: string;

  /** Hint text */
  @Prop() hint: string;

  /** Error message */
  @Prop() error: string;

  /** Emitted when the checked state changes */
  @Event() capChange: EventEmitter<boolean>;

  @Watch('indeterminate')
  indeterminateChanged(newValue: boolean) {
    if (this.inputEl) {
      this.inputEl.indeterminate = newValue;
    }
  }

  @Watch('checked')
  checkedChanged() {
    if (this.inputEl) {
      this.inputEl.indeterminate = false;
      this.indeterminate = false;
    }
  }

  componentDidLoad() {
    if (this.inputEl && this.indeterminate) {
      this.inputEl.indeterminate = true;
    }
  }

  private handleChange = (e: Event) => {
    const input = e.target as HTMLInputElement;
    this.checked = input.checked;
    this.indeterminate = false;
    this.capChange.emit(this.checked);
  };

  private get status(): CheckboxStatus {
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
          'checkbox__feedback': true,
          'checkbox__feedback--error': this.status === 'error',
          'checkbox__feedback--hint': this.status === 'default',
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
            'checkbox-wrapper': true,
            'checkbox-wrapper--disabled': this.disabled,
            'checkbox-wrapper--error': this.status === 'error',
          }}
        >
          <label class="checkbox__label" htmlFor={this.inputId}>
            <input
              id={this.inputId}
              ref={(el) => (this.inputEl = el)}
              type="checkbox"
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
            <span class={{
              'checkbox__control': true,
              'checkbox__control--checked': this.checked,
              'checkbox__control--indeterminate': this.indeterminate,
            }} aria-hidden="true" />
            {this.label && (
              <span class="checkbox__text">
                {this.label}
                {this.required && (
                  <span class="checkbox__required" aria-hidden="true"> *</span>
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