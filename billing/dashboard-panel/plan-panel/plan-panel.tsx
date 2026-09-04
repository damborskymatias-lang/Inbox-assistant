import React from 'react';
import classNames from 'classnames';
import { Card } from '@lov/design.content.card';
import { QuotaMeter } from '@lov/billing.ui.quota-meter';
import { UpgradePrompt } from '@lov/billing.ui.upgrade-prompt';
import { usePlan } from '@lov/billing.hooks.use-plan';
import type { UsePlanOptions } from '@lov/billing.hooks.use-plan';
import styles from './plan-panel.module.scss';

const NEAR_LIMIT_RATIO = 0.8;

const PLAN_LABELS: Record<string, string> = {
  free: `Free`,
  pro: `Pro`,
};

export type PlanPanelProps = {
  /**
   * mock user plan data, skips the network request — useful for tests and compositions.
   */
  mockPlan?: UsePlanOptions['mockPlan'];

  /**
   * destination for the upgrade call to action shown to Free users nearing their limit.
   */
  upgradeHref?: string;

  /**
   * class name for the panel root element.
   */
  className?: string;

  /**
   * inline style for the panel root element.
   */
  style?: React.CSSProperties;
};

/**
 * Compact dashboard panel showing the current plan name and the AI reply quota meter, with an
 * inline upgrade prompt for Free users approaching their monthly limit.
 */
export function PlanPanel({ mockPlan, upgradeHref = `/pricing`, className, style }: PlanPanelProps) {
  const { plan, loading, error, isPro } = usePlan({ mockPlan });

  const planLabel = plan ? PLAN_LABELS[plan.planId] || plan.planId : `Free`;
  const usageRatio = plan && plan.aiRepliesLimit > 0 ? plan.aiRepliesUsed / plan.aiRepliesLimit : 0;
  const isNearLimit = !isPro && usageRatio >= NEAR_LIMIT_RATIO;

  return (
    <Card
      title="Your plan"
      padding="md"
      className={classNames(styles.planPanel, className)}
      style={style}
    >
      <div className={styles.header}>
        <span className={styles.planName}>{planLabel}</span>
        {isPro && <span className={styles.proBadge}>Pro</span>}
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {loading ? (
        <p className={styles.loading}>Loading your plan…</p>
      ) : (
        <QuotaMeter userPlan={plan} compact upgradeHref={upgradeHref} className={styles.meter} />
      )}

      {isNearLimit && (
        <UpgradePrompt
          feature="unlimitedAiReplies"
          variant="inline"
          ctaHref={upgradeHref}
          className={styles.upgrade}
        />
      )}
    </Card>
  );
}
