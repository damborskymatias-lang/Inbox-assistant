import React from 'react';
import { Icon } from '@lov/design.content.icon';
import type { ProductivityIconProps } from './productivity-icon-props-type.js';

/**
 * Upward trend icon, used to represent growth and improved productivity.
 */
export function TrendUpIcon({ size = 'md', color = 'inherit', title = `Trending up`, className, style }: ProductivityIconProps) {
  return (
    <Icon size={size} color={color} title={title} className={className} style={style}>
      <path d="M3 17 9.5 10.5 13.5 14.5 21 6" />
      <path d="M15 6h6v6" />
    </Icon>
  );
}
