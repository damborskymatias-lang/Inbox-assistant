import type { ComponentType } from 'react';

/**
 * layout span of a dashboard panel within the responsive grid.
 */
export type DashboardPanelSpan = 'full' | 'half';

/**
 * a dashboard panel contributed by a feature via the dashboard panels slot.
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
   * weight used to sort panels in ascending order, lower weights render first.
   */
  weight?: number;

  /**
   * layout span of the panel within the dashboard grid.
   */
  span?: DashboardPanelSpan;
};
