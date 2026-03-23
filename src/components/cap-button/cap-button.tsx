import { Component, Host, Prop, Event, EventEmitter, h } from '@stencil/core';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonType = 'button' | 'submit' | 'reset';

@Component({
  tag: 'cap-button',
  styleUrl: 'cap-button.css',
  shadow: true,
})
export class CapButton {
  /** Visual style of the button */
  @Prop() variant: ButtonVariant = 'primary';

  /** Size of the button */
  @Prop() size: ButtonSize = 'md';

  /** HTML button type */
  @Prop() type: ButtonType = 'button';

  /** Disables the button */
  @Prop() disabled: boolean = false;

  /** Shows a loading spinner and disables interaction */
  @Prop() loading: boolean = false;

  /** Stretches the button to full container width */
  @Prop() fullWidth: boolean = false;

  /** Accessible label for icon-only buttons */
  @Prop() ariaLabel: string;

  /** Emitted when the button is clicked */
  @Event() capClick: EventEmitter<MouseEvent>;

  private handleClick = (e: MouseEvent) => {
    if (!this.disabled && !this.loading) {
      this.capClick.emit(e);
    }
  };

  render() {
    return (
      <Host>
        <button
          type={this.type}
          class={{
            'btn': true,
            [`btn--${this.variant}`]: true,
            [`btn--${this.size}`]: true,
            'btn--full-width': this.fullWidth,
            'btn--loading': this.loading,
            'btn--disabled': this.disabled,
          }}
          disabled={this.disabled || this.loading}
          aria-disabled={this.disabled || this.loading ? 'true' : undefined}
          aria-busy={this.loading ? 'true' : undefined}
          aria-label={this.ariaLabel}
          onClick={this.handleClick}
        >
          <slot name="icon-start" />
          <span class="btn__label">
            <slot />
          </span>
          <slot name="icon-end" />
          {this.loading && (
            <span class="btn__spinner" aria-hidden="true" role="presentation" />
          )}
        </button>
      </Host>
    );
  }
}