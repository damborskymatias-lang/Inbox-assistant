import React from 'react';
import { Icon } from '@lov/design.content.icon';
import type { ProductivityIconProps } from './productivity-icon-props-type.js';

/**
 * Digest icon, used to represent a daily summary document.
 */
export function DigestIcon({ size = 'md', color = 'inherit', title = `Daily digest`, className, style }: ProductivityIconProps) {
  return (
    <Icon size={size} color={color} title={title} className={className} style={style}>
      <path d="M5 3h11l3 3v15H5z" />
      <path d="M16 3v3h3" />
      <path d="M8 11h8" />
      <path d="M8 14.5h8" />
      <path d="M8 18h5" />
    </Icon>
  );
}
