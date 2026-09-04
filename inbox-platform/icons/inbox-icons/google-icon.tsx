import React from 'react';
import { Icon } from '@lov/design.content.icon';
import type { InboxIconProps } from './inbox-icon-props-type.js';

/**
 * Google sign-in mark, drawn as a single-color line icon to match the set's stroke style.
 */
export function GoogleIcon({ size = 'md', color = 'inherit', title = `Google`, className, style }: InboxIconProps) {
  return (
    <Icon size={size} color={color} title={title} className={className} style={style}>
      <path d="M20 12a8 8 0 1 1-2.34-5.66" />
      <path d="M12 12h8" />
    </Icon>
  );
}
