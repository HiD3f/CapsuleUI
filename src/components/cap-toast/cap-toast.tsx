import {
  Component,
  Host,
  Prop,
  State,
  Event,
  EventEmitter,
  Method,
  h,
} from '@stencil/core';

export type ToastVariant = 'default' | 'success' | 'warning' | 'danger';
export type ToastPosition =
  | 'top-right'
  | 'top-left'
  | 'top-center'
  | 'bottom-right'
  | 'bottom-left'
  | 'bottom-center';

export interface ToastOptions {
  /** Notification message */
  message: string;
  /** Visual style */
  variant?: ToastVariant;
  /**
   * Auto-dismiss after this many milliseconds.
   * Pass 0 to require manual dismissal.
   */
  duration?: number;
  /** Show a close (×) button. Default true. */
  closeable?: boolean;
}

interface ToastItem extends Required<ToastOptions> {
  id: string;
  /** State for exit animation */
  exiting: boolean;
}

let idCounter = 0;

@Component({
  tag: 'cap-toast',
  styleUrl: 'cap-toast.css',
  shadow: true,
})
export class CapToast {
  /** Where toasts stack on screen */
  @Prop() position: ToastPosition = 'top-right';

  /** Default auto-dismiss duration in ms (0 = no auto-dismiss) */
  @Prop() defaultDuration: number = 4000;

  /** Emitted when a toast is removed */
  @Event() capDismiss!: EventEmitter<{ id: string }>;

  @State() private items: ToastItem[] = [];

  private timers = new Map<string, ReturnType<typeof setTimeout>>();

  // ─── Public API ───────────────────────────────────────────────

  /**
   * Add a toast notification.
   * Returns the id so you can dismiss it programmatically.
   */
  @Method()
  async show(options: ToastOptions): Promise<string> {
    const id = `toast-${++idCounter}`;
    const item: ToastItem = {
      id,
      message: options.message,
      variant: options.variant ?? 'default',
      duration: options.duration !== undefined ? options.duration : this.defaultDuration,
      closeable: options.closeable !== false,
      exiting: false,
    };

    this.items = [...this.items, item];

    if (item.duration > 0) {
      const timer = setTimeout(() => this.dismiss(id), item.duration);
      this.timers.set(id, timer);
    }

    return id;
  }

  /** Remove a toast by id (with exit animation) */
  @Method()
  async dismiss(id: string) {
    this.startExit(id);
  }

  /** Remove all toasts immediately */
  @Method()
  async clear() {
    this.timers.forEach(t => clearTimeout(t));
    this.timers.clear();
    this.items = [];
  }

  // ─── Internal ─────────────────────────────────────────────────

  private startExit(id: string) {
    if (this.timers.has(id)) {
      clearTimeout(this.timers.get(id)!);
      this.timers.delete(id);
    }
    // Mark as exiting to trigger CSS exit animation
    this.items = this.items.map(i => i.id === id ? { ...i, exiting: true } : i);
    // Remove from DOM after animation
    setTimeout(() => {
      this.items = this.items.filter(i => i.id !== id);
      this.capDismiss.emit({ id });
    }, 200);
  }

  disconnectedCallback() {
    this.timers.forEach(t => clearTimeout(t));
    this.timers.clear();
  }

  // ─── Render ───────────────────────────────────────────────────

  private variantIcon(variant: ToastVariant): string {
    switch (variant) {
      case 'success': return '✓';
      case 'warning': return '⚠';
      case 'danger':  return '✕';
      default:        return 'ℹ';
    }
  }

  render() {
    const [vAlign, hAlign] = this.position.split('-') as [string, string];

    return (
      <Host>
        <div
          class={`toast__container toast__container--${vAlign} toast__container--${hAlign ?? 'center'}`}
          aria-live={vAlign === 'top' ? 'assertive' : 'polite'}
          aria-atomic="false"
        >
          {this.items.map(item => (
            <div
              key={item.id}
              class={{
                'toast__item': true,
                [`toast__item--${item.variant}`]: true,
                'toast__item--exiting': item.exiting,
              }}
              role={item.variant === 'danger' ? 'alert' : 'status'}
            >
              <span class="toast__icon" aria-hidden="true">
                {this.variantIcon(item.variant)}
              </span>
              <span class="toast__message">{item.message}</span>
              {item.closeable && (
                <button
                  class="toast__close"
                  type="button"
                  aria-label="Dismiss notification"
                  onClick={() => this.startExit(item.id)}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      </Host>
    );
  }
}
