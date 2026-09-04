import type { ComponentType } from 'react';

/**
 * a single navigation item registered by a feature aspect, rendered in the
 * sidebar sorted by weight.
 */
export type NavigationItem = {
  /**
   * label displayed for the navigation item.
   */
  label: string;

  /**
   * route the navigation item links to.
   */
  href: string;

  /**
   * icon component rendered before the label.
   */
  icon?: ComponentType<{ size?: 'xs' | 'sm' | 'md' | 'lg' | number; className?: string }>;

  /**
   * ordering weight, lower values render first.
   */
  weight?: number;

  /**
   * returns a count to render as a badge next to the label, or undefined to hide it.
   */
  badge?: () => number | undefined;
};
