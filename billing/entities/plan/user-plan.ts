import type { PlanId } from './plan.js';

/**
 * feature flags that are gated behind specific plans.
 */
export type GatedFeature =
  | 'unlimitedAiReplies'
  | 'smartInboxCleanup'
  | 'personalizedWritingStyle'
  | 'priorityProcessing'
  | 'advancedFilters';

/**
 * mapping of each gated feature to the list of plan ids that are allowed to use it.
 */
export const GATED_FEATURE_PLANS: Record<GatedFeature, PlanId[]> = {
  unlimitedAiReplies: ['pro'],
  smartInboxCleanup: ['pro'],
  personalizedWritingStyle: ['pro'],
  priorityProcessing: ['pro'],
  advancedFilters: ['pro'],
};

/**
 * check whether a given plan is allowed to use a gated feature.
 */
export function canPlanUseFeature(planId: PlanId, feature: GatedFeature): boolean {
  return GATED_FEATURE_PLANS[feature].includes(planId);
}

/**
 * Plain, serializable representation of a UserPlan.
 */
export type PlainUserPlan = {
  /**
   * unique identifier of the user plan, matching the owning user id.
   */
  id: string;

  /**
   * identifier of the subscribed plan.
   */
  planId: PlanId;

  /**
   * number of AI replies already used in the current billing period.
   */
  aiRepliesUsed: number;

  /**
   * maximum number of AI replies allowed in the current billing period.
   */
  aiRepliesLimit: number;

  /**
   * ISO timestamp marking the start of the current billing period.
   */
  periodStart: string;

  /**
   * ISO timestamp marking the end of the current billing period.
   */
  periodEnd: string;
};

/**
 * UserPlan entity, tracking a user's subscription and their AI reply usage
 * for the current billing period.
 */
export class UserPlan {
  constructor(
    /**
     * unique identifier of the user plan, matching the owning user id.
     */
    readonly id: string,

    /**
     * identifier of the subscribed plan.
     */
    readonly planId: PlanId,

    /**
     * number of AI replies already used in the current billing period.
     */
    readonly aiRepliesUsed: number,

    /**
     * maximum number of AI replies allowed in the current billing period.
     */
    readonly aiRepliesLimit: number,

    /**
     * ISO timestamp marking the start of the current billing period.
     */
    readonly periodStart: string,

    /**
     * ISO timestamp marking the end of the current billing period.
     */
    readonly periodEnd: string
  ) {}

  /**
   * whether the user has remaining AI replies for the current period.
   */
  get hasAiRepliesRemaining(): boolean {
    return this.aiRepliesUsed < this.aiRepliesLimit;
  }

  /**
   * number of AI replies still available for the current period.
   */
  get aiRepliesRemaining(): number {
    return Math.max(0, this.aiRepliesLimit - this.aiRepliesUsed);
  }

  /**
   * check whether the current plan grants access to a gated feature.
   */
  canUse(feature: GatedFeature): boolean {
    return canPlanUseFeature(this.planId, feature);
  }

  /**
   * serialize the UserPlan into a plain object.
   */
  toObject(): PlainUserPlan {
    return {
      id: this.id,
      planId: this.planId,
      aiRepliesUsed: this.aiRepliesUsed,
      aiRepliesLimit: this.aiRepliesLimit,
      periodStart: this.periodStart,
      periodEnd: this.periodEnd,
    };
  }

  /**
   * create a UserPlan instance from a plain object.
   */
  static from(plainUserPlan: PlainUserPlan): UserPlan {
    const {
      id = '',
      planId = 'free',
      aiRepliesUsed = 0,
      aiRepliesLimit = 30,
      periodStart = new Date().toISOString(),
      periodEnd = new Date().toISOString(),
    } = plainUserPlan || {};

    return new UserPlan(id, planId, aiRepliesUsed, aiRepliesLimit, periodStart, periodEnd);
  }
}
