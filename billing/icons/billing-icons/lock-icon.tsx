import React from 'react';
import { Icon } from '@lov/design.content.icon';
import type { BillingIconProps } from './billing-icon-props-type.js';

/**
 * Padlock glyph used to mark gated features that require an upgrade.
 */
export function LockIcon({ size, color, title, className, style }: BillingIconProps) {
  return (
    <Icon size={size} color={color} title={title || `Locked`} className={className} style={style}>
      <rect x="4.5" y="10.5" width="15" height="10" rx="2" />
      <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
    </Icon>
  );
}
