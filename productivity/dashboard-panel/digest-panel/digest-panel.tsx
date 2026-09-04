import React from 'react';
import classNames from 'classnames';
import { Card } from '@lov/design.content.card';
import { Link } from '@lov/design.navigation.link';
import { useDailyDigest, type UseDailyDigestOptions } from '@lov/productivity.hooks.use-daily-digest';
import styles from './digest-panel.module.scss';

export type DigestPanelProps = {
  /**
   * mock digest data bypassing the network request, useful for tests and compositions.
   */
  digest?: UseDailyDigestOptions['mockData'];

  /**
   * path to the full digest page.
   */
  digestLink?: string;

  /**
   * class name for the root element.
   */
  className?: string;

  /**
   * style for the root element.
   */
  style?: React.CSSProperties;
};

/**
 * Compact dashboard panel summarizing today's time saved, with a link to the full digest page.
 */
export function DigestPanel({ digest, digestLink = `/digest`, className, style }: DigestPanelProps) {
  const { digest: todayDigest, loading, error } = useDailyDigest({ mockData: digest });

  return (
    <Card
      title="Time saved today"
      padding="md"
      className={classNames(styles.panel, className)}
      style={style}
    >
      {loading && (
        <div>
          <div className={styles.skeletonValue} />
          <div className={styles.skeletonStats}>
            <div className={styles.skeletonStat} />
            <div className={styles.skeletonStat} />
          </div>
        </div>
      )}

      {!loading && error && <p className={styles.errorText}>Unable to load today&apos;s digest.</p>}

      {!loading && !error && (
        <div>
          <div className={styles.metric}>
            <span className={styles.value}>{Math.round(todayDigest?.minutesSaved ?? 0)}</span>
            <span className={styles.unit}>minutes saved</span>
          </div>
          <p className={styles.caption}>The AI handled the busywork so you didn&apos;t have to.</p>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statValue}>{todayDigest?.emailsProcessed ?? 0}</span>
              <span className={styles.statLabel}>Processed</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>{todayDigest?.repliesSent ?? 0}</span>
              <span className={styles.statLabel}>Replies sent</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>{todayDigest?.emailsCleaned ?? 0}</span>
              <span className={styles.statLabel}>Cleaned up</span>
            </div>
          </div>
        </div>
      )}

      <div className={styles.footer}>
        <Link href={digestLink} className={styles.link} underline>
          View full digest &rarr;
        </Link>
      </div>
    </Card>
  );
}
