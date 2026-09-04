import React, { type ReactNode } from 'react';
import classNames from 'classnames';
import styles from './card.module.scss';

export type CardPadding = 'sm' | 'md' | 'lg';

export type CardTone = 'default' | 'warning' | 'success' | 'brand';

export type CardProps = {
  /**
   * optional eyebrow title rendered uppercase with letter spacing.
   */
  title?: string;

  /**
   * actions rendered on the top-right corner of the card.
   */
  actions?: ReactNode;

  /**
   * padding scale applied to the card content.
   */
  padding?: CardPadding;

  /**
   * color tone applied to the card border and background accent.
   */
  tone?: CardTone;

  /**
   * enables a subtle hover lift interaction, useful for clickable cards.
   */
  interactive?: boolean;

  /**
   * content rendered inside the card.
   */
  children?: ReactNode;

  /**
   * class name for the card root element.
   */
  className?: string;

  /**
   * inline style for the card root element.
   */
  style?: React.CSSProperties;
};

const PADDING_STYLES: Record<CardPadding, string> = {
  sm: styles.paddingSm,
  md: styles.paddingMd,
  lg: styles.paddingLg,
};

const TONE_STYLES: Record<CardTone, string> = {
  default: styles.toneDefault,
  warning: styles.toneWarning,
  success: styles.toneSuccess,
  brand: styles.toneBrand,
};

/**
 * Surface card container used across the inbox assistant for grouping content,
 * summaries and lists behind a white surface with a hairline border.
 */
export function Card({
  title,
  actions,
  padding = `md`,
  tone = `default`,
  interactive = false,
  children,
  className,
  style,
}: CardProps) {
  return (
    <section
      className={classNames(
        styles.card,
        PADDING_STYLES[padding],
        TONE_STYLES[tone],
        interactive && styles.interactive,
        className
      )}
      style={style}
    >
      {(title || actions) && (
        <div className={styles.header}>
          {title && <span className={styles.title}>{title}</span>}
          {actions && <div className={styles.actions}>{actions}</div>}
        </div>
      )}
      {children && <div className={styles.content}>{children}</div>}
    </section>
  );
}
