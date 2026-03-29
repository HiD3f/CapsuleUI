import { Component, Host, Prop, State, Watch, h } from '@stencil/core';

export type SpinnerSize = 'sm' | 'md' | 'lg';
export type SpinnerVariant = 'circle' | 'ascii' | 'dots' | 'block' | 'bar';

const ASCII_FRAMES = ['|', '/', '—', '\\'];

@Component({
  tag: 'cap-spinner',
  styleUrl: 'cap-spinner.css',
  shadow: true,
})
export class CapSpinner {
  /** Visual animation style */
  @Prop() variant: SpinnerVariant = 'circle';

  /** Size of the spinner */
  @Prop() size: SpinnerSize = 'md';

  /** Accessible label announced to screen readers */
  @Prop() label: string = 'Loading…';

  @State() private asciiFrame: number = 0;
  private interval: ReturnType<typeof setInterval> | null = null;

  connectedCallback() {
    if (this.variant === 'ascii') this.startInterval();
  }

  @Watch('variant')
  onVariantChange(val: SpinnerVariant) {
    if (val === 'ascii') {
      this.startInterval();
    } else {
      this.stopInterval();
    }
  }

  disconnectedCallback() {
    this.stopInterval();
  }

  private startInterval() {
    this.stopInterval();
    this.interval = setInterval(() => {
      this.asciiFrame = (this.asciiFrame + 1) % ASCII_FRAMES.length;
    }, 100);
  }

  private stopInterval() {
    if (this.interval !== null) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  private renderInner() {
    switch (this.variant) {
      case 'ascii':
        return (
          <span class="spinner__ascii" aria-hidden="true">
            {ASCII_FRAMES[this.asciiFrame]}
          </span>
        );

      case 'dots':
        return (
          <span class="spinner__dots" aria-hidden="true">
            <span class="spinner__dot" />
            <span class="spinner__dot" />
            <span class="spinner__dot" />
          </span>
        );

      case 'block':
        return (
          <span class="spinner__block" aria-hidden="true">█</span>
        );

      case 'bar':
        return (
          <span class="spinner__bar" aria-hidden="true">
            <span class="spinner__seg" />
            <span class="spinner__seg" />
            <span class="spinner__seg" />
            <span class="spinner__seg" />
          </span>
        );

      case 'circle':
      default:
        return <span class="spinner__circle" aria-hidden="true" />;
    }
  }

  render() {
    return (
      <Host>
        <span
          class={`spinner spinner--${this.size} spinner--${this.variant}`}
          role="status"
          aria-label={this.label}
        >
          {this.renderInner()}
          <span class="spinner__sr-only">{this.label}</span>
        </span>
      </Host>
    );
  }
}
