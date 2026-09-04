import React from 'react';
import { Icon } from '@lov/design.content.icon';
import type { CleanupIconProps } from './cleanup-icon-props-type.js';

/**
 * Trash icon representing a bulk delete action for many emails at once.
 */
export function TrashBulkIcon({ size = 'md', color = 'inherit', title = `Delete all`, className, style }: CleanupIconProps) {
  return (
    <Icon size={size} color={color} title={title} className={className} style={style}>
      <path d="M4 7h16" />
      <path d="M9 7V4h6v3" />
      <path d="M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
      <path d="M3 5l1.5-2" />
      <path d="M21 5l-1.5-2" />
    </Icon>
  );
}
