import { prop } from '@typegoose/typegoose';
import type { PlanId } from '@lov/billing.entities.plan';

/**
 * typegoose-compatible model for persisting a UserPlan.
 * Kept in the aspect's node runtime (not the entity component) so the
 * mongoose/typegoose dependency never reaches the browser bundle.
 */
export class UserPlanModel {
  @prop({ required: true, unique: true, type: String })
  public userId!: string;

  @prop({ required: true, type: String })
  public planId!: PlanId;

  @prop({ required: true, type: Number, default: 0 })
  public aiRepliesUsed!: number;

  @prop({ required: true, type: Number })
  public aiRepliesLimit!: number;

  @prop({ required: true, type: String })
  public periodStart!: string;

  @prop({ required: true, type: String })
  public periodEnd!: string;
}
