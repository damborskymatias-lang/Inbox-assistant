import React from 'react';
import { Icon } from '@lov/design.content.icon';
import type { CleanupIconProps } from './cleanup-icon-props-type.js';

/**
 * Archive box icon used to represent archiving emails.
 */
export function BoxArchiveIcon({ size = 'md', color = 'inherit', title = `Archive`, className, style }: CleanupIconProps) {
  return (
    <Icon size={size} color={color} title={title} className={className} style={style}>
      <rect x="3" y="4" width="18" height="5" rx="1" />
      <path d="M5 9v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9" />
      <line x1="10" y1="13" x2="14" y2="13" />
    </Icon>
  );
}
