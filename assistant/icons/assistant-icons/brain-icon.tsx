import React from 'react';
import { Icon } from '@lov/design.content.icon';

export type BrainIconProps = {
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
 * Brain glyph representing the assistant's understanding and analysis of the inbox.
 */
export function BrainIcon({
  size = 'md',
  color = 'default',
  title = 'AI understanding',
  className,
  style,
}: BrainIconProps) {
  return (
    <Icon size={size} color={color} title={title} className={className} style={style}>
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.02-3.63A2.5 2.5 0 0 1 3.5 12a2.5 2.5 0 0 1 .18-4.09A2.5 2.5 0 0 1 6 4a2.5 2.5 0 0 1 3.5-2Z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.02-3.63A2.5 2.5 0 0 0 20.5 12a2.5 2.5 0 0 0-.18-4.09A2.5 2.5 0 0 0 18 4a2.5 2.5 0 0 0-3.5-2Z" />
    </Icon>
  );
}
