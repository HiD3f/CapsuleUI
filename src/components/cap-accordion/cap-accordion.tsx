import {
  Component,
  Host,
  Prop,
  State,
  Event,
  EventEmitter,
  Watch,
  h,
} from '@stencil/core';

export interface AccordionItem {
  /** Unique identifier */
  id: string;
  /** Header label */
  label: string;
  /** Panel content as plain text or HTML string */
  content?: string;
  /** Whether this item is disabled */
  disabled?: boolean;
}

@Component({
  tag: 'cap-accordion',
  styleUrl: 'cap-accordion.css',
  shadow: true,
})
export class CapAccordion {
  /** Items to render */
  @Prop() items: AccordionItem[] = [];

  /**
   * ID(s) of the open panel(s).
   * Pass a string for single mode, or an array for multiple mode.
   * When unset the accordion starts collapsed.
   */
  @Prop({ mutable: true }) openItems: string | string[] = [];

  /** Allow multiple panels to be open simultaneously */
  @Prop() multiple: boolean = false;

  /** Emitted when a panel is toggled. Detail: `{ id, open, openItems }` */
  @Event() capChange!: EventEmitter<{ id: string; open: boolean; openItems: string[] }>;

  @State() private openSet: Set<string> = new Set();

  componentWillLoad() {
    this.syncFromProp();
  }

  @Watch('openItems')
  onOpenItemsChange() {
    this.syncFromProp();
  }

  private syncFromProp() {
    const raw = this.openItems;
    if (Array.isArray(raw)) {
      this.openSet = new Set(raw);
    } else if (typeof raw === 'string' && raw) {
      this.openSet = new Set([raw]);
    } else {
      this.openSet = new Set();
    }
  }

  private toggle(item: AccordionItem) {
    if (item.disabled) return;

    const id = item.id;
    const isOpen = this.openSet.has(id);
    let next: Set<string>;

    if (isOpen) {
      next = new Set(this.openSet);
      next.delete(id);
    } else if (this.multiple) {
      next = new Set(this.openSet);
      next.add(id);
    } else {
      next = new Set([id]);
    }

    this.openSet = next;
    const openItems = Array.from(this.openSet);
    this.openItems = openItems;
    this.capChange.emit({ id, open: !isOpen, openItems });
  }

  private handleKeyDown(e: KeyboardEvent, item: AccordionItem) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.toggle(item);
    }
  }

  render() {
    return (
      <Host>
        <div class="accordion">
          {this.items.map(item => {
            const isOpen = this.openSet.has(item.id);
            const headerId = `acc-header-${item.id}`;
            const panelId = `acc-panel-${item.id}`;

            return (
              <div
                class={{
                  'accordion__item': true,
                  'accordion__item--open': isOpen,
                  'accordion__item--disabled': !!item.disabled,
                }}
              >
                {/* Header */}
                <button
                  class="accordion__header"
                  id={headerId}
                  type="button"
                  aria-expanded={String(isOpen)}
                  aria-controls={panelId}
                  aria-disabled={item.disabled ? 'true' : undefined}
                  disabled={item.disabled}
                  onClick={() => this.toggle(item)}
                  onKeyDown={e => this.handleKeyDown(e, item)}
                >
                  <span class="accordion__label">{item.label}</span>
                  <span class="accordion__arrow" aria-hidden="true">
                    {isOpen ? '▲' : '▼'}
                  </span>
                </button>

                {/* Panel */}
                <div
                  class={{
                    'accordion__panel': true,
                    'accordion__panel--open': isOpen,
                  }}
                  id={panelId}
                  role="region"
                  aria-labelledby={headerId}
                  hidden={!isOpen}
                >
                  <div class="accordion__content">
                    {item.content
                      ? <span innerHTML={item.content} />
                      : <slot name={item.id} />
                    }
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Host>
    );
  }
}
