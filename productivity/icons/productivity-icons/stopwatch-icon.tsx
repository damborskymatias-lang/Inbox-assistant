import React from 'react';
import { Icon } from '@lov/design.content.icon';
import type { ProductivityIconProps } from './productivity-icon-props-type.js';

/**
 * Stopwatch icon, used to represent tracked or saved time.
 */
export function StopwatchIcon({ size = 'md', color = 'inherit', title = `Stopwatch`, className, style }: ProductivityIconProps) {
  return (
    <Icon size={size} color={color} title={title} className={className} style={style}>
      <path d="M10 2h4" />
      <path d="M12 14 15 11" />
      <circle cx="12" cy="14" r="8" />
    </Icon>
  );
}
