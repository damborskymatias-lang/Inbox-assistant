import React from 'react';
import { CrownIcon } from './crown-icon.js';
import { LockIcon } from './lock-icon.js';
import { CheckIcon } from './check-icon.js';
import { BoltIcon } from './bolt-icon.js';
import { CreditCardIcon } from './credit-card-icon.js';
import type { BillingIconProps } from './billing-icon-props-type.js';
import styles from './billing-icons.module.scss';

export type BillingIconName = 'crown' | 'lock' | 'check' | 'bolt' | 'credit-card';

export type BillingIconsProps = {
  /**
   * class name for the root element.
   */
  className?: string;

  /**
   * inline style for the root element.
   */
  style?: React.CSSProperties;
};

const ICON_ENTRIES: Array<{ name: BillingIconName; label: string; component: React.ComponentType<BillingIconProps> }> = [
  { name: `crown`, label: `Pro`, component: CrownIcon },
  { name: `lock`, label: `Gated feature`, component: LockIcon },
  { name: `check`, label: `Included`, component: CheckIcon },
  { name: `bolt`, label: `Priority processing`, component: BoltIcon },
  { name: `credit-card`, label: `Payment method`, component: CreditCardIcon },
];

/**
 * Billing icon set gallery — a visual reference of every icon used across billing
 * surfaces: plan badges, gated features, included features and payment methods.
 */
export function BillingIcons({ className, style }: BillingIconsProps) {
  return (
    <div className={`${styles.grid} ${className || ``}`} style={style}>
      {ICON_ENTRIES.map((entry) => {
        const IconComponent = entry.component;
        return (
          <div key={entry.name} className={styles.item}>
            <span className={styles.iconWrap}>
              <IconComponent size="lg" color="primary" />
            </span>
            <span className={styles.label}>{entry.label}</span>
          </div>
        );
      })}
    </div>
  );
}
