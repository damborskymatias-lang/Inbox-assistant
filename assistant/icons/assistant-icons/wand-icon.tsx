import React from 'react';
import { Icon } from '@lov/design.content.icon';

export type WandIconProps = {
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
 * Magic wand glyph used for one-click AI actions like auto-cleanup and quick fixes.
 */
export function WandIcon({
  size = 'md',
  color = 'default',
  title = 'Magic action',
  className,
  style,
}: WandIconProps) {
  return (
    <Icon size={size} color={color} title={title} className={className} style={style}>
      <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z" />
      <path d="m14 7 3 3" />
      <path d="M5 6v4" />
      <path d="M19 14v4" />
      <path d="M10 2v2" />
      <path d="M7 8H3" />
      <path d="M21 16h-4" />
      <path d="M11 3H9" />
    </Icon>
  );
}
