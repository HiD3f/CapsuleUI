import { Component, Host, Prop, State, Element, Watch, h } from '@stencil/core';

@Component({
  tag: 'cap-tooltip',
  styleUrl: 'cap-tooltip.css',
  shadow: true,
})
export class CapTooltip {
  private tooltipId = `cap-tooltip-${Math.random().toString(36).slice(2, 9)}`;
  private panelEl?: HTMLElement;
  private showTimeout: ReturnType<typeof setTimeout> | null = null;
  private escKeyHandler: (e: KeyboardEvent) => void;
  // Light-DOM hidden span that carries the tooltip id — reachable by aria-describedby
  private descEl?: HTMLSpanElement;
  // Saved aria-describedby value on slotted trigger before we modify it
  private savedDescribedBy: string | null = null;

  @Element() el!: HTMLElement;

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
    // Inject a hidden light-DOM span whose id is the tooltip id.
    // aria-describedby on the slotted trigger can reference it because
    // both the trigger and this span are in the same light DOM tree.
    this.descEl = document.createElement('span');
    this.descEl.id = this.tooltipId;
    this.descEl.textContent = this.content;
    this.descEl.style.cssText =
      'position:absolute;width:1px;height:1px;overflow:hidden;' +
      'clip:rect(0,0,0,0);white-space:nowrap;border:0;padding:0;margin:-1px;';
    this.el.appendChild(this.descEl);

    this.escKeyHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') this.hide();
    };
    document.addEventListener('keydown', this.escKeyHandler);
  }

  disconnectedCallback() {
    document.removeEventListener('keydown', this.escKeyHandler);
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
      this.showTimeout = null;
    }
    if (this.descEl?.parentNode) {
      this.descEl.parentNode.removeChild(this.descEl);
    }
  }

  @Watch('content')
  onContentChange(val: string) {
    if (this.descEl) this.descEl.textContent = val;
  }

  componentDidUpdate() {
    if (!this.visible || !this.panelEl) return;
    const rect = this.panelEl.getBoundingClientRect();

    let flipped = false;
    if (this.actualPlacement === 'top' && rect.top < 0) {
      this.actualPlacement = 'bottom'; flipped = true;
    } else if (this.actualPlacement === 'bottom' && rect.bottom > window.innerHeight) {
      this.actualPlacement = 'top'; flipped = true;
    } else if (this.actualPlacement === 'left' && rect.left < 0) {
      this.actualPlacement = 'right'; flipped = true;
    } else if (this.actualPlacement === 'right' && rect.right > window.innerWidth) {
      this.actualPlacement = 'left'; flipped = true;
    }
    if (flipped) {
      this.computePosition();
      return;
    }

    let x = this.tipX;
    if (rect.right > window.innerWidth) x -= rect.right - window.innerWidth;
    if (rect.left < 0) x -= rect.left;
    if (x !== this.tipX) this.tipX = x;
  }

  private computePosition() {
    const probe = document.createElement('div');
    probe.style.cssText = 'position:fixed;top:0;left:0;pointer-events:none;visibility:hidden;';
    this.el.shadowRoot.appendChild(probe);
    const origin = probe.getBoundingClientRect();
    this.el.shadowRoot.removeChild(probe);

    const triggerRect = this.el.getBoundingClientRect();
    const gap = 8;
    let x: number, y: number;

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

  // Returns the first light-DOM element assigned to the default slot
  private getSlottedTrigger(): HTMLElement | null {
    const slot = this.el.shadowRoot?.querySelector('slot:not([name])') as HTMLSlotElement;
    return (slot?.assignedElements({ flatten: true })[0] as HTMLElement) ?? null;
  }

  private addDescribedBy(trigger: HTMLElement) {
    this.savedDescribedBy = trigger.getAttribute('aria-describedby');
    const next = this.savedDescribedBy
      ? `${this.savedDescribedBy} ${this.tooltipId}`
      : this.tooltipId;
    trigger.setAttribute('aria-describedby', next);
  }

  private removeDescribedBy(trigger: HTMLElement) {
    if (this.savedDescribedBy) {
      trigger.setAttribute('aria-describedby', this.savedDescribedBy);
    } else {
      trigger.removeAttribute('aria-describedby');
    }
    this.savedDescribedBy = null;
  }

  private show = () => {
    if (this.disabled) return;
    this.showTimeout = setTimeout(() => {
      this.actualPlacement = this.placement;
      this.computePosition();
      this.visible = true;
      const trigger = this.getSlottedTrigger();
      if (trigger) this.addDescribedBy(trigger);
    }, this.delay);
  };

  private hide = () => {
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
      this.showTimeout = null;
    }
    if (this.visible) {
      const trigger = this.getSlottedTrigger();
      if (trigger) this.removeDescribedBy(trigger);
    }
    this.visible = false;
  };

  render() {
    return (
      <Host>
        <div
          class="tooltip__trigger-wrap"
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
          aria-hidden="true"
        >
          {this.content}
        </div>
      </Host>
    );
  }
}
