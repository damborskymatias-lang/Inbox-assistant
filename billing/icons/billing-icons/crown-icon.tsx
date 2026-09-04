import React from 'react';
import { Icon } from '@lov/design.content.icon';
import type { BillingIconProps } from './billing-icon-props-type.js';

/**
 * Crown glyph used to mark Pro-only plans and premium features.
 */
export function CrownIcon({ size, color, title, className, style }: BillingIconProps) {
  return (
    <Icon size={size} color={color} title={title || `Pro`} className={className} style={style}>
      <path d="m2.5 19 1.6-11.5L9 12l3-7 3 7 4.9-4.5L21.5 19z" />
      <path d="M4 19h16" />
    </Icon>
  );
}
