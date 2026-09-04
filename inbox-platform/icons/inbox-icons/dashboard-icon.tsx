import React from 'react';
import { Icon } from '@lov/design.content.icon';
import type { InboxIconProps } from './inbox-icon-props-type.js';

/**
 * Dashboard / panels grid icon.
 */
export function DashboardIcon({ size = 'md', color = 'inherit', title = `Dashboard`, className, style }: InboxIconProps) {
  return (
    <Icon size={size} color={color} title={title} className={className} style={style}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </Icon>
  );
}
