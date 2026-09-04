import React from 'react';
import { Icon } from '@lov/design.content.icon';
import type { CleanupIconProps } from './cleanup-icon-props-type.js';

/**
 * Broom icon used to represent sweeping / cleanup actions.
 */
export function BroomIcon({ size = 'md', color = 'inherit', title = `Cleanup`, className, style }: CleanupIconProps) {
  return (
    <Icon size={size} color={color} title={title} className={className} style={style}>
      <path d="M19 3 12 10" />
      <path d="M12 10 5 21" />
      <path d="M12 10 9 21" />
      <path d="M12 10 15 20" />
      <path d="M5 21h10" />
    </Icon>
  );
}
