import React from 'react';
import { Icon } from '@lov/design.content.icon';
import type { CleanupIconProps } from './cleanup-icon-props-type.js';

/**
 * Sparkle icon used to represent an AI-powered or freshly cleaned inbox.
 */
export function SparkleCleanIcon({ size = 'md', color = 'inherit', title = `Clean`, className, style }: CleanupIconProps) {
  return (
    <Icon size={size} color={color} title={title} className={className} style={style}>
      <path d="M12 3c.5 3 2 5.5 5 6-3 .5-5.5 2-6 5-.5-3-2-5.5-5-6 3-.5 5.5-2 6-5z" />
      <path d="M18 14c.2 1.2.8 2.2 2 2.4-1.2.2-1.8 1.2-2 2.4-.2-1.2-.8-2.2-2-2.4 1.2-.2 1.8-1.2 2-2.4z" />
    </Icon>
  );
}
