import { Component, Host, Prop, State, Event, EventEmitter, Element, Watch, h } from '@stencil/core';
import { MenuItem } from '../cap-dropdown-menu/cap-dropdown-menu';
import { firstEnabledIndex, lastEnabledIndex, nextEnabledIndex, prevEnabledIndex } from '../../utils/listbox-keyboard';

@Component({
  tag: 'cap-context-menu',
  styleUrl: 'cap-context-menu.css',
  shadow: true,
})
export class CapContextMenu {
  private cmId = `cap-context-${Math.random().toString(36).slice(2, 9)}`;
  private menuEl?: HTMLElement;
  private closeSubMenuTimeout: ReturnType<typeof setTimeout> | null = null;
  private _focusOnUpdate = false;
  private _previousFocus: HTMLElement | null = null;
  private clickOutsideHandler: (e: MouseEvent) => void;

  @Element() el: HTMLElement;

  /** Menu items */
  @Prop() items: MenuItem[] = [];

  /** Accessible label for the menu panel */
  @Prop() label: string = 'Context menu';

  /** Disables the context menu (browser default is shown instead) */
  @Prop() disabled: boolean = false;

  @State() open: boolean = false;
  @State() menuX: number = 0;
  @State() menuY: number = 0;
  @State() activeIndex: number = -1;
  @State() openSubMenuIndex: number = -1;
  @State() activeSubIndex: number = -1;
  @State() inSubMenu: boolean = false;
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
    // Close on any mousedown that is not inside the menu panel itself
    this.clickOutsideHandler = (e: MouseEvent) => {
      if (!this.open) return;
      const path = e.composedPath();
      if (this.menuEl && !path.includes(this.menuEl as EventTarget)) {
        this.closeMenu(false);
      }
    };
    document.addEventListener('mousedown', this.clickOutsideHandler);
  }

  disconnectedCallback() {
    document.removeEventListener('mousedown', this.clickOutsideHandler);
    if (this.closeSubMenuTimeout) clearTimeout(this.closeSubMenuTimeout);
  }

  componentDidUpdate() {
    // Clamp menu panel to viewport after it renders.
    // getBoundingClientRect is always viewport-relative, so comparing against
    // innerWidth/innerHeight is correct regardless of any ancestor transforms.
    if (this.open && this.menuEl) {
      const rect = this.menuEl.getBoundingClientRect();
      let x = this.menuX;
      let y = this.menuY;
      if (rect.right > window.innerWidth) x -= rect.right - window.innerWidth;
      if (rect.bottom > window.innerHeight) y -= rect.bottom - window.innerHeight;
      if (x !== this.menuX) this.menuX = x;
      if (y !== this.menuY) this.menuY = y;
    }

    // Focus management
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

  private get menuId() { return `${this.cmId}-menu`; }
  private itemId(i: number) { return `${this.cmId}-item-${i}`; }
  private subMenuId(i: number) { return `${this.cmId}-submenu-${i}`; }
  private subItemId(i: number, j: number) { return `${this.cmId}-item-${i}-sub-${j}`; }

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

  private openMenu() {
    if (this.disabled) return;
    const nav = this.toNavItems(this.items);
    this.activeIndex = firstEnabledIndex(nav);
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
    if (returnFocus && this._previousFocus) {
      this._previousFocus.focus();
      this._previousFocus = null;
    }
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
      return;
    }

    this.capSelect.emit(item);
    if (!item.persistent) this.closeMenu();
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

  private handleContextMenu = (e: MouseEvent) => {
    if (this.disabled) return; // let the browser's native context menu appear
    e.preventDefault();
    this._previousFocus = document.activeElement as HTMLElement;

    // Probe the actual fixed-positioning origin inside this shadow root.
    // If an ancestor has a CSS transform it creates a new containing block
    // for position:fixed, shifting the origin away from the viewport's (0,0).
    // The probe measures that shift so we can compensate.
    const probe = document.createElement('div');
    probe.style.cssText = 'position:fixed;top:0;left:0;pointer-events:none;visibility:hidden;';
    this.el.shadowRoot.appendChild(probe);
    const origin = probe.getBoundingClientRect();
    this.el.shadowRoot.removeChild(probe);

    this.menuX = e.clientX - origin.left;
    this.menuY = e.clientY - origin.top;
    this.openMenu();
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
    return (
      <span class="context-menu__item-start" aria-hidden="true">
        {item.type === 'toggle'
          ? (checkedKey ? this.getChecked(checkedKey) : !!item.checked) ? '✓' : ''
          : (item.icon ?? '')}
      </span>
    );
  }

  private renderItem(item: MenuItem, index: number) {
    if (item.type === 'separator') {
      return <div key={`sep-${index}`} role="separator" class="context-menu__separator" />;
    }

    const isActive = index === this.activeIndex && !this.inSubMenu;
    const hasSubMenu = !!(item.items?.length);
    const isSubMenuOpen = index === this.openSubMenuIndex;
    const subItems = item.items ?? [];
    const checkedKey = item.type === 'toggle' ? this.rootCheckedKey(index) : undefined;

    const classes = {
      'context-menu__item': true,
      'context-menu__item--active': isActive,
      'context-menu__item--disabled': !!item.disabled,
      'context-menu__item--toggle': item.type === 'toggle',
      'context-menu__item--has-submenu': hasSubMenu,
    };

    const sharedAttrs = {
      id: this.itemId(index),
      tabIndex: -1,
      'aria-disabled': item.disabled ? 'true' : undefined,
      onMouseEnter: () => this.handleItemMouseEnter(index),
      onMouseLeave: this.handleItemMouseLeave,
      onClick: () => this.handleItemClick(item, index),
    };

    const content = [
      this.renderItemStart(item, checkedKey),
      <span class="context-menu__item-label">{item.label}</span>,
      hasSubMenu && (
        <span class="context-menu__item-submenu-arrow" aria-hidden="true">▶</span>
      ),
      hasSubMenu && (
        <div
          id={this.subMenuId(index)}
          role="menu"
          aria-label={item.label}
          class="context-menu__submenu"
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
      return <div key={`sep-sub-${j}`} role="separator" class="context-menu__separator" />;
    }

    const isActive = this.inSubMenu && parentIndex === this.openSubMenuIndex && j === this.activeSubIndex;
    const subCheckedKey = item.type === 'toggle' ? this.subCheckedKey(parentIndex, j) : undefined;

    const classes = {
      'context-menu__item': true,
      'context-menu__item--active': isActive,
      'context-menu__item--disabled': !!item.disabled,
      'context-menu__item--toggle': item.type === 'toggle',
    };

    const sharedAttrs = {
      id: this.subItemId(parentIndex, j),
      tabIndex: -1,
      'aria-disabled': item.disabled ? 'true' : undefined,
      onMouseEnter: () => this.handleSubItemMouseEnter(j),
      onClick: () => this.handleSubItemClick(item, parentIndex, j),
    };

    const content = [
      this.renderItemStart(item, subCheckedKey),
      <span class="context-menu__item-label">{item.label}</span>,
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
        <div class="context-menu-wrapper" onContextMenu={this.handleContextMenu}>
          <slot></slot>
        </div>
        <div
          id={this.menuId}
          ref={(el) => (this.menuEl = el)}
          role="menu"
          aria-label={this.label}
          class="context-menu__panel"
          style={{ top: `${this.menuY}px`, left: `${this.menuX}px` }}
          tabIndex={-1}
          hidden={!this.open}
          onKeyDown={this.handleMenuKeyDown}
        >
          {this.items.map((item, i) => this.renderItem(item, i))}
        </div>
      </Host>
    );
  }
}
