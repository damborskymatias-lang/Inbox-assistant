import type { ComponentType } from 'react';

/**
 * a single item registered into the user-bar dropdown menu by a feature aspect.
 */
export type UserBarMenuItem = {
  /**
   * label displayed for the menu item.
   */
  label: string;

  /**
   * destination the menu item navigates to.
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
};
