import type { GatedFeature, PlanId } from '@lov/billing.entities.plan';

/**
 * options of the `canUse` feature gate.
 */
export type CanUseOptions = {
  /**
   * the gated feature to check against the current plan.
   */
  feature: GatedFeature;
};

/**
 * options of the `changePlan` mutation.
 */
export type ChangePlanOptions = {
  /**
   * identifier of the plan to switch to.
   */
  planId: PlanId;
};

/**
 * result of the `canUse` feature gate, telling the UI whether to render the gated
 * action or an upgrade prompt instead.
 */
export type CanUseResult = {
  /**
   * whether the current plan grants access to the feature.
   */
  allowed: boolean;

  /**
   * human readable explanation, surfaced by the upgrade prompt when access is denied.
   */
  reason?: string;

  /**
   * number of AI replies still available in the current billing period,
   * for quota based features.
   */
  remaining?: number;
};

/**
 * result of consuming a single AI reply from the monthly quota.
 */
export type ConsumeAiReplyResult = {
  /**
   * number of AI replies used in the current billing period, after the consumption.
   */
  used: number;

  /**
   * maximum number of AI replies allowed in the current billing period.
   */
  limit: number;
};
