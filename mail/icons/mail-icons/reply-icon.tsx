import React from 'react';
import { Icon } from '@lov/design.content.icon';
import type { MailIconProps } from './mail-icon-props-type.js';

/**
 * Reply arrow icon used for the reply email action.
 */
export function ReplyIcon({ size = 'md', color = 'default', title, className, style }: MailIconProps) {
  return (
    <Icon size={size} color={color} title={title} className={className} style={style}>
      <polyline points="9 17 4 12 9 7" />
      <path d="M20 18v-2a4 4 0 0 0-4-4H4" />
    </Icon>
  );
}
