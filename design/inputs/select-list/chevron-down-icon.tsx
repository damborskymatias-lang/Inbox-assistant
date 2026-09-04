import React from 'react';
import classNames from 'classnames';
import styles from './chevron-down-icon.module.scss';

export type ChevronDownIconProps = {
  /**
   * whether the chevron should render in its rotated (open) state.
   */
  open?: boolean;

  /**
   * class name for the icon container.
   */
  className?: string;
};

/**
 * a small chevron icon indicating an expandable dropdown trigger.
 */
export function ChevronDownIcon({ open = false, className }: ChevronDownIconProps) {
  return (
    <svg
      className={classNames(styles.chevron, open ? styles.chevronOpen : undefined, className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
