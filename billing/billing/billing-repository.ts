import type { ReturnModelType } from '@typegoose/typegoose';
import type { PlainPlan, PlanId } from '@lov/billing.entities.plan';
import { PlanModel } from './plan.model.js';
import { UserPlanModel } from './user-plan.model.js';
import { currentPeriodEnd, currentPeriodStart, FREE_AI_REPLY_LIMIT } from './billing-seed.js';

export type UpsertUserPlanOptions = {
  /**
   * the plan the user subscribes to.
   */
  planId: PlanId;

  /**
   * maximum number of AI replies allowed in the current billing period.
   */
  aiRepliesLimit: number;
};

/**
 * data access for the billing plan catalog and the per user plan documents.
 */
export class BillingRepository {
  constructor(
    private planModel: ReturnModelType<typeof PlanModel>,
    private userPlanModel: ReturnModelType<typeof UserPlanModel>
  ) {}

  /**
   * whether the plan catalog has already been seeded.
   */
  async hasPlans(): Promise<boolean> {
    const existing = await this.planModel.find().limit(1);
    return Boolean(existing.length);
  }

  /**
   * persist the plan catalog.
   */
  async insertPlans(plans: PlainPlan[]): Promise<void> {
    await this.planModel.insertMany(plans);
  }

  /**
   * whether any user plan has already been seeded.
   */
  async hasUserPlans(): Promise<boolean> {
    const existing = await this.userPlanModel.find().limit(1);
    return Boolean(existing.length);
  }

  /**
   * persist the demo user plans.
   */
  async insertUserPlans(userPlans: UserPlanModel[]): Promise<void> {
    await this.userPlanModel.insertMany(userPlans);
  }

  /**
   * list the plan catalog, cheapest plan first.
   */
  async listPlans(): Promise<PlanModel[]> {
    const plans = await this.planModel.find({}).sort({ priceEur: 1 });
    return plans.map((plan) => plan.toObject());
  }

  /**
   * read the plan of a user, defaulting new users to the Free plan with the
   * monthly AI reply quota, and resetting the counter once the period boundary
   * has been crossed.
   */
  async findOrCreateUserPlan(userId: string): Promise<UserPlanModel> {
    const existing = await this.userPlanModel.findOne({ userId });

    if (!existing) {
      const created = await this.userPlanModel.create({
        userId,
        planId: 'free',
        aiRepliesUsed: 0,
        aiRepliesLimit: FREE_AI_REPLY_LIMIT,
        periodStart: currentPeriodStart(),
        periodEnd: currentPeriodEnd(),
      });

      return created.toObject();
    }

    const now = new Date();
    const periodEnd = new Date(existing.periodEnd);
    const hasExpired = Number.isNaN(periodEnd.getTime()) || periodEnd.getTime() < now.getTime();
    if (!hasExpired) return existing.toObject();

    existing.aiRepliesUsed = 0;
    existing.periodStart = currentPeriodStart(now);
    existing.periodEnd = currentPeriodEnd(now);
    await existing.save();

    return existing.toObject();
  }

  /**
   * increment the AI reply counter of a user by one and return the updated plan.
   */
  async incrementAiRepliesUsed(userId: string): Promise<UserPlanModel> {
    const updated = await this.userPlanModel.findOneAndUpdate(
      { userId },
      { $inc: { aiRepliesUsed: 1 } },
      { new: true }
    );

    if (!updated) throw new Error(`no billing plan found for user "${userId}"`);
    return updated.toObject();
  }

  /**
   * switch a user to another plan, applying the AI reply quota of that plan.
   */
  async updateUserPlan(userId: string, options: UpsertUserPlanOptions): Promise<UserPlanModel> {
    const updated = await this.userPlanModel.findOneAndUpdate(
      { userId },
      {
        $set: {
          planId: options.planId,
          aiRepliesLimit: options.aiRepliesLimit,
        },
      },
      { new: true }
    );

    if (!updated) throw new Error(`no billing plan found for user "${userId}"`);
    return updated.toObject();
  }
}
