import React from 'react';
import { Icon } from '@lov/design.content.icon';
import type { ProductivityIconProps } from './productivity-icon-props-type.js';

/**
 * Target icon, used to represent goals and focus areas.
 */
export function TargetIcon({ size = 'md', color = 'inherit', title = `Target`, className, style }: ProductivityIconProps) {
  return (
    <Icon size={size} color={color} title={title} className={className} style={style}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" />
    </Icon>
  );
}
