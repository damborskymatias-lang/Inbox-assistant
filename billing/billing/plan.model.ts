import { prop } from '@typegoose/typegoose';
import type { PlanId, PlanInterval } from '@lov/billing.entities.plan';

/**
 * typegoose-compatible model for persisting a Plan.
 * Kept in the aspect's node runtime (not the entity component) so the
 * mongoose/typegoose dependency never reaches the browser bundle.
 */
export class PlanModel {
  @prop({ required: true, unique: true, type: String })
  public id!: PlanId;

  @prop({ required: true, type: String })
  public name!: string;

  @prop({ required: true, type: Number })
  public priceEur!: number;

  @prop({ required: true, type: String })
  public interval!: PlanInterval;

  @prop({ required: true, type: [String] })
  public features!: string[];

  @prop({ type: Boolean })
  public highlighted?: boolean;
}
