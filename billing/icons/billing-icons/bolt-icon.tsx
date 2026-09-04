import React from 'react';
import { Icon } from '@lov/design.content.icon';
import type { BillingIconProps } from './billing-icon-props-type.js';

/**
 * Lightning bolt glyph used to mark priority processing.
 */
export function BoltIcon({ size, color, title, className, style }: BillingIconProps) {
  return (
    <Icon size={size} color={color} title={title || `Priority processing`} className={className} style={style}>
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" />
    </Icon>
  );
}
