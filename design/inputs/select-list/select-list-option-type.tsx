import type { ReactNode } from 'react';

/**
 * A single selectable option rendered inside the select-list dropdown.
 */
export type SelectListOption = {
  /**
   * unique value identifying the option.
   */
  value: string;

  /**
   * label displayed for the option.
   */
  label: string;

  /**
   * optional icon rendered before the label, e.g. an emoji or SVG icon.
   */
  icon?: ReactNode;
};
