import { type ComponentType } from 'react';
import type { SlotRegistry } from '@bitdev/harmony.harmony';

/**
 * a sidebar navigation entry contributed by a feature aspect.
 */
export type NavigationItem = {
  /**
   * display label of the navigation item.
   */
  label: string;

  /**
   * destination the navigation item links to.
   */
  href: string;

  /**
   * icon rendered before the label.
   */
  icon?: ComponentType;

  /**
   * ordering weight, lower values render first.
   */
  weight?: number;

  /**
   * resolves a badge count rendered next to the label.
   */
  badge?: () => number | undefined;
};

export type NavigationItemSlot = SlotRegistry<NavigationItem[]>;
