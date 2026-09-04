import React from 'react';
import classNames from 'classnames';
import { Card } from '@lov/design.content.card';
import { Heading } from '@lov/design.typography.heading';
import { Paragraph } from '@lov/design.typography.paragraph';
import { StatTile } from '@lov/design.content.stat-tile';
import {
  StopwatchIcon,
  DigestIcon,
  TrendUpIcon,
  TargetIcon,
} from '@lov/productivity.icons.productivity-icons';
import type { PlainDailyDigest } from '@lov/productivity.entities.daily-digest';
import styles from './digest-summary.module.scss';

export type DigestSummaryProps = {
  /**
   * the digest metrics for the current day.
   */
  digest?: PlainDailyDigest;

  /**
   * the last days of digests, oldest to newest, used for the trend chart.
   */
  history?: PlainDailyDigest[];

  /**
   * whether the summary is loading, renders skeleton placeholders.
   */
  loading?: boolean;

  /**
   * class name for the root element.
   */
  className?: string;

  /**
   * style for the root element.
   */
  style?: React.CSSProperties;
};

const DEFAULT_DIGEST: PlainDailyDigest = {
  id: `digest-today`,
  userId: `user-demo`,
  date: `2024-06-07`,
  emailsProcessed: 38,
  repliesSent: 4,
  emailsCleaned: 42,
  minutesSaved: 34.4,
};

const DEFAULT_HISTORY: PlainDailyDigest[] = [
  {
    id: `digest-1`,
    userId: `user-demo`,
    date: `2024-06-01`,
    emailsProcessed: 31,
    repliesSent: 3,
    emailsCleaned: 12,
    minutesSaved: 17.4,
  },
  {
    id: `digest-2`,
    userId: `user-demo`,
    date: `2024-06-02`,
    emailsProcessed: 42,
    repliesSent: 5,
    emailsCleaned: 0,
    minutesSaved: 22.5,
  },
  {
    id: `digest-3`,
    userId: `user-demo`,
    date: `2024-06-03`,
    emailsProcessed: 27,
    repliesSent: 2,
    emailsCleaned: 18,
    minutesSaved: 19.1,
  },
  {
    id: `digest-4`,
    userId: `user-demo`,
    date: `2024-06-04`,
    emailsProcessed: 35,
    repliesSent: 4,
    emailsCleaned: 0,
    minutesSaved: 16.5,
  },
  {
    id: `digest-5`,
    userId: `user-demo`,
    date: `2024-06-05`,
    emailsProcessed: 44,
    repliesSent: 6,
    emailsCleaned: 25,
    minutesSaved: 34.5,
  },
  {
    id: `digest-6`,
    userId: `user-demo`,
    date: `2024-06-06`,
    emailsProcessed: 19,
    repliesSent: 1,
    emailsCleaned: 0,
    minutesSaved: 5.5,
  },
  {
    id: `digest-7`,
    userId: `user-demo`,
    date: `2024-06-07`,
    emailsProcessed: 38,
    repliesSent: 4,
    emailsCleaned: 42,
    minutesSaved: 34.4,
  },
];

const WEEKDAY_LABELS = [`S`, `M`, `T`, `W`, `T`, `F`, `S`];

const SKELETON_TILE_KEYS = [`tile-1`, `tile-2`, `tile-3`, `tile-4`];

function formatDayLabel(dateStr: string): string {
  const parsed = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return `-`;
  return WEEKDAY_LABELS[parsed.getDay()];
}

/**
 * Digest summary block showing stat tiles for minutes saved, emails processed,
 * replies sent and emails cleaned, plus a simple bar trend of the last 7 days.
 */
export function DigestSummary({
  digest = DEFAULT_DIGEST,
  history = DEFAULT_HISTORY,
  loading = false,
  className,
  style,
}: DigestSummaryProps) {
  const maxMinutes = Math.max(1, ...history.map((day) => day.minutesSaved));

  return (
    <Card
      padding="lg"
      title="📊 Digest summary"
      className={classNames(styles.digestSummary, className)}
      style={style}
    >
      {loading ? (
        <div className={styles.tiles}>
          {SKELETON_TILE_KEYS.map((key) => (
            <div key={key} className={styles.skeletonTile} />
          ))}
        </div>
      ) : (
        <div className={styles.tiles}>
          <StatTile
            count={Math.round(digest.minutesSaved)}
            label="Minutes saved"
            icon={<StopwatchIcon size="sm" />}
            accent="brand"
          />
          <StatTile
            count={digest.emailsProcessed}
            label="Emails processed"
            icon={<DigestIcon size="sm" />}
            accent="needsReply"
          />
          <StatTile
            count={digest.repliesSent}
            label="Replies sent"
            icon={<TrendUpIcon size="sm" />}
            accent="fyi"
          />
          <StatTile
            count={digest.emailsCleaned}
            label="Emails cleaned"
            icon={<TargetIcon size="sm" />}
            accent="promotions"
          />
        </div>
      )}

      <div className={styles.trendSection}>
        <Heading level={4} size="xs" className={styles.trendTitle}>
          Last 7 days
        </Heading>
        {loading ? (
          <div className={styles.skeletonTrend} />
        ) : (
          <div className={styles.trend}>
            {history.map((day) => {
              const heightPercent = Math.max(6, Math.round((day.minutesSaved / maxMinutes) * 100));
              return (
                <div key={day.id} className={styles.trendColumn}>
                  <div className={styles.trendBarTrack}>
                    <div className={styles.trendBar} style={{ height: `${heightPercent}%` }} />
                  </div>
                  <Paragraph size="xs" tone="muted" className={styles.trendLabel}>
                    {formatDayLabel(day.date)}
                  </Paragraph>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
}
