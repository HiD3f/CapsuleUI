import { Component, Host, Prop, h } from '@stencil/core';

export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger';
export type BadgeSize = 'sm' | 'md';

@Component({
  tag: 'cap-badge',
  styleUrl: 'cap-badge.css',
  shadow: true,
})
export class CapBadge {
  /** Visual style variant */
  @Prop() variant: BadgeVariant = 'default';

  /** Size of the badge */
  @Prop() size: BadgeSize = 'md';

  render() {
    return (
      <Host>
        <span
          class={{
            'badge': true,
            [`badge--${this.variant}`]: true,
            [`badge--${this.size}`]: true,
          }}
        >
          <slot></slot>
        </span>
      </Host>
    );
  }
}
