import { useCallback } from 'react';
import { UserPlan, Plan, canPlanUseFeature, type GatedFeature, type PlanId, type PlainUserPlan, type PlainPlan } from '@lov/billing.entities.plan';
import { useGetPlan } from './use-get-plan.js';
import { useListPlans } from './use-list-plans.js';
import { useChangePlan } from './use-change-plan.js';

export type UsePlanOptions = {
  /**
   * provide mock data for the current user plan, useful for tests and compositions.
   */
  mockPlan?: PlainUserPlan;

  /**
   * provide mock data for the plan catalog, useful for tests and compositions.
   */
  mockPlans?: PlainPlan[];
};

export type UsePlanResult = {
  /**
   * the current user's subscription and AI reply usage, if loaded.
   */
  plan?: UserPlan;

  /**
   * the catalog of billing plans offered by the product (e.g. Free and Pro).
   */
  plans: Plan[];

  /**
   * whether the plan or plan catalog is still loading.
   */
  loading: boolean;

  /**
   * error message, if fetching the plan or plan catalog failed.
   */
  error?: string;

  /**
   * whether the current user is on the Pro plan.
   */
  isPro: boolean;

  /**
   * number of AI replies still available in the current billing period.
   */
  remainingReplies: number;

  /**
   * check whether the current plan grants access to a gated feature. Features should use this
   * to decide whether to render an upgrade prompt instead of the gated action.
   */
  canUse: (feature: GatedFeature) => boolean;

  /**
   * switch the current user to the given plan id.
   */
  changePlan: (planId: PlanId) => Promise<UserPlan | undefined>;
};

/**
 * exposes the current user's billing plan, usage and the plan catalog, together with helpers to
 * check feature gating and to change the subscribed plan.
 */
export function usePlan(options?: UsePlanOptions): UsePlanResult {
  const { userPlan, loading: planLoading, error: planError } = useGetPlan({
    mockData: options?.mockPlan,
  });
  const { plans, loading: plansLoading, error: plansError } = useListPlans({
    mockData: options?.mockPlans,
  });
  const { changePlan } = useChangePlan();

  const canUse = useCallback(
    (feature: GatedFeature) => {
      if (!userPlan) return false;
      return canPlanUseFeature(userPlan.planId, feature);
    },
    [userPlan]
  );

  return {
    plan: userPlan,
    plans,
    loading: planLoading || plansLoading,
    error: planError || plansError,
    isPro: userPlan?.planId === 'pro',
    remainingReplies: userPlan?.aiRepliesRemaining ?? 0,
    canUse,
    changePlan,
  };
}
