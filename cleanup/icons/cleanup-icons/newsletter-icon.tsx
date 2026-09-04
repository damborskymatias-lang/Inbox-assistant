import React from 'react';
import { Icon } from '@lov/design.content.icon';
import type { CleanupIconProps } from './cleanup-icon-props-type.js';

/**
 * Newsletter icon used to represent bulk newsletters and promotional mail.
 */
export function NewsletterIcon({ size = 'md', color = 'inherit', title = `Newsletter`, className, style }: CleanupIconProps) {
  return (
    <Icon size={size} color={color} title={title} className={className} style={style}>
      <path d="M7 3h7l4 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
      <path d="M14 3v4h4" />
      <line x1="8" y1="12" x2="16" y2="12" />
      <line x1="8" y1="15" x2="16" y2="15" />
      <line x1="8" y1="18" x2="12" y2="18" />
    </Icon>
  );
}
