import React from 'react';
import classNames from 'classnames';
import { StatTile, type StatTileAccent } from '@lov/design.content.stat-tile';
import { SkeletonList } from '@lov/design.loaders.skeleton';
import type { TriageBucket } from '@lov/mail.entities.email';
import styles from './triage-tiles.module.scss';

export type TriageTileCounts = {
  /**
   * number of urgent emails.
   */
  urgent: number;

  /**
   * number of emails awaiting a reply.
   */
  needsReply: number;

  /**
   * number of emails that are informational only.
   */
  fyi: number;

  /**
   * number of promotional emails.
   */
  promotions: number;
};

type TriageTileDefinition = {
  key: TriageBucket;
  label: string;
  emoji: string;
  accent: StatTileAccent;
};

const DEFAULT_COUNTS: TriageTileCounts = {
  urgent: 5,
  needsReply: 12,
  fyi: 18,
  promotions: 31,
};

const TILES: TriageTileDefinition[] = [
  { key: `urgent`, label: `Urgent`, emoji: `🔥`, accent: `urgent` },
  { key: `needsReply`, label: `Needs Reply`, emoji: `📄`, accent: `needsReply` },
  { key: `fyi`, label: `FYI`, emoji: `✅`, accent: `fyi` },
  { key: `promotions`, label: `Promotions`, emoji: `🗑`, accent: `promotions` },
];

export type TriageTilesProps = {
  /**
   * counts of emails per triage bucket.
   */
  counts?: TriageTileCounts;

  /**
   * currently active/selected bucket filter, or `all` when no filter is applied.
   */
  active?: TriageBucket | 'all';

  /**
   * called when a tile is selected. selecting the already active tile deselects it, passing `all`.
   */
  onSelect?: (bucket: TriageBucket | 'all') => void;

  /**
   * whether the counts are still loading, rendering skeleton placeholders instead of the tiles.
   */
  loading?: boolean;

  /**
   * class name for the root element.
   */
  className?: string;

  /**
   * inline style for the root element.
   */
  style?: React.CSSProperties;
};

/**
 * The four triage tiles from the inbox dashboard — Urgent, Needs Reply, FYI and Promotions —
 * each showing a count and acting as a toggleable filter.
 */
export function TriageTiles({
  counts = DEFAULT_COUNTS,
  active = `all`,
  onSelect,
  loading = false,
  className,
  style,
}: TriageTilesProps) {
  if (loading) {
    return <SkeletonList variant="panel" count={4} className={classNames(styles.tiles, className)} style={style} />;
  }

  return (
    <div className={classNames(styles.tiles, className)} style={style}>
      {TILES.map((tile) => (
        <StatTile
          key={tile.key}
          count={counts[tile.key]}
          label={tile.label}
          icon={tile.emoji}
          accent={tile.accent}
          selected={active === tile.key}
          onSelect={() => onSelect && onSelect(active === tile.key ? `all` : tile.key)}
        />
      ))}
    </div>
  );
}
