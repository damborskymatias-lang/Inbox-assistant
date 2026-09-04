import React from 'react';
import { Icon } from '@lov/design.content.icon';

export type RegenerateIconProps = {
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
 * Circular refresh glyph used to regenerate an AI reply or a summary.
 */
export function RegenerateIcon({
  size = 'md',
  color = 'default',
  title = 'Regenerate',
  className,
  style,
}: RegenerateIconProps) {
  return (
    <Icon size={size} color={color} title={title} className={className} style={style}>
      <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
      <path d="M3 21v-5h5" />
    </Icon>
  );
}
