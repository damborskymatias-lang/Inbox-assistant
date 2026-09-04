import React from 'react';
import classNames from 'classnames';
import { Card } from '@lov/design.content.card';
import { Heading } from '@lov/design.typography.heading';
import { Paragraph } from '@lov/design.typography.paragraph';
import { Button } from '@lov/design.actions.button';
import { CrownIcon, LockIcon } from '@lov/billing.icons.billing-icons';
import type { GatedFeature } from '@lov/billing.entities.plan';
import styles from './upgrade-prompt.module.scss';

export type UpgradePromptVariant = 'inline' | 'card' | 'banner';

export type UpgradePromptProps = {
  /**
   * the gated Pro feature this prompt is tailored for.
   */
  feature?: GatedFeature;

  /**
   * the visual presentation of the prompt.
   */
  variant?: UpgradePromptVariant;

  /**
   * destination of the upgrade call to action.
   */
  ctaHref?: string;

  /**
   * label rendered on the call to action.
   */
  ctaLabel?: string;

  /**
   * called when the user dismisses the prompt, if dismissible.
   */
  onDismiss?: () => void;

  /**
   * class name for the root element.
   */
  className?: string;

  /**
   * inline style for the root element.
   */
  style?: React.CSSProperties;
};

const FEATURE_COPY: Record<GatedFeature, string> = {
  unlimitedAiReplies: `Unlimited AI replies are part of Pro — €12/month`,
  smartInboxCleanup: `Smart inbox cleanup is part of Pro — €12/month`,
  personalizedWritingStyle: `Personalized writing style is part of Pro — €12/month`,
  priorityProcessing: `Priority processing is part of Pro — €12/month`,
  advancedFilters: `Advanced filters are part of Pro — €12/month`,
};

const FEATURE_HEADLINE: Record<GatedFeature, string> = {
  unlimitedAiReplies: `Never run out of AI replies`,
  smartInboxCleanup: `Keep your inbox spotless`,
  personalizedWritingStyle: `Sound more like you`,
  priorityProcessing: `Skip the queue`,
  advancedFilters: `Filter with precision`,
};

/**
 * Reusable inline upgrade prompt shown wherever a Pro capability is gated. Tailors its copy to
 * the gated feature and links out to the pricing page.
 */
export function UpgradePrompt({
  feature = `unlimitedAiReplies`,
  variant = `inline`,
  ctaHref = `/pricing`,
  ctaLabel = `Upgrade to Pro`,
  onDismiss,
  className,
  style,
}: UpgradePromptProps) {
  const copy = FEATURE_COPY[feature];
  const headline = FEATURE_HEADLINE[feature];

  if (variant === `card`) {
    return (
      <Card
        tone="brand"
        padding="lg"
        className={classNames(styles.card, className)}
        style={style}
      >
        <div className={styles.cardIcon}>
          <CrownIcon size="lg" color="warning" />
        </div>
        <Heading level={3} size="sm" className={styles.cardHeadline}>
          {headline}
        </Heading>
        <Paragraph size="sm" tone="soft" className={styles.cardCopy}>
          {copy}
        </Paragraph>
        <Button variant="primary" href={ctaHref} fullWidth className={styles.cardCta}>
          {ctaLabel}
        </Button>
        {onDismiss && (
          <Button variant="ghost" size="sm" className={styles.cardDismiss} onClick={() => onDismiss()}>
            Not now
          </Button>
        )}
      </Card>
    );
  }

  if (variant === `banner`) {
    return (
      <div className={classNames(styles.banner, className)} style={style}>
        <div className={styles.bannerContent}>
          <span className={styles.bannerIcon}>
            <CrownIcon size="md" color="warning" />
          </span>
          <div className={styles.bannerText}>
            <Paragraph size="md" weight="semiBold" className={styles.bannerHeadline}>
              {headline}
            </Paragraph>
            <Paragraph size="sm" className={styles.bannerCopy}>
              {copy}
            </Paragraph>
          </div>
        </div>
        <div className={styles.bannerActions}>
          <Button variant="primary" href={ctaHref} className={styles.bannerCta}>
            {ctaLabel}
          </Button>
          {onDismiss && (
            <Button variant="ghost" size="sm" onClick={() => onDismiss()}>
              Dismiss
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={classNames(styles.inline, className)} style={style}>
      <span className={styles.inlineIcon}>
        <LockIcon size="sm" color="muted" />
      </span>
      <Paragraph size="sm" tone="soft" className={styles.inlineCopy}>
        {copy}
      </Paragraph>
      <Button variant="ghost" size="sm" href={ctaHref} className={styles.inlineCta}>
        {ctaLabel}
      </Button>
    </div>
  );
}
