import React from 'react';
import classNames from 'classnames';
import { Card } from '@lov/design.content.card';
import { Badge } from '@lov/design.content.badge';
import { Heading } from '@lov/design.typography.heading';
import { Paragraph } from '@lov/design.typography.paragraph';
import { Button } from '@lov/design.actions.button';
import { CheckIcon } from '@lov/billing.icons.billing-icons';
import { Plan, mockFreePlan } from '@lov/billing.entities.plan';
import type { PlanId } from '@lov/billing.entities.plan';
import styles from './plan-card.module.scss';

export type PlanCardProps = {
  /**
   * the plan rendered by the card.
   */
  plan?: Plan;

  /**
   * identifier of the plan the current user is subscribed to.
   */
  currentPlanId?: PlanId;

  /**
   * shows a loading state on the call to action button.
   */
  loading?: boolean;

  /**
   * called with the plan id when the user selects this plan.
   */
  onSelect?: (planId: PlanId) => void;

  /**
   * class name for the card root element.
   */
  className?: string;

  /**
   * inline style for the card root element.
   */
  style?: React.CSSProperties;
};

function formatPrice(priceEur: number, interval: string): string {
  if (priceEur <= 0) return `Free`;
  return `€${priceEur} / ${interval}`;
}

function resolveCtaLabel(plan: Plan, currentPlanId?: PlanId): string {
  if (currentPlanId === plan.id) return `Current plan`;
  if (plan.priceEur > 0) return `Upgrade to ${plan.name}`;
  return `Downgrade`;
}

/**
 * Pricing plan card displaying the plan name, price, feature list and a
 * call to action reflecting the user's subscription state.
 */
export function PlanCard({
  plan = mockFreePlan(),
  currentPlanId,
  loading = false,
  onSelect,
  className,
  style,
}: PlanCardProps) {
  const isCurrent = currentPlanId === plan.id;
  const ctaLabel = resolveCtaLabel(plan, currentPlanId);
  const ctaVariant = isCurrent ? `secondary` : plan.priceEur > 0 ? `primary` : `secondary`;

  return (
    <Card
      padding="lg"
      tone={plan.highlighted ? `brand` : `default`}
      className={classNames(styles.card, plan.highlighted && styles.highlighted, className)}
      style={style}
    >
      {plan.highlighted && (
        <Badge tone="brand" size="sm" className={styles.badge}>
          Most popular
        </Badge>
      )}

      <div className={styles.head}>
        <Heading level={3} size="md">
          {plan.name}
        </Heading>
        <div className={styles.priceRow}>
          <span className={styles.price}>{formatPrice(plan.priceEur, plan.interval)}</span>
          {plan.priceEur > 0 && <span className={styles.interval}>per {plan.interval}</span>}
        </div>
      </div>

      <ul className={styles.features}>
        {plan.features.map((feature) => (
          <li key={feature} className={styles.feature}>
            <CheckIcon size="sm" color="positive" className={styles.checkIcon} />
            <Paragraph size="sm">{feature}</Paragraph>
          </li>
        ))}
      </ul>

      <Button
        variant={ctaVariant}
        fullWidth
        loading={loading}
        disabled={isCurrent}
        className={styles.cta}
        onClick={() => onSelect?.(plan.id)}
      >
        {ctaLabel}
      </Button>
    </Card>
  );
}
