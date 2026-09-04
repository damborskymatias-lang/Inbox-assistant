import React, { useState } from 'react';
import classNames from 'classnames';
import { PageLayout } from '@lov/design.layouts.page-layout';
import { Card } from '@lov/design.content.card';
import { ConfirmDialog } from '@lov/design.overlays.confirm-dialog';
import { ProtectedRoute } from '@lov/inbox-platform.ui.protected-route';
import { useAuth } from '@lov/inbox-platform.hooks.use-auth';
import type { UseAuthOptions } from '@lov/inbox-platform.hooks.use-auth';
import { usePlan } from '@lov/billing.hooks.use-plan';
import { QuotaMeter } from '@lov/billing.ui.quota-meter';
import { PlanCard } from '@lov/billing.ui.plan-card';
import type { PlanId, PlainPlan, PlainUserPlan } from '@lov/billing.entities.plan';
import styles from './billing-page.module.scss';

export type BillingPageProps = {
  /**
   * mock authenticated user, useful for tests and compositions.
   */
  mockUser?: UseAuthOptions['mockData'];

  /**
   * mock current user plan, useful for tests and compositions.
   */
  mockPlan?: PlainUserPlan;

  /**
   * mock plan catalog, useful for tests and compositions.
   */
  mockPlans?: PlainPlan[];

  /**
   * path anonymous visitors are redirected to.
   */
  redirectTo?: string;

  /**
   * class name for the root element.
   */
  className?: string;

  /**
   * style for layout and positioning purposes.
   */
  style?: React.CSSProperties;
};

function formatPlanName(planId?: PlanId): string {
  if (planId === `pro`) return `Pro`;
  return `Free`;
}

function formatResetDate(periodEnd?: string): string {
  if (!periodEnd) return `--`;
  const date = new Date(periodEnd);
  if (Number.isNaN(date.getTime())) return `--`;
  return date.toLocaleDateString(`en-US`, { month: `long`, day: `numeric`, year: `numeric` });
}

/**
 * Protected billing page at /billing. Shows the user's current plan, the AI reply quota meter
 * with the period reset date, the list of included features, and upgrade/downgrade actions
 * guarded by a confirm dialog. Payment processing is not part of the MVP.
 */
export function BillingPage({
  mockUser,
  mockPlan,
  mockPlans,
  redirectTo = `/login`,
  className,
  style,
}: BillingPageProps) {
  const { user } = useAuth({ mockData: mockUser });
  const { plan, plans, error, changePlan } = usePlan({ mockPlan, mockPlans });
  const [pendingPlanId, setPendingPlanId] = useState<PlanId | undefined>(undefined);
  const [switchingPlanId, setSwitchingPlanId] = useState<PlanId | undefined>(undefined);

  const currentPlanId = plan?.planId;
  const currentPlanDetails = plans.find((item) => item.id === currentPlanId);
  const pendingPlan = plans.find((item) => item.id === pendingPlanId);

  const handleRequestChange = (planId: PlanId) => {
    if (planId === currentPlanId) return;
    setPendingPlanId(planId);
  };

  const handleConfirmChange = () => {
    if (!pendingPlanId) return;

    setSwitchingPlanId(pendingPlanId);
    changePlan(pendingPlanId).finally(() => {
      setSwitchingPlanId(undefined);
      setPendingPlanId(undefined);
    });
  };

  const handleCancelChange = () => {
    setPendingPlanId(undefined);
  };

  const isUpgrade = Boolean(pendingPlan && pendingPlan.priceEur > (currentPlanDetails?.priceEur ?? 0));

  return (
    <ProtectedRoute mockUser={mockUser} redirectTo={redirectTo}>
      <div className={classNames(styles.page, className)} style={style}>
        <PageLayout
          title="Billing"
          subtitle={`Manage ${user?.name?.trim().split(' ')[0] || `your`} subscription, usage and included features.`}
        >
          {error && <p className={styles.errorNote}>{error}</p>}

          <Card title="Current plan" padding="lg" className={styles.currentPlanCard}>
            <div className={styles.currentPlanHeader}>
              <span>
                <span className={styles.planName}>{formatPlanName(currentPlanId)}</span>
                {currentPlanDetails && currentPlanDetails.priceEur > 0 && (
                  <span className={styles.planPrice}>
                    €{currentPlanDetails.priceEur} / {currentPlanDetails.interval}
                  </span>
                )}
              </span>
            </div>

            <div className={styles.quotaSection}>
              <QuotaMeter userPlan={plan} />
              {plan && (
                <p className={styles.resetNote}>Quota resets on {formatResetDate(plan.periodEnd)}</p>
              )}
            </div>

            {currentPlanDetails && (
              <ul className={styles.featureList}>
                {currentPlanDetails.features.map((feature) => (
                  <li key={feature} className={styles.feature}>
                    <span className={styles.checkMark}>✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <div className={styles.plansSection}>
            <h2 className={styles.sectionTitle}>Change plan</h2>
            <p className={styles.mvpNote}>
              Payment processing is not part of the MVP yet — plan changes here are applied
              immediately without collecting payment details.
            </p>
            <div className={styles.plansGrid}>
              {plans.map((planItem) => (
                <PlanCard
                  key={planItem.id}
                  plan={planItem}
                  currentPlanId={currentPlanId}
                  loading={switchingPlanId === planItem.id}
                  onSelect={(planId) => handleRequestChange(planId)}
                />
              ))}
            </div>
          </div>
        </PageLayout>

        <ConfirmDialog
          open={Boolean(pendingPlan)}
          title={
            pendingPlan
              ? `${isUpgrade ? `Upgrade` : `Downgrade`} to ${pendingPlan.name}?`
              : `Change plan?`
          }
          description={
            pendingPlan
              ? `You're about to switch to the ${pendingPlan.name} plan (${
                  pendingPlan.priceEur > 0 ? `€${pendingPlan.priceEur} / ${pendingPlan.interval}` : `Free`
                }). This takes effect immediately.`
              : undefined
          }
          confirmLabel={isUpgrade ? `Upgrade` : `Downgrade`}
          cancelLabel="Cancel"
          loading={Boolean(switchingPlanId)}
          onConfirm={() => handleConfirmChange()}
          onCancel={() => handleCancelChange()}
        />
      </div>
    </ProtectedRoute>
  );
}
