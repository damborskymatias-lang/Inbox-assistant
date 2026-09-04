import React from 'react';
import classNames from 'classnames';
import { Badge, type BadgeSize } from '@lov/design.content.badge';
import type { EmailCategory } from '@lov/mail.entities.email';
import { CATEGORY_META } from './category-meta.js';
import styles from './category-chip.module.scss';

export type CategoryChipProps = {
  /**
   * smart category assigned to the email by the AI classifier.
   */
  category?: EmailCategory;

  /**
   * size of the chip.
   */
  size?: BadgeSize;

  /**
   * class name for the chip root element.
   */
  className?: string;

  /**
   * inline style for the chip root element.
   */
  style?: React.CSSProperties;
};

/**
 * Chip rendering a smart email category with its emoji and matching tone.
 */
export function CategoryChip({ category = `work`, size = `sm`, className, style }: CategoryChipProps) {
  const meta = CATEGORY_META[category];

  return (
    <Badge
      tone={meta.tone}
      icon={meta.emoji}
      size={size}
      className={classNames(styles.chip, className)}
      style={style}
    >
      {meta.label}
    </Badge>
  );
}
