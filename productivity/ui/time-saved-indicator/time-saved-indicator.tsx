import React, { useState } from 'react';
import classNames from 'classnames';
import { Badge } from '@lov/design.content.badge';
import { Dropdown } from '@lov/design.overlays.dropdown';
import { Paragraph } from '@lov/design.typography.paragraph';
import { Link } from '@lov/design.navigation.link';
import {
  TrendUpIcon,
  TargetIcon,
  DigestIcon,
} from '@lov/productivity.icons.productivity-icons';
import { useDailyDigest } from '@lov/productivity.hooks.use-daily-digest';
import type { PlainDailyDigest } from '@lov/productivity.entities.daily-digest';
import styles from './time-saved-indicator.module.scss';

export type TimeSavedIndicatorProps = {
  /**
   * mock digest data used instead of the live query, useful for tests and previews.
   */
  digest?: PlainDailyDigest;

  /**
   * link to the full daily digest page.
   */
  digestHref?: string;

  /**
   * class name for the root element.
   */
  className?: string;

  /**
   * style for the root element.
   */
  style?: React.CSSProperties;
};

const DEFAULT_DIGEST_HREF = `/dashboard/digest`;

/**
 * A header pill showing minutes saved today by the AI inbox assistant.
 * Clicking it opens a breakdown of replies sent, emails cleaned and emails triaged.
 */
export function TimeSavedIndicator({
  digest,
  digestHref = DEFAULT_DIGEST_HREF,
  className,
  style,
}: TimeSavedIndicatorProps) {
  const [open, setOpen] = useState(false);
  const { digest: todayDigest } = useDailyDigest({ mockData: digest });

  const minutesSaved = Math.round(todayDigest?.minutesSaved ?? 0);
  const repliesSent = todayDigest?.repliesSent ?? 0;
  const emailsCleaned = todayDigest?.emailsCleaned ?? 0;
  const emailsTriaged = todayDigest?.emailsProcessed ?? 0;

  return (
    <div className={classNames(styles.timeSavedIndicator, className)} style={style}>
      <Dropdown
        open={open}
        onOpenChange={(nextOpen) => setOpen(nextOpen)}
        placement="bottom-end"
        triggerClassName={styles.triggerWrapper}
        contentClassName={styles.popover}
        trigger={
          <Badge tone="success" size="sm" icon="⏱" className={styles.trigger}>
            <span className={styles.fullLabel}>{`You saved ~${minutesSaved} minutes today`}</span>
            <span className={styles.shortLabel}>{`${minutesSaved}m`}</span>
          </Badge>
        }
      >
        <div className={styles.breakdownHeader}>
          <Paragraph size="sm" weight="semiBold">
            Time saved today
          </Paragraph>
          <Paragraph size="sm" tone="success" weight="semiBold">
            {`~${minutesSaved} min`}
          </Paragraph>
        </div>

        <div className={styles.breakdownRow}>
          <div className={styles.breakdownLabel}>
            <TrendUpIcon size="sm" />
            <Paragraph size="sm" tone="soft">
              Replies sent
            </Paragraph>
          </div>
          <Paragraph size="sm" weight="medium">
            {repliesSent}
          </Paragraph>
        </div>

        <div className={styles.breakdownRow}>
          <div className={styles.breakdownLabel}>
            <TargetIcon size="sm" />
            <Paragraph size="sm" tone="soft">
              Emails cleaned
            </Paragraph>
          </div>
          <Paragraph size="sm" weight="medium">
            {emailsCleaned}
          </Paragraph>
        </div>

        <div className={styles.breakdownRow}>
          <div className={styles.breakdownLabel}>
            <DigestIcon size="sm" />
            <Paragraph size="sm" tone="soft">
              Emails triaged
            </Paragraph>
          </div>
          <Paragraph size="sm" weight="medium">
            {emailsTriaged}
          </Paragraph>
        </div>

        <Link href={digestHref} className={styles.digestLink} underline>
          View full digest →
        </Link>
      </Dropdown>
    </div>
  );
}
