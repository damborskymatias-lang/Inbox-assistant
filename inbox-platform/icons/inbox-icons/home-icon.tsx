import React from 'react';
import { Icon } from '@lov/design.content.icon';
import type { InboxIconProps } from './inbox-icon-props-type.js';

/**
 * Home / dashboard entry icon.
 */
export function HomeIcon({ size = 'md', color = 'inherit', title = `Home`, className, style }: InboxIconProps) {
  return (
    <Icon size={size} color={color} title={title} className={className} style={style}>
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5.5 9.5V20h13V9.5" />
      <path d="M9.5 20v-6h5v6" />
    </Icon>
  );
}
