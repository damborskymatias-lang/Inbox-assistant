import React from 'react';
import { Icon } from '@lov/design.content.icon';
import type { MailIconProps } from './mail-icon-props-type.js';

/**
 * Flame icon used to mark an email as urgent.
 */
export function FlameIcon({ size = 'md', color = 'urgent', title, className, style }: MailIconProps) {
  return (
    <Icon size={size} color={color} title={title} className={className} style={style}>
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </Icon>
  );
}
