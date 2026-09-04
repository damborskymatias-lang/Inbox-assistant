import React, { type ReactNode } from 'react';
import classNames from 'classnames';
import styles from './stat-tile.module.scss';

export type StatTileAccent = 'urgent' | 'needsReply' | 'fyi' | 'promotions' | 'brand' | 'neutral';

export type StatTileProps = {
  /**
   * the large number displayed by the tile.
   */
  count?: number;

  /**
   * the small label rendered below the count.
   */
  label?: string;

  /**
   * an emoji rendered before the label.
   */
  emoji?: string;

  /**
   * an icon rendered before the label, used instead of an emoji.
   */
  icon?: ReactNode;

  /**
   * the accent color token used for the tile's tint bar.
   */
  accent?: StatTileAccent;

  /**
   * whether the tile is in the selected state.
   */
  selected?: boolean;

  /**
   * called when the tile is clicked or selected.
   */
  onSelect?: () => void;

  /**
   * class name for the tile root element.
   */
  className?: string;

  /**
   * inline style for the tile root element.
   */
  style?: React.CSSProperties;
};

const ACCENT_TO_CLASS: Record<StatTileAccent, string> = {
  urgent: styles.urgent,
  needsReply: styles.needsReply,
  fyi: styles.fyi,
  promotions: styles.promotions,
  brand: styles.brand,
  neutral: styles.neutral,
};

/**
 * Selectable stat tile used for inbox triage summaries and digest metrics.
 */
export function StatTile({
  count = 0,
  label = `Items`,
  emoji,
  icon,
  accent = `neutral`,
  selected = false,
  onSelect,
  className,
  style,
}: StatTileProps) {
  return (
    <button
      type="button"
      className={classNames(styles.tile, selected ? styles.tileSelected : undefined, className)}
      style={style}
      aria-pressed={selected}
      onClick={() => onSelect && onSelect()}
    >
      <span className={classNames(styles.accentBar, ACCENT_TO_CLASS[accent])} />
      <span className={styles.count}>{count}</span>
      <span className={styles.label}>
        {icon && <span className={styles.icon}>{icon}</span>}
        {!icon && emoji && <span className={styles.icon}>{emoji}</span>}
        <span className={styles.labelText}>{label}</span>
      </span>
    </button>
  );
}
