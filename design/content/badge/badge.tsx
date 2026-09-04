import React, { type ReactNode } from 'react';
import classNames from 'classnames';
import styles from './badge.module.scss';

export type BadgeTone =
  | 'neutral'
  | 'urgent'
  | 'work'
  | 'bills'
  | 'shopping'
  | 'family'
  | 'marketing'
  | 'success'
  | 'brand';

export type BadgeSize = 'xs' | 'sm';

export type BadgeProps = {
  /**
   * content rendered inside the badge.
   */
  children?: ReactNode;

  /**
   * color tone used to convey category, importance or status.
   */
  tone?: BadgeTone;

  /**
   * size of the badge.
   */
  size?: BadgeSize;

  /**
   * icon or emoji rendered before the label.
   */
  icon?: ReactNode;

  /**
   * class name for the badge root element.
   */
  className?: string;

  /**
   * inline style for the badge root element.
   */
  style?: React.CSSProperties;
};

const TONE_STYLES: Record<BadgeTone, string> = {
  neutral: styles.neutral,
  urgent: styles.urgent,
  work: styles.work,
  bills: styles.bills,
  shopping: styles.shopping,
  family: styles.family,
  marketing: styles.marketing,
  success: styles.success,
  brand: styles.brand,
};

/**
 * Pill badge / chip used for smart categories, importance scores and status.
 */
export function Badge({ children, tone = 'neutral', size = 'sm', icon, className, style }: BadgeProps) {
  return (
    <span
      className={classNames(styles.badge, TONE_STYLES[tone], styles[size], className)}
      style={style}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      {children && <span className={styles.label}>{children}</span>}
    </span>
  );
}
