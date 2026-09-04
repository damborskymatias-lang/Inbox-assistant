import React, { useState } from 'react';
import classNames from 'classnames';
import { Heading } from '@lov/design.typography.heading';
import { Paragraph } from '@lov/design.typography.paragraph';
import { PageLayout } from '@lov/design.layouts.page-layout';
import { useAuth } from '@lov/inbox-platform.hooks.use-auth';
import type { UseAuthOptions } from '@lov/inbox-platform.hooks.use-auth';
import { usePlan } from '@lov/billing.hooks.use-plan';
import { PlanCard } from '@lov/billing.ui.plan-card';
import type { PlanId, PlainPlan, PlainUserPlan } from '@lov/billing.entities.plan';
import type { PricingFaqItem } from './pricing-faq-item-type.js';
import { DEFAULT_FAQ_ITEMS } from './pricing-page.mock.js';
import styles from './pricing-page.module.scss';

export type PricingPageProps = {
  /**
   * FAQ questions and answers shown below the plan cards.
   */
  faqItems?: PricingFaqItem[];

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
   * class name to override the root container.
   */
  className?: string;

  /**
   * style for layout and positioning purposes.
   */
  style?: React.CSSProperties;
};

/**
 * Public pricing page showing the headline value proposition, the Free and Pro plan cards,
 * and a short FAQ. Anonymous visitors can browse plans, while signed-in users see their current
 * plan reflected on the cards and can switch plans inline.
 */
export function PricingPage({
  faqItems = DEFAULT_FAQ_ITEMS,
  mockUser,
  mockPlan,
  mockPlans,
  className,
  style,
}: PricingPageProps) {
  const { user, isAuthenticated } = useAuth({ mockData: mockUser });
  const { plan, plans, isPro, error, changePlan } = usePlan({ mockPlan, mockPlans });
  const [switchingPlanId, setSwitchingPlanId] = useState<PlanId | undefined>(undefined);

  const currentPlanId = isAuthenticated ? plan?.planId : undefined;

  const handleSelect = (planId: PlanId) => {
    if (!isAuthenticated || planId === currentPlanId) return;

    setSwitchingPlanId(planId);
    changePlan(planId).finally(() => setSwitchingPlanId(undefined));
  };

  return (
    <div className={classNames(styles.page, className)} style={style}>
      <PageLayout>
        <div className={styles.hero}>
          <span className={styles.eyebrow}>Pricing</span>
          <Heading level={1} size="xl" className={styles.title}>
            Save 15–30 minutes a day on email
          </Heading>
          <Paragraph size="lg" tone="soft" className={styles.subtitle}>
            The AI inbox assistant triages, summarizes and drafts replies for you. Pick the plan
            that fits how much of your inbox you want to hand off.
          </Paragraph>
          {isAuthenticated && (
            <Paragraph size="sm" tone="muted" className={styles.currentPlanNote}>
              {isPro
                ? `You're currently on the Pro plan.`
                : `You're currently on the Free plan.`}
            </Paragraph>
          )}
        </div>

        <div className={styles.cardsSection}>
          {error && (
            <Paragraph size="sm" tone="danger" className={styles.errorNote}>
              {error}
            </Paragraph>
          )}
          <div className={styles.cards}>
            {plans.map((planItem) => (
              <PlanCard
                key={planItem.id}
                plan={planItem}
                currentPlanId={currentPlanId}
                loading={switchingPlanId === planItem.id}
                onSelect={(planId) => handleSelect(planId)}
              />
            ))}
          </div>
        </div>

        <div className={styles.faqSection}>
          <Heading level={2} size="lg" className={styles.faqHeading}>
            Frequently asked questions
          </Heading>
          <div className={styles.faqList}>
            {faqItems.map((item) => (
              <div key={item.question} className={styles.faqItem}>
                <Paragraph size="md" weight="semiBold" className={styles.faqQuestion}>
                  {item.question}
                </Paragraph>
                <Paragraph size="sm" tone="soft" className={styles.faqAnswer}>
                  {item.answer}
                </Paragraph>
              </div>
            ))}
          </div>
        </div>
      </PageLayout>
    </div>
  );
}
