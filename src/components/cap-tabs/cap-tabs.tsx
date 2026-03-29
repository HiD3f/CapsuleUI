import {
  Component,
  Host,
  Prop,
  State,
  Event,
  EventEmitter,
  Element,
  Watch,
  h,
} from '@stencil/core';

export interface TabItem {
  /** Unique identifier — also used as the slot name for panel content */
  id: string;
  /** Tab label */
  label: string;
  /** Disable this tab */
  disabled?: boolean;
}

@Component({
  tag: 'cap-tabs',
  styleUrl: 'cap-tabs.css',
  shadow: true,
})
export class CapTabs {
  @Element() el!: HTMLElement;

  /** Tab definitions */
  @Prop() tabs: TabItem[] = [];

  /** ID of the active tab */
  @Prop({ mutable: true }) activeTab: string = '';

  /**
   * Emitted when the active tab changes.
   * Detail: `{ id }` — the newly active tab id.
   */
  @Event() capChange!: EventEmitter<{ id: string }>;

  @State() private currentTab: string = '';

  componentWillLoad() {
    this.currentTab = this.activeTab || this.firstEnabled()?.id || '';
  }

  @Watch('activeTab')
  onActiveTabChange(val: string) {
    this.currentTab = val;
  }

  @Watch('tabs')
  onTabsChange() {
    if (!this.currentTab || !this.tabs.find(t => t.id === this.currentTab)) {
      this.currentTab = this.firstEnabled()?.id || '';
    }
  }

  private firstEnabled(): TabItem | undefined {
    return this.tabs.find(t => !t.disabled);
  }

  private activate(tab: TabItem) {
    if (tab.disabled || tab.id === this.currentTab) return;
    this.currentTab = tab.id;
    this.activeTab = tab.id;
    this.capChange.emit({ id: tab.id });
  }

  private handleKeyDown(e: KeyboardEvent, index: number) {
    const enabled = this.tabs.filter(t => !t.disabled);
    const cur = enabled.findIndex(t => t.id === this.tabs[index].id);

    let next = -1;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      next = (cur + 1) % enabled.length;
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      next = (cur - 1 + enabled.length) % enabled.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      next = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      next = enabled.length - 1;
    }

    if (next >= 0) {
      this.activate(enabled[next]);
      // Move focus to newly selected tab
      const tabEl = this.tabs.indexOf(enabled[next]);
      const btn = this.el?.shadowRoot?.querySelectorAll<HTMLButtonElement>('.tabs__tab')[tabEl];
      btn?.focus();
    }
  }

  render() {
    return (
      <Host>
        {/* Tab strip */}
        <div class="tabs__list" role="tablist">
          {this.tabs.map((tab, i) => {
            const isActive = tab.id === this.currentTab;
            return (
              <button
                class={{
                  'tabs__tab': true,
                  'tabs__tab--active': isActive,
                  'tabs__tab--disabled': !!tab.disabled,
                }}
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={String(isActive)}
                aria-controls={`panel-${tab.id}`}
                aria-disabled={tab.disabled ? 'true' : undefined}
                tabIndex={isActive ? 0 : -1}
                disabled={tab.disabled}
                onClick={() => this.activate(tab)}
                onKeyDown={e => this.handleKeyDown(e, i)}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab panels — all rendered, hidden via display:none */}
        {this.tabs.map(tab => (
          <div
            class={{
              'tabs__panel': true,
              'tabs__panel--active': tab.id === this.currentTab,
            }}
            tabIndex={tab.id === this.currentTab ? 0 : -1}
            id={`panel-${tab.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${tab.id}`}
            hidden={tab.id !== this.currentTab}
          >
            <slot name={tab.id} />
          </div>
        ))}
      </Host>
    );
  }
}
