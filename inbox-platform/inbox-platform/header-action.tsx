import { type ComponentType } from 'react';
import type { SlotRegistry } from '@bitdev/harmony.harmony';

/**
 * a persistent action or indicator rendered in the app header.
 */
export type HeaderAction = {
  /**
   * unique name identifying the action.
   */
  name: string;

  /**
   * component rendered in the header actions area.
   */
  component: ComponentType;

  /**
   * ordering weight, lower values render first.
   */
  weight?: number;
};

export type HeaderActionSlot = SlotRegistry<HeaderAction[]>;
