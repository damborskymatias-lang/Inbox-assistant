import { getModelForClass } from '@typegoose/typegoose';
import {
  SymphonyPlatformAspect,
  type SymphonyPlatformNode,
} from '@bitdev/symphony.symphony-platform';
import {
  InboxPlatformAspect,
  type InboxPlatformNode,
} from '@lov/inbox-platform.inbox-platform';
import {
  Plan,
  UserPlan,
  canPlanUseFeature,
} from '@lov/billing.entities.plan';
import type { GatedFeature, PlanId } from '@lov/billing.entities.plan';
import type { BillingConfig } from './billing-config.js';
import { billingGqlSchema } from './billing.graphql.js';
import { BillingRepository } from './billing-repository.js';
import { PlanModel } from './plan.model.js';
import { UserPlanModel } from './user-plan.model.js';
import { QuotaExceededError } from './quota-exceeded-error.js';
import {
  buildDemoUserPlans,
  buildPlanCatalogSeed,
  DEMO_USER_ID,
  FREE_AI_REPLY_LIMIT,
  PRO_AI_REPLY_LIMIT,
} from './billing-seed.js';
import type { CanUseResult, ConsumeAiReplyResult } from './billing-types.js';

/**
 * map a persisted plan document to the Plan entity.
 */
function toPlan(model: PlanModel): Plan {
  return Plan.from({
    id: model.id,
    name: model.name,
    priceEur: model.priceEur,
    interval: model.interval,
    features: model.features,
    highlighted: model.highlighted,
  });
}

/**
 * map a persisted user plan document to the UserPlan entity.
 */
function toUserPlan(model: UserPlanModel): UserPlan {
  return UserPlan.from({
    id: model.userId,
    planId: model.planId,
    aiRepliesUsed: model.aiRepliesUsed,
    aiRepliesLimit: model.aiRepliesLimit,
    periodStart: model.periodStart,
    periodEnd: model.periodEnd,
  });
}

export class BillingNode {
  constructor(
    private billingConfig: BillingConfig,
    private billingRepository: BillingRepository,
    private inboxPlatform: InboxPlatformNode
  ) {}

  /**
   * the aspect configuration.
   */
  get config(): BillingConfig {
    return this.billingConfig;
  }

  /**
   * number of AI replies included in the Free plan for a single billing period.
   */
  get freeAiReplyLimit(): number {
    return this.billingConfig.freeAiReplyLimit ?? FREE_AI_REPLY_LIMIT;
  }

  /**
   * effective ceiling of AI replies for the Pro plan, presented as unlimited.
   */
  get proAiReplyLimit(): number {
    return this.billingConfig.proAiReplyLimit ?? PRO_AI_REPLY_LIMIT;
  }

  /**
   * resolve the plan owner, falling back to the demo account so previews are populated.
   */
  private resolveUserId(userId?: string): string {
    return userId || DEMO_USER_ID;
  }

  /**
   * the AI reply quota granted by a plan.
   */
  private limitOf(planId: PlanId): number {
    return planId === 'pro' ? this.proAiReplyLimit : this.freeAiReplyLimit;
  }

  /**
   * read the current plan of a user together with the AI reply usage of the active
   * billing period. New users default to the Free plan, and the usage counter resets
   * automatically once the period boundary has been crossed.
   */
  async getPlan(userId?: string): Promise<UserPlan> {
    const userPlan = await this.billingRepository.findOrCreateUserPlan(this.resolveUserId(userId));
    return toUserPlan(userPlan);
  }

  /**
   * list the plan catalog offered by the product, cheapest plan first.
   */
  async listPlans(): Promise<Plan[]> {
    const plans = await this.billingRepository.listPlans();
    return plans.map((plan) => toPlan(plan));
  }

  /**
   * feature gate other aspects call before running a gated capability. Quota based
   * features additionally report the number of AI replies still available, so the UI
   * can warn before the limit is reached.
   */
  async canUse(feature: GatedFeature, userId?: string): Promise<CanUseResult> {
    const userPlan = await this.getPlan(userId);
    const allowedByPlan = canPlanUseFeature(userPlan.planId, feature);

    if (allowedByPlan) {
      return { allowed: true, remaining: userPlan.aiRepliesRemaining };
    }

    if (feature === 'unlimitedAiReplies') {
      const remaining = userPlan.aiRepliesRemaining;

      return {
        allowed: remaining > 0,
        remaining,
        reason:
          remaining > 0
            ? undefined
            : `You've used all ${userPlan.aiRepliesLimit} AI replies included in your Free plan this month. Upgrade to Pro for unlimited AI replies.`,
      };
    }

    return {
      allowed: false,
      remaining: 0,
      reason: `This feature is part of the Pro plan. Upgrade to unlock it.`,
    };
  }

  /**
   * consume a single AI reply from the monthly quota. Throws a quota exceeded error the
   * UI surfaces as an upgrade prompt once the Free plan allowance is exhausted.
   */
  async consumeAiReply(userId?: string): Promise<ConsumeAiReplyResult> {
    const resolvedUserId = this.resolveUserId(userId);
    const current = await this.getPlan(resolvedUserId);

    if (!current.hasAiRepliesRemaining) {
      throw new QuotaExceededError(current.aiRepliesUsed, current.aiRepliesLimit);
    }

    const updated = await this.billingRepository.incrementAiRepliesUsed(resolvedUserId);

    return {
      used: updated.aiRepliesUsed,
      limit: updated.aiRepliesLimit,
    };
  }

  /**
   * switch a user to another plan, applying the AI reply quota of that plan. Payment
   * processing is out of scope for the MVP, so the change takes effect immediately.
   */
  async changePlan(planId: PlanId, userId?: string): Promise<UserPlan> {
    if (planId !== 'free' && planId !== 'pro') {
      throw new Error(`unknown plan "${planId}". expected "free" or "pro".`);
    }

    const resolvedUserId = this.resolveUserId(userId);
    await this.billingRepository.findOrCreateUserPlan(resolvedUserId);

    const updated = await this.billingRepository.updateUserPlan(resolvedUserId, {
      planId,
      aiRepliesLimit: this.limitOf(planId),
    });

    return toUserPlan(updated);
  }

  /**
   * the manifest of the hosting platform, used in billing copy and notifications.
   */
  getPlatformManifest() {
    return this.inboxPlatform.getPlatformManifest();
  }

  static dependencies = [SymphonyPlatformAspect, InboxPlatformAspect];

  static defaultConfig: BillingConfig = {
    freeAiReplyLimit: FREE_AI_REPLY_LIMIT,
    proAiReplyLimit: PRO_AI_REPLY_LIMIT,
    pricingPath: '/pricing',
    billingPath: '/billing',
    seedDemoPlans: true,
  };

  static async provider(
    [symphonyPlatform, inboxPlatform]: [SymphonyPlatformNode, InboxPlatformNode],
    config: BillingConfig
  ) {
    const planModel = getModelForClass(PlanModel);
    const userPlanModel = getModelForClass(UserPlanModel);
    const billingRepository = new BillingRepository(planModel, userPlanModel);

    const billing = new BillingNode(config, billingRepository, inboxPlatform);
    const gqlSchema = billingGqlSchema(billing);

    /**
     * seed the plan catalog and put the demo account on the Free plan with part of
     * the monthly quota already used, so the quota meter is meaningful on a fresh
     * database.
     */
    symphonyPlatform.registerOnStart(async () => {
      if (config.seedDemoPlans === false) return undefined;

      const hasPlans = await billingRepository.hasPlans();
      if (!hasPlans) {
        await billingRepository.insertPlans(buildPlanCatalogSeed());
      }

      const hasUserPlans = await billingRepository.hasUserPlans();
      if (!hasUserPlans) {
        await billingRepository.insertUserPlans(buildDemoUserPlans());
      }

      return undefined;
    });

    symphonyPlatform.registerBackendServer([
      {
        routes: [],
        gql: gqlSchema,
      },
    ]);

    return billing;
  }
}

export default BillingNode;
