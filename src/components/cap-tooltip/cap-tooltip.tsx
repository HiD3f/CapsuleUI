import { Component, Host, Prop, State, Element, h } from '@stencil/core';

@Component({
  tag: 'cap-tooltip',
  styleUrl: 'cap-tooltip.css',
  shadow: true,
})
export class CapTooltip {
  private tooltipId = `cap-tooltip-${Math.random().toString(36).slice(2, 9)}`;
  private wrapperEl?: HTMLElement;
  private panelEl?: HTMLElement;
  private showTimeout: ReturnType<typeof setTimeout> | null = null;
  private escKeyHandler: (e: KeyboardEvent) => void;

  @Element() el: HTMLElement;

  /** Tooltip text content */
  @Prop() content: string = '';

  /** Preferred placement of the tooltip relative to the trigger */
  @Prop() placement: 'top' | 'bottom' | 'left' | 'right' = 'top';

  /** Delay in milliseconds before showing the tooltip */
  @Prop() delay: number = 150;

  /** Disables the tooltip */
  @Prop() disabled: boolean = false;

  @State() visible: boolean = false;
  @State() tipX: number = 0;
  @State() tipY: number = 0;
  @State() actualPlacement: 'top' | 'bottom' | 'left' | 'right' = 'top';

  connectedCallback() {
    this.escKeyHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        this.hide();
      }
    };
    document.addEventListener('keydown', this.escKeyHandler);
  }

  disconnectedCallback() {
    document.removeEventListener('keydown', this.escKeyHandler);
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
      this.showTimeout = null;
    }
  }

  componentDidUpdate() {
    if (!this.visible || !this.panelEl) return;
    const rect = this.panelEl.getBoundingClientRect();

    // Flip if overflowing viewport
    let flipped = false;
    if (this.actualPlacement === 'top' && rect.top < 0) {
      this.actualPlacement = 'bottom';
      flipped = true;
    } else if (this.actualPlacement === 'bottom' && rect.bottom > window.innerHeight) {
      this.actualPlacement = 'top';
      flipped = true;
    } else if (this.actualPlacement === 'left' && rect.left < 0) {
      this.actualPlacement = 'right';
      flipped = true;
    } else if (this.actualPlacement === 'right' && rect.right > window.innerWidth) {
      this.actualPlacement = 'left';
      flipped = true;
    }
    if (flipped) {
      this.computePosition();
      return;
    }

    // Clamp horizontally for top/bottom placements
    let x = this.tipX;
    if (rect.right > window.innerWidth) x -= rect.right - window.innerWidth;
    if (rect.left < 0) x -= rect.left;
    if (x !== this.tipX) this.tipX = x;
  }

  private computePosition() {
    if (!this.wrapperEl) return;

    // Probe the actual fixed-positioning origin inside this shadow root.
    // If an ancestor has a CSS transform it creates a new containing block
    // for position:fixed, shifting the origin away from the viewport's (0,0).
    const probe = document.createElement('div');
    probe.style.cssText = 'position:fixed;top:0;left:0;pointer-events:none;visibility:hidden;';
    this.el.shadowRoot.appendChild(probe);
    const origin = probe.getBoundingClientRect();
    this.el.shadowRoot.removeChild(probe);

    const triggerRect = this.el.getBoundingClientRect();
    const gap = 8;
    let x: number;
    let y: number;

    switch (this.actualPlacement) {
      case 'top':
        x = triggerRect.left + triggerRect.width / 2;
        y = triggerRect.top - gap;
        break;
      case 'bottom':
        x = triggerRect.left + triggerRect.width / 2;
        y = triggerRect.bottom + gap;
        break;
      case 'left':
        x = triggerRect.left - gap;
        y = triggerRect.top + triggerRect.height / 2;
        break;
      case 'right':
        x = triggerRect.right + gap;
        y = triggerRect.top + triggerRect.height / 2;
        break;
      default:
        x = triggerRect.left + triggerRect.width / 2;
        y = triggerRect.top - gap;
    }

    this.tipX = x - origin.left;
    this.tipY = y - origin.top;
  }

  private show = () => {
    if (this.disabled) return;
    this.showTimeout = setTimeout(() => {
      this.actualPlacement = this.placement;
      this.computePosition();
      this.visible = true;
    }, this.delay);
  };

  private hide = () => {
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
      this.showTimeout = null;
    }
    this.visible = false;
  };

  render() {
    return (
      <Host>
        <div
          class="tooltip__trigger-wrap"
          ref={el => (this.wrapperEl = el)}
          aria-describedby={this.visible ? this.tooltipId : undefined}
          onMouseEnter={this.show}
          onMouseLeave={this.hide}
          onFocusin={this.show}
          onFocusout={this.hide}
        >
          <slot></slot>
        </div>
        <div
          id={this.tooltipId}
          role="tooltip"
          ref={el => (this.panelEl = el)}
          class={{
            'tooltip__panel': true,
            'tooltip__panel--visible': this.visible,
            [`tooltip__panel--${this.actualPlacement}`]: true,
          }}
          style={{ top: `${this.tipY}px`, left: `${this.tipX}px` }}
        >
          {this.content}
        </div>
      </Host>
    );
  }
}
