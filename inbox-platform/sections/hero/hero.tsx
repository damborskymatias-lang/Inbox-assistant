import React from 'react';
import classNames from 'classnames';
import { Heading } from '@lov/design.typography.heading';
import { Paragraph } from '@lov/design.typography.paragraph';
import { Button } from '@lov/design.actions.button';
import { GoogleIcon } from '@lov/inbox-platform.icons.inbox-icons';
import styles from './hero.module.scss';
import { heroPreviewEmails } from './hero.mock.js';
import type { HeroPreviewEmail, HeroPreviewBucket } from './hero-preview-email-type.js';

const STRIPE_CLASS_NAME: Record<HeroPreviewBucket, string> = {
  urgent: styles.stripeUrgent,
  needsReply: styles.stripeNeedsReply,
  fyi: styles.stripeFyi,
  promotions: styles.stripePromotions,
};

export type HeroStat = {
  /**
   * The stat value, for example `15–30 min`.
   */
  value: string;

  /**
   * The label describing the stat, for example `saved every day`.
   */
  label: string;
};

const DEFAULT_STATS: HeroStat[] = [
  { value: `15–30 min`, label: `saved every day` },
  { value: `AI triage`, label: `urgent, replies & FYI` },
  { value: `1-click`, label: `drafted replies` },
];

export type HeroProps = {
  /**
   * the main headline of the hero section.
   */
  headline?: string;

  /**
   * the supporting subheadline text under the headline.
   */
  subheadline?: string;

  /**
   * label shown on the primary call to action button.
   */
  ctaLabel?: string;

  /**
   * called when the primary call to action is clicked.
   */
  onCtaClick?: () => void;

  /**
   * small note rendered under the primary call to action.
   */
  ctaNote?: string;

  /**
   * short stats rendered under the call to action.
   */
  stats?: HeroStat[];

  /**
   * emails rendered inside the stylized inbox preview mock.
   */
  previewEmails?: HeroPreviewEmail[];

  /**
   * class name to override the root element style.
   */
  className?: string;

  /**
   * style for layout and positioning purposes.
   */
  style?: React.CSSProperties;
};

/**
 * Marketing hero for the public homepage, with a headline, subheadline, a primary
 * "Continue with Google" call to action, and a stylized inbox preview mock.
 */
export function Hero({
  headline = `Process your inbox in minutes, not hours`,
  subheadline = `AI triages every message, summarizes what matters and drafts replies for you — saving 15–30 minutes a day so you can get back to real work.`,
  ctaLabel = `Continue with Google`,
  onCtaClick,
  ctaNote = `Read-only access to triage, plus permission to send replies you approve.`,
  stats = DEFAULT_STATS,
  previewEmails = heroPreviewEmails,
  className,
  style,
}: HeroProps) {
  return (
    <section className={classNames(styles.hero, className)} style={style}>
      <div className={styles.container}>
        <div className={styles.content}>
          <span className={styles.eyebrow}>AI-powered inbox</span>

          <Heading level={1} size="xl" className={styles.headline}>
            {headline}
          </Heading>

          <Paragraph size="lg" tone="soft" className={styles.subheadline}>
            {subheadline}
          </Paragraph>

          <div className={styles.actions}>
            <div className={styles.ctaRow}>
              <Button
                variant="primary"
                size="lg"
                iconStart={<GoogleIcon size="sm" />}
                onClick={() => onCtaClick?.()}
              >
                {ctaLabel}
              </Button>
            </div>
            <Paragraph size="xs" tone="muted" className={styles.ctaNote}>
              {ctaNote}
            </Paragraph>
          </div>

          <div className={styles.stats}>
            {stats.map((stat) => (
              <div className={styles.stat} key={`${stat.value}-${stat.label}`}>
                <span className={styles.statValue}>{stat.value}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.previewWrapper}>
          <span className={styles.previewGlow} />
          <div className={styles.previewCard}>
            <div className={styles.previewHeader}>
              <span className={styles.previewHeaderLabel}>
                <span className={styles.previewDot} />
                Inbox summary
              </span>
              <span className={styles.previewBadge}>Saved ~24 min today</span>
            </div>

            <div className={styles.previewList}>
              {previewEmails.map((email) => (
                <div className={styles.previewRow} key={email.id}>
                  <span
                    className={classNames(styles.previewStripe, STRIPE_CLASS_NAME[email.bucket])}
                  />
                  <div className={styles.previewMain}>
                    <span className={styles.previewSender}>{email.sender}</span>
                    <span className={styles.previewSubject}>{email.subject}</span>
                    <span className={styles.previewSummary}>{email.summary}</span>
                  </div>
                  <span className={styles.previewTime}>{email.receivedAt}</span>
                </div>
              ))}
            </div>

            <div className={styles.previewFooter}>Drafted replies waiting for your approval</div>
          </div>
        </div>
      </div>
    </section>
  );
}
