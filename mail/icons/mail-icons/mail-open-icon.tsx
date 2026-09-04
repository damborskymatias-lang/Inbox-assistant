import React from 'react';
import { Icon } from '@lov/design.content.icon';
import type { MailIconProps } from './mail-icon-props-type.js';

/**
 * Open envelope icon used to represent a read email.
 */
export function MailOpenIcon({ size = 'md', color = 'default', title, className, style }: MailIconProps) {
  return (
    <Icon size={size} color={color} title={title} className={className} style={style}>
      <path d="m22 9.5-9.1 6.1c-.55.37-1.25.37-1.8 0L2 9.5" />
      <path d="M2 9.5V19a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9.5a2 2 0 0 0-.87-1.65l-8-5.44a2 2 0 0 0-2.26 0l-8 5.44A2 2 0 0 0 2 9.5Z" />
    </Icon>
  );
}
