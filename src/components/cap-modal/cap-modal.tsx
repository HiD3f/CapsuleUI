import {
  Component,
  Host,
  Prop,
  State,
  Event,
  EventEmitter,
  Element,
  Watch,
  Method,
  h,
} from '@stencil/core';

@Component({
  tag: 'cap-modal',
  styleUrl: 'cap-modal.css',
  shadow: true,
})
export class CapModal {
  @Element() el!: HTMLElement;

  /** Whether the modal is open */
  @Prop({ mutable: true, reflect: true }) open: boolean = false;

  /** Modal title shown in the header */
  @Prop() heading: string = '';

  /**
   * Width of the modal panel.
   * Any valid CSS width value, e.g. '480px', '60vw', '100%'.
   */
  @Prop() width: string = '480px';

  /** Hide the default close (×) button in the header */
  @Prop() hideClose: boolean = false;

  /**
   * Close the modal when the backdrop is clicked.
   * Set to false to require explicit close action.
   */
  @Prop() closeOnBackdrop: boolean = true;

  /** Emitted when the modal requests to close (× button, Escape, or backdrop click) */
  @Event() capClose!: EventEmitter<void>;

  /** Emitted after the modal finishes opening */
  @Event() capOpen!: EventEmitter<void>;

  @State() private visible: boolean = false;
  @State() private animating: boolean = false;

  private previousFocus: HTMLElement | null = null;
  private scrollY: number = 0;

  // ─── Lifecycle ────────────────────────────────────────────────

  componentDidLoad() {
    if (this.open) this.doOpen();
  }

  disconnectedCallback() {
    this.cleanup();
  }

  @Watch('open')
  onOpenChange(newVal: boolean) {
    if (newVal) {
      this.doOpen();
    } else {
      this.doClose();
    }
  }

  // ─── Open / close logic ───────────────────────────────────────

  private doOpen() {
    this.previousFocus = document.activeElement as HTMLElement;

    // Scroll lock — freeze body position
    this.scrollY = window.scrollY;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${this.scrollY}px`;
    document.body.style.width = '100%';

    document.addEventListener('keydown', this.handleKeyDown);

    this.visible = true;
    this.animating = true;
    // Let browser paint, then remove animating flag so CSS transition can settle
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.animating = false;
        this.trapFocus();
        this.capOpen.emit();
      });
    });
  }

  private doClose() {
    this.cleanup();
    this.visible = false;
    this.open = false;
    // Restore focus
    if (this.previousFocus && typeof this.previousFocus.focus === 'function') {
      this.previousFocus.focus();
    }
    this.previousFocus = null;
  }

  private cleanup() {
    document.removeEventListener('keydown', this.handleKeyDown);

    // Restore scroll lock
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    if (this.scrollY !== 0) {
      window.scrollTo(0, this.scrollY);
      this.scrollY = 0;
    }
  }

  // ─── Public API ───────────────────────────────────────────────

  /** Programmatically open the modal */
  @Method()
  async show() {
    this.open = true;
  }

  /** Programmatically close the modal */
  @Method()
  async hide() {
    this.open = false;
  }

  // ─── Focus trap ───────────────────────────────────────────────

  private getFocusable(): HTMLElement[] {
    const panel = this.el.shadowRoot?.querySelector('.modal__panel') as HTMLElement;
    if (!panel) return [];

    const selectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(',');

    // Shadow DOM focusables
    const shadowFocusable = Array.from(panel.querySelectorAll<HTMLElement>(selectors));

    // Slotted focusables (light DOM)
    const slot = panel.querySelector('slot:not([name])') as HTMLSlotElement;
    const slotFocusable: HTMLElement[] = [];
    if (slot) {
      slot.assignedElements({ flatten: true }).forEach(el => {
        if (el.matches(selectors)) slotFocusable.push(el as HTMLElement);
        slotFocusable.push(...Array.from(el.querySelectorAll<HTMLElement>(selectors)));
      });
    }

    // Slot[name=footer] focusables
    const footerSlot = panel.querySelector('slot[name="footer"]') as HTMLSlotElement;
    const footerFocusable: HTMLElement[] = [];
    if (footerSlot) {
      footerSlot.assignedElements({ flatten: true }).forEach(el => {
        if (el.matches(selectors)) footerFocusable.push(el as HTMLElement);
        footerFocusable.push(...Array.from(el.querySelectorAll<HTMLElement>(selectors)));
      });
    }

    return [...shadowFocusable, ...slotFocusable, ...footerFocusable];
  }

  private trapFocus() {
    const focusable = this.getFocusable();
    if (focusable.length > 0) focusable[0].focus();
  }

  // ─── Event handlers ───────────────────────────────────────────

  private requestClose() {
    this.capClose.emit();
    this.open = false;
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    if (!this.open) return;

    if (e.key === 'Escape') {
      e.stopPropagation();
      this.requestClose();
      return;
    }

    if (e.key === 'Tab') {
      const focusable = this.getFocusable();
      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first || this.el.shadowRoot?.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last || this.el.shadowRoot?.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  };

  private handleBackdropClick = (e: MouseEvent) => {
    if (!this.closeOnBackdrop) return;
    // Only close if click is directly on the backdrop, not the panel
    if ((e.target as HTMLElement).classList.contains('modal__backdrop')) {
      this.requestClose();
    }
  };

  // ─── Render ───────────────────────────────────────────────────

  render() {
    if (!this.visible) return <Host />;

    return (
      <Host>
        <div
          class={{
            'modal__backdrop': true,
            'modal__backdrop--animating': this.animating,
          }}
          onClick={this.handleBackdropClick}
          aria-hidden="true"
        >
          <div
            class={{
              'modal__panel': true,
              'modal__panel--animating': this.animating,
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby={this.heading ? 'modal-heading' : undefined}
            style={{ width: this.width }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            {(this.heading || !this.hideClose) && (
              <div class="modal__header">
                {this.heading && (
                  <h2 class="modal__heading" id="modal-heading">{this.heading}</h2>
                )}
                {!this.hideClose && (
                  <button
                    class="modal__close"
                    type="button"
                    aria-label="Close dialog"
                    onClick={() => this.requestClose()}
                  >
                    ✕
                  </button>
                )}
              </div>
            )}

            {/* Body */}
            <div class="modal__body">
              <slot />
            </div>

            {/* Footer — optional named slot */}
            <slot name="footer" />
          </div>
        </div>
      </Host>
    );
  }
}
