import React from 'react';
import { Icon } from '@lov/design.content.icon';

export type StyleIconProps = {
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
  style?: React.CSSProperties;
};

/**
 * Pen glyph used to represent the user's writing style preferences.
 */
export function StyleIcon({
  size = 'md',
  color = 'default',
  title = 'Writing style',
  className,
  style,
}: StyleIconProps) {
  return (
    <Icon size={size} color={color} title={title} className={className} style={style}>
      <path d="M12 20h9" />
      <path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z" />
    </Icon>
  );
}
