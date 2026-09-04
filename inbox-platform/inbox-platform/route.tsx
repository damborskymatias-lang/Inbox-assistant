import { type ComponentType } from 'react';
import type { SlotRegistry } from '@bitdev/harmony.harmony';

/**
 * a route registered to the platform router by the platform or a feature aspect.
 */
export type Route = {
  /**
   * url path of the route.
   */
  path: string;

  /**
   * component rendered for this route.
   */
  component: ComponentType;

  /**
   * whether the route requires an authenticated user.
   */
  protected?: boolean;
};

export type RouteSlot = SlotRegistry<Route[]>;
