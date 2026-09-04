import { type ComponentType } from 'react';
import type { SlotRegistry } from '@bitdev/harmony.harmony';

/**
 * layout span of a dashboard panel within the responsive grid.
 */
export type DashboardPanelSpan = 'full' | 'half';

/**
 * a dashboard panel contributed by a feature aspect.
 */
export type DashboardPanel = {
  /**
   * unique name identifying the panel.
   */
  name: string;

  /**
   * component rendered inside the panel.
   */
  component: ComponentType;

  /**
   * ordering weight, lower values render first.
   */
  weight?: number;

  /**
   * layout span of the panel within the dashboard grid.
   */
  span?: DashboardPanelSpan;
};

export type DashboardPanelSlot = SlotRegistry<DashboardPanel[]>;
