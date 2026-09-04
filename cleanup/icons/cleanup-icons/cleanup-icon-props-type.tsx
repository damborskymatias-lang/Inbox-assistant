import type { CSSProperties } from 'react';

export type CleanupIconProps = {
  /**
   * size of the icon, either a preset (xs, sm, md, lg) or a number of pixels.
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | number;

  /**
   * color of the icon, either a theme color token name or a CSS color value.
   */
  color?: string;

  /**
   * accessible title for the icon.
   */
  title?: string;

  /**
   * class name to override the icon container.
   */
  className?: string;

  /**
   * style to override the icon container.
   */
  style?: CSSProperties;
};
