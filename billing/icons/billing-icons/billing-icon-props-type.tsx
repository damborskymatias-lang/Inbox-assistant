import type { CSSProperties } from 'react';
import type { IconSize } from '@lov/design.content.icon';

export type BillingIconProps = {
  /**
   * size of the icon, either a preset (xs, sm, md, lg) or a number of pixels.
   */
  size?: IconSize;

  /**
   * color of the icon, either a theme color token name or a CSS color value.
   */
  color?: string;

  /**
   * accessible title for the icon. defaults to a label describing its billing meaning.
   */
  title?: string;

  /**
   * class name for the icon root element.
   */
  className?: string;

  /**
   * inline style for the icon root element.
   */
  style?: CSSProperties;
};
