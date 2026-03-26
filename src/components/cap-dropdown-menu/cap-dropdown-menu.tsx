import { Component, Host, Prop, State, Event, EventEmitter, Element, Watch, h } from '@stencil/core';
import { firstEnabledIndex, lastEnabledIndex, nextEnabledIndex, prevEnabledIndex } from '../../utils/listbox-keyboard';
import { createClickOutsideHandler } from '../../utils/click-outside';

export interface MenuItem {
  /** Determines rendering and behaviour */
  type: 'action' | 'link' | 'toggle' | 'separator';
  /** Display text */
  label?: string;
  /** Identifier emitted in events */
  value?: string;
  /** href for type='link' */
  href?: string;
  /** Link target, e.g. '_blank' */
  target?: string;
  /** Single character or emoji shown before the label */
  icon?: string;
  /** Controlled checked state for type='toggle' */
  checked?: boolean;
  disabled?: boolean;
  /**
   * When true, the menu stays open after the item is activated.
   * Useful for repeated actions like zoom in/out or quantity steppers.
   * toggle items are always persistent regardless of this flag.
   */
  persistent?: boolean;
  /** One level of nested items. Deeper nesting is ignored. */
  items?: MenuItem[];
}

@Component({
  tag: 'cap-dropdown-menu',
  styleUrl: 'cap-dropdown-menu.css',
  shadow: true,
})
export class CapDropdownMenu {
  private dmId = `cap-dropdown-${Math.random().toString(36).slice(2, 9)}`;
  private triggerEl?: HTMLButtonElement;
  private menuEl?: HTMLElement;
  private clickOutsideHandler: (e: MouseEvent) => void;
  private closeSubMenuTimeout: ReturnType<typeof setTimeout> | null = null;
  // Set to true before a state change that should move focus to the active item
  private _focusOnUpdate = false;

  @Element() el: HTMLElement;

  /** Trigger button label */
  @Prop() label: string = '';

  /** Optional icon shown in the trigger */
  @Prop() icon: string;

  /** Menu items */
  @Prop() items: MenuItem[] = [];

  /** Horizontal alignment of the menu panel relative to the trigger */
  @Prop() align: 'start' | 'end' = 'start';

  /** Disables the trigger */
  @Prop() disabled: boolean = false;

  @State() open: boolean = false;
  @State() activeIndex: number = -1;
  @State() openSubMenuIndex: number = -1;
  @State() activeSubIndex: number = -1;
  @State() inSubMenu: boolean = false;
  // Internal checked state for toggle items — keyed by `r{i}` (root) or `s{i}_{j}` (sub)
  @State() checkedMap: Map<string, boolean> = new Map();

  /** Emitted when an action or link item is activated */
  @Event() capSelect: EventEmitter<MenuItem>;

  /** Emitted when a toggle item is activated; checked reflects the new state */
  @Event() capToggle: EventEmitter<{ item: MenuItem; checked: boolean }>;

  componentWillLoad() {
    this.syncCheckedMap();
  }

  @Watch('items')
  itemsChanged() {
    this.syncCheckedMap();
  }

  connectedCallback() {
    this.clickOutsideHandler = createClickOutsideHandler(this.el, () => {
      this.closeMenu(false);
    });
    document.addEventListener('mousedown', this.clickOutsideHandler);
  }

  disconnectedCallback() {
    document.removeEventListener('mousedown', this.clickOutsideHandler);
    if (this.closeSubMenuTimeout) clearTimeout(this.closeSubMenuTimeout);
  }

  componentDidUpdate() {
    if (!this.open || !this._focusOnUpdate) return;
    this._focusOnUpdate = false;

    if (this.inSubMenu && this.activeSubIndex >= 0) {
      const id = this.subItemId(this.openSubMenuIndex, this.activeSubIndex);
      (this.el.shadowRoot?.querySelector(`#${id}`) as HTMLElement)?.focus();
    } else if (!this.inSubMenu && this.activeIndex >= 0) {
      const id = this.itemId(this.activeIndex);
      (this.el.shadowRoot?.querySelector(`#${id}`) as HTMLElement)?.focus();
    } else {
      this.menuEl?.focus();
    }
  }

  // ─── ID helpers ───────────────────────────────────────────────────────────

  private get triggerId() { return `${this.dmId}-trigger`; }
  private get menuId() { return `${this.dmId}-menu`; }
  private itemId(i: number) { return `${this.dmId}-item-${i}`; }
  private subMenuId(i: number) { return `${this.dmId}-submenu-${i}`; }
  private subItemId(i: number, j: number) { return `${this.dmId}-item-${i}-sub-${j}`; }

  // Adapts MenuItem[] to the { disabled } shape expected by listbox-keyboard utils
  private toNavItems(items: MenuItem[]) {
    return items.map(item => ({ disabled: item.type === 'separator' || !!item.disabled }));
  }

  // ─── Checked state helpers ─────────────────────────────────────────────────

  private rootCheckedKey(i: number) { return `r${i}`; }
  private subCheckedKey(i: number, j: number) { return `s${i}_${j}`; }

  private syncCheckedMap() {
    const map = new Map<string, boolean>();
    this.items.forEach((item, i) => {
      if (item.type === 'toggle') map.set(this.rootCheckedKey(i), !!item.checked);
      item.items?.forEach((sub, j) => {
        if (sub.type === 'toggle') map.set(this.subCheckedKey(i, j), !!sub.checked);
      });
    });
    this.checkedMap = map;
  }

  private getChecked(key: string): boolean {
    return this.checkedMap.get(key) ?? false;
  }

  private setChecked(key: string, value: boolean) {
    const map = new Map(this.checkedMap);
    map.set(key, value);
    this.checkedMap = map;
  }

  // ─── Actions ──────────────────────────────────────────────────────────────

  private openMenu(focusLast = false) {
    if (this.disabled) return;
    const nav = this.toNavItems(this.items);
    this.activeIndex = focusLast ? lastEnabledIndex(nav) : firstEnabledIndex(nav);
    this.openSubMenuIndex = -1;
    this.activeSubIndex = -1;
    this.inSubMenu = false;
    this.open = true;
    this._focusOnUpdate = true;
  }

  private closeMenu(returnFocus = true) {
    this.open = false;
    this.activeIndex = -1;
    this.openSubMenuIndex = -1;
    this.activeSubIndex = -1;
    this.inSubMenu = false;
    if (returnFocus) this.triggerEl?.focus();
  }

  private openSubMenu(parentIndex: number) {
    const subItems = this.items[parentIndex]?.items ?? [];
    const nav = this.toNavItems(subItems);
    this.cancelCloseSubMenu();
    this.openSubMenuIndex = parentIndex;
    this.activeSubIndex = firstEnabledIndex(nav);
    this.inSubMenu = true;
    this._focusOnUpdate = true;
  }

  private exitSubMenu() {
    this.inSubMenu = false;
    this.openSubMenuIndex = -1;
    this.activeSubIndex = -1;
    this._focusOnUpdate = true;
  }

  private activateItem(item: MenuItem, checkedKey?: string) {
    if (item.disabled || item.type === 'separator') return;

    if (item.type === 'toggle') {
      const newChecked = checkedKey ? !this.getChecked(checkedKey) : !item.checked;
      if (checkedKey) this.setChecked(checkedKey, newChecked);
      this.capToggle.emit({ item, checked: newChecked });
      // Toggle items are always persistent
      return;
    }

    this.capSelect.emit(item);
    if (!item.persistent) this.closeMenu();
    // link navigation is handled natively by the <a> element
  }

  private scheduleCloseSubMenu() {
    this.cancelCloseSubMenu();
    this.closeSubMenuTimeout = setTimeout(() => {
      if (this.inSubMenu) {
        this.inSubMenu = false;
        this.activeSubIndex = -1;
      }
      this.openSubMenuIndex = -1;
    }, 150);
  }

  private cancelCloseSubMenu = () => {
    if (this.closeSubMenuTimeout) {
      clearTimeout(this.closeSubMenuTimeout);
      this.closeSubMenuTimeout = null;
    }
  };

  // ─── Event handlers ───────────────────────────────────────────────────────

  private handleTriggerClick = () => {
    if (this.open) {
      this.closeMenu(false);
    } else {
      this.openMenu();
    }
  };

  private handleTriggerKeyDown = (e: KeyboardEvent) => {
    if (this.disabled) return;
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!this.open) this.openMenu(false);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!this.open) this.openMenu(true);
    }
  };

  private handleMenuKeyDown = (e: KeyboardEvent) => {
    if (!this.open) return;
    if (this.inSubMenu) {
      this.handleSubKeyDown(e);
    } else {
      this.handleRootKeyDown(e);
    }
  };

  private handleRootKeyDown(e: KeyboardEvent) {
    const nav = this.toNavItems(this.items);

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        this.activeIndex = this.activeIndex < 0
          ? firstEnabledIndex(nav)
          : nextEnabledIndex(nav, this.activeIndex);
        this._focusOnUpdate = true;
        break;
      case 'ArrowUp':
        e.preventDefault();
        this.activeIndex = this.activeIndex < 0
          ? lastEnabledIndex(nav)
          : prevEnabledIndex(nav, this.activeIndex);
        this._focusOnUpdate = true;
        break;
      case 'Home':
        e.preventDefault();
        this.activeIndex = firstEnabledIndex(nav);
        this._focusOnUpdate = true;
        break;
      case 'End':
        e.preventDefault();
        this.activeIndex = lastEnabledIndex(nav);
        this._focusOnUpdate = true;
        break;
      case 'ArrowRight': {
        e.preventDefault();
        const item = this.items[this.activeIndex];
        if (item?.items?.length) this.openSubMenu(this.activeIndex);
        break;
      }
      case 'Enter':
      case ' ': {
        e.preventDefault();
        const item = this.items[this.activeIndex];
        if (!item) break;
        if (item.items?.length) {
          this.openSubMenu(this.activeIndex);
        } else {
          this.activateItem(item, this.rootCheckedKey(this.activeIndex));
        }
        break;
      }
      case 'Escape':
        e.preventDefault();
        this.closeMenu();
        break;
      case 'Tab':
        this.closeMenu(false);
        break;
    }
  }

  private handleSubKeyDown(e: KeyboardEvent) {
    const subItems = this.items[this.openSubMenuIndex]?.items ?? [];
    const nav = this.toNavItems(subItems);

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        this.activeSubIndex = this.activeSubIndex < 0
          ? firstEnabledIndex(nav)
          : nextEnabledIndex(nav, this.activeSubIndex);
        this._focusOnUpdate = true;
        break;
      case 'ArrowUp':
        e.preventDefault();
        this.activeSubIndex = this.activeSubIndex < 0
          ? lastEnabledIndex(nav)
          : prevEnabledIndex(nav, this.activeSubIndex);
        this._focusOnUpdate = true;
        break;
      case 'Home':
        e.preventDefault();
        this.activeSubIndex = firstEnabledIndex(nav);
        this._focusOnUpdate = true;
        break;
      case 'End':
        e.preventDefault();
        this.activeSubIndex = lastEnabledIndex(nav);
        this._focusOnUpdate = true;
        break;
      case 'ArrowLeft':
      case 'Escape':
        e.preventDefault();
        this.exitSubMenu();
        break;
      case 'Enter':
      case ' ': {
        e.preventDefault();
        const item = subItems[this.activeSubIndex];
        if (item) this.activateItem(item, this.subCheckedKey(this.openSubMenuIndex, this.activeSubIndex));
        break;
      }
      case 'Tab':
        this.closeMenu(false);
        break;
    }
  }

  private handleItemMouseEnter = (index: number) => {
    this.cancelCloseSubMenu();
    this.activeIndex = index;
    this.inSubMenu = false;
    const item = this.items[index];
    if (item?.items?.length) {
      this.openSubMenuIndex = index;
    } else {
      this.scheduleCloseSubMenu();
    }
  };

  private handleItemMouseLeave = () => {
    if (this.openSubMenuIndex >= 0) {
      this.scheduleCloseSubMenu();
    }
  };

  private handleSubMenuMouseEnter = () => {
    this.cancelCloseSubMenu();
  };

  private handleSubItemMouseEnter = (j: number) => {
    this.cancelCloseSubMenu();
    this.inSubMenu = true;
    this.activeSubIndex = j;
  };

  private handleItemClick = (item: MenuItem, index: number) => {
    if (item.disabled || item.type === 'separator') return;
    if (item.items?.length) {
      this.openSubMenuIndex = this.openSubMenuIndex === index ? -1 : index;
      return;
    }
    this.activateItem(item, this.rootCheckedKey(index));
  };

  private handleSubItemClick = (item: MenuItem, parentIndex: number, subIndex: number) => {
    this.activateItem(item, this.subCheckedKey(parentIndex, subIndex));
  };

  // ─── Render helpers ───────────────────────────────────────────────────────

  private renderItemStart(item: MenuItem, checkedKey?: string) {
    // Always render a fixed-width left slot for visual alignment
    return (
      <span class="dropdown__item-start" aria-hidden="true">
        {item.type === 'toggle'
          ? (checkedKey ? this.getChecked(checkedKey) : !!item.checked) ? '✓' : ''
          : (item.icon ?? '')}
      </span>
    );
  }

  private renderItem(item: MenuItem, index: number) {
    if (item.type === 'separator') {
      return <div key={`sep-${index}`} role="separator" class="dropdown__separator" />;
    }

    const isActive = index === this.activeIndex && !this.inSubMenu;
    const hasSubMenu = !!(item.items?.length);
    const isSubMenuOpen = index === this.openSubMenuIndex;
    const subItems = item.items ?? [];

    const classes = {
      'dropdown__item': true,
      'dropdown__item--active': isActive,
      'dropdown__item--disabled': !!item.disabled,
      'dropdown__item--toggle': item.type === 'toggle',
      'dropdown__item--has-submenu': hasSubMenu,
      'dropdown__item--submenu-open': isSubMenuOpen,
    };

    const sharedAttrs = {
      id: this.itemId(index),
      tabIndex: -1,
      'aria-disabled': item.disabled ? 'true' : undefined,
      onMouseEnter: () => this.handleItemMouseEnter(index),
      onMouseLeave: this.handleItemMouseLeave,
      onClick: () => this.handleItemClick(item, index),
    };

    const checkedKey = item.type === 'toggle' ? this.rootCheckedKey(index) : undefined;
    const content = [
      this.renderItemStart(item, checkedKey),
      <span class="dropdown__item-label">{item.label}</span>,
      hasSubMenu && (
        <span class="dropdown__item-submenu-arrow" aria-hidden="true">▶</span>
      ),
      hasSubMenu && (
        <div
          id={this.subMenuId(index)}
          role="menu"
          aria-label={item.label}
          class="dropdown__submenu"
          hidden={!isSubMenuOpen}
          onMouseEnter={this.handleSubMenuMouseEnter}
        >
          {subItems.map((sub, j) => this.renderSubItem(sub, index, j))}
        </div>
      ),
    ];

    if (item.type === 'link') {
      return (
        <a
          key={item.value ?? index}
          {...sharedAttrs}
          role="menuitem"
          href={!item.disabled ? item.href : undefined}
          target={item.target}
          class={classes}
        >
          {content}
        </a>
      );
    }

    return (
      <div
        key={item.value ?? index}
        {...sharedAttrs}
        role={item.type === 'toggle' ? 'menuitemcheckbox' : 'menuitem'}
        aria-checked={item.type === 'toggle' ? String(checkedKey ? this.getChecked(checkedKey) : !!item.checked) : undefined}
        aria-haspopup={hasSubMenu ? 'menu' : undefined}
        aria-expanded={hasSubMenu ? String(isSubMenuOpen) : undefined}
        aria-controls={hasSubMenu ? this.subMenuId(index) : undefined}
        class={classes}
      >
        {content}
      </div>
    );
  }

  private renderSubItem(item: MenuItem, parentIndex: number, j: number) {
    if (item.type === 'separator') {
      return <div key={`sep-sub-${j}`} role="separator" class="dropdown__separator" />;
    }

    const isActive = this.inSubMenu && parentIndex === this.openSubMenuIndex && j === this.activeSubIndex;

    const classes = {
      'dropdown__item': true,
      'dropdown__item--active': isActive,
      'dropdown__item--disabled': !!item.disabled,
      'dropdown__item--toggle': item.type === 'toggle',
    };

    const sharedAttrs = {
      id: this.subItemId(parentIndex, j),
      tabIndex: -1,
      'aria-disabled': item.disabled ? 'true' : undefined,
      onMouseEnter: () => this.handleSubItemMouseEnter(j),
      onClick: () => this.handleSubItemClick(item, parentIndex, j),
    };

    const subCheckedKey = item.type === 'toggle' ? this.subCheckedKey(parentIndex, j) : undefined;
    const content = [
      this.renderItemStart(item, subCheckedKey),
      <span class="dropdown__item-label">{item.label}</span>,
    ];

    if (item.type === 'link') {
      return (
        <a
          key={item.value ?? j}
          {...sharedAttrs}
          role="menuitem"
          href={!item.disabled ? item.href : undefined}
          target={item.target}
          class={classes}
        >
          {content}
        </a>
      );
    }

    return (
      <div
        key={item.value ?? j}
        {...sharedAttrs}
        role={item.type === 'toggle' ? 'menuitemcheckbox' : 'menuitem'}
        aria-checked={item.type === 'toggle' ? String(subCheckedKey ? this.getChecked(subCheckedKey) : !!item.checked) : undefined}
        class={classes}
      >
        {content}
      </div>
    );
  }

  render() {
    return (
      <Host>
        <div
          class={{
            'dropdown-wrapper': true,
            'dropdown-wrapper--open': this.open,
            'dropdown-wrapper--disabled': this.disabled,
          }}
          onKeyDown={this.handleMenuKeyDown}
        >
          {/* Trigger */}
          <button
            id={this.triggerId}
            ref={(el) => (this.triggerEl = el)}
            type="button"
            class="dropdown__trigger"
            aria-haspopup="menu"
            aria-expanded={String(this.open)}
            aria-controls={this.menuId}
            disabled={this.disabled}
            onClick={this.handleTriggerClick}
            onKeyDown={this.handleTriggerKeyDown}
          >
            {this.icon && (
              <span class="dropdown__trigger-icon" aria-hidden="true">{this.icon}</span>
            )}
            <span class="dropdown__trigger-label">{this.label}</span>
            <span class="dropdown__trigger-arrow" aria-hidden="true">▼</span>
          </button>

          {/* Menu panel */}
          <div
            id={this.menuId}
            ref={(el) => (this.menuEl = el)}
            role="menu"
            aria-labelledby={this.triggerId}
            class={{
              'dropdown__menu': true,
              'dropdown__menu--end': this.align === 'end',
            }}
            tabIndex={-1}
            hidden={!this.open}
          >
            {this.items.map((item, i) => this.renderItem(item, i))}
          </div>
        </div>
      </Host>
    );
  }
}
