import { Component, Host, Prop, h } from '@stencil/core';

export type ProgressVariant = 'default' | 'success' | 'warning' | 'danger';

@Component({
  tag: 'cap-progress',
  styleUrl: 'cap-progress.css',
  shadow: true,
})
export class CapProgress {
  /**
   * Current value. When undefined the bar shows an indeterminate animation.
   */
  @Prop() value: number | undefined = undefined;

  /** Maximum value (default 100) */
  @Prop() max: number = 100;

  /** Accessible label */
  @Prop() label: string = '';

  /** Show the numeric percentage next to the bar */
  @Prop() showValue: boolean = false;

  /** Color variant */
  @Prop() variant: ProgressVariant = 'default';

  private get pct(): number {
    if (this.value === undefined) return 0;
    return Math.min(100, Math.max(0, (this.value / this.max) * 100));
  }

  private get indeterminate(): boolean {
    return this.value === undefined;
  }

  render() {
    const pct = this.pct;
    const label = this.label || (this.indeterminate ? 'Loading' : `${Math.round(pct)}%`);

    return (
      <Host>
        {this.label && (
          <div class="progress__label-row">
            <span class="progress__label">{this.label}</span>
            {this.showValue && !this.indeterminate && (
              <span class="progress__value">{Math.round(pct)}%</span>
            )}
          </div>
        )}
        {!this.label && this.showValue && !this.indeterminate && (
          <div class="progress__label-row">
            <span class="progress__value progress__value--only">{Math.round(pct)}%</span>
          </div>
        )}
        <div
          class="progress__track"
          role="progressbar"
          aria-label={label}
          aria-valuenow={this.indeterminate ? undefined : Math.round(pct)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            class={{
              'progress__fill': true,
              [`progress__fill--${this.variant}`]: true,
              'progress__fill--indeterminate': this.indeterminate,
            }}
            style={this.indeterminate ? {} : { width: `${pct}%` }}
          />
        </div>
      </Host>
    );
  }
}
