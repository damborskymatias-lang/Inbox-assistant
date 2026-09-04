import React from 'react';
import { Icon } from '@lov/design.content.icon';
import type { MailIconProps } from './mail-icon-props-type.js';

/**
 * Tag icon used to mark an email as a promotion.
 */
export function TagIcon({ size = 'md', color = 'promotions', title, className, style }: MailIconProps) {
  return (
    <Icon size={size} color={color} title={title} className={className} style={style}>
      <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42Z" />
      <circle cx="7.5" cy="7.5" r="1.5" />
    </Icon>
  );
}
