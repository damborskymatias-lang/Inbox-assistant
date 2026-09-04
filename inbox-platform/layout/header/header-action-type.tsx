import { type ComponentType } from 'react';

/**
 * a single action registered into the header by a feature aspect, rendered
 * between the logo and the user bar (e.g. the minutes-saved indicator).
 */
export type HeaderAction = {
  /**
   * unique name identifying the header action.
   */
  name: string;

  /**
   * component rendered for the action.
   */
  component: ComponentType;

  /**
   * ordering weight, lower values render first.
   */
  weight?: number;
};
