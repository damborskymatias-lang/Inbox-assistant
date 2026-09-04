import React from 'react';
import { Icon } from '@lov/design.content.icon';
import type { InboxIconProps } from './inbox-icon-props-type.js';

/**
 * Clock / time-saved icon.
 */
export function ClockIcon({ size = 'md', color = 'inherit', title = `Time`, className, style }: InboxIconProps) {
  return (
    <Icon size={size} color={color} title={title} className={className} style={style}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </Icon>
  );
}
