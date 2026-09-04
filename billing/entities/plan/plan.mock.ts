import { Plan } from './plan.js';
import type { PlainPlan } from './plan.js';

/**
 * catalog of plain plan definitions offered by the product.
 */
export const PLAN_CATALOG: PlainPlan[] = [
  {
    id: 'free',
    name: 'Free',
    priceEur: 0,
    interval: 'month',
    features: [
      '30 AI-generated replies per month',
      'Daily inbox summary',
      'Basic email categorization',
    ],
    highlighted: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    priceEur: 12,
    interval: 'month',
    features: [
      'Unlimited AI replies',
      'Smart inbox cleanup',
      'Personalized writing style',
      'Priority processing',
      'Advanced filters',
    ],
    highlighted: true,
  },
];

/**
 * mock list of all plans offered by the product (Free and Pro).
 * pass overrides keyed by plan id to customize a specific plan.
 */
export function mockPlans(overrides: Partial<Record<PlainPlan['id'], Partial<PlainPlan>>> = {}): Plan[] {
  return PLAN_CATALOG.map((plainPlan) =>
    Plan.from({
      ...plainPlan,
      ...overrides[plainPlan.id],
    })
  );
}

/**
 * mock of the Free plan.
 */
export function mockFreePlan(overrides: Partial<PlainPlan> = {}): Plan {
  return Plan.from({
    ...PLAN_CATALOG[0],
    ...overrides,
  });
}

/**
 * mock of the Pro plan.
 */
export function mockProPlan(overrides: Partial<PlainPlan> = {}): Plan {
  return Plan.from({
    ...PLAN_CATALOG[1],
    ...overrides,
  });
}
