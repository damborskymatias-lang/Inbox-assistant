import { type ComponentType } from 'react';
import type { SlotRegistry } from '@bitdev/harmony.harmony';

/**
 * an item rendered in the signed-in user dropdown menu.
 */
export type UserBarMenuItem = {
  /**
   * display label of the menu item.
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

export type UserBarMenuItemSlot = SlotRegistry<UserBarMenuItem[]>;
