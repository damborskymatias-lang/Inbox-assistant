import React from 'react';

export type OverflowIconProps = {
  /**
   * class name to override the icon styles.
   */
  className?: string;

  /**
   * style tags to include.
   */
  style?: React.CSSProperties;
};

/**
 * a horizontal three-dot icon used for overflow menu actions.
 */
export function OverflowIcon({ className, style }: OverflowIconProps) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="currentColor"
    >
      <circle cx="5" cy="12" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="19" cy="12" r="2" />
    </svg>
  );
}
