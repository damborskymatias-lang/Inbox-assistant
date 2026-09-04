import React from 'react';
import classNames from 'classnames';
import { ProgressBar } from '@lov/design.content.progress-bar';
import { Paragraph } from '@lov/design.typography.paragraph';
import { Link } from '@lov/design.navigation.link';
import { CrownIcon } from '@lov/billing.icons.billing-icons';
import { UserPlan, mockFreeUserPlan } from '@lov/billing.entities.plan';
import styles from './quota-meter.module.scss';

export type QuotaMeterProps = {
  /**
   * the current user's subscription and AI reply usage for the active billing period.
   */
  userPlan?: UserPlan;

  /**
   * renders a condensed layout suited for sidebars and dashboard widgets.
   */
  compact?: boolean;

  /**
   * destination for the inline upgrade link shown when the quota is nearly exhausted.
   */
  upgradeHref?: string;

  /**
   * class name for the root element.
   */
  className?: string;

  /**
   * inline style for the root element.
   */
  style?: React.CSSProperties;
};

const NEAR_LIMIT_RATIO = 0.8;

/**
 * AI reply quota meter — shows the number of AI replies used this month with a progress bar
 * that escalates in tone as the limit approaches, plus an inline upgrade link once the quota is
 * nearly exhausted. Pro users see an "Unlimited replies" state with a crown instead.
 */
export function QuotaMeter({
  userPlan = mockFreeUserPlan(),
  compact = false,
  upgradeHref = `/billing`,
  className,
  style,
}: QuotaMeterProps) {
  const isUnlimited = userPlan.planId === `pro`;

  if (isUnlimited) {
    return (
      <div
        className={classNames(styles.quotaMeter, styles.unlimited, compact && styles.compact, className)}
        style={style}
      >
        <CrownIcon size={compact ? `sm` : `md`} color="warning" className={styles.crownIcon} />
        <Paragraph size={compact ? `sm` : `md`} weight="semiBold" className={styles.unlimitedLabel}>
          Unlimited replies
        </Paragraph>
      </div>
    );
  }

  const used = Math.max(0, userPlan.aiRepliesUsed);
  const limit = userPlan.aiRepliesLimit > 0 ? userPlan.aiRepliesLimit : 1;
  const ratio = Math.min(1, used / limit);
  const isNearLimit = ratio >= NEAR_LIMIT_RATIO;

  return (
    <div className={classNames(styles.quotaMeter, compact && styles.compact, className)} style={style}>
      <ProgressBar
        label={compact ? `AI replies` : `AI replies used this month`}
        value={used}
        max={limit}
        showValue
        className={styles.progressBar}
      />
      {isNearLimit && (
        <div className={styles.upgradeRow}>
          {!compact && (
            <Paragraph size="xs" tone="muted" className={styles.upgradeText}>
              You&apos;re almost out of AI replies this month.
            </Paragraph>
          )}
          <Link href={upgradeHref} underline className={styles.upgradeLink}>
            Upgrade to Pro
          </Link>
        </div>
      )}
    </div>
  );
}
