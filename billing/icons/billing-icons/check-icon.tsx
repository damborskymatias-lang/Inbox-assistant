import React from 'react';
import { Icon } from '@lov/design.content.icon';
import type { BillingIconProps } from './billing-icon-props-type.js';

/**
 * Checkmark glyph used to mark a feature included in a plan.
 */
export function CheckIcon({ size, color, title, className, style }: BillingIconProps) {
  return (
    <Icon size={size} color={color} title={title || `Included`} className={className} style={style}>
      <path d="M20 6 9 17l-5-5" />
    </Icon>
  );
}
