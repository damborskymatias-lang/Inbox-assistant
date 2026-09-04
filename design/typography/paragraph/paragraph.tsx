import React, { type ReactNode, type CSSProperties } from 'react';
import classNames from 'classnames';
import styles from './paragraph.module.scss';

export type ParagraphSize = 'xs' | 'sm' | 'md' | 'lg';

export type ParagraphTone = 'default' | 'soft' | 'muted' | 'success' | 'danger';

export type ParagraphWeight = 'regular' | 'medium' | 'semiBold' | 'bold';

export type ParagraphProps = {
  /**
   * the text content of the paragraph.
   */
  children?: ReactNode;

  /**
   * controls the font size of the paragraph.
   */
  size?: ParagraphSize;

  /**
   * controls the color tone of the paragraph.
   */
  tone?: ParagraphTone;

  /**
   * controls the font weight of the paragraph.
   */
  weight?: ParagraphWeight;

  /**
   * clamps the paragraph to the given number of lines, truncating overflow with an ellipsis.
   */
  truncate?: number;

  /**
   * a class name to override the paragraph styles.
   */
  className?: string;

  /**
   * inline style for the paragraph container.
   */
  style?: CSSProperties;
};

const SIZE_TO_CLASS: Record<ParagraphSize, string> = {
  xs: styles.xs,
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
};

const TONE_TO_CLASS: Record<ParagraphTone, string> = {
  default: styles.default,
  soft: styles.soft,
  muted: styles.muted,
  success: styles.success,
  danger: styles.danger,
};

const WEIGHT_TO_CLASS: Record<ParagraphWeight, string> = {
  regular: styles.regular,
  medium: styles.medium,
  semiBold: styles.semiBold,
  bold: styles.bold,
};

/**
 * a paragraph/text component used for email summaries, helper text and captions throughout the app.
 */
export function Paragraph({
  children,
  size = 'md',
  tone = 'default',
  weight = 'regular',
  truncate,
  className,
  style,
}: ParagraphProps) {
  const truncateStyle = truncate
    ? ({ '--truncate-lines': truncate } as CSSProperties)
    : undefined;

  return (
    <p
      className={classNames(
        styles.paragraph,
        SIZE_TO_CLASS[size],
        TONE_TO_CLASS[tone],
        WEIGHT_TO_CLASS[weight],
        truncate ? styles.truncate : undefined,
        className
      )}
      style={{ ...truncateStyle, ...style }}
    >
      {children}
    </p>
  );
}
