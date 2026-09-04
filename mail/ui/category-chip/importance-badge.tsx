import React from 'react';
import classNames from 'classnames';
import { Badge, type BadgeSize, type BadgeTone } from '@lov/design.content.badge';
import styles from './importance-badge.module.scss';

export type ImportanceBadgeProps = {
  /**
   * importance score assigned by the AI classifier, from 1 (low) to 10 (critical).
   */
  score?: number;

  /**
   * size of the badge.
   */
  size?: BadgeSize;

  /**
   * class name for the badge root element.
   */
  className?: string;

  /**
   * inline style for the badge root element.
   */
  style?: React.CSSProperties;
};

/**
 * resolve the badge tone for an importance score, escalating from
 * neutral to a warning tone and finally to urgent as the score rises.
 */
function toneForScore(score: number): BadgeTone {
  if (score >= 8) {
    return `urgent`;
  }
  if (score >= 5) {
    return `bills`;
  }
  return `neutral`;
}

/**
 * Badge showing the AI-assigned importance score of an email, with its
 * tone escalating from neutral to urgent as the score rises.
 */
export function ImportanceBadge({ score = 5, size = `sm`, className, style }: ImportanceBadgeProps) {
  const clamped = Math.min(10, Math.max(1, Math.round(score)));

  return (
    <Badge
      tone={toneForScore(clamped)}
      size={size}
      className={classNames(styles.badge, className)}
      style={style}
    >
      {`importance ${clamped}/10`}
    </Badge>
  );
}
