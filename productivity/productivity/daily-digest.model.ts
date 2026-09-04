import { prop } from '@typegoose/typegoose';

/**
 * persisted daily digest of a user's AI inbox assistant activity,
 * used to power the trend chart and digest notifications.
 * Kept in the aspect's node runtime (not the entity component) so the
 * mongoose/typegoose dependency never reaches the browser bundle.
 */
export class DailyDigestModel {
  @prop({ required: true, unique: true, type: String })
  public digestId!: string;

  @prop({ required: true, type: String })
  public userId!: string;

  @prop({ required: true, type: String })
  public date!: string;

  @prop({ required: true, type: Number, default: 0 })
  public emailsProcessed!: number;

  @prop({ required: true, type: Number, default: 0 })
  public repliesSent!: number;

  @prop({ required: true, type: Number, default: 0 })
  public emailsCleaned!: number;

  @prop({ required: true, type: Number, default: 0 })
  public minutesSaved!: number;
}
