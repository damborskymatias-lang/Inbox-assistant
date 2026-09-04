import type { CSSProperties } from 'react';
import type { IconSize } from '@lov/design.content.icon';

export type MailIconProps = {
  /**
   * size of the icon, either a preset (xs, sm, md, lg) or a number of pixels.
   */
  size?: IconSize;

  /**
   * color of the icon, either a theme color token name or a CSS color value.
   */
  color?: string;

  /**
   * accessible title for the icon. when omitted the icon is hidden from assistive tech.
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
