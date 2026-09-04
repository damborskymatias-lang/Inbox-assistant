import React from 'react';

export type TrashIconProps = {
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
 * a simple trash can icon used for the delete row action.
 */
export function TrashIcon({ className, style }: TrashIconProps) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  );
}
