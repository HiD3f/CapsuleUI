import { Component, Host, Prop, Event, EventEmitter, Element, Watch, Listen, h } from '@stencil/core';

export type RadioGroupStatus = 'default' | 'error';

@Component({
  tag: 'cap-radio-group',
  styleUrl: 'cap-radio-group.css',
  shadow: true,
})
export class CapRadioGroup {
  private groupId = `cap-radio-group-${Math.random().toString(36).slice(2, 9)}`;

  @Element() el: HTMLElement;

  /** Currently selected value */
  @Prop({ mutable: true, reflect: true }) value: string;

  /** Name shared across all child cap-radio elements */
  @Prop() name: string;

  /** Disables all child radios */
  @Prop() disabled: boolean = false;

  /** Marks all child radios as required */
  @Prop() required: boolean = false;

  /** Group label */
  @Prop() label: string;

  /** Hint text */
  @Prop() hint: string;

  /** Error message */
  @Prop() error: string;

  /** Emitted when the selected value changes */
  @Event() capChange: EventEmitter<string>;

  @Watch('value')
  valueChanged() {
    this.syncRadios();
  }

  @Watch('disabled')
  disabledChanged() {
    this.syncRadios();
  }

  componentDidLoad() {
    this.syncRadios();
  }

  @Listen('capChange')
  handleRadioChange(e: CustomEvent<string>) {
    e.stopImmediatePropagation();
    this.value = e.detail;
    this.syncRadios();
    this.capChange.emit(this.value);
  }

  private syncRadios() {
    const radios = this.el.querySelectorAll('cap-radio');
    radios.forEach((radio: any) => {
      if (this.name) radio.name = this.name;
      radio.checked = radio.value === this.value;
      if (this.disabled) radio.disabled = true;
    });
  }

  private get status(): RadioGroupStatus {
    return this.error ? 'error' : 'default';
  }

  private get feedbackId(): string {
    return `${this.groupId}-feedback`;
  }

  private get labelId(): string {
    return `${this.groupId}-label`;
  }

  private renderFeedback() {
    if (!this.error && !this.hint) return null;

    return (
      <div
        id={this.feedbackId}
        class={{
          'radio-group__feedback': true,
          'radio-group__feedback--error': this.status === 'error',
          'radio-group__feedback--hint': this.status === 'default',
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
            'radio-group-wrapper': true,
            'radio-group-wrapper--disabled': this.disabled,
            'radio-group-wrapper--error': this.status === 'error',
          }}
          role="radiogroup"
          aria-labelledby={this.label ? this.labelId : undefined}
          aria-describedby={hasFeedback ? this.feedbackId : undefined}
          aria-required={this.required ? 'true' : undefined}
          aria-invalid={this.status === 'error' ? 'true' : undefined}
        >
          {this.label && (
            <span id={this.labelId} class="radio-group__legend">
              {this.label}
              {this.required && (
                <span class="radio-group__required" aria-hidden="true"> *</span>
              )}
            </span>
          )}

          <div class="radio-group__options">
            <slot />
          </div>

          {this.renderFeedback()}
        </div>
      </Host>
    );
  }
}
