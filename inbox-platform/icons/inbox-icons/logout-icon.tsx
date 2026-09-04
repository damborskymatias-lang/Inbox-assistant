import React from 'react';
import { Icon } from '@lov/design.content.icon';
import type { InboxIconProps } from './inbox-icon-props-type.js';

/**
 * Sign out / logout icon.
 */
export function LogoutIcon({ size = 'md', color = 'inherit', title = `Log out`, className, style }: InboxIconProps) {
  return (
    <Icon size={size} color={color} title={title} className={className} style={style}>
      <path d="M15 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h9" />
      <path d="M19 12H9" />
      <path d="m15 8 4 4-4 4" />
    </Icon>
  );
}
