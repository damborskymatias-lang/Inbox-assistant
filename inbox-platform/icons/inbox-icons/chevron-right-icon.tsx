import React from 'react';
import { Icon } from '@lov/design.content.icon';
import type { InboxIconProps } from './inbox-icon-props-type.js';

/**
 * Chevron pointing right, used for navigation and disclosure controls.
 */
export function ChevronRightIcon({ size = 'md', color = 'inherit', title = `Next`, className, style }: InboxIconProps) {
  return (
    <Icon size={size} color={color} title={title} className={className} style={style}>
      <path d="m9 6 6 6-6 6" />
    </Icon>
  );
}
