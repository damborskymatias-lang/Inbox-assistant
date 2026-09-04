import React from 'react';
import { Icon } from '@lov/design.content.icon';
import type { ProductivityIconProps } from './productivity-icon-props-type.js';

/**
 * Notification bell icon, used for digest and reminder notifications.
 */
export function BellIcon({ size = 'md', color = 'inherit', title = `Notifications`, className, style }: ProductivityIconProps) {
  return (
    <Icon size={size} color={color} title={title} className={className} style={style}>
      <path d="M6 8a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6" />
      <path d="M10.5 20a1.5 1.5 0 0 0 3 0" />
    </Icon>
  );
}
