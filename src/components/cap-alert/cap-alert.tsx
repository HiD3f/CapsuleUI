import { Component, Host, Prop, State, Event, EventEmitter, h } from '@stencil/core';

export type AlertVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

@Component({
  tag: 'cap-alert',
  styleUrl: 'cap-alert.css',
  shadow: true,
})
export class CapAlert {
  /** Visual style */
  @Prop() variant: AlertVariant = 'default';

  /** Bold title line above the message */
  @Prop() heading: string = '';

  /** Show a dismiss (×) button */
  @Prop() dismissible: boolean = false;

  /** Emitted when the dismiss button is clicked */
  @Event() capDismiss!: EventEmitter<void>;

  @State() private dismissed: boolean = false;

  private iconMap: Record<AlertVariant, string> = {
    default: 'ℹ',
    info:    'ℹ',
    success: '✓',
    warning: '⚠',
    danger:  '✕',
  };

  private handleDismiss() {
    this.dismissed = true;
    this.capDismiss.emit();
  }

  render() {
    if (this.dismissed) return <Host style={{ display: 'none' }} />;

    return (
      <Host>
        <div
          class={`alert alert--${this.variant}`}
          role="alert"
        >
          <span class="alert__icon" aria-hidden="true">
            {this.iconMap[this.variant]}
          </span>

          <div class="alert__body">
            {this.heading && (
              <strong class="alert__heading">{this.heading}</strong>
            )}
            <div class="alert__message">
              <slot />
            </div>
            <slot name="actions" />
          </div>

          {this.dismissible && (
            <button
              class="alert__close"
              type="button"
              aria-label="Dismiss"
              onClick={() => this.handleDismiss()}
            >
              ✕
            </button>
          )}
        </div>
      </Host>
    );
  }
}
