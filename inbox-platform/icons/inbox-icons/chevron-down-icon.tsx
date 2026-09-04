import React from 'react';
import { Icon } from '@lov/design.content.icon';
import type { InboxIconProps } from './inbox-icon-props-type.js';

/**
 * Chevron pointing down, used for expandable sections and select controls.
 */
export function ChevronDownIcon({ size = 'md', color = 'inherit', title = `Expand`, className, style }: InboxIconProps) {
  return (
    <Icon size={size} color={color} title={title} className={className} style={style}>
      <path d="m6 9 6 6 6-6" />
    </Icon>
  );
}
