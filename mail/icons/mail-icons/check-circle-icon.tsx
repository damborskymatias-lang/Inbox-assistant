import React from 'react';
import { Icon } from '@lov/design.content.icon';
import type { MailIconProps } from './mail-icon-props-type.js';

/**
 * Check circle icon used to mark an email as FYI.
 */
export function CheckCircleIcon({ size = 'md', color = 'fyi', title, className, style }: MailIconProps) {
  return (
    <Icon size={size} color={color} title={title} className={className} style={style}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </Icon>
  );
}
