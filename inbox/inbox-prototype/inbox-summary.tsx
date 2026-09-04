import { Card } from '@lov/design.content.card';
import { StatTile, type StatTileAccent } from '@lov/design.content.stat-tile';
import styles from './inbox-prototype.module.css';
import type { TriageBucket } from './inbox-types.js';

export type InboxSummaryProps = {
  /** Counts per triage bucket. */
  counts: Record<TriageBucket, number>;
  /** Currently selected bucket filter. */
  active: TriageBucket | 'all';
  /** Called when a bucket tile is selected. */
  onSelect: (bucket: TriageBucket | 'all') => void;
};

const TILES: { key: TriageBucket; label: string; emoji: string; accent: StatTileAccent }[] = [
  { key: 'urgent', label: 'Urgent', emoji: '🔥', accent: 'urgent' },
  { key: 'needsReply', label: 'Needs Reply', emoji: '📄', accent: 'needsReply' },
  { key: 'fyi', label: 'FYI', emoji: '✅', accent: 'fyi' },
  { key: 'promotions', label: 'Promotions', emoji: '🗑', accent: 'promotions' },
];

/**
 * Inbox summary tiles that also act as triage filters.
 */
export function InboxSummary({ counts, active, onSelect }: InboxSummaryProps) {
  return (
    <Card title="📥 Inbox summary">
      <div className={styles.tiles}>
        {TILES.map((tile) => (
          <StatTile
            key={tile.key}
            count={counts[tile.key]}
            label={tile.label}
            icon={tile.emoji}
            accent={tile.accent}
            selected={active === tile.key}
            onSelect={() => onSelect(active === tile.key ? 'all' : tile.key)}
          />
        ))}
      </div>
    </Card>
  );
}
