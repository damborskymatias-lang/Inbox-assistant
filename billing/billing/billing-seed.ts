import { PLAN_CATALOG } from '@lov/billing.entities.plan';
import type { PlainPlan } from '@lov/billing.entities.plan';

/**
 * number of AI replies included in the Free plan for a single billing period.
 */
export const FREE_AI_REPLY_LIMIT = 30;

/**
 * effective ceiling of AI replies for the Pro plan. Pro is presented as unlimited
 * across the UI, the ceiling only exists so the quota is representable as a number
 * and stays within the GraphQL `Int` range.
 */
export const PRO_AI_REPLY_LIMIT = 1000000;

/**
 * id of the seeded demo account (Peter Novak), kept on the Free plan.
 */
export const DEMO_USER_ID = 'user-peter-novak';

/**
 * id of the seeded admin account, kept on the Pro plan.
 */
export const ADMIN_USER_ID = 'user-admin';

/**
 * the plan catalog persisted on a fresh database, sourced from the Plan entity
 * so pricing and features never drift from the UI.
 */
export function buildPlanCatalogSeed(): PlainPlan[] {
  return PLAN_CATALOG.map((plan) => ({ ...plan }));
}

/**
 * start of the current calendar month, as an ISO timestamp.
 */
export function currentPeriodStart(now: Date = new Date()): string {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0)).toISOString();
}

/**
 * end of the current calendar month, as an ISO timestamp. The monthly AI reply
 * quota resets once this boundary is crossed.
 */
export function currentPeriodEnd(now: Date = new Date()): string {
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59, 0)
  ).toISOString();
}

/**
 * demo user plans persisted on a fresh database. Peter Novak starts on the Free plan
 * with part of the monthly quota already used, so the quota meter is meaningful.
 */
export function buildDemoUserPlans() {
  const periodStart = currentPeriodStart();
  const periodEnd = currentPeriodEnd();

  return [
    {
      userId: DEMO_USER_ID,
      planId: 'free' as const,
      aiRepliesUsed: 18,
      aiRepliesLimit: FREE_AI_REPLY_LIMIT,
      periodStart,
      periodEnd,
    },
    {
      userId: ADMIN_USER_ID,
      planId: 'pro' as const,
      aiRepliesUsed: 142,
      aiRepliesLimit: PRO_AI_REPLY_LIMIT,
      periodStart,
      periodEnd,
    },
  ];
}
