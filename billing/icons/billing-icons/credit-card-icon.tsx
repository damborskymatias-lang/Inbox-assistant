import React from 'react';
import { Icon } from '@lov/design.content.icon';
import type { BillingIconProps } from './billing-icon-props-type.js';

/**
 * Credit card glyph used for billing and payment method actions.
 */
export function CreditCardIcon({ size, color, title, className, style }: BillingIconProps) {
  return (
    <Icon size={size} color={color} title={title || `Payment method`} className={className} style={style}>
      <rect x="2.5" y="5.5" width="19" height="13" rx="2" />
      <path d="M2.5 10h19" />
      <path d="M6 15h4" />
    </Icon>
  );
}
