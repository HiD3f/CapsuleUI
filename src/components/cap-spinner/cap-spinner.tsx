import { Component, Host, Prop, h } from '@stencil/core';

export type SpinnerSize = 'sm' | 'md' | 'lg';

@Component({
  tag: 'cap-spinner',
  styleUrl: 'cap-spinner.css',
  shadow: true,
})
export class CapSpinner {
  /** Size of the spinner */
  @Prop() size: SpinnerSize = 'md';

  /** Accessible label announced to screen readers */
  @Prop() label: string = 'Loading…';

  render() {
    return (
      <Host>
        <span
          class={`spinner spinner--${this.size}`}
          role="status"
          aria-label={this.label}
        >
          <span class="spinner__inner" aria-hidden="true" />
          <span class="spinner__sr-only">{this.label}</span>
        </span>
      </Host>
    );
  }
}
