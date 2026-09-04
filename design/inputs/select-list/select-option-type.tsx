import type { ReactNode } from 'react';

/**
 * A single selectable option rendered inside the select-list dropdown.
 */
export type SelectOption = {
  /**
   * unique value identifying the option.
   */
  value: string;

  /**
   * label displayed to the user.
   */
  label: string;

  /**
   * optional icon rendered before the label.
   */
  icon?: ReactNode;
};
