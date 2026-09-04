import React from 'react';

export type SearchIconProps = {
  /**
   * class name for the svg element.
   */
  className?: string;

  /**
   * inline style for the svg element.
   */
  style?: React.CSSProperties;
};

/**
 * Magnifying glass icon used for the inbox search input.
 */
export function SearchIcon({ className, style }: SearchIconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
